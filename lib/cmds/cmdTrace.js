var bUnitTest = (process.argv[1] === __filename)
  , A = require('./../AttrCfg.js')
  ;

function Trace(srcNodeID, cmdTime, cmdSeq, UserNumber){
  this.srcNodeID = srcNodeID;
  this.cmdTime = cmdTime;
  this.cmdSeq = cmdSeq;
  this.UserNumber = UserNumber;
}
Trace.PDUAttrSeq = [A.srcNodeID, A.cmdTime, A.cmdSeq, A.UserNumber];


function TraceResp(Results, NodeIds, ReceiveTimes, SendTimes){
  if (Results) {
    this.Count = Result.length;
    this.Result = Results;
    this.NodeId = NodeIds;
    this.ReceiveTime = ReceiveTimes;
    this.SendTime = SendTimes;
  } else {
    this.Count = 0;
    this.Result = [];
    this.NodeId = [];
    this.ReceiveTime = [];
    this.SendTime = [];
  }
}
TraceResp.PDUAttrSeq = [A.Count, A.Result, A.NodeId, A.ReceiveTime, A.SendTime, false];
TraceResp.prototype.addTrace = function(Result, NodeId, ReceiveTime, SendTime){
  this.Count++;
  this.Result.push(Result);
  this.NodeId.push(NodeId);
  this.ReceiveTime.push(ReceiveTime);
  this.SendTime.push(SendTime);
}
TraceResp.prototype.getPDULength = function(){
  return (this.constructor.fixedPartLength - 1) * this.Count + 1;
}

module.exports = Trace;
Trace.Resp = TraceResp;

if (bUnitTest) {
  process.nextTick(function(){
    var Msg = require('../Commands.js').Msg
      , msg, PDU, msgEcho
      ;
    msg = new Trace(3020091287, 0528102149, 4, '15620001781');
    PDU = msg.makePDU();
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    msgEcho = Msg.parse(PDU);
    console.log(msgEcho);

    msg = new TraceResp();
    msg.addTrace(0, '123456', '120526120000+032', '120226120102+32');
    msg.addTrace(1, '654321', '120526130000+032', '120226130102+32');
    PDU = msg.makePDU();
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    msgEcho = Msg.parse(PDU);
    console.log(msgEcho);
  });
}
