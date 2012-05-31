var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function ModifySP(SMGId, OldSPNumber, OldServiceTag, NewSPNumber, NewServiceTag, CorpId){
  utl.msgInit(this, arguments);
}
ModifySP.PDUAttrSeq = [A.SMGId, A.OldSPNumber, A.OldServiceTag, A.NewSPNumber, A.NewServiceTag, A.CorpId];

exports.Class = ModifySP;