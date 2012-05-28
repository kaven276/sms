var bUnitTest = (process.argv[1] === __filename)
  , A = require('./../AttrCfg.js')
  ;

function Report(srcNodeID, cmdTime, cmdSeq, ReportType, UserNumber, State, ErrCode){
  this.srcNodeID = srcNodeID;
  this.cmdTime = cmdTime;
  this.cmdSeq = cmdSeq;
  this.ReportType = ReportType;
  this.UserNumber = UserNumber;
  this.State = State;
  if (State === 2)
    this.ErrCode = ErrCode;
  else
    this.ErrCode = 0;
}
Report.PDUAttrSeq = [A.srcNodeID, A.cmdTime, A.cmdSeq, A.ReportType, A.UserNumber, A.State, A.ErrCode];

module.exports = Report;


if (bUnitTest) {
  process.nextTick(function(){
    var Msg = require('../Commands.js').Msg;
    var msg = new Report(3020012474, 0528104520, 13, 0, '15620001781', 0);
    var PDU = msg.makePDU();
    var msgEcho = Msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
  process.nextTick(function(){
    var Msg = require('../Commands.js').Msg;
    var msg = new Report(3020012474, 0528104520, 13, 0, '15620001781', 2, 12);
    var PDU = msg.makePDU();
    var msgEcho = Msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
}