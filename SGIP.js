/**
 * Created with JetBrains WebStorm.
 * User: kaven276
 * Date: 12-5-29
 * Time: 上午8:39
 */
var bUnitText = (process.argv[1] === __filename);

exports.AttrCfg = require('./lib/AttrCfg.js');

/*
 var mCmd = require('./lib/Commands.js');
 exports.Cmds = mCmd.Cmds;

 var fs = require('fs')
 , files = fs.readdirSync(__dirname + '/lib/cmds')
 ;
 files.forEach(function(fname){
 exports['pdu' + fname.substr(3).replace(/\.js$/, '')] = require(__dirname + '/lib/cmds/' + fname);
 });
 */

exports.nodeSP = require('./lib/nodes/nodeSP.js');
exports.nodeSMG = require('./lib/nodes/nodeSMG.js');
exports.nodeSMSC = require('./lib/nodes/nodeSMSC.js');
exports.nodeGNS = require('./lib/nodes/nodeGNS.js');


exports.msgBind = require('./lib/cmds/cmdBind.js');
exports.msgUnbind = require('./lib/cmds/cmdUnbind.js');
exports.msgSubmit = require('./lib/cmds/cmdSubmit.js');
exports.msgDeliver = require('./lib/cmds/cmdDeliver.js');
exports.msgReport = require('./lib/cmds/cmdReport.js');
exports.msgAddSP = require('./lib/cmds/cmdAddSP.js');
exports.msgModifySP = require('./lib/cmds/cmdModifySP.js');
exports.msgDeleteSP = require('./lib/cmds/cmdDeleteSP.js');
exports.msgQueryRoute = require('./lib/cmds/cmdQueryRoute.js');
exports.msgAddTeleSeg = require('./lib/cmds/cmdAddTeleSeg.js');
exports.msgModifyTeleSeg = require('./lib/cmds/cmdModifyTeleSeg.js');
exports.msgDeleteTeleSeg = require('./lib/cmds/cmdDeleteTeleSeg.js');
exports.msgAddSMG = require('./lib/cmds/cmdAddSMG.js');
exports.msgModifySMG = require('./lib/cmds/cmdModifySMG.js');
exports.msgDeleteSMG = require('./lib/cmds/cmdDeleteSMG.js');
exports.msgCheckUser = require('./lib/cmds/cmdCheckUser.js');
exports.msgUserRpt = require('./lib/cmds/cmdUserRpt.js');
exports.msgTrace = require('./lib/cmds/cmdTrace.js');

