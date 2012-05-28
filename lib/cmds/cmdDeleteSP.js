var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function DeleteSP(SMGId, SPNumber, ServiceTag){
  utl.msgInit(this, arguments);
}
DeleteSP.PDUAttrSeq = [A.SMGId, A.SPNumber, A.ServiceTag];

module.exports = DeleteSP;