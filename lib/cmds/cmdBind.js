var bUnitTest = (process.argv[1] === __filename)
  , A = require('../AttrCfg.js')
  ;

function Bind(LoginType, LoginName, LoginPassword){
  this.LoginType = LoginType;
  this.LoginName = LoginName;
  this.LoginPassword = LoginPassword;
}
Bind.PDUAttrSeq = [A.LoginType, A.LoginName, A.LoginPassword];


module.exports = Bind;

if (bUnitTest) {
  process.nextTick(function(){
    var Msg = require('../Commands.js').Msg;
    var msg = new Bind(1, 'kaven', 'psp');
    var PDU = msg.makePDU();
    var msgEcho = Msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
}