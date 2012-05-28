function dummy(){
}

function Msg(){

}
Msg.prototype = {
  sBuf : new Buffer(0),
  rBuf : new Buffer(0),
  sPtr : 0,
  setBuf : dummy,
  getBuf : dummy
};

Msg.prototype.setFixedPartLength = function(){
  var attrs = this.constructor.propSeq
    , len = 0
    ;
  for (var n in attrs) {
    len += attrs[n].len;
  }
  this.fixedPartLength = len;
  return len;
}

Submit.prototype.messageLength = function(){
  return this.constructor.fixedPartLength + (this.UserNumber.length - 1) * A.UserNumber.len;
}

Msg.prototype._writeText = function(txt, len){
  this.sBuf.write(txt, this.sPtr, len, 'ascii');
  this.sPtr += len;
};
Msg.prototype._writeInt = function(val, len){
  this.sBuf.writeUInt8(val, this.sPtr, 1);
  this.sPtr += 1;
};
Msg.prototype._writeInt4 = function(val, len){
  this.sBuf.writeUInt32BE(val, this.sPtr, 4);
  this.sPtr += 4;
};
Msg.prototype.setBuf = function(){
  var m = this
    , attrs = this.constructor.attrs
    ;
  m.sPtr = 0;
  for (var i = 0, len = attrs.length; i < len; i++) {
    var attr = attrs[i],
      val = m[attr.name] || m.cfg[attr.name]
    switch (attr.type) {
      case 1 : // text
        m._writeText(val, attr.len);
        break;
      case 2 : // integer1
        m._writeInt(val);
        break;
      case 3 : // integer4
        m._writeInt4(val);
        break;
      case 4 : // text array
        val.forEach(function(val){
          m._writeText(val, attr.len);
        });
        break;
    }
  }
  return m.sBuf;
};

Msg.prototype.send = function(socket, cb){
  socket.write(this.toBuffer);
  socket.on('data', function(data){
    var res = new msgSubmitResp(buf);
    cd(res);
  })
};

exports.Msg = Msg;


var Queue = [];

(function export_commands(){
  var cmds = 'Bind,Unbind,Submit,Deliver,Report,CheckUser,UserRpt,Trace';
  // AddSP,ModifySP,DeleteSP,QueryRoute,AddTeleSeg,ModifyTeleSeg,DeleteTeleSeg,AddMSG,ModifySMS,DeleteSMG
  cmds.split(',').forEach(function(cmd){
      var mCmd = require('./cmd' + cmd + '.js');
      exports[cmd] = mCmd;
      util.inherits(mCmd, Msg);
      mCmd.setFixedPartLength();
      exports[cmd + 'Resp'] = mCmd.Resp;
      util.inherits(mCmd.Resp, Msg);
      mCmd.Resp.setFixedPartLength();
    }
  );
})();

