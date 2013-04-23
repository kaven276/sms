/**
 * Created with JetBrains WebStorm.
 * User: cuccpkfs
 * Date: 12-5-14
 * Time: 上午10:51
 * To change this template use File | Settings | File Templates.
 */


var net = require('net')
  , Cmds = require('../Commands.js')
  , Msg = Cmds.Msg
  , StreamSpliter = require('../StreamSpliter.js').Class
  , BindResp = require('../cmds/cmdBind.js').Class.Resp
  ;

var server = net.createServer(function(c){
  console.log('fake SMG server connected');
  var spliter = new StreamSpliter(c, 'readUInt32BE')
    , passed = false
    ;
  c.on('end', function(){
    console.log('\n\n\nSMG server end');
  });
  c.on('close', function(){
    console.log('SMG server close');
  });
  c.on('error', function(){
    console.log('SMG server error');
  });

  function errHandler(cond, info){
    if (!cond) {
      console.log(info);
      c.close();
      return true;
    } else {
      return false;
    }
  }

  spliter.on('message', function(pdu){
    console.log('\n\n\n');
    console.log(pdu);
    if (!passed) {
      // console.log(pdu.slice(0, 20));
      // console.log(pdu.slice(20));
      var bind = Msg.parse(pdu);
      if (errHandler(bind instanceof Cmds.Bind, 'first PDU must be Bind PDU.')) return;
      if (errHandler(bind.LoginType === 1, 'LoginType must be 1.')) return;
      if (errHandler(bind.LoginName === 'dialbook', 'LoginName must be dialbook.')) return;
      if (errHandler(bind.LoginPassword === 'dialbooktest', 'LoginPassword must be dialbooktest.')) return;
      console.log(1);
      console.log(bind);
      var bindResp = new BindResp(0);
      c.write(bindResp.makePDU(pdu));
      passed = true;
    } else {
      var msg = Msg.parse(pdu);
      console.log(2);
      console.log(msg);
      var msgResp = new msg.constructor.Resp(0);
      c.write(msgResp.makePDU(pdu));
      console.log(3);
      console.log(msgResp);
    }
  });
});
