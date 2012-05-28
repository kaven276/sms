var bUnitTest = (process.argv[1] === __filename)
  , A = require('./../AttrCfg.js')
  ;

function Unbind(){

}
Unbind.PDUAttrSeq = [];


function UnbindResp(){

}
UnbindResp.PDUAttrSeq = [];


module.exports = Unbind;
Unbind.Resp = UnbindResp;

if (bUnitTest) {
  process.nextTick(function(){
    var Msg = require('../Commands.js').Msg;
    var msg = new Unbind(1, 'kaven', 'psp');
    var PDU = msg.makePDU();
    var msgEcho = Msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
}