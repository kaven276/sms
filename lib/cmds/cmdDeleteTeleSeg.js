var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function DeleteTeleSeg(SMGId, TeleSeg){
  utl.msgInit(this, arguments);
}
DeleteTeleSeg.PDUAttrSeq = [A.SMGId, A.TeleSeg];

exports.Class = DeleteTeleSeg;