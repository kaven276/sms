var bUnitTest = (process.argv[1] === __filename)
  , A = require('./../AttrCfg.js')
  , override = require('../util.js').override
  ;

var defOptions = {
  SPNumber : '123456',
  TP_pid : 0,
  TP_udhi : 0
};

function Deliver(UserNumber, MessageCoding, MessageContent, options){

  if (arguments.length === 0) return; // it is for receiver to parse PDU only
  var myOptions = this.options = {};
  myOptions.__proto__ = defOptions;

  if (options) {
    if (typeof options === 'object') {
      override(myOptions, options);
    } else {
      throw new Error('options must be cannedOptions ID or options name-value pair object!');
    }
  }

  this.UserNumber = UserNumber;
  this.MessageCoding = MessageCoding; // todo: for digit id only or automatic detected, default to what ??
  this.MessageLength = (new Buffer(MessageContent, 'utf8')).length;
  this.MessageContent = MessageContent;
}
Deliver.PDUAttrSeq = [A.UserNumber, A.SPNumber, A.TP_pid, A.TP_udhi, A.MessageCoding, A.MessageLength, A.MessageContent];

exports.Class = Deliver;

if (bUnitTest) {
  process.nextTick(function(){
    var Msg = require('../Commands.js').Msg;
    var msg = new Deliver(1, 'kaven', 'psp');
    var PDU = msg.makePDU();
    var msgEcho = Msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
}