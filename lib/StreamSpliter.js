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

exports.Class = StreamSpliter;
/**
 *
 * @param stream the readable stream to inspect
 * @param method leadingUInt32, httpChunkedTransfer
 * @constructor
 */
function StreamSpliter(stream, method){
  var self = this
    , lenMethod
    , handler
    , dueLen = false
    , message
    , halfLen
    ;
  EV.call(this);

  method = method || 'readUInt32BE';
  if (!method)
    throw new Error('must specify split method as the second parameter.');

  if (method === StreamSpliter.httpChunkedTransfer) {
    handler = httpChunkedTransfer;
  } else {
    lenMethod = Buffer.prototype[method];
    handler = leadingUInt;
  }
  stream.on('data', handler);

  function leadingUInt(data){
    if (!dueLen) {
      try {
        dueLen = lenMethod.call(data, 0);
      } catch (e) {
        self.emit('error', e);
        stream.removeListener('data', handler);
        return;
      }
      if (dueLen === 0) {
        self.emit('end', null);
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
      self.emit('message', message);
      dueLen = false;
      if (restLen > 0)
        leadingUInt(data.slice(lackLen));
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
StreamSpliter.httpChunkedTransfer = 0;
StreamSpliter.leadingUInt32 = 1;

if (bUnitText) {
  var net = require('net');
  (function(){
    var server = net.createServer(function(c){
      console.log('client connected.');
      var spliter = new StreamSpliter(c);
      spliter.on('test', function(str){
        console.log(str);
      })
      spliter.on('message', function(msg){
        console.log('received message : ' + msg.toString('utf8', 4));
      });
    });
    server.listen(3000);
    var socket = net.Socket();
    socket.connect(3000, function(){
      var repeat = 3;
      var str = 'Li Yong';
      var len = str.length * repeat + 4;
      var bigBuf = new Buffer(11 * 3);
      for (var i = 0; i < 3; i++) {
        bigBuf.writeUInt32BE(11, i * 11);
        bigBuf.write(str, i * 11 + 4);
      }
      socket.write(bigBuf);
      var buf = new Buffer(4);
      buf.writeUInt32BE(len, 0);
      socket.write(buf);
      var intervalID = setInterval(function(){
        if (--repeat === 0) {
          clearInterval(intervalID);
        }
        socket.write(str);
      }, 1000);
    })
  })();
}