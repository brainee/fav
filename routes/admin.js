/*
 * admin router.
 * getX/doX is public fn
 * fmX is memoize fn
 * fnX is normal fn
 * other is view fn
 */
var async=require('async');
var util=require('util');
var crypto = require('crypto');
var fs = require('fs');

var sets = require('../sets');
var memoize=require('../util/memoize.js');
var api=require('./api.js');
var user=require('../models/user.js');
var img=require('../models/img.js');


var root=sets.virtualPath;
var log = sets.log;
sets.logger.info('admin启动正常！');
exports.index= function(req, res, next) {
	res.render('admin/index', {
		title: '后台管理'
	});
};
exports.reg= function(req, res, next) {
	res.render('admin/reg', {
		title: '注册'
	});
};

exports.doreg2=function(req, res, next){
    var name = req.query.name;
    var pwd = req.query.pwd;
    var ip = req.ip;	
	var json={err:'',data:[]};
	async.auto({
		last:function(cb){
			user.last(cb);
		},exist:function(cb){
			user.finds({name:name},cb);
		},add:['last','exist',function(cb,rst){
			var maxid=rst.last.length>0?rst.last[0].id:10000;
			var b=rst.exist.length>0?true:false;//是否已经存在
			if(!b){
				var obj={};
				obj.id=maxid+1;
				obj.name=name;
				obj.pwd=pwd;
				obj.stat='1';
				obj.date=new Date();
				user.add(obj,cb);
			}else{
				cb('该用户名已经被注册!');
			}
		}]
	},function(err, rst){
		json.err=err;
		json.data=rst.add;
		res.json(json);
	});
}
exports.doreg = function(req, res,next){ 
    // 校验
    //var userid = parseInt(req.body.userid);//req.body.userid
    var name = req.body.username;
    var pwd = req.body.password;
    var ip = req.ip;
	user.last(function(err,docs){
		var json={err:err,data:[]};
		if(!!err){
				json.err=err;
				res.json(json);	
		}else{
			var lastid=docs.length>0?docs[0].id:10000;
			user.finds({name:name},function(err,docs){		
				if(!!err){
					json.err=err;			
				}else if(docs.length<1){	
					var obj={};
					obj.id=lastid+1;
					obj.name=name;
					obj.pwd=pwd;
					obj.stat='1';
					obj.date=new Date();
					user.add(obj,function(err,docs){
						json.data=docs;
					});
				}else{
					json.err='该用户名已经被注册!';
				}
				res.json(json);
			});
		}
	});
};
exports.login= function(req, res, next) {
	var id=parseInt(req.query.id)||-1;
	res.render('admin/login', {
		title: '登陆'
	});
};
exports.logout= function(req, res, next) {	
	req.session.user=null;
	res.render('admin/logout', {
		title: '登出'
	});

};
exports.dologin = function(req, res,next){
    // 校验
    //var userid = parseInt(req.body.userid);//req.body.userid
    var name = req.body.username;
    var pwd = req.body.password;//req.body.password
    var ip = req.ip;
	user.finds({name:name,stat:'1'},function(err,docs){
		var json={err:'',data:[]};
		if(!!err){
			json.err=err;			
		}else if(docs.length<1){
			json.err='用户名或密码不正确!';
		}else{
			var oUser=docs[0];
			if(pwd==oUser.pwd){
				//req.session.id = oUser.id;
				req.session.user = oUser;
				json.data=oUser;				
			}else{
				json.err='用户名或密码不正确!!';
			}
		}
		res.json(json);
	});
};
exports.node= function(req, res, next) {
	var id=parseInt(req.query.id)||-1;
	api.getSubs(id,function(err,docs){
		if (err) {
			docs = [];
		}			
		res.render('admin/node', {
		title: '节点管理',
		nodes: docs,
		});
	});
};
exports.users= function(req, res, next) {
	res.render('admin/users', {
		title: '用户管理'
	});
};

var fmUsers=memoize(function(obj,cb){
	user.finds(obj,cb);
},sets.expire);
exports.getUsers= function(req, res, next) {
	// user.finds({stat:'1'},function(err,docs){
		// res.send({err:err,data:docs||[]});
	// });	
	fmUsers({stat:'1'},function(err,rst){
		 res.send({err:err,data:rst||[]});
	});
};
exports.getAllUsers= function(req, res, next) {	
	fmUsers({},function(err,rst){
		 res.send({err:err,data:rst||[]});
	});
};
exports.removeUsers= function(req, res, next) {	
	fmUsers({},function(err,rst){
		 res.send({err:err,data:rst||[]});
	});
};

