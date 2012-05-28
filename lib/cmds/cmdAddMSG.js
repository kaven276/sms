var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function AddMSG(SMGId, SMGIP, LoginName, LoginPassword){
  utl.msgInit(this, arguments);
}
AddMSG.PDUAttrSeq = [A.SMGId, A.SMGIP, A.LoginName, A.LoginPassword];

module.exports = AddMSG;