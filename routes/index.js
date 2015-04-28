/*
 * main router.
 * getX/doX is public fn
 * fmX is memoize fn
 * fnX is normal fn
 * other is view fn
 */
var sets = require('../sets');
var crypto = require('crypto');
var auth=require('./auth.js');
var api=require('./api.js');
var oAdmin=require('./admin.js');
var oImg=require('./img.js');
var oWx=require('./wx.js');

var root=sets.virtualPath;
var log=sets.log;
sets.logger.info('index启动正常！');
module.exports = function(app) {
	app.get('/', function(req, res) {		
		res.redirect(root);
	});
	app.get(root, function(req, res) {	
		var id=-1;
		var stat="1";
		api.getSubs(id,function(err,docs){
			if (err) {
				docs = [];
			}			
			res.render('index', {
			title: '首页',
			nodes: docs,
			});
		},stat);
	});
	app.get(root+'api/:act',api.action);
	app.post(root+'api/:act',api.action);
	//admin
	app.get(root+'admin/reg',oAdmin.reg);
	app.post(root+'admin/doreg',oAdmin.doreg);
	app.get(root+'admin/login',oAdmin.login);
	//app.get(root+'admin/logout',oAdmin.logout);	
	app.post(root+'admin/dologin',oAdmin.dologin);	
	app.get(root+'admin/:act',process(oAdmin));
	app.post(root+'admin/:act',process(oAdmin));
	//app.get(root+'admin/:act',auth.authorize,process(oAdmin));
	//app.post(root+'admin/:act',auth.authorize,process(oAdmin));//auth.authorize,
	//img
	app.get(root+'img/:act',auth.authorize,process(oImg));
	app.get(root+'wx/:act',process(oWx));//,auth.authorize
	app.post(root+'wx/:act',process(oWx));//,auth.authorize
};

function process(obj){
	function assign(req, res, next){
		try{
			//throw new Error('我错了');
			if(obj&&req.params.act&&obj[req.params.act]){
				obj[req.params.act](req, res, next);
			}else{
			  res.status(404);
			  res.end();
			}		
		}catch(e){
			log(e);
			res.send('系统故障，请联系管理员！或稍后再试！');
		}
	};
	return assign;
}


