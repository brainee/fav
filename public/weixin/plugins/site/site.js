var uri={
	pager:"plugins/pager/pager.html"
	,rptService:"http://61.152.115.141"
	,api:"api/"
	,forAdmin:"../api/"//供admin用
	,update:"../plugins/page/js/img.html"//供admin用
	,service:""//admin之后
};
//$.ajaxSetup({cache:false});
/**
* 扩展String方法
*/
(function ($) {
    $.extend(String.prototype, {
       isNumber: function (value, element) {
           return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
       },
        trim: function (c) {
			//c不能等于\.  
			var str=c==null?"(^\\s*)|(\\s*$)|\\r|\\n":"(^[\\s"+c+"]*)|([\\s"+c+"]*$)|\\r|\\n";
			var pattern =new RegExp(str,"g"); 
            return this.replace(pattern, "");
            //return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
        },
        format: function () {
            var args = arguments;
            return this.replace(/\{(\d+)\}/g,
            function (m, i) {
                return args[i];
            });
        }
    });
	//tabs
	$(".w_tabsA,.w_tabs,.u_tabs,.u_tabV").each(function(){
		var _this=this;
		$(_this).find("a").click(function(){//live
			$(_this).find("a").each(function(){
				$(this).removeClass("select");
				var href=$(this).attr("href");
				(href&&href.length>3)?$(href.replace("###","#")).hide():null;
			});
			$(this).addClass("select").blur();
			var href=$(this).attr("href");
			(href&&href.length>3)?$(href.replace("###","#")).show():null;			
		});
		$(this).find("a.select").click();
	});	
})(jQuery);

