var dbh = require('../util/dbh');
var db=dbh.db;
var coll=db.collection('user');

db.bind('user', {
  findName: function (obj,fn) {
   this.find({name:obj.name}).toArray(fn);
  },
  last: function (fn) {
   this.find().sort({id:-1}).limit(1).toArray(fn);
  },
  finds: function (obj,fn) {
   this.find(obj).toArray(fn);
  },
  add: function (obj, fn) {
   this.insert(obj,fn);
  },
  update: function (obj, fn) {
   this.update({id:obj.id},obj,fn);
  },
  removes: function (obj, fn) {
    this.remove({id:obj.id},fn);
  } 
});

module.exports = coll;


