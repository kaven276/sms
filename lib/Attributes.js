/**
 * All the attributes of all the commands is defined here
 */

var Types = {
  'text' : 1,
  'integer' : 2,
  'integer4' : 3,
  'texts' : 4
};

var AttrCfg = require('./AttrCfg.js');

function Attr(name, type, len){
  this.name = name;
  this.len = parseInt(len);
  this.type = Types[type];
}

for (var n in AttrCfg) {
  var attr = AttrCfg[n].split(':');
  exports[n] = new Attr(n, attr[0], attr[1]);
}

// unit test
if (process.argv[1] === __filename) {
  console.log(exports);
}


