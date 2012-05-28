exports.addPlaceHolderMembers = function(tar, tpl)
{
  var proto = tar.prototype;
  for (var n in tpl)
    tar[n] = undefined;
}
