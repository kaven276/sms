/**
 * Created with JetBrains WebStorm.
 * User: kaven276
 * Date: 12-5-29
 * Time: 上午8:36
 */
var SGIP = require('..')
  , SP = SGIP.nodeSP.Class
  , Submit = SGIP.msgSubmit.Class
  ;

var cont = '一线：北京周边景点：周村、小故宫、九如山瀑布、红叶大峡谷，大三日，' +
  '时间为6月28日--30日（周四--周六），其中两日为年休假时间。' +
  '二线：草原/海边：在承德木兰围场或坝上草原或日照择一，暂时未定，预计时间在8月份。' +
  '如有家属参加请注明，以便协调旅行社。' +
  '-- 李勇';

cont = require('fs').readFileSync(require('path').join(__dirname, 'cont.txt'), 'utf8');


var sp = new SP('202.99.87.201', 8801, 'dialbook', 'dialbooktest', 8801, '', 'dialbook', 'dialbooktest');


sp.on('request', function(req){
  if (req instanceof SGIP.msgReport.Class) {
    console.log('\nReport:');
  } else if (req instanceof SGIP.msgDeliver.Class) {
    console.log('\nDeliver:');
  }
  console.log(req);
});

var msg = new Submit('8615620009233', 8, cont, {"SPNumber" : '10655022400312345678'});
msg.rowid = 'AAAS2sAAEAAACEjAAA';
console.log(msg);
sp.send(msg, function(res, req){
  console.log('\n\nrespond :');
  console.log('the result for %j is %d', res.header, res.Result);
  console.log('You can use oracle rowid %s to fill SMS id columns with %j', req.rowid, res.header);
});

