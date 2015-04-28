$(function(){
	$("#nav a").click(function(){
		var that=$(this);
		if(that.attr("load")!=1){
			$("#divCan").html('');
			getDetail(this.id);
			//that.attr("load",1);
		}		
	});
	$("#nav a:first").click();
	$("#divCan a").live('click',function(){
		fnOpen(this.href);
		return false;
	});	
	fnMain({},$('#divImgLinks'),function(json,wrap){
		if(json.err){
			tip(json.err);
		}else if(json.data&&json.data.length>0){
			var imgs='';
			$(json.data).each(function(i,n){
				imgs+='<img src="plugins/files/{0}" alt="" url="{1}" out="{2}"/>'.format(n.img,n.url,n.out);
			});
			wrap.html(imgs);
		}
		$('#divImgLinks img').each(function(i,n){
			var img=$(this).clone();
			var src=img.attr('src').replace('.png','2.png');
			img.attr('src',src);
			$('#listIcon').append(img);
		});	
	},'admin/getImgs');
	$('#divImgLinks img').live('click',function(){
		var url=$(this).attr('url');
		if($(this).attr('out')==1){
			fnOpen(url);
		}else{
			fnIconClick(url);
		}
	});
	$('#divImgLinks img:eq(0)').click();
	if($.browser.safari){
		$('#main').addClass('u_pl');
		$('#other').addClass('u_pl');		
	}
	$('#spnIconList').click(function(){
		asyncbox.tips("进入列表视图.","success");	
		$('#listIcon').show();
		$('#listIcon').siblings().hide();
	});	
	$('#listIcon img').live('click',function(){
		$('#main').show();
		$('#main').siblings().hide();
		var url=$(this).attr('url');
		if($(this).attr('out')==1){
			fnOpen(url);
		}else{
			fnIconClick(url);
		}
	});
	function fnIconClick(url,out){
		if(url){
			$('#divNavCan').hide();
			$('#ifm').attr('src',url);
			$('#ifm').show();
			$('#ifm').siblings().hide();
		}else{
			$('#divNavCan').show();			
			$('#divCan').show();
			$('#divCan').siblings().hide();	
		}
	}
	
	//search
	$('.txtSearch').val('名字、简介关键字');
	$('.txtSearch').focus(function(){
		this.value="";
	});
	$('.txtSearch').keyup(function(e){
		if(e.keyCode==13){
			$('#btnSearch').click();			
		}
		return false;
	});
	$('#btnSearch').click(function(){
		//var id=$("#nav a.select").attr("id");
		var word=$('.txtSearch').val();
		if(!word){
			asyncbox.tips("查询条件不能为空","error");
			return;
		}
		var ids=[];
		$('.u_body[ntype!=1]').each(function(){
			ids.push(this.id);
		});		
		var url=uri.api+'search';
		var params={ids:ids,word:word,stat:"1"};
		$.getJSON(url,params,function(json){
			if(!json.err){
				asyncbox.tips("查询数据成功。","success");		
				$(ids).each(function(i,n){
					$('#'+n).html('');
				});
				$(json.data).each(function(i,n){
					var sa="";
					if(n.auri.length>0){
						$(n.auri).each(function(j,m){
							sa+='<a href="{0}" class="block u_inline" target="_blank"><span class="blockTitle">{1}</span><span class="blockBody">{2}</span></a>'.format(m.url,m.name,m.desc);
						});						
					}
					$('#'+n.id).html(sa);
				});					
			}else{
				asyncbox.tips('查询数据失败。',"error");
			}
		});
		return false;
	});	
	$('#btnReset').click(function(){
		$('.txtSearch').val('');
		$("#nav a.select").click();
	});
	//cmd
	$('#oldpage').click(function(){
			var p1='http://61.152.115.138/info-product/index.html?name={0}&tel={1}&email={2}'.format(fnParam('name'),fnParam('tel'),fnParam('email'));
            fnCmd(10003,p1,false,'jbsy');//旧版首页
			return false;
	});
	$('#favcmd a').click(function(){
		$('#favcmd li').removeClass('selected');
		var that=$(this);
		//that.parent().addClass('selected');
		var index=$('#favcmd a').index(that);
		switch(index){
			case 0:
			var userCode=fnParam('userCode');
			var p1=uri.rptService+'/newreport/category.html?init=true&userCode='+userCode;
			fnCmd(10003,p1,false,'xbybflll');
			break;
			case 1:fnCmd(3,'ChinaMacro');break;
			case 2:fnCmd(3,'ChinaFinance');break;
			case 3:fnCmd(3,'ChinaSector');break;
			case 4:fnCmd(13,41);break;
			case 5:fnCmd(35,0);break;
			case 6:fnCmd(21);break;
			case 7:fnCmd(23,9282,9561);break;
			case 8:fnCmd(23,8089,8081);break;
			case 9:fnCmd(23,8090,8098);break;
		}
		return false;
	});
	
	//manager
	var email=decodeURI(fnParam("email"));
	var name=decodeURI(fnParam("name"));
	var sManager=''
	+'<div class="w_ac u_pd"><img src="plugins/page/images/dived_line.png" alt="" /></div>'
	+'<div style="padding-left:10px;line-height:18px;color:#fff">'
		+'<div style="padding-bottom:10px;">'+name+'为您服务</div>'
		+'<div class="u_pb"><img src="plugins/page/images/phone.gif" alt="" /><span class="u_av u_mr">'+decodeURI(fnParam("tel"))+'</span><a href="mailto:'+email+'" class="u_email">'+'<img src="plugins/page/images/email.gif" alt="" title="'+email+'"/></a></div>'
		+'<div class="u_pb"><img src="plugins/page/images/telephone.gif" alt="" /><span class="u_av">400-882-1010</span></div>'
		+'<div class="u_pb"><span style="margin-right:16px;"></span><span class="u_av">'+decodeURI(fnParam("telp"))+'</span></div>'
	+'</div>'
	+'<div class="w_ac u_pd"><img src="plugins/page/images/dived_line.png" alt="" /></div>'
	+'<div class="aboutus w_ac"><a class="bar1">免责申明</a><a class="bar2">联系我们</a></div>';
	$("#divManager").html(sManager);
	resize();
	//contact
	$('.u_iconBack').click(function(){
		$('#main').show();
		$('#main').siblings().hide();
	});
	$("#divManager .aboutus a").click(function(){
		$('#other').show();
		$('#other').siblings().hide();
		$('#otherBar ul').find('a[href=###'+$(this).attr('class')+']').click();
		// var otherBarH=$(window).height()-$('#otherBar').height()-20-8;
		// $('#otherBody').height(otherBarH);
	});
	$('#toBar2').click(function(){
		var mapCanH=$(window).height()-$('#otherBar').height()-$('#addrCan').height()-20;//12
		$('#mapCan').height(mapCanH);	
	});
});

