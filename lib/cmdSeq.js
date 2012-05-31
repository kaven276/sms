var bUnitText = (process.argv[1] === __filename)
  , myNodeID = 3022091287
  , time = 'mmddhhmmss'
  , curSeq = 0xffffffff
  ;

function genNextSeq(buf){
  var d = new Date();
  var mTime = 0;
  mTime = mTime * 100 + (d.getMonth() + 1);
  mTime = mTime * 100 + d.getDate();
  mTime = mTime * 100 + d.getHours();
  mTime = mTime * 100 + d.getMinutes();
  mTime = mTime * 100 + d.getSeconds();
  // buf = new Buffer(20);
  buf.writeUInt32BE(myNodeID, 8);
  buf.writeUInt32BE(mTime, 12);
  curSeq = (curSeq === 0xffffffff) ? 0 : curSeq + 1;
  buf.writeUInt32BE(curSeq, 16);
  return buf;
}


function readSeq(buf, offset){
  // buf = new Buffer(12);
  offset = offset || 0;
  return {
    srcNodeID : buf.readUInt32BE(offset + 8),
    cmdTime : buf.readUInt32BE(offset + 12),
    cmdSeq : buf.readUInt32BE(offset + 16)
  }
}

exports.genNextSeq = genNextSeq;
exports.readSeq = readSeq;

if (bUnitText) {
  for (var i = 0; i < 2; i++) {
    var buf = new Buffer(20);
    buf.fill(0);
    console.log(genNextSeq(buf));
    console.log(readSeq(buf));
  }
  console.log((new Date()).getTime());
  console.log(new Date() - 0);
  console.log(new Date() - 1);
}