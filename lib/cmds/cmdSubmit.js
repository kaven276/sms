var bUnitText = (process.argv[1] === __filename)
  , A = require('../AttrCfg.js')
  , override = require('../util.js').override
  , Encodings = require('../util.js').Encodings
  , cannedOptions = {}
  ;

var defOptions = {
  SPNumber : '106550224003',
  ChargeNumber : '000000000000000000000',
  CorpId : '91287', // 0-99999 no particular CorpId assigned
  ServiceType : 'QHT2', // no specific ServerType
  FeeType : 1, // free of charge
  FeeValue : '0', // free of charge
  GivenValue : '0', // no Given
  AgentFlag : 0,
  MorelatetoMTFlag : 2, // SP initiated submit, not related with any MO requirement
  Priority : 0, // the lowest priority
  ExpireTime : '', // use SMC's default expiration setting, normally 2 days
  ScheduleTime : '', // send immediately
  ReportFlag : 2, //  status report not required
  TP_pid : 0,
  TP_udhi : 0,
  MessageCoding : 8, // 15 GBK, 8 UCS2
  MessageType : 0 // SMS
};

// convert defOptions to a instance object of a class
function CDefOptions(){
  for (var n in defOptions) {
    this[n] = defOptions[n];
  }
}


/**
 * create a submit PDU object with required parameters and options
 * @param UserNumbers
 * @param MessageContent
 * @param options may be a name-value object, or predefined option ID string, or array of ether of them
 * @constructor
 */
function Submit(UserNumber, MessageCoding, MessageContent, options){
  if (arguments.length === 0) return; // it is for receiver to parse PDU only
  var myOptions = {};
  myOptions.__proto__ = defOptions;

  if (options) {
    if (!(options instanceof Array))
      options = [options];
    options.forEach(function(opt){
      if (opt instanceof String) {
        override2(myOptions, cannedOptions[opt]);
      } else if (typeof opt === 'object') {
        override2(myOptions, opt);
      } else {
        throw new Error('options must be cannedOptions ID or options name-value pair object!');
      }
    });
  }
  this.options = myOptions;

  if (UserNumber instanceof Array) {
    this.UserCount = UserNumber.length;
    this.UserNumber = UserNumber;
  } else {
    this.UserCount = 1;
    this.UserNumber = [UserNumber];
  }

  this.MessageCoding = MessageCoding; // todo: for digit id only or automatic detected, default to what ??
  var enc = Encodings[MessageCoding.toString()];
  console.log('MessageContent', MessageContent)
  console.log(new Buffer(MessageContent, enc));
  this.MessageLength = (new Buffer(MessageContent, enc)).length;
  this.MessageContent = MessageContent;
}

Submit.addCunnedOptions = function(name, options){
  cannedOptions[name] = options;
};

Submit.PDUAttrSeq = [A.SPNumber, A.ChargeNumber, A.UserCount, A.UserNumber, null, A.CorpId, A.ServiceType, A.FeeType
  , A.FeeValue, A.GivenValue, A.AgentFlag, A.MorelatetoMTFlag, A.Priority, A.ExpireTime, A.ScheduleTime, A.ReportFlag
  , A.TP_pid, A.TP_udhi, A.MessageCoding, A.MessageType, A.MessageLength, A.MessageContent];

Submit.prototype.getPDULength = function(){
  return Submit.fixedPartLength + (this.UserNumber.length - 1) * A.UserNumber.length + this.MessageLength;
};

Submit.prototype.beforeSend = function(){
  if (this.MessageLength > 140 || this.splits)
    this.options.ScheduleTime = utl.afterNow(1);
};

exports.Class = Submit;


if (bUnitText) {
  process.nextTick(function(){
    var Msg = require('../Commands.js').Msg;
    var submit = new Submit(['15620001781', '15620009233'], 15, 'some content');
    var PDU = submit.makePDU();
    var submitEcho = Msg.parse(PDU);
    console.log(submit);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(submitEcho);
  });
}