var bUnitText = (process.argv[1] === __filename)
  , EE = require('events').EventEmitter
  , utl = require('../util.js')
  , net = require('net')
  , Cmd = require('../Commands.js')
  , Msg = Cmd.Msg
  , Bind = require('../cmds/cmdBind.js').Class
  , Unbind = require('../cmds/cmdUnbind.js').Class
  , Submit = require('../cmds/cmdSubmit.js').Class
  , Trace = require('../cmds/cmdTrace.js').Class
  , rc = require('../regCode.js')
  , StreamSpliter = require('../StreamSpliter.js').Class
  , SuperQueue = require('node-queue-pool')
  ;

function dummy(){
}

function SP(NodeID, SMGHost, SMGPort, SMGUser, SMGPass, SPPort, SPHost, SPUser, SPPass){
  EE.call(this);
  var m = this;

  m.NodeID = NodeID;
  m.SMGHost = SMGHost;
  m.SMGPort = SMGPort;
  m.SMGUser = SMGUser;
  m.SMGPass = SMGPass;

  if (SPPort) {
    m.SPPort = SPPort;
    m.SPHost = SPHost || '';
    m.SPUser = SPUser;
    m.SPPass = SPPass;
    m.listen(SPPort, SPHost);
  }

  m.linkStatus = false;
  m.sendQueue = [];
  m.ackQueue = [];
  m.superQueue = new SuperQueue();

  m.reqCnt1 = 0;
  m.resCnt1 = 0;
  m.reqCnt2 = 0;
  m.resCnt2 = 0;

  this.SPNumber = null;
  this.CorpId = null;
  this.log = dummy;
}
require('util').inherits(SP, EE);


SP.prototype.setSPNumber = function(SPNumber){
  this.SPNumber = SPNumber;
  return this;
}

SP.prototype.setCorpId = function(CorpId){
  this.CorpId = CorpId;
  return this;
}

SP.prototype.setLogger = function(logger){
  this.log = logger || dummy;
  return this;
}

SP.prototype.findAckReq = function(resPDU){
  var queue = this.ackQueue;
  var resHead = resPDU.slice(8, 16).toString('hex')
    , resSeq = resPDU.readUInt32BE(16)
    ;
  for (var i = 0, len = queue.length; i < len; i++) {
    var req = queue[i]
      , reqPDU = req.PDU
      , reqHead = reqPDU.slice(8, 16).toString('hex')
      , reqSeq = reqPDU.readUInt32BE(16)
      ;
    this.log(resHead, reqHead, resSeq, reqSeq, req.splits, req.lackAckCnt);
    if (resHead === reqHead && resSeq >= reqSeq && resSeq < reqSeq + (req.splits || 1)) {
      this.resCnt2++;
      if (--req.lackAckCnt === 0) {
        this.resCnt1++;
        return queue.splice(i, 1)[0];
      } else {
        return;
      }
    }
  }
  return null; // may be res after first part for multi-split req, so just ignored
  this.log(Msg.parse(resPDU));
  throw new Error('no acknownledge queue message corresponding to the response PDU.');
};

SP.prototype.connect = function(cb){
  var me = this
    , client = me.socket = new net.Socket()
    , bound = false
    ;

  client.on('close', function(){
    me.linkStatus = false;
    me.log('SMG server close');
  });
  client.on('end', function(){
    me.linkStatus = false;
    me.log('SMG server end');
  });
  client.on('error', function(){
    me.log('SMG connection has error!');
    me.log(me);
  });
  client.on('timeout', function(){
    me.log('SMG connection has timeout!');
  });

  me.log('try to connect to SMG with %s:%s', me.SMGHost, me.SMGPort);
  client.connect(me.SMGPort, me.SMGHost, function(){
    me.log('SMG connected');
    var bind = new Bind(1, me.SMGUser, me.SMGPass);
    client.write(bind.makePDU(null, me.NodeID));

    var spliter = new StreamSpliter(client, 'readUInt32BE');
    spliter.on('message', function(PDU){
      var res = Msg.parse(PDU);
      if (!bound) {
        me.log('bind response received');
        if (res.Result === 0) {
          me.log('Bind to SMG success');
          bound = true;
          me.linkStatus = true;
          me.dumpQueue(); // send all ready-to-send cmds from queue
          cb && cb();
        } else {
          console.log('Bind to smg failed with errCode %d', res.Result);
          client.end();
        }
      } else {
        var req = me.findAckReq(PDU);
        if (req) {
          req.callback && req.callback(res, req);
        } else {
          me.emit('request', res);
        }
      }
    });
  });
};

SP.prototype.disconnect = function(){
  if (!this.linkStatus) return;
  this.dumpQueue();
  this.socket.end(new Unbind());
  this.linkStatus = false;
}

SP.prototype.dumpQueue = function(){
  this.sendQueue.forEach(function(act){
    act();
  }, this);
  this.sendQueue = [];
}

SP.prototype.send = function(msg, callback){
  if (callback) {
    msg.callback = callback;
  }
  var me = this;
  me.superQueue.enqueue({weight : msg.splits || 1}, function(option, actcb){
    function _send(){
      me.socket.write(msg.makePDU(null, me.NodeID));
      me.ackQueue.push(msg);
      me.reqCnt1++;
      me.reqCnt2 += (msg.splits || 1);
      actcb();
    }

    if (this.linkStatus) {
      _send();
    } else {
      me.sendQueue.push(_send);
      me.connect();
    }
  });
}

