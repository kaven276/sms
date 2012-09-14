var A = require('./../AttrCfg.js')
  ;

function UserRpt(){

}
UserRpt.propIniSeq = [A.SPNumber, A.UserNumber, A.UserCondition];
UserRpt.PDUAttrSeq = [A.SPNumber, A.UserNumber, A.UserCondition];


function UserRptResp(){

}
UserRptResp.propIniSeq = [A.Result];
UserRptResp.PDUAttrSeq = [A.Result];


exports.Class = UserRpt;
UserRpt.Resp = UserRptResp;