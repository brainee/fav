var Node=require('../models/node.js');
var Mnode=require('../models/mnode.js');
var cImg=require('../models/img.js');
var sets = require('../sets');
var log=sets.log;
var crypto = require('crypto');

exports.action=function(req, res) {
	var action=req.params.act;
	switch(action){
		case "getSubs"://only array
			var id=parseInt(req.query.id)||-1;
			var stat=req.query.stat;
			getSubs(id,function(err,docs){
				if (err) {
					docs = [];
				}
				res.send(JSON.stringify(docs));
			},stat);		
		break;
		case "getAuri":
			var id=parseInt(req.query.id);
			var stat=req.query.stat;
			Mnode.findOne(id,function(err,docs){
				if(docs&&docs.length>0){
					docs=docs[0].auri||[];
					if(stat){
						var newdocs=[];
						docs.forEach(function(n,i){
							if(n.stat==stat){
								newdocs.push(n);
							}
						});
						docs=newdocs;
					}
				}
				res.send(JSON.stringify({err:err,data:docs||[]}));
			});			
		break;		
		case "putSub":
			var id=parseInt(req.query.id);
			var name=req.query.name;
			var stat=req.query.stat;
			var ntype=req.query.ntype;
			Node.findLastOne(null,null,function(err,docs){
				if(err){
					res.send(JSON.stringify({err:err,data:docs||[]}));
				}
				var newid;
				if(docs&&docs.length>0){
					newid=docs[0].id+1;
				}else{
					newid=1001;//default start
				}
				var node=new Node(newid,name,stat,ntype);
				node.insert(function(err,docs){
					if(err){
						res.send(JSON.stringify({err:err,data:docs||[]}));
					}
					Mnode.findOne(id,function(err,docs){
						if(err){
							res.send(JSON.stringify({err:err,data:docs||[]}));
						}
						var mnode=new Mnode(id,[newid]);
						if(docs&&docs.length>0){
							mnode.appendSubs(function(err,docs){
								if(err){
								}else{
									docs=[node];
								}						
								res.send(JSON.stringify({err:err,data:docs||[]}));
							});						
						}else{
							mnode.insertSubs(function(err,docs){
								docs=[node];
								res.send(JSON.stringify({err:err,data:docs||[]}));
							});						
						}						
					});
				});
			});						
		break;
		case "putUri":
			var id=parseInt(req.query.id);
			var name=req.query.name;
			var desc=req.query.desc;
			var url=req.query.url;
			var icon=req.query.icon;
			var stat=req.query.stat;
			var uri={
				name:name
				,desc:desc
				,url:url				
				,icon:icon				
				,stat:stat				
			};
			Mnode.findOne(id,function(err,docs){
				if(err){
					res.send(JSON.stringify({err:err,data:docs||[]}));
				}
				var mnode=new Mnode(id,null,[uri]);
				if(docs&&docs.length>0){
					mnode.appendAuri(function(err,docs){
						if(err){
						}else{
							docs=[uri];
						}				
						res.send(JSON.stringify({err:err,data:docs||[]}));
					});				
				}else{
					mnode.insertAuri(function(err,docs){
						docs=[uri];
						res.send(JSON.stringify({err:err,data:docs||[]}));
					});
				}				
			});			
		break;
		case 'postUri':
			var id=parseInt(req.query.id);
			var oldName=req.query.oldName;//todo
			var name=req.query.name;
			var desc=req.query.desc;
			var url=req.query.url;
			var icon=req.query.icon;
			var stat=req.query.stat;
			var uri={
				name:name
				,desc:desc
				,url:url				
				,icon:icon				
				,stat:stat				
			};
			var mnode=new Mnode(id,null,[uri]);
			mnode.updateUri(oldName,function(err,docs){
				if(err){//docs==1
					res.send(JSON.stringify({err:err,data:[]}));
				}else{//docs==0					
					docs=[uri];
					res.send(JSON.stringify({err:err,data:docs||[]}));
				}				
			});
		break;
		case 'postNode':
			var id=parseInt(req.query.id);
			var name=req.query.name;
			var ntype=req.query.ntype;
			var stat=req.query.stat;
			var node=new Node(id, name, stat,ntype);
			node.update(function(err,docs){
				if(err){//docs==1
					res.send(JSON.stringify({err:err,data:[]}));
				}else{//docs==0
					docs=[node];
					res.send(JSON.stringify({err:err,data:docs||[]}));
				}
			});
		break;
		case 'postNodeUp':
			var pid=parseInt(req.query.pid);
			var id=parseInt(req.query.id);
			var up=req.query.up;
			Mnode.findOne(pid,function(err,docs){
				if(docs&&docs.length>0){
					var mnode=docs[0];
					var subs=mnode.subs||[];
					if(changePos(subs,up,id)){
						var newmnode=new Mnode(pid,subs);
						newmnode.updatePos(function(err,docs){// when err is undefined cant stringify
							res.send(JSON.stringify({err:err||null,data:docs||[]}));						
						});					
					}else{
						res.send(JSON.stringify({err:'更新位置失败',data:[]}));
					}
				}else{
					res.send(JSON.stringify({err:err,data:[]}));
				}								
			});			
		break;
		case 'postUriUp':
			var id=parseInt(req.query.id);
			var name=req.query.name;
			var up=req.query.up;
			Mnode.findOne(id,function(err,docs){
				if(docs&&docs.length>0){
					var mnode=docs[0];
					var auri=mnode.auri||[];
					if(changePos(auri,up,{name:name},'name')){
						var newmnode=new Mnode(id,null,auri);
						newmnode.updatePos(function(err,docs){
							res.send(JSON.stringify({err:err||null,data:docs||[]}));						
						});					
					}else{
						res.send(JSON.stringify({err:'更新位置失败',data:[]}));
					}
				}else{
					res.send(JSON.stringify({err:err,data:docs||[]}));				
				}	
			});
		break;
		case 'search':
			var ids=req.query.ids||[];
			var word=req.query.word;
			var stat=req.query.stat;
			var reg=new RegExp('^.*'+word+'.*$','gi');
			Mnode.findByReg(reg,stat,function(err,finds){
				if(err){
					res.send(JSON.stringify({err:err,data:[]}));
				}
				var rsts=[];
				ids.forEach(function(id,i){
					finds.forEach(function(find,j){
						if(find.id==id){//in the leafs
							var rst={id:find.id,auri:[]};
							find.auri.forEach(function(uri,k){
								if(uri.stat==stat){
									if(reg.test(uri.name)||reg.test(uri.desc)){
										rst.auri.push(uri);
									}								
								}
							});
							rsts.push(rst);
						}
					});	
				});
				res.send(JSON.stringify({err:err,data:rsts||[]}));
			});
		break;		
		case 'searchAll':
			var id=parseInt(req.query.id);
			var word=req.query.word;
			var stat=req.query.stat;
			Mnode.findByWord(word,function(err,docs){
				res.send(JSON.stringify({err:err,data:docs||[]}));
			});		
		break;		
		case 'findChildren':
			var id=parseInt(req.query.id);
			Mnode.findChildIds(id,function(err,docs){
				res.send(JSON.stringify({err:err,data:docs||[]}));
			});		
		break;		
		case 'findChildDocs':
			var id=parseInt(req.query.id);
			Mnode.findChildDocs(id,function(err,docs){
				res.send(JSON.stringify({err:err,data:docs||[]}));
			});		
		break;		
		case 'admintoken':
			var echostr=req.query.echostr;
			var rst=checkSignature(req);
			if(rst==true){
				res.send(echostr);
			}else{
				res.send(JSON.stringify(rst));
			}			
		break;			
		case 'sha1':
			var str=req.query.str;
			res.send(sha1(str));			
		break;		
		case 'delUri':
			var id=req.query.id;
			var name=req.query.name;
			var mnode=new Mnode(id);
			mnode.removeUri({name:name},function(err,docs){
				res.send(JSON.stringify({err:err,data:docs||[]}));
			});						
		break;	
		case 'getIcons':			
			cImg.findIcons({stat:'1'},function(err,docs){
				res.send(JSON.stringify({err:err,data:docs||[]}));
			});			
		break;		
		case 'addIcon':
			var obj={};
			obj.dir=req.query.dir||'';
			obj.img=req.query.img;
			obj.img2=req.query.img2;
			obj.stat=req.query.stat||'1';
			obj.date='';//new Date()
			cImg.add(obj,function(err,docs){
				res.send(JSON.stringify({err:err,data:docs||[]}));
			});			
		break;		
		case 'removeIcon':
			var obj={};
			obj.img=req.query.img||'';
			cImg.remove(obj,function(err,docs){
				res.send(JSON.stringify({err:err,data:docs||[]}));
			});			
		break;		
	
	}

}

