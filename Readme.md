using node to implement the telecommunication industry's SGIP/SMPP protocol for sms send/receiver proxy
==============

Function Scope
-------

* By now, we support SGIP only, SMPP will be supported in the future.
* For SGIP, only nodeSP is really supported, other SGIP node types like SMG,SMSC is just fake server for test work by now


SMS send by SP features
-----------

1. support sending multiple target numbers in one Submit message
2. support message larger than 70 ucs2 chars (without SP content split work)
3. support message larger than 127 ucs2 chars (using SP side content split work utilizing TP_udhi field)
4. when SMSC/SMG have the n-minute delay for long content(>70 ucs2 chars), SP can automatically utilize ScheduleTime field to set it to 1s in future, and then reduced the delay in 1 second.
5. can receive report


Examples:
-------

  You can read the test part in every code file, like "lib/nodes/nodeSP.js".

	var sp = new SP('202.99.87.201', 8801, 'dialbook', 'dialbooktest', 8801, '', 'dialbook', 'dialbooktest');
	var msg = new Submit('8615620001781', 8, 'some ucs2 encoded test or just a Buffer object', {'ReportFlag':1});

	// event mode
	sp.send(msg);
	sp.on('resp', function(msgResp, msgSend){
		console.log('send message success for :');
		console.log(msgResp);
		console.log(sp.ackQueue.length);
	});

	// callback mode
	sp.send(msg,function(res, req){
		// console.log('pair are', req, res, 'end');
	});

	// accept SMG request, like report, deliver, ...
	sp.on('request', function(req){
		console.log('\nReport:');
		console.log(req);
	});

