/**
 * Created with JetBrains WebStorm.
 * User: kaven276
 * Date: 12-6-25
 * Time: 下午3:46
 */

var SGIP = require('..')
  , SP = SGIP.nodeSP.Class
  , Submit = SGIP.msgSubmit.Class
  , net = require('net')
  , StreamSpliter = require('../lib/StreamSpliter.js').Class
  ;

var sp = new SP('202.99.87.201', 8801, 'dialbook', 'dialbooktest', 8801, '', 'dialbook', 'dialbooktest');


sp.on('request', function(req){
  if (req instanceof SGIP.msgReport.Class) {
    console.log('\nReport:');
  } else if (req instanceof SGIP.msgDeliver.Class) {
    console.log('\nDeliver:');
  }
  console.log(req);
});


var server = net.createServer(function(extHubSock){
  console.log('connect from ext_hub');
  var spliter = new StreamSpliter(extHubSock, 'readInt32BE');
  spliter.on('message', function onMessage(req){
    console.log('message length is ', req.length);
    var lines = req.slice(8).toString().split('\n');
    var smg = lines.shift();
    var target = lines.shift();
    var content = lines.join('\n');
    var msg = new Submit(target, 8, content, {"SPNumber" : '106550224003'});
    msg.rowid = 'AAAS2sAAEAAACEjAAA';
    console.log(msg);
    sp.send(msg, function(res, req){
      console.log('\n\nrespond :');
      console.log('the result for %j is %d', res.header, res.Result);
      console.log('You can use oracle rowid %s to fill SMS id columns with %j', req.rowid, res.header);
    });
  });
});
server.listen(1527);