SP.prototype.listen = function(port, host){
  var me = this;
  var server = net.createServer(function(c){
    console.log('server connected');
    var spliter = new StreamSpliter(c, 'readUInt32BE')
      , bound = false
      ;
    c.on('end', function(){
      me.log('SP server end');
    });
    c.on('close', function(){
      me.log('SP server close');
    });
    c.on('error', function(){
      me.log('SP server error');
    });
    c.once('data', function(data){
      me.log(data);
    });
    spliter.on('message', function(PDU){
      var msg = Msg.parse(PDU)
        , resp
        , result
        ;
      if (!bound) {
        if (msg.LoginName === me.SPUser && msg.LoginPassword === me.SPPass) {
          result = 0;
          bound = true;
        } else {
          result = 1;
        }
        resp = new Bind.Resp(result);
        c.write(resp.makePDU(PDU));
      } else {
        me.emit('request', msg);
      }
    });
  });

  if (host) {
    server.listen(port, host, function(sock){ //'listening' listener
      console.log('SP server bound at ' + host);
    });
  } else {
    server.listen(port, function(sock){ //'listening' listener
      console.log('SP server bound');
    });
  }
}

exports.Class = SP;
// module.exports = SP;

if (bUnitText) {
  var sp = new SP('202.99.87.201', 8801, 'dialbook', 'dialbooktest', 8801, '', 'dialbook', 'dialbooktest');
  var msg, encoding = 8, content = '', option = {};
  var lowDebug = 0
    , sendMethod = 2
    , amount10 = 20
    ;
  sp.connect();

  switch (lowDebug || encoding) {
    case 0:
      encoding = 0;
      content = '1234567890123456789012345678901234567890123456789012345678901234567890';
      content += content;
      content = 'password:4644 @http://unidialbook.com/tjuc/register_b.a?rc=4644';
      break;
    case 1:
      encoding = 1;
      content = 'liyong4';
      break;
    case 8:
      encoding = 8;
      content = '';
      // 67 one page, 134 for two page max
      for (var i = 0; i < amount10; i++) {
        content += '一二三四五六七八九' + ((i + 1) % 10);
      }
      content += '完'; // 201 chars will cause error
      break;
    case 15:
      encoding = 15;
      content = new Buffer([192, 238, 211, 194, 49, 50, 51]); //'李勇';
      break;
    case -1:
      encoding = 8;
      content = new Buffer([0x05, 0x00, 0x03, 19, 3, 3, 0x67, 0x4e, 0x52, 0xc7, 0x4e, 0x00, 0x67, 0x4e, 0x52, 0xc7, 0x4e, 0x00, 0x67, 0x4e, 0x52, 0xc7, 0x4e, 0x00, 0x67, 0x4e, 0x52, 0xc7, 0x4e, 0x00, 0x67, 0x4e, 0x52, 0xc7, 0x4e, 0x00, 0x67, 0x4e, 0x52, 0xc7, 0x4e, 0x00, 0x67, 0x4e, 0x52, 0xc7, 0x4e, 0x00, 0x67, 0x4e, 0x52, 0xc7, 0x4e, 0x00]);
      //'李勇'; 共计 3*6*10*2=360 字节  15*6*4=360字节
      break;
  }

  if (true) {
    // for single target number test
    option.ReportFlag = 1;
    msg = new Submit('8615620001781', encoding, content, option); // 8618602247757  8615620001781
  } else {
    // todo: for multiple numbers, SMG result is 5 (bad format)
    msg = new Submit(['8615620007256', '8615620001781' , '8618602247741'], encoding, content);
  }
  // console.log(msg);

  sp.on('request', function(req){
    if (req instanceof Msg.Report) {
      console.log('\nReport:');
    } else if (req instanceof Msg.Deliver) {
      console.log('\nDeliver:');
    } else {
      console.log('\nOtherType:');
    }
    console.log(req);
  });

  switch (lowDebug || sendMethod) {
    case 1 :
      msg.rowid = 'AAAS2sAAEAAACEjAAA';
      sp.send(msg, function(res, req){
        console.log('\n\nrespond :');
        console.log('the result for %j is %d', res.header, res.Result);
        console.log('You can use oracle rowid %s to fill SMS id columns with %j', req.rowid, res.header);
      });
      break;
    case 2:
      // for send and catch for "resp" event mode
      sp.send(msg);
      sp.on('resp', function(msgResp, msgSend){
        console.log('\n\nresponse :');
        console.log(msgResp);
        console.log(msgSend);
        // console.log(sp.ackQueue.length);
      });
      break;
    case -1:
      option = { 'TP_udhi' : 1, 'ScheduleTime' : utl.afterNow(1)};
      // for send with response callback mode
      var parts = 10;
      content.writeUInt8(21, 3);
      content.writeUInt8(parts, 4);
      for (var j = 0; j < parts; j++) {
        (function(){
          var c = new Buffer(content);
          c.writeUInt8(j + 1, 5);
          msg = new Submit('8615620001781', encoding, c, option);
          sp.send(msg, function(res, req){
            console.log('pair are', req, res, 'end');
          });
        })();
      }
      break;
  }
}
