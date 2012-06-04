var bUnitText = (process.argv[1] === __filename)
  , CmdSeq = require('./CmdSeq.js')
  , util = require('util')
  , Encodings = require('./util.js').Encodings
  ;

function Msg(){
  this.sPtr = 0;
  this.PDU = null;
}

Msg.setFixedPartLength = function(subtype){
  var len = 0
    ;
  subtype.PDUAttrSeq.forEach(function(attr, i){
    attr && (len += attr.length);
  });
  subtype.fixedPartLength = len;
  return len;
}

/**
 * default PDU length computator if there is no variale length attr or multi occurence attr for the PDU type
 * particular PDU types have it's own overrided method
 * @return {*}
 */
Msg.prototype.getPDULength = function(){
  return this.constructor.fixedPartLength + (this.MessageLength || 0);
}

Msg.prototype.beforeSend = function(){
  ;
}

Msg.prototype.makePDU = function(reqPDU){
  var me = this
    , PDULen = 20 + me.getPDULength() + 8
    , PDUType = me.constructor
    , attrs = PDUType.PDUAttrSeq
    , PDU
    , sPtr
    , count = false
    , j
    , loopPos
    ;
  PDU = me.PDU = new Buffer(PDULen);
  PDU.writeUInt32BE(PDULen, 0);
  PDU.writeUInt32BE(PDUType.code, 4);
  if (reqPDU) {
    reqPDU.copy(PDU, 8, 8, 20);
  } else {
    CmdSeq.genNextSeq(PDU);
  }
  sPtr = 20;

  me.beforeSend(); // Warning: must execute after setting PDU time in unique 3 4UIntBE sequence
  for (var i = 0, aLen = attrs.length; i < aLen; i++) {
    var attr = attrs[i];
    if (!attr) {
      // end of array once
      if (++j < count) {
        i = loopPos;
      } else {
        count = false;
      }
      continue;
    }
    var aname = attr.name;
    var val = count ? me[aname][j] : me[aname];
    if (attr.name)
      if (val === undefined) val = me.options[attr.name];

    switch (attr.datatype) {
      case 'text' :
        (function(len){
          var bytesWriten;
          if (len) {
            bytesWriten = PDU.write(val, sPtr, len, 'utf8');
            PDU.fill(0, sPtr + bytesWriten, sPtr + len);
            sPtr += len;
            // console.log(PDU.slice(sPtr, sPtr + len));
          } else {
            // for attr that length is determined by its instance length, not by its type's fixed length
            // for example MessageContent attr in Submit PDU
            bytesWriten = val.copy(PDU, sPtr);
            sPtr += val.length;
          }
        })(attr.length);
        break;

      case 'integer' :
        switch (attr.length) {
          case 1 :
            PDU.writeUInt8(val, sPtr);
            if (aname.substr(-5) === 'Count') {
              count = val;
              loopPos = i;
              j = 0;
            }
            break;
          case 4 :
            PDU.writeUInt32BE(val, sPtr);
            break;
          case 12 :
            PDU.writeUInt32BE(val, sPtr);
        }
        sPtr += attr.length;
        break;
    }
  }
  PDU.fill(0, sPtr);
  if (me.splits) {
    return me.followParts(PDU);
  }
  return PDU;
};

Msg.readHeader = function(buf){
  return {
    length : CmdMap[ buf.readUInt32BE(0)],
    class : CmdMap[ buf.readUInt32BE(4)],
    SN : CmdSeq.readSeq(buf, 8, 20)
  };
}

/**
 * Give a whole SGIP message raw buffer data, convert it to a SGIP javascript object
 * @param data
 * @return {Msg}
 */
