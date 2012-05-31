var A = require('./../AttrCfg.js')
  , utl = require('../util.js')
  ;

function DeleteMSG(SMGId){
  utl.msgInit(this, arguments);
}
DeleteMSG.PDUAttrSeq = [A.SMGId];


exports.Class = DeleteMSG;