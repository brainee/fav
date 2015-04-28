$(function(){
	var d=new dTree('d');
	$.getJSON(uri.service+"/detail",function(json){
		$(json).each(function(i,n){
			d.add(n.id,-1,n.name); //创建一个树对象 
		});	
		$("#tree").html(d.toString());		
	});
    

	$("#btnAdd1").click(function(){		
		var set={title:"一级栏目",
			//url:uri.taskTypeAdd,
			content:'<table class="u_tableA"><tbody>'
			+'<tr><td>栏目名称：</td><td><input type="text" /></td></tr>'
			+'<tr><td></td><td><input type="button" class="w_buttonA" value="确定" id="btnOk1"/><input type="button" class="w_buttonA" value="取消" id="btnCancel1"/></td></tr>'
			//+'<tr><td></td><td></td></tr>'
			+'</tbody></table>',
			width:700,
			//btnsbar:$.btn.OKCANCEL,
			callback:function(action){
				if(action=="ok"){	
				}
			},render:function(){
				$("#btnOk1").click(function(){
					asyncbox.tips("添加一级栏目成功！","success");
					dialog.close();
				});
				$("#btnCancel1").click(function(){
					dialog.close();
				});
			}};
			var dialog=$.dialog(set);
			return false;
	});

});