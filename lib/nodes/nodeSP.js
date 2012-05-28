var bUnitText = (process.argv[1] === __filename)
  , EE = require('events').EventEmitter
  , utl = require('./../util.js')
  , net = require('net')
  , Cmd = require('../Commands.js')
  , CmdSeq = require('../CmdSeq.js')
  , Bind = require('../cmds/cmdBind.js')
  , BindResp = Bind.Resp
  , Unbind = require('../cmds/cmdUnbind.js')
  , UnbindResp = Unbind.Resp
  , Submit = require('../cmds/cmdSubmit.js')
  , SubmitResp = Submit.Resp
  , Trace = require('../cmds/cmdTrace.js')
  , TraceResp = Trace.Resp
  , rc = require('../regCode.js')
  , StreamSpliter = require('../StreamSpliter.js')
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
  var me = this;
  var client = me.socket = new net.Socket();
  client.connect(me.SMGPort, me.SMGHost, function(){
    var bind = new Bind(1, me.SMGUser, me.SMGPass);
    buf = bind.setBuf();
    client.send(bind.sbuf);
    client.once('data', function(bindRespBuf){
        var bindResp = BindResp.getBuf(bindRespBuf);
        if (bindResp.Result === 0) {
          console.log('connect to SMG success');
          me.linkStatus = true;
          me.sendQueue(); // send all ready-to-send cmds from queue
          var spliter = new StreamSpliter(client, 'readUInt32BE');
          spliter.on('message', parseMsg);
        } else {
          console.log('connect to smg failed with errCode %d', bindResp.Result);
          client.end();
        }
      }
    );
  });

  function parseMsg(respBuf){
    // todo: remove the corresponding cmd from acknowledge-waiting queue
    var cmdHeader = null; // todo
    switch (cmdHeader.CommandId) {
      case rc.CmdIDs.SGIP_SUBMIT_RESP :
        var submitResp = Submit.Resp.getBuf(respBuf);
        me.emit('resp', submitResp);
        break;
      case rc.CmdIDs.SGIP_TRACE_RESP :
        var traceResp = Trace.Resp.getBuf(respBuf);
        me.emit('resp', traceResp);
        break;
      default:
    }
  }
};

SP.prototype.disconnect = function(){
  if (!this.linkStatus) return;
  this.socket.end(new Unbind());
  this.linkStatus = false;
}

SP.prototype.sendQueue = function(){
  this.sendQueue.forEach(function(msg){
    this.send(msg);
  });
  this.sendQueue = [];
}

SP.prototype.send = function(msg){
  if (this.linkStatus) {
    this.socket.write(msg.setBuf());
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
      console.log('server disconnected');
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
    server.listen(port, host, function(){ //'listening' listener
      console.log('server bound');
    });
  } else {
    server.listen(port, function(){ //'listening' listener
      console.log('server bound');
    });
  }
}

if (bUnitText) {
  var sp = new SP('211.94.244.225', 8801, 8010);
  sp.connect();
  sp.send(new Submit('15620001781', 'test1'), callback);
  sp.send(new Submit('15620001781', 'test2'), callback);
  sp.send(new Submit('15620001781', 'test3'), callback);
  sp.on('resp', callback);
  function callback(msgSend, msgResp){
    console.log('send message success for :');
    console.log(msgSend);
  }

}