/** 
* 时间对象的格式化 
*/
Date.prototype.format = function (format) {
    /* 
    * format="yyyy-MM-dd hh:mm:ss"; 
    */
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
function format(num, options){
	options=options||{};
	options.point=options.point||'.';  
	options.group=options.group||',';  
	options.suffix=options.suffix||'';  
	options.prefix=options.prefix||'';  
	if (typeof(options.places)=="undefined")  
	{     
		options.places=2;  
	} 
	regex = /(\d+)(\d{3})/;  
	result = ((isNaN(num) ? 0 : Math.abs(num)).toFixed(options.places)) + '';  
	for (result = result.replace('.', options.point); regex.test(result) && options.group; result=result.replace(regex, '$1'+options.group+'$2')) {  
		regex.exec(result);        
	};  
	return (num < 0 ? '-' : '') + options.prefix + result + options.suffix; 
}
function fnParam(param) {
	var query = window.location.search;
	var iLen = param.length;
	var iStart = query.indexOf(param);
	if (iStart == -1) {
		return "";
	}
	//取得开始搜索的位置。 
	iStart += iLen + 1;
	var iEnd = query.indexOf("&", iStart);
	//如果只有一个参数传进来 
	if (iEnd == -1) {
		return query.substring(iStart);
	} else {
		return query.substring(iStart, iEnd);
	}
}
function fnJSON(sJson){
	if(typeof sJson=='object'){
		return sJson;
	}else if($&&$.parseJSON){
		return $.parseJSON(sJson);
	}else if(sJson==""){
		return null;
	}else{
		return eval("("+sJson+")");
	}
}
///aData数组数据
///aAlign 位置与数据索引对应[2,1,3] 1左，2中，3右
///aFilter 过滤索引列表[0,1]
///aaCall 自定义绘制表格内容[[0,function(td,irow,iCol,oTr){}],[1,""]]
function fnDrawTrs(aData,aAlign,oSet) {//aAlign,aFilter,aaCall,strip
     var aData=aData||[],oSet=oSet||{},aAlign=aAlign||oSet.aAlign||[],aFilter=oSet.aFilter||[],aaCall=oSet.aaCall||[],strip=oSet.strip==null||oSet.strip,cell=oSet.cell||"td",aHead=oSet.aHead,aOrder=oSet.aOrder||[],aaAddCol=oSet.aaAddCol||[],key=oSet.sKey==null?'':oSet.sKey,fnTdCb=oSet.fnTdCb,fnTrCb=oSet.fnTrCb,iLimitCol=oSet.iLimitCol,iLimitRow=oSet.iLimitRow,aRangeR=oSet.aRangeR,bFilter=oSet.bFilter;
     var trs = "";
     var aAlignClass=["","w_al","w_ac","w_ar"];
     for (var i = 0; i < aData.length; i++) {
		  if(iLimitRow!=null&&i>=iLimitRow){           
			continue;
		  }
		  if(aRangeR&&(i<aRangeR[0]||(null==aRangeR[1]?false:i>aRangeR[1]))){
			continue;
		  }
          var oTr = aData[i];
		  aHead?$.inArray(i,aHead)>-1?cell="th":cell="td":'';
          var sTds = "";              
          var k=0;
          for (var j in oTr) {
				if(iLimitCol!=null&&k>=iLimitCol){
                    k++;              
                    continue;
				}
               if(bFilter){//filter in use  
				  if($.inArray(k,aFilter)==-1){
					k++;              
					continue;
				  } 
               }else{
				  if($.inArray(k,aFilter)>-1){
					k++;              
					continue;
				  }
			   }
			   if($.inArray(j,aOrder)>-1){//order
			   j=aOrder[k];
			   }
               var text=oTr[j]==null?"":key?oTr[j][key]:oTr[j];//deal "null"			   
               if(aaCall.length>0){
                    $.each(aaCall,function(m,n){
                         if(n[0]==k){
                         text=typeof n[1]=="function"?n[1](text,i,k,oTr,j):n[1];
                         }
                    });
               }
			   var std="";
               if(passif(aAlign[k])){                   
				   std = '<'+cell+' class="'+aAlignClass[aAlign[k]]+'">'+text+'</'+cell+'>';
               }else{
				   std = '<'+cell+'>'+text+'</'+cell+'>';
               }
			   if(aaAddCol.length>0){//add
				  var sadd="";
				  $.each(aaAddCol,function(m,n){
					if(n[0]==k){
					   sadd=typeof n[1]=="function"?n[1](text,i,k,oTr):n[1];
					   sadd= sadd.toString().indexOf("<td")>-1?sadd:'<'+cell+'>'+sadd+'</'+cell+'>';
					}
					if(n[2]){//insert bafter
						std=std+sadd;
					}else{
						std=sadd+std;
					}
				  });
			   }			   
			   sTds+=fnTdCb?fnTdCb(std,i,k,oTr,j):std;
               k++;              
          }
          var sTr=strip?i%2==0?'<tr>'+sTds+'</tr>':'<tr class="w_trEven">'+sTds+'</tr>':'<tr>'+sTds+'</tr>';         
		  trs +=fnTrCb?fnTrCb(sTr,i,oTr):sTr; 
     }
     return trs;
}
function fnDrawTbl(aData,aAlign,oSet){
	var jtbl=oSet.jtbl;
	var aData=aData||[],iHead=oSet.iHead||0;	
	oSet.aRangeR=[0,iHead-1];
	oSet.cell='th';
	var thead='<thead>'+fnDrawTrs(aData,oSet.aAlign,oSet)+'</thead>';
	oSet.aRangeR=[iHead];
	oSet.cell='td';
	if(jtbl&&jtbl.length>0){
		if(jtbl.find('thead').length>0){
			oSet.iLimitCol=jtbl.find('thead th').length||jtbl.find('thead td').length;
			jtbl.find('tbody').html(fnDrawTrs(aData,aAlign,oSet));
		}else{
			var tbody='<tbody>'+fnDrawTrs(aData,aAlign,oSet)+'</tbody>';
			jtbl.html(thead+tbody);
		}
		return jtbl;
	}else{
		var tbody='<tbody>'+fnDrawTrs(aData,aAlign,oSet)+'</tbody>';
		return thead+tbody;
	}
}
function isEmpty(source){
 return source==null||source=='';
}
function isNE(source){
 return !(source==null||source=='');
}
function passif(source){
	var flag=false;
	if(source){
		flag=true;
	}
	return flag;	
}
function fnMain(_params,_jcan,_fnOrSet,_url){//_fnOrSet is callback or oSet
	_params._=new Date().getTime();
	var fnset=_fnOrSet?_fnOrSet:{};	
	$.getJSON(_url||uri.service,_params,function(json){
		if($.isFunction(fnset)){
			fnset(json,_jcan);
		}else if($.isArray(json)||($.isArray(json[fnset.key||'data']))){//后台返回数组
			json.data=json[fnset.key||'data'];
			if(json.data){//data向下一级
				json=json.data;
			}
			if(json&&json.length>0){				
				_jcan=_jcan==null?$(document):_jcan;
				var pre=fnset.fnPre||function(){
					var tbody=_jcan.find('tbody');
					_jcan=tbody.length>0?tbody:_jcan;
					_jcan.html(fnDrawTrs(json,null,fnset));				
				};
				var post=fnset.fnPost||function(){};
				pre(json,_jcan);
				post(json,_jcan);
			}else{
				(fnset.btip==null||fnset.btip)?tip('没有数据。'):'';
			}		
		}else{
			tip('后台数据格式有误。');
		}
	});
}
function tip(msg){
	try{
	asyncbox.tips(msg,'success');				
	}catch(e){alert(msg);}
}
function FnTab(jtab,oTab,oset){	
	oset=oset||{};
	oset.bAutoInit=oset.bAutoInit==null?true:oset.bAutoInit;
	if(jtab.data('oTab')){
		oTab=jtab.data('oTab');
	}else{
		oTab=oTab||oset.oTab;//endof oTab
		oTab.can=jtab;
		if(oset.bAutoInit){
			oTab.fnInit=oTab.fnInit||$.noop;
			oTab.fnInit();	
		}
		jtab.data('oTab',oTab);
	}
	return oTab;
}
function fnOpen(url){
		 try{
			if(!url){
				alert('url地址不存在。');
				return;
			}
			window.external.NavigateTo(url);
		 }catch(ex){
			//fnWindow(url);
			//alert('版本较低，请升级到最新版本。');
			window.open(url);
		 }
}
// function fnDownload(_href,_name){
	// if(!_href||!_name){
		// alert("url和地址不能为空");
		// return;
	// }						
	// _name=_name.replace(/[\/\\:*?"<>|]/g,"")||"";
	// try {
		// try{
			// //window.external.DownloadFile(_href,_name);
			// window.external.NavigateTo(_href);
		// }catch(ex){
			// api.DownloadFile(_href,_name);
		// }
	// } catch (e) {
		// window.open(_href);
	// }
// }
// function fnWindow(url,oSet){
     // oSet=oSet||{};
     // var width=oSet.width||800;
     // var height=oSet.height||500;
     // var left=oSet.left||(screen.width - width )/2;
     // var top=oSet.top||(screen.height - height )/2;
     // var args=oSet.args||null;
     // //var target=oSet.target||"_self";//window.dialogArguments//window.returnValue
     // var scroll=oSet.scroll||0;
     // var resizable=oSet.resizable||1;
     // var center=oSet.center||1;
     // var status=oSet.status||1;
     // return window.showModalDialog(url,args,'dialogWidth='+width+'px;dialogHeight='+height+'px;dialogTop='+top+'px;dialogLeft='+left+'px;scroll='+scroll+';resizable='+resizable+';center='+center+';status='+status+'');
// }
// function fnCmd(cmdid,p1,p2,p3){
		 // try{
			// cmdid=cmdid||0;
			// p1=p1||"";
			// p2=p2||"";
			// p3=p3||"";			
			// window.external.ExecuteCommand(cmdid,p1,p2,p3);
		 // }catch(ex){
			// alert('版本较低，请升级到最新版本。');
		 // }
// }
// function fnStar(iNum){
// iNum=parseInt(iNum)||0;
// var star='★';
// var stars="";
// for(var i=0;i<iNum;i++){
// stars+=star;
// }
// return '<span class="u_star">{0}</span>'.format(stars);
// }
// function getxy(e){
	 // e=typeof e=="string"?document.getElementById(e):e;
     // var x = e.offsetLeft;
     // var y = e.offsetTop;
     // while(e = e.offsetParent){
          // x += e.offsetLeft;
          // y += e.offsetTop;
     // }
     // return {"x": x, "y": y};
// }
// function isMouseAt(e,jPanel){               
   // jPanel=jPanel||$("#manigerlist");
   // var flag=false;
   // if(e){                    
		// var offset = jPanel.offset();
		// offset.right = offset.left + jPanel.outerWidth();
		// offset.bottom = offset.top + jPanel.outerHeight();
		// if(e.pageY < offset.bottom && e.pageY > offset.top && e.pageX < offset.right && e.pageX > offset.left){
			 // flag=true;
		// }
   // }
   // return flag;
// }
// function fnSort(dataSource,dataindex,direction){
	// dataSource=dataSource||[];
	// dataindex=dataindex||0;
	// direction=direction||"asc";	
	// var sortor=function(d1, d2) {
            // if (d1[dataindex] != undefined && d2[dataindex] != undefined) {
                // var s1 = d1[dataindex].toString();
                // var s2 = d2[dataindex].toString();
                // if (!isNaN(s1) && !isNaN(s2)) {
					// var exp=direction=="asc"?parseFloat(s1) - parseFloat(s2):parseFloat(s2) - parseFloat(s1);
                    // return exp;
                // }
                // else {
                    // var step = Math.max(s1.length, s2.length);
                    // var c1, c2;
                    // for (var i = 0; i < step; i++) {
                        // c1 = s1.charCodeAt(i);
                        // c2 = s2.charCodeAt(i);
                        // if (c1 != c2) {
							// var exp=direction=="asc"?c1 - c2:c2 - c1;
                            // return exp;
                        // }
                    // }
                    // return 0;
                // }
            // }
            // return 0;
        // };
	// return dataSource.sort(sortor);		
// }	
// function fnArrow(input,arrow){
	// var aarrow=["","↓","↑"];
	// var acolors=["","u_green","u_red"];
	// var num;
	// if(arguments.length>1){
		// num=arrow;
	// }else{
		// num=input.toString().replace("%","");
	// }
	// var i=isNaN(num)?0:num==0?0:parseFloat(num)<0?1:2;
	// var stext='<span class="{0}">{1}</span><span class="{0} u_arrow">{2}</span>'.format(acolors[i],input,aarrow[i]);
	// return stext;
// }
// function fnDate(type,n,date){
	// var aDate=[];
	// date=date||new Date();
	// aDate[0]=date.format('yyyy-MM-dd');//source date
	// switch(type){
		// case 'y':
		// date.setYear(date.getYear()+n);
		// aDate[1]=date.format('yyyy-MM-dd');
		// break;
		// case 'M':
		// date.setMonth(date.getMonth()+n);
		// aDate[1]=date.format('yyyy-MM-dd');
		// break;
		// case 'd':
		// date.setDate(date.getDate()+n);
		// aDate[1]=date.format('yyyy-MM-dd');
		// break;
	// }
	// return aDate;
// }
// //锁定行和列
// function fnFixTable(oSet) {//tableID, fixCols, width, height,fix
	// var tid=typeof oSet.tableID=="string"?oSet.tableID:$(oSet.tableID).attr("id")?$(oSet.tableID).attr("id"):$(oSet.tableID).attr("id",new Date().getTime()).attr("id");
	// var fixCols=oSet.fixCols||0;
	// var bdeep=oSet.bdeep||false;
	// var colorfix=oSet.colorfix||"Silver";
	// var colorhead=oSet.colorhead||"Silver";//
	// var colorcols=oSet.colorcols||"#EEE";//
	// var iScroll=oSet.iScroll||17;
	// var oldtable = $("#" + tid);
	// var isIe6=$.browser.msie&&$.browser.version<7;
	// fix=oSet.fix||3;
	// width=oSet.width||oldtable.parent().css("width").replace("px","");//alert($(window).width()+","+$(".w_header").width())
	// height=oSet.height||oldtable.parent().css("height").replace("px","");//
	// var pwidth=oldtable.parent().width();
	// var pheight=oldtable.parent().height();
	// if(width=="auto"){
		// width=isIe6?$(".w_header").width()||$(window).width():pwidth;
		// isIe6?oldtable.width(width-iScroll):"";//fix==2&&oSet.height	
	// }else if(!oSet.width){
		// width=!($(".w_wrapper").length)?pwidth+iScroll:pwidth;
	// }
	// if(height=="auto"){//ie isIe6?$(window).height()*0.8:
		// height=fix==2?pheight:($(window).height()*0.8);
	// }else if(!oSet.height){//has no value
		// height=fix==2?oldtable.height()+iScroll+2:$(window).height()*0.8;
	// }
	// if ($("#" + tid + "_tblCan").length != 0) {
        // $("#" + tid + "_tblCan").before($("#" + tid));
        // $("#" + tid + "_tblCan").empty();
    // }
    // else {
        // $("#" + tid).after("<div id='" + tid + "_tblCan' style='overflow:hidden;position:relative;height:" + height + "px; width:" + width + "px;'></div>");
    // }
	// var divs="";	
	// switch(fix){
		// case 1://只锁表头
		// divs='<div id="' + tid + '_headCan"></div>'+ '<div id="' + tid + '_dataCan"></div>';
		// break;
		// case 2://只锁列头
		// divs='<div id="' + tid + '_colCan"></div>'+ '<div id="' + tid + '_dataCan"></div>';
		// break;
		// case 3://锁定头和列
		// divs='<div id="' + tid + '_fixCan"></div>'+'<div id="' + tid + '_headCan"></div>'+'<div id="'+tid+'_colCan"></div>'+'<div id="'+tid+'_dataCan"></div>';
		
	// }
    // $(divs).appendTo("#" + tid + "_tblCan");    
	// if(fix!=2){
	    // var tableHeadClone = oldtable.clone(bdeep);
		// tableHeadClone.attr("id", tid + "_tableHeadClone");
		// $("#" + tid + "_headCan").append(tableHeadClone);
	// }
	// if(fix!=1){
	    // var tableColumnClone = oldtable.clone(bdeep);
		// tableColumnClone.attr("id", tid + "_tableColumnClone");
		// $("#" + tid + "_colCan").append(tableColumnClone);
	// }
	// if(fix==3){
		// var tableFixClone = oldtable.clone(bdeep);
		// tableFixClone.attr("id", tid + "_tableFixClone");
		// $("#" + tid + "_fixCan").append(tableFixClone);
	// }
    // $("#" + tid + "_dataCan").append(oldtable);
    // $("#" + tid + "_tblCan table").each(function () {
        // $(this).css("margin", "0");
    // });
	// if(fix!=2){
	    // var HeadHeight = $("#" + tid + "_headCan thead").height();
		// HeadHeight += 2;
		// $("#" + tid + "_headCan").css("height", HeadHeight);
		// if(fix==3){$("#" + tid + "_fixCan").css("height", HeadHeight);}//
	// }
	// if(fix!=1){
		// var ColumnsWidth = 0;
		// var ColumnsNumber = 0;
		// $("#" + tid + "_colCan tr:last td:lt(" + fixCols + ")").each(function () {
			// ColumnsWidth += $(this).outerWidth(true);
			// ColumnsNumber++;
		// });
		// ColumnsWidth += 2;
		// if ($.browser.msie) {
			// switch ($.browser.version) {
				// case "7.0":
					// if (ColumnsNumber >= 3) ColumnsWidth--;
					// break;
				// case "8.0":
					// if (ColumnsNumber >= 2) ColumnsWidth--;
					// break;
			// }
		// }	
		// $("#" + tid + "_colCan").css("width", ColumnsWidth);
		// if(fix==3){$("#" + tid + "_fixCan").css("width", ColumnsWidth);}//
	// }
    // $("#" + tid + "_dataCan").scroll(function () {
        // if(fix!=2){$("#" + tid + "_headCan").scrollLeft($("#" + tid + "_dataCan").scrollLeft());}
        // if(fix!=1){$("#" + tid + "_colCan").scrollTop($("#" + tid + "_dataCan").scrollTop());}
    // });
	// var oDataCss={ "overflow": "auto", "width": width, "height": height, "position": "absolute", "z-index": "35" };
	// if(fix!=2){
		// $("#" + tid + "_headCan").css({ "overflow": "hidden", "width": width - iScroll, "position": "absolute", "z-index": "45", "background-color": colorhead });//
		// oDataCss.overflowY="scroll";
	// }	
	// if(fix!=1){
		// $("#" + tid + "_colCan").css({ "overflow": "hidden", "height": height - iScroll, "position": "absolute", "z-index": "40", "background-color":colorcols });//
	// }	
	// if(fix==3){
		// $("#" + tid + "_fixCan").css({ "overflow": "hidden", "position": "absolute", "z-index": "50", "background-color":colorfix });//
		// oDataCss.overflow="scroll";
	// }   
    // $("#" + tid + "_dataCan").css(oDataCss);
	// if(fix!=2){
		// var headCan=$("#" + tid + "_headCan");
	    // if (fix==3&&headCan.width() > headCan.find("table").width()) {
			// headCan.css("width", headCan.find("table").width());
			// $("#" + tid + "_dataCan").css("width", headCan.find("table").width() + iScroll);
		// }
		// headCan.offset($("#" + tid + "_tblCan").offset());
	// }
	// if(fix!=1){
		// var colsCan=$("#" + tid + "_colsCan");
		// if (colsCan.height() > colsCan.find("table").height()) {
			// colsCan.css("height",colsCan.find("table").height());
			// $("#" + tid + "_dataCan").css("height", colsCan.find("table").height() + iScroll);
		// }
		// colsCan.offset($("#" + tid + "_tblCan").offset());
	// }
	// if(fix==3){
		// $("#" + tid + "_fixCan").offset($("#" + tid + "_tblCan").offset());
	// }   
    // $("#" + tid + "_dataCan").offset($("#" + tid + "_tblCan").offset());
// }