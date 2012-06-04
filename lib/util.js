var bUnitText = (process.argv[1] === __filename)
  ;

exports.addPlaceHolderMembers = function(tar, tpl){
  var proto = tar.prototype;
  for (var n in tpl)
    tar[n] = undefined;
}

/**
 * use new options to override existing options, updater can update already exists option properties only
 * @param options
 * @param updater
 */
exports.override = function(options, updater){
  for (var n in updater) {
    if (n in options) options[n] = updater[n];
  }
}

exports.override2 = function(options, updater){
  for (var n in updater) {
    options[n] = updater[n];
  }
}

exports.msgInit = function(msg, arg){
  msg.constructor.PDUAttrSeq.forEach(function(attr, i){
    msg[attr.name] = args[i];
  });
}

exports.Encodings = {
  0 : 'ascii',
  8 : 'ucs2',
  4 : 'binary',
  15 : 'gbk',
  3 : 'write_card'
};

exports.logger = {

}

exports.afterNow = function(delay){
  if (arguments.length === 0) delay = 1;
  function pad(num){
    return ('00' + num.toString()).substr(-2);
  }

  var d = new Date();
  d = new Date(d.valueOf() + delay * 1000);
  return pad(d.getFullYear() % 100) + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) + '032+';
}

if (bUnitText) {
  console.log(exports.afterNow());
  var d = new Date();
  var d2 = new Date(d.valueOf() + delay * 1000);
  console.log(d);
  console.log(d2);
}