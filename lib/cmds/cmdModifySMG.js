var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function ModifyMSG(OldSMGId, NewSMGId, SMGIP, LoginName, LoginPassword){
  utl.msgInit(this, arguments);
}
ModifyMSG.PDUAttrSeq = [A.OldSMGId, A.NewSMGId, A.SMGIP, A.LoginName, A.LoginPassword];

module.exports = ModifyMSG;