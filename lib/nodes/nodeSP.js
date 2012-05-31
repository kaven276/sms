var bUnitText = (process.argv[1] === __filename)
  , EE = require('events').EventEmitter
  , utl = require('../util.js')
  , net = require('net')
  , Cmd = require('../Commands.js')
  , Msg = Cmd.Msg
  , CmdSeq = require('../CmdSeq.js')
  , Bind = require('../cmds/cmdBind.js').Class
  , Unbind = require('../cmds/cmdUnbind.js').Class
  , Submit = require('../cmds/cmdSubmit.js').Class
  , Trace = require('../cmds/cmdTrace.js').Class
  , rc = require('../regCode.js')
  , StreamSpliter = require('../StreamSpliter.js').Class
  ;

function SP(SMGHost, SMGPort, SMGUser, SMGPass, SPPort, SPHost, SPUser, SPPass){
  EE.call(this);
  var m = this;
  m.SMGHost = SMGHost;
  m.SMGPort = SMGPort;
  m.SMGUser = SMGUser;
  m.SMGPass = SMGPass;
  m.linkStatus = false;
  m.sendQueue = [];
  m.ackQueue = [];
  if (SPPort) {
    m.SPPort = SPPort;
    m.SPHost = SPHost || '';
    m.SPUser = SPUser;
    m.SPPass = SPPass;
    m.listen(SPPort, SPHost);
  }
}
require('util').inherits(SP, EE);

SP.prototype.connect = function(){
  var me = this
    , client = me.socket = new net.Socket()
    , bound = false
    ;
  client.connect(me.SMGPort, me.SMGHost, function(){
    console.log('SMG connected');


    var bind = new Bind(1, me.SMGUser, me.SMGPass)
      , buf = bind.makePDU()
      ;
    console.log(bind);
    console.log(bind.PDU.slice(20));
    console.log(bind.PDU.length);
    client.on('data', function(bindRespBuf){
        console.log('bind response received');
        var bindResp = Msg.parse(bindRespBuf);
        if (bindResp.Result === 0) {
          console.log('connect to SMG success');
          me.linkStatus = true;
          me.dumpQueue(); // send all ready-to-send cmds from queue
          var spliter = new StreamSpliter(client, 'readUInt32BE');
          spliter.on('message', parseMsg);
        } else {
          console.log('connect to smg failed with errCode %d', bindResp.Result);
          client.end();
        }
      }
    );
    client.write(buf);
    client.on('close', function(){
      console.log('SMG server close');
    });
    client.on('end', function(){
      console.log('SMG server end');
    });
  });

  function parseMsg(respBuf){
    // todo: remove the corresponding cmd from acknowledge-waiting queue
    var msg = Msg.parse(respBuf);
    me.emit('resp', msg);
    console.log(msg);

  }
};

SP.prototype.disconnect = function(){
  if (!this.linkStatus) return;
  this.socket.end(new Unbind());
  this.linkStatus = false;
}

SP.prototype.dumpQueue = function(){
  this.sendQueue.forEach(function(msg){
    this.send(msg);
  }, this);
  this.sendQueue = [];
}

SP.prototype.send = function(msg){
  if (this.linkStatus) {
    this.socket.write(msg.makePDU());
    this.ackQueue.push(msg);
  } else {
    this.sendQueue.push(msg);
  }
}

SP.prototype.listen = function(port, host){
  var me = this;
  var server = net.createServer(function(svrSock){
    var halfBuf = [], halfLen = 0;
    console.log('server connected');
    // todo: wait for bind request and check user/pass
    // todo: if passed, accept request and emit events for report, userRpt
    c.on('end', function(){
      console.log('SP server end');
    });
    c.on('close', function(){
      console.log('SP server close');
    });
    c.on('error', function(){
      console.log('SP server error');
    });
    c.once('data', function(bindReqBuf){
      var bind = Cmd.Msg.getBuf(bindReqBuf);
      var bindResp;
      if (bind.LoginName === me.SPUser && bind.LoginPassword = me.SPPass) {
        // login succeed
        bindResp = new BindResp(0);
        svrSock.write(bindResp.setBuf());
        var spliter = new StreamSpliter(c, 'readUInt32BE');
        spliter.on('message', function(msg){
          // Msg.parse(msg);
          // todo: convert buffer to SGIP message object
          me.emit('request', Msg.parse(msg));
        });
      } else {
        bindResp = new BindResp(1);
        svrSock.end(bindResp.setBuf());
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
  var msg;
  console.log(sp);
  sp.connect();
  msg = new Submit(['15620001781'], 0, 'liyong1');
  sp.send(msg, callback);
  console.log(msg);
  // sp.send(new Submit(['15620007256'], 8, 'sms is ok now, thank you!'), callback);
  // sp.send(new Submit(['15620001781'], 15, '李勇'), callback);
  sp.on('resp', callback);
  function callback(msgSend, msgResp){
    console.log('send message success for :');
    console.log(msgSend);
    console.log(msgResp);
  }
}