//imgs
exports.imgs= function(req, res, next) {
	res.render('admin/imgs', {
		title: '用户管理'
	});
};
exports.getImgs= function(req, res, next) {
	img.finds({},function(err,docs){
		if(docs&&docs.length>0){
			docs=docs[0].aicon;
		}
		res.send({err:err,data:docs||[]});
	});	
};
exports.putImg= function(req, res, next) {
	var obj={};
	var name=req.body.imgName||(req.files?req.files.img.name:'');
	if(name.indexOf('.')>-1){
		var aname=name.split('.');
		var name2=aname[0]+'2.'+aname[1];		
	}else{
		var tail=req.files?req.files.img.name.split('.')[1]:'png';
		name=name+'.'+tail;
		var name2=name+'2.'+tail;	
	}
	obj.dir=req.body.dir;
	obj.img=name;
	obj.img2=name2;
	obj.stat=req.body.stat;
	obj.date=new Date();
	obj.disc=req.body.disc;
	obj.url=req.body.url;
	obj.out=req.body.out;
	async.waterfall([function(cb){
		if(req.files){//重命名
			var arr=[{name:name,file:req.files.img},{name:name2,file:req.files.img2}];
			async.map(arr,function(item,cb){
				fs.rename(item.file.path,sets.uploadDir+item.name,cb);
			},cb);	
		}else{			
			cb(null,null);//必须两个null，否则下一个cb=undefined
		}
	},function(n,cb){//是否已存在
		img.findImg(obj,cb);
		// img.findImg(obj,function(err,docs){
			// cb(err,docs);
		// });
	}],function(err,rts){
		if(err){
			res.send(JSON.stringify({err:'上传数据有误。',data:[]}));	
		}else{
			if(rts&&rts.length>0&&rts[0].aicon){//修改
				//var doc=rts[0].aicon[0];
				var index=findPos(rts[0].aicon,{img:obj.img},'img');
				var doc=rts[0].aicon[index];
				obj.date=doc.date;//不传文件改名称
				// if(obj.img!=doc.img){//这里必然相等，就是用obj.img查的
					// async.series([function(cb){
						// var arr=[{name:name,file:doc.img},{name:name2,file:doc.img2}];
						// async.map(arr,function(item,cb){
							// fs.rename(sets.uploadDir+item.file,sets.uploadDir+item.name,cb);
						// },cb);					
					// },function(cb){
						// img.updateImg(obj,cb);
					// }],function(err,rts){
						// var data=[{img:name,img2:name2}];
						// res.send(JSON.stringify({err:err,data:data||[]}));
					// });
				// }else{
				// }
				img.updateImg(obj,function(err,docs){
					var data=[{img:name,img2:name2}];
					res.send(JSON.stringify({err:err,data:data||[]}));
				});
			}else{//新增
				if(req.files){
					img.add(obj,function(err,docs){
						var data=[{img:name,img2:name2}];
						res.send(JSON.stringify({err:err,data:data||[]}));
					});
				}else{
					res.send(JSON.stringify({err:'请先选择上传文件。',data:[]}));
				}
			}		
		}
	});
};
exports.dltImg= function(req, res, next) {
	var obj={};
	var name=req.query.img;
	obj.img=name;	
	var aname=name.split('.');
	var name2=aname[0]+'2.'+aname[1];
	obj.img2=name2;	
	// img.removes(obj,function(err,docs){
		// if(docs&&docs.length>0){
			// docs=docs[0].aicon;
		// }
		// res.send({err:err,data:docs||[]});
	// });	
	
	// async.series([function(cb){
		// fs.unlink(sets.uploadDir+obj.img,cb);				
	// },function(cb){
		// img.removes(obj,cb);
	// }],function(err,rts){
		// var docs=rts[1];
		// if(docs&&docs.length>0){
			// docs=docs[0].aicon;
		// }
		// res.send({err:err,data:docs||[]});
	// });	
	
	async.series([function(cb){
		var arr=[{name:name},{name:name2}];
		async.map(arr,function(item,cb){
			fs.unlink(sets.uploadDir+item.name,cb);	
		},cb);					
	},function(cb){
		img.removes(obj,cb);
	}],function(err,rts){
		var docs=rts[1];//docs[0]==1
		res.send({err:err,data:docs||[]});
	});
};

function findPos(arr,item,key){
	var index;
	if(!(arr instanceof Array)){
		arr=[];
		log("arr is not a array in "+arguments.callee.name);
	}
	arr.forEach(function(n,i){
		if(key){
			if(n[key]==item[key]){
				index=i;
			}
		}else{//normal
			if(item==n){
				index=i;
			}		
		}

	});
	return index;
}

