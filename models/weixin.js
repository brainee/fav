var dbh = require('../util/dbh');
var db=dbh.db;
var cNode=dbh.node;

function Node(id, text, stat,ntype) {
	if(typeof id=="object"){
		this=id;//todo
	}else{
		this.id = id;
		this.text=text;
		this.stat=stat;
		this.ntype=ntype;
		// text?this.text=text:null;
		// stat?this.stat=stat:null;
		// ntype?this.ntype=ntype:null;	
	}
};
module.exports = Node;
Node.prototype.insert = function(callback) {
	// 存入 Mongodb 的文档
	var that=this;
	cNode.insert(that, {safe: true},callback);
	
	// var set={
		// call:callback
		// ,coll:"node"
		// ,operate:function(ocoll,odb,oset){
			// 为 id 属性添加索引
			// ocoll.ensureIndex({id:-1},function(err,obj){
					// if(err){
						// odb.close();
						// return callback(err);
					// }			
			// });
			// ocoll.insert(that, {safe: true}, function(err, docs) {
			// odb.close();
			// callback(err, docs);
			// });
		// }
	// }
	//dbh(set);
};
Node.prototype.update = function(callback) {
	var that=this;
	cNode.update({id:that.id},{$set:that},callback);
	
	// var set={
		// call:callback
		// ,coll:"node"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.update({id:that.id},{$set:that}, function(err, docs) {
			// odb.close();
			// callback(err, docs);
			// });
		// }
	// }
	//dbh(set);
};
Node.prototype.remove = function(callback) {
	var that=this;
	cNode.remove({id:that.id},callback);
	
	// var set={
		// call:callback
		// ,coll:"node"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.remove({id:that.id}, function(err, docs) {
			// odb.close();
			// callback(err, docs);
			// });
		// }
	// }
	//dbh(set);
};
Node.findOne = function(p, callback) {
	var query = typeof p=="object"?p:{id:p};
	cNode.find(query).toArray(callback);
	//dbh({coll:"node",call:callback,query:query});
};
Node.findLastOne = function(p,sortor,callback) {
	var query = (p&&typeof p=="object")?p:null;
	var sortor= (sortor&&typeof sortor=='object')?sortor:{id:-1};
	var that=this;
	cNode.find(query).sort(sortor).limit(1).toArray(callback);
	
	// var set={
		// call:callback
		// ,coll:"node"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.find(query).sort(sortor).limit(1).toArray(function(err, docs) {
			// odb.close();
			// callback(err, docs);
			// });
		// }
	// }
	//dbh(set);
};
Node.findIn = function(arr,stat,callback) {
	var query =arr instanceof Array?{id:{$in:arr}}:arr;
	stat?query.stat=stat:null;
	var that=this;
	cNode.find(query).toArray(callback);
	// var set={
		// call:callback
		// ,coll:"node"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.find(query).toArray(function(err, docs) {
			// odb.close();
			// callback(err, docs);
			// });
		// }
	// }
	//dbh(set);
};


