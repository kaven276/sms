var A = require('./../AttrCfg.js')
  ;

function CheckUser(){

}
CheckUser.propIniSeq = [A.UserName, A.Password, A.UserNumber];
CheckUser.PDUAttrSeq = [A.UserName, A.Password, A.UserNumber];


function CheckUserResp(){

}
CheckUserResp.propIniSeq = [A.Result, A.Status];
CheckUserResp.PDUAttrSeq = [A.Result, A.Status];


module.exports = CheckUser;
CheckUser.Resp = CheckUserResp;