var dbh = require('../util/dbh');
var db=dbh.db;
var coll=db.collection('img');

db.bind('img', {
  findIcons: function (obj,fn) {
   this.find({'aicon.stat':obj.stat},{'aicon.img':1}).toArray(fn);
  },
  finds: function (obj,fn) {
   this.find(obj).toArray(fn);
  },
  add: function (obj, fn) {
   this.update({},{$addToSet:{'aicon':obj}},fn);
  },
  removes: function (obj, fn) {
   //this.remove(obj,fn);
    this.update({},{$pull:{'aicon':obj}},fn);
  },
  findImg:function(obj, fn){
	//this.find({'aicon.img':obj.img},{aicon:{'$slice':['aicon.$',1]}}).toArray(fn);
	this.find({'aicon.img':obj.img}).toArray(fn);
  },
  updateImg:function(obj,fn){
	this.update({'aicon.img':obj.img},{$set:{'aicon.$':obj}},fn);
  }
});

module.exports = coll;


