var utl = require('./../util.js');

function SP(){

}

function SubmitType(){

}

function submit(msg, msgType){
  // msg maybe have prototype point to a submit type

}

/**
 * all the submit parameters here
 */
function MsgSubmit(p1, p2, msgSubmit){
  this.prototype = msgType;

}
msgSubmit.toBuffer = function(){
  var m = this
    , buf = new Buffer()
    , ptr = 0
    ;
  utl._writeText(buf, m.SPNumber, ptr, 21);
  buf.write(m.SPNumber, ptr, 21, 'ascii'); // 21 text
  ptr += 21;
  buf.write
  //...
}
var socket;


msgSubmit.inherit = function(msg){
  msgSubmit.prototype = msg;
}


SP.Submit = Submit
;