Msg.parse = function(data){

  var cmdID = data.readUInt32BE(4);
  if (cmdID > 0x80000000)
    MsgType = CmdMap[cmdID - 0x80000000].Resp;
  else
    MsgType = CmdMap[cmdID];

  // console.log(data.readUInt32BE(4));
  // console.log(MsgType);

  var PDULen = data.readUInt32BE(0)
    , msg = new MsgType()
    , PDUAttrSeq = MsgType.PDUAttrSeq
    , ptr = 20
    , varLen
    , prevName
    , count
    , j
    , loopPos
    ;
  msg.header = CmdSeq.readSeq(data);
  for (var i = 0, aLen = PDUAttrSeq.length; i < aLen; i++) {
    var attr = PDUAttrSeq[i]
      , aname
      , val
      ;
    if (!attr) {
      if (++j < count) {
        i = loopPos;
      } else {
        count = false;
      }
      continue;
    }
    aname = attr.name;
    if (attr.datatype === 'text') {
      if (attr.length) {
        val = data.toString('utf8', ptr, ptr + attr.length); // todo: encoding may not be utf8
        // console.log('string length for %s is %d', aname, val.length);
        var zeroPos = val.indexOf("\u0000");
        ~zeroPos && (val = val.slice(0, zeroPos));
        ptr += attr.length;
      } else {
        varLen = msg[PDUAttrSeq[i - 1].name];
        // val = data.toString('utf8', ptr, ptr + varLen); // todo: encoding may not be utf8
        val = new Buffer(data.slice(ptr, ptr + varLen));
        // console.log('varLen', varLen, aname, val);
        ptr += varLen;
      }
    } else if (attr.datatype = 'integer') {
      switch (attr.length) {
        case 1 :
          val = data.readUInt8(ptr);
          if (aname.substr(-5) === 'Count') {
            count = val;
            j = 0;
            loopPos = i;
            msg[aname] = count;
            ptr++;
            continue;
          }
          break;
        case 4:
          val = data.readUInt32BE(ptr);
          break;
        case 12:
          val = CmdSeq.readSeq(data, ptr);
          break;
      }
      ptr += attr.length;
    }
    if (count) {
      if (j)
        msg[aname].push(val);
      else
        msg[aname] = [val];
    } else {
      msg[aname] = val;
    }
  }
  return msg;
}

Msg.findInQueue = function(queue, PDU){
  var respSeq = PDU.slice(8, 20).toString('hex');
  for (var i = 0, len = queue.length; i < len; i++) {
    var reqSeq = queue[i].PDU.slice(8, 20).toString('hex');
    if (reqSeq == respSeq) {
      return queue.splice(i, 1)[0];
    }
  }
  return null;
  throw new Error('no acknownledge queue message corresponding to the response PDU.');
};

exports.Msg = Msg;

var CmdMap = [];
exports.CmdMap = CmdMap;

var Cmds = {};
exports.Cmds = Cmds;

var attrResult = require('./AttrCfg.js').Result;
function makeResp(){
  function stdResp(Result){
    this.Result = Result;
  }

  stdResp.PDUAttrSeq = [attrResult];
  return stdResp;
}


/**
 * bulk inherit PDU classes from Msg
 * assign each PDU class a CommandID
 * compute each PDU class's fix part length
 * the above functions run only once
 */
(function export_commands(){
  // Warning: the cmds have PDU type names that must keep order as below for index with correct CommandID
  var cmds = 'Bind,Unbind,' +
      'Submit,Deliver,Report,' +
      'AddSP,ModifySP,DeleteSP,' +
      'QueryRoute,' +
      'AddTeleSeg,ModifyTeleSeg,DeleteTeleSeg,' +
      'AddSMG,ModifySMG,DeleteSMG,' +
      'CheckUser,UserRpt,Trace'
    , A = require('./AttrCfg.js')
    ;

  cmds.split(',').forEach(function(cmd, i){
    var mCmd = require('./cmds/cmd' + cmd + '.js').Class, resp;
    exports[cmd] = mCmd;
    var proto = mCmd.prototype;
    util.inherits(mCmd, Msg);
    for (var n in proto) {
      mCmd.prototype[n] = proto[n];
    }
    Msg.setFixedPartLength(mCmd);
    CmdMap[++i] = mCmd;
    mCmd.code = i;
    Cmds[cmd] = mCmd;

    resp = mCmd.Resp;
    if (!resp) {
      resp = mCmd.Resp = makeResp();
    }
    exports[cmd + 'Resp'] = resp;
    proto = resp.prototype;
    util.inherits(resp, Msg);
    for (var n in proto) {
      resp.prototype[n] = proto[n];
    }
    Msg.setFixedPartLength(resp);
    resp.code = 0x80000000 + i;
  });

  CmdMap[0x1000] = CmdMap.pop();
  CmdMap[0x1000].code = 0x1000;
  CmdMap[0x1000].Resp.code = 0x80001000;
})();

if (bUnitText) {
  for (var i in CmdMap) {
    console.log('\n');
    console.log(i);
    console.log(CmdMap[i]);
    // console.log(CmdMap[i].prototype.getPDULength.toString());
  }
  console.log(Cmds);
}
