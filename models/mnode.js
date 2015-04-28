var dbh = require('../util/dbh');
var db=dbh.db;
//var cNode=dbh.node;
var cMnode=dbh.mnode;

function Mnode(id,subs,auri){ 
	if(typeof id=="object"){
		this=id;
	}else{
		this.id = id;
		subs?this.subs=subs:null;
		auri?this.auri=auri:null;
	}
};
module.exports = Mnode;
Mnode.prototype.appendSubs = function(callback) {
	// 存入 Mongodb 的文档
	var that=this;
	cMnode.update({id:that.id}, {$addToSet:{subs:{$each:that.subs}}},true,callback);
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.update({id:that.id}, {$addToSet:{subs:{$each:that.subs}}},true,function(err, doc) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	// dbh(set);
};
Mnode.prototype.insertSubs = function(callback) {
	// 存入 Mongodb 的文档
	var that=this;
	cMnode.insert(that,callback);
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.insert(that,function(err, doc) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.prototype.appendAuri = function(callback) {
	// 存入 Mongodb 的文档
	var that=this;
	cMnode.update({id:that.id},{$addToSet:{auri:{$each:that.auri}}},callback);
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.update({id:that.id}, {$addToSet:{auri:{$each:that.auri}}},true,function(err, doc) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.prototype.insertAuri = function(callback) {
	// 存入 Mongodb 的文档
	var that=this;
	cMnode.insert(that,callback);
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.insert(that,function(err, doc) {			
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.prototype.update = function(callback) {
	var that=this;
	cMnode.update({id:that.id},{$set:that},callback);
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.update({id:that.id},{$set:that}, function(err, doc) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.prototype.updateUri = function(oldName,callback) {
	var that=this;
	var uri=that.auri[0];
	cMnode.update({id:that.id,"auri.name":oldName},{$set:{"auri.$":uri}},callback);
	
	// var uri=that.auri[0];
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.update({id:that.id,"auri.name":oldName},{$set:{"auri.$":uri}}, function(err, doc) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.prototype.updatePos = function(callback) {
	var that=this;
	cMnode.update({id:that.id},that,callback);
	
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.update({id:that.id},that, function(err, doc) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.prototype.remove = function(callback) {
	var that=this;
	cMnode.remove({id:that.id},callback);
	
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.remove({id:that.id}, function(err, doc) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.prototype.removeUri = function(uri,callback) {
	var that=this;
	cMnode.update({id:that.id},{$pull:{"auri.name":uri.name}},callback);
	
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.update({id:that.id},{$pull:{"auri.name":uri.name}},function(err, doc) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.findOne = function(p, callback) {
	var query = typeof p=="object"?p:{id:p};
	cMnode.find(query).toArray(callback);
	// var query = typeof p=="object"?p:{id:p};
	// dbh({coll:"mnode",call:callback,query:query});
};
Mnode.findLastOne = function(p,sortor,callback) {
	var query = (p&&typeof p=="object")?p:{};
	var sortor= (sortor&&typeof sortor=="object")?sortor:{id:-1};
	var that=this;
	cMnode.find(query).sort(sortor).limit(1).toArray(callback);
	
	// var set={
		// call:callback
		// ,coll:"mnode"
		// ,operate:function(ocoll,odb,oset){
			// ocoll.find(query).sort(sortor).limit(1).toArray(function(err, docs) {
			// odb.close();
			// callback(err, doc);
			// });
		// }
	// }
	//dbh(set);
};
Mnode.findByWord = function(p, callback) {
	var reg=new RegExp('^.*'+p+'.*$','gi');
	var query = typeof p=="object"?p:{$or:[{'auri.name':reg},{'auri.desc':reg}]};
	cMnode.find(query).toArray(callback);
};
Mnode.findByReg = function(reg,stat,callback) {
	var query = {'auri.stat':stat,$or:[{'auri.name':reg},{'auri.desc':reg}]};
	cMnode.find(query).toArray(callback);
};
Mnode.findChildIds = function(id,callback) {	//for level 1
	var query = {id:id};
	cMnode.find(query).toArray(function(err,docs){
		if(docs&&docs.length>0){
			var doc=docs[0];
			if(doc.subs&&doc.subs.length>0){//has child
				var query2 = {id:{$in:doc.subs},subs:{$exists:1}};
				cMnode.find(query2).toArray(function(err,docs){
					var children=[];
					if(docs&&docs.length>0){//exists third level
						docs.forEach(function(n,i){
							doc.subs.forEach(function(m,j){
								if(n.id==m){
									children=children.concat(n.subs||[]);
								}else{
									children.push(m);
								}
							});							
						});
					}else{
						children=doc.subs;
					}
					callback(err,children);
				});
			}else{
				callback(err,doc.subs||[]);
			}
		}else{
			callback(err,docs||[]);
		}		
	});
};
Mnode.findChildDocs = function(id,callback) {	//for level 1
	var query = {id:id};
	cMnode.find(query).toArray(function(err,docs){
		if(docs&&docs.length>0){
			var doc=docs[0];
			if(doc.subs&&doc.subs.length>0){//has child
				var query2 = {id:{$in:doc.subs},subs:{$exists:1}};
				cMnode.find(query2).toArray(function(err,docs){
					var children=[doc].concat(docs||[]);
					callback(err,children);
				});
			}else{
				callback(err,[doc]);
			}
		}else{
			callback(err,docs||[]);
		}		
	});
};


