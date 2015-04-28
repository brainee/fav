var myLog = require('./util/log');
var async=require('async');

module.exports = {
	cookieSecret: 'yongzheng'
	,db:'navdb'
	,host: 'http://172.16.163.230:27017/navdb?auto_reconnect=true&poolSize=5'//172.17.14.187
	,webport:8000
	,virtualPath:'/weixin/'// /navpage/ static files base on public/virtualPath
	,expire:5*60*1000//1*60*60*1000 
	,token:'gaotime'
	,upload:{keepExtensions: true, uploadDir: __dirname+'/temp' }
	,uploadDir:__dirname+'/public/weixin/plugins/files/'
	,log:async.apply(console.log,">")//(function(){return async.apply(console.log,arguments.callee.name,">")})()
	,logger:myLog.logC
	,logF:async.log//log(function, arguments) 用于快速执行某异步函数，并记录它的返回值
}; 