function changePos(arr,up,item,key){
	var bchanged=false;
	if(!(arr instanceof Array)){
		arr=[];
		log("arr is not a array at "+arguments.callee.name);
	}
	var index=findPos(arr,item,key);
	if(index!=null){
		var len=arr.length;
		var index2;
		if(len>1){//need change 
			if(up=="1"&&index!=0){
				index2=index-1;
			}else if(up=="0"&&index!=(len-1)){
				index2=index+1;
			}
			if(index2!=null){
				var temp=arr[index];
				arr[index]=arr[index2];
				arr[index2]=temp;
				bchanged=true;
			}
		}
	}else{
		log("item is not in array at "+arguments.callee.name);
	}
	return bchanged;
}

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
exports.getSubs=getSubs;
function getSubs(id,callback,stat){
	Mnode.findOne({id:id}, function(err, docs) {
		if (err) {
			docs = [];
		}			
		if(docs&&docs.length>0){
			var node=docs[0];
			var subnodes=[];			
			Node.findIn(node.subs,stat,function(err, docs){
				if (err) {
					docs = [];
				}
				node.subs.forEach(function(n,i){
					docs.forEach(function(doc,j){
						if(doc.id==n){
							subnodes.push(doc);
						}
					});
				});
				callback(err,subnodes);				
			});
		}else{
			callback(err,[]);
		}		
	});
}