var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function AddSMG(SMGId, SMGIP, LoginName, LoginPassword){
  utl.msgInit(this, arguments);
}
AddSMG.PDUAttrSeq = [A.SMGId, A.SMGIP, A.LoginName, A.LoginPassword];

exports.Class = AddSMG;