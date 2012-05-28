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
  msg.constructor.forEach(function(attr, i){
    msg[attr.name] = args[i];
  });
}
