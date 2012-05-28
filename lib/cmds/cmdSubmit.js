var Msg = require('./../Commands.js').Msg()
  , util = require('util')
  , utl = require('./../util.js')
  , A = require('./../AttrCfg.js')
  ;

function Submit(UserNumbers, MessageContent, cfg){
  this.UserCount = UserNumbers.length;
  this.UserNumber = UserNumbers;
  this.MessageContent = MessageContent;
  this.cfg = cfg;
}

Submit.propSeq = [A.SPNumber, A.ChangeNumber, A.UserCount, A.UserNumber, A.CorpId, A.ServiceType, A.FeeType
  , A.FeeValue, A.GivenValue, A.AgentFlag, A.MorelatetoMTFlag, A.Priority, A.ExpireTime, A.ScheduleTime, A.ReportFlag
  , A.TP_pid, A.TP_udhi, A.MessageCoding, A.MessageType, A.MessageLength, A.MessageContent, A.Reserve];


function SubmitResp(){

}
SubmitResp.propSeq = [];


module.exports = Submit;
Submit.Resp = SubmitResp;