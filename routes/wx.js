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
sets.logger.info('wx启动正常！');
exports.index= function(req, res, next) {
	res.render('admin/index', {
		title: '微信平台'
	});
};
exports.token=function(req, res, next){
	//http://ranks.xicp.net/wx/wx/token?
	//http://61.152.115.141/navpage/api/admintoken?
	//http://172.17.10.239/weixin/wx/token
	var echostr=req.query.echostr;
	var rst=checkSignature(req);
	if(rst==true){
		res.send(echostr);
	}else{
		res.send(JSON.stringify(rst));
	}
};
exports.sha1=function(req, res, next){
	var str=req.query.str;
	res.send(sha1(str));
};
		
		
		
function checkSignature(req){
	var signature=req.query.signature;
	var timestamp=req.query.timestamp;
	var nonce=req.query.nonce;
	var echostr=req.query.echostr;
	var mytoken=sets.token;
	var arr=[mytoken,timestamp,nonce];
	arr.sort();
	var tokenStr=sha1(arr.toString().replace(',','').replace(',',''));//.replace(',','')
	if(tokenStr==signature){
		return true;
	}else{
		return {err:'check faild.',signature:signature,timestamp:timestamp,nonce:nonce,echostr:echostr,token:mytoken,tokenStr:tokenStr};
	}
}
//sha1
function sha1(str) {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str,'utf8');
    str = md5sum.digest('hex');
    return str;
}
//sha1('agentsy489981aecontent脸真圆receiver13523460220secretAA4091068C59B65F77E871701895D49DD8235EEAservicetypeb23dc7')
//e7a328e41f84e0af1bdd7274ea754578cbb8a847
