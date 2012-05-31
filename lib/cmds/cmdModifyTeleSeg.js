var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function ModifyTeleSeg(SMGId, OldTeleSeg, NewTeleSeg, NewTeleType, NewAreaCode){
  utl.msgInit(this, arguments);
}
ModifyTeleSeg.PDUAttrSeq = [A.SMGId, A.OldTeleSeg, A.NewTeleSeg, A.NewTeleType, A.NewAreaCode];

exports.Class = ModifyTeleSeg;