function getDetail(pid){//subs==>json  auri==>json.data
	var url=uri.api+'getSubs';
	var params={id:pid,stat:"1"};
	$.getJSON(url,params,function(json){
		//asyncbox.tips("查询数据成功。","success");
		//[{"id":1008,"text":"财经媒体","stat":"1","ntype":"2","_id":"523839a52826866464000006"},{"id":1009,"text":"国家部委","stat":"1","ntype":"2","_id":"523839b32826866464000008"},{"id":1010,"text":"监管机构","stat":"1","ntype":"2","_id":"523839c72826866464000009"},{"id":1011,"text":"交易所","stat":"1","ntype":"1","_id":"523839d1282686646400000a"}]
		$(json).each(function(i,n){
			if($('#'+n.id).length>0){			
			}else{
				var html='<div class="w_block">'
				+'<div class="barTitle">{0}</div>'.format(n.text)
				+'<div class="u_body" id="{0}" {1}></div>'.format(n.id,n.ntype==1?'ntype='+n.ntype:'')
				+'</div>'
				+'<div class="w_al"><hr style="width:{0}px;"/></div>'.format($("#divCan").width()-30);
				$("#divCan").append(html);			
			}
			if(n.ntype==2){
				getAuri(n);
			}else{
				var url2=uri.api+'getSubs';
				var params2={id:n.id,stat:"1"};
				$.getJSON(url2,params2,function(json2){
					//asyncbox.tips("查询数据成功。","success");
					$(json2).each(function(j,m){
						if($('#'+m.id).length>0){						
						}else{
							var html2='<div class="w_block">'
							+'<div class="barTitle2">{0}</div>'.format(m.text)
							+'<div class="u_body" id="{0}"></div>'.format(m.id)
							+'</div>';
							$("#"+n.id).append(html2);						
						}
						if(m.ntype==2){
							getAuri(m);							
						}else{
							asyncbox.tips("目前仅支持到3级","success");
						}
					});	
				});
			}		
		});		
	});
}

function getAuri(n){
	var url=uri.api+'getAuri';
	var params={id:n.id,stat:"1"};
	$.getJSON(url,params,function(json){
		if(!json.err){
			var sa="";
			$(json.data).each(function(j,m){
				sa+='<a href="{0}" class="block u_inline" target="_blank"><span class="blockTitle">{1}</span><span class="blockBody">{2}</span></a>'.format(m.url,m.name,m.desc);
			});	
			// var html='<div class="w_block"><div class="barTitle">{0}</div><div class="u_body">{1}</div></div>'.format(n.text,sa);					
			// html+='<hr />';alert(html)
			$("#"+n.id).html(sa);		
		}else{
			asyncbox.tips('查询'+n.id+'数据失败。',"error");
		}
	});
}
$(window).resize(resize);
function resize(){
   var winH=$(window).height();
   var b6=$.browser.version==6;
   var favcmdH=winH-$("#divManager").height()-($.browser.msie?3:4)-(b6?0:0);
   $("#favcmd").height(favcmdH);
   
   var divImgLinksCanH=$('#divImgLinksCan').height();
   var divCanH=winH-divImgLinksCanH-$('#divNavCan').height()-($.browser.msie?12:8)-(b6?0:0);
   $('#divCan').height(divCanH);
   
   var ifmH=winH-divImgLinksCanH-($.browser.msie?12:4);
   $('#ifm').height(ifmH);
   $('hr').width($("#divCan").width()-30);
}