var A = require('../AttrCfg.js')
  , utl = require('../util.js')
  ;

function AddTeleSeg(SMGId, TeleSeg, TeleType, AreaCode){
  utl.msgInit(this, arguments);
}
AddTeleSeg.PDUAttrSeq = [A.SMGId, A.TeleSeg, A.TeleType, A.AreaCode];

module.exports = AddTeleSeg;
