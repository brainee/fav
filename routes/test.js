/*
 * admin router.
 */
var sets = require('../sets');
var memoize=require('../util/memoize.js');
var user=require('../models/user.js');

var async=require('async');
var fs = require('fs');
var log=async.apply(console.log,'>');

var fn= async.memoize(function(name, cbf) {   
   log('fn:'+(new Date().getTime()));
  return fs.readFile('./auth.js', cbf);
});

test = function(name,cb) {
  var cb=cb?cb:function(){};
  var d=new Date();
  fn(name, function(err, data) {
	var e=new Date();
	log('test times:'+(e-d));	
    cb(err,data);
  });
  //return result = [];
};
// exports.test=test;
exports.test=fn;

// setInterval(function() {
  // return test('./auth.js');
// }, 1000);



var newfn=memoize(function(a,cb){
	var cb=cb?cb:function(){};	
	log('zy:'+new Date());
	cb(a);
},2000);
 newfn('a',function(a){
	log('newfn a:'+a);
 });
 newfn('a',function(a){
	log('newfn a:'+a);
 });

setInterval(function() {
   log('setInterval');
  return newfn({b:'b'},function(b){
	log('b:'+b)
  });
}, 1000);