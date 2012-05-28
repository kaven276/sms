/**
 * Created with JetBrains WebStorm.
 * User: Li Yong
 * Date: 12-5-22
 * Time: 下午2:10
 */

var bUnitText = (process.argv[1] === __filename)
  , EV = require('events').EventEmitter
  , util = require('util')
  ;

/**
 *
 * @param stream the readable stream to inspect
 * @param method leadingUInt32, httpChunkedTransfer
 * @constructor
 */
function StreamSpliter(stream, method){
  var handler
    , halfLen = 0
    , message
    , dueLen
    ;
  EV.call(this);

  switch (method) {
    case StreamSpliter.leadingUInt32 :
      handler = leadingUInt32;
      break;
    case StreamSpliter.httpChunkedTransfer :
      leadingUInt32 = httpChunkedTransfer;
      break;
  }
  stream.on('data', handler);

  function leadingUInt32(data){
    if (!dueLen) {
      try {
        dueLen = data.readUInt32BE(0);
      } catch (e) {
        this.emit('error', e);
        stream.removeListener('data', handler);
        return;
      }
      if (dueLen === 0) {
        this.emit('end', null);
        stream.removeListener('data', handler);
        return;
      }
      message = new Buffer(dueLen);
      halfLen = 0;
    }
    var lackLen = dueLen - halfLen;
    var restLen = data.length - lackLen;
    if (restLen >= 0) {
      data.copy(message, halfLen, 0, lackLen);
      this.emit('message', message);
      dueLen = false;
      if (restLen > 0)
        leadingUInt32(data.slice(lackLen));
    } else {
      data.copy(message, halfLen);
      halfLen += data.length;
    }
  }

  function httpChunkedTransfer(data){
    ;
  }
}
util.inherits(StreamSpliter, EV);
StreamSpliter.leadingUInt32 = 1;
StreamSpliter.httpChunkedTransfer = 2;


if (bUnitText) {
  var net = require('net');
  (function(){
    var server = net.createServer(function(c){
      var spliter = new StreamSpliter(c);
      spliter.on('message', function(msg){
        console.log(msg.toString(4));
      });
    });
    server.listen(3000);
    var socket = net.Socket();
    socket.connect(3000, function(){
      var str = 'Li Yong';
      var buf = new Buffer('0000' || str);
      buf.writeUInt32BE(buf.length, 0);
      socket.write(buf);
      socket.end();
    })
  })();
}