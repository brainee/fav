var sets = require('../sets');
var async=require('async');

var log=sets.log;
var memoize = function(fn, hasher, ttl) {
  var memo, memoized, originHasher, ttls;
  if (!isNaN(hasher)) {
    ttl = hasher;
    hasher = null;
  }
  if (ttl) {
    ttls = {};
    originHasher = hasher || function(x) {
      return x;
    };
    hasher = function() {
      var se;
	  // var args = Array.prototype.slice.call(arguments);
      // var callback = args.pop();
	  // se = originHasher.apply(null, args);
	  // args.push(callback);
      se = originHasher.apply(null, arguments);//log('se:'+se)
      if (!ttls[se]) {//log('23:'+ttls)
        ttls[se] = Date.now() + ttl;
      } else if (memo[se] && ttls[se] < Date.now()) {//log('25:'+ttls)
        delete memo[se];
        ttls[se] = Date.now() + ttl;//log('27:'+ttl+':'+se)
      }else{	  
	  }
      return se;
    };
  }
  memoized = async.memoize(fn, hasher);
  memo = memoized.memo;
  return memoized;
}

module.exports=memoize;

