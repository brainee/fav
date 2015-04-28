var mongodb = require('./db');
exports.logonoff=false;
exports.dbh=function dbh(set){
	var scoll=set.coll||set.collection;
	var callback=set.call||set.callback||function(){};
	var query=set.query||{};
	var operate=set.operate||function(ocoll,odb,oset){//remember close db.
		ocoll.find(oset.query).toArray(function(err, docs) {
		odb.close();
		if (err) {
		callback(err);
		}
		callback(null, docs);
		});
	};
	//operate db
	mongodb.open(function(err, db) {
		if (err) {
		return callback(err);
		}
		console.log('* mongodb connected');
		// 读取集合
		db.collection(scoll, function(err, collection) {
			if (err) {
			mongodb.close();
			return callback(err);
			}
			operate(collection,db,set);
		});
	});
}