var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function AddSP(SMGId, SPNumber, ServiceTag, CorpId){
  utl.msgInit(this, arguments);
}
AddSP.PDUAttrSeq = [A.SMGId, A.SPNumber, A.ServiceTag, A.CorpId];

exports.Class = AddSP;
