var bUnitText = (process.argv[1] === __filename);

var Attrs = module.exports = {
  srcNodeID : 'integer:4',
  cmdTime : 'integer:4',
  cmdSeq : 'integer:4',
  AgentFlag : 'integer:1',
  AreaCode : 'text:4', // 号段所在地区长途区号
  ChargeNumber : 'text:21',
  Code : 'text:5', // SP企业代码或号段所在地区长途区号, 左对齐，剩余部分填’\0’
  CorpId : 'text:5', // 企业代码，取值范围0-99999
  Count : 'integer:1',
  ErrCode : 'integer:1', // 当State=2时为错误码值，否则为0 // todo : type info
  ExpireTime : 'text:16',
  FeeType : 'integer:1',
  FeeValue : 'text:6',
  GivenValue : 'text:6',
  LoginName : 'text:16',
  LoginPassword : 'text:16',
  LoginUser : 'text:16', // SMG的登录用户名
  LoginType : 'integer:1',
  Mark : 'text:10', // SP业务代码或手机用户类型。当Type为1时，可表示SP业务代码，该字段为空则不考虑业务代码；当Type为2时，表示手机用户类型；
  MessageCoding : 'integer:1',
  MessageContent : 'text:0',
  MessageLength : 'integer:4',
  MessageType : 'integer:1',
  MorelatetoMTFlag : 'integer:1',
  NewAreaCode : 'text:4', // 号段所在地区长途区号
  NewSMGId : 'text:6', // SP所在SMG的节点编号
  NewSPNumber : 'text:21', // SP的新接入号码
  NewServiceTag : 'text:10', // 业务代码，该字段为空时不考虑服务特征串
  NewTeleSeg : 'text:7', // 手机号码段
  NewTeleType : 'text:1', // 用户类型；0：签约用户，1：如意通
  NodeId : 'text:6', // todo
  Number : 'text:21', // 左对齐，剩余部分填’\0’
  OldSMGId : 'text:6', // SP所在SMG的节点编号
  OldSPNumber : 'text:21', // SP的原接入号码
  OldServiceTag : 'text:10', // 业务代码，该字段为空时不考虑服务特征串
  OldTeleSeg : 'text:7', // 手机号码段
  OldTeleType : 'text:1', // 用户类型；0：签约用户，1：如意通
  Password : 'text:16', // SMG的登录密码
  Priority : 'integer:1',
  ReceiveTime : 'text:12',
  ReportFlag : 'integer:1',
  ReportType : 'integer:1', // 0：对先前一条Submit命令的状态报告; 1：对先前一条前转Deliver命令的状态报告
  Reserve : 'text:8',
  Result : 'integer:1',
  QueryType : 'integer:1', // QueryRoute操作的请求类型
  ScheduleTime : 'text:16',
  SendTime : 'text:12',
  ServiceTag : 'text:10', // 业务代码，该字段为空时不考虑服务特征串
  ServiceType : 'text:10',
  SMGId : 'text:6', // SP所在SMG的节点编号
  SMGIP : 'integer:4', // SMG IP地址号
  SPNumber : 'text:21',
  State : 'integer:1', // 0：发送成功; 1：等待发送; 2：发送失败
  Status : 'integer:1',
  SubmitSequenceNumber : 'integer:12',
  TeleSeg : 'text:7', // 手机号码段
  TeleType : 'text:1', // 用户类型；0：签约用户，1：如意通
  TP_pid : 'integer:1',
  TP_udhi : 'integer:1',
  Type : 'integer:1', // QueryRoute 的类型
  UserCondition : 'integer:1',
  UserCount : 'integer:1',
  UserName : 'text:16',
  UserNumber : 'text:21'
};

// use class for efficiency
function Attr(name, pair){
  this.name = name;
  this.datatype = pair[0];
  this.length = parseInt(pair[1]);
}

// convert strings to instances of Attr class
for (var n in Attrs) {
  var pair = Attrs[n].split(':');
  Attrs[n] = new Attr(n, pair);
}

if (bUnitText) {
  console.log(module.exports);
}