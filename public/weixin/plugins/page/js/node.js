var tree;
$(function(){
	tree=$("#tree").ligerTree({  
		data:level1
		,checkbox: false
		,idFieldName :'id'
		//,parentIDFieldName :'pid'
		,isExpand: true
		,slide: false
		,ajaxType:'get'
		,isLeaf : function(data){
			 if (!data) return false;
			 return data.ntype == 2;
		 }
		,delay:function(e){
			var data = e.data;
			if(data.ntype!=2){
				return {url:uri.forAdmin+'getSubs'+'?id='+data.id}
			}
			return false;
		}
		,onClick:function(e){
			var data=e.data;
			if(data.ntype==2){
				$.getJSON(uri.forAdmin+'getAuri?id='+data.id,function(json){
					if(json.err){
						asyncbox.tips(json.err,'error');
						return;
					}
					$("#tblAuri tbody").html('');
					$("#tblAuri tbody").html(addUri(json.data));
				});
			}
		}
	});
	//
	//tree.expandAll();
	$('#btnAddSub').click(function(){
		var node=tree.getSelected();
		addNode(node);		
	});	
	$('#btnAddSib').click(function(){
		var node=tree.getSelected();
		var e;
		if(node){
			var dpnode=tree.getParentTreeItem(node.target);
			if(dpnode){
				var pid=$(dpnode).attr("id");
				var data=tree.getDataByID(pid);
				e={data:data,target:dpnode};		
			}else{
				e={data:{id:-1},target:$('#tree').get(0)};
			}
		}
		addNode(e);
	});
	$('#btnAdd').click(function(){
		var node=tree.getSelected();
		if(node){
			var data=node.data;
			if(data.ntype==2){
			   var set={
			   title:"网址"
			   //,url:uri.taskTypeAdd
			   ,content:getUriEdit()
			   ,width:700
			   ,render:function(){
					//load
					$("#btnOk1").click(function(){
						var url=uri.forAdmin+'putUri';
						var name=$('#txtName').val();
						var params={
							id:data.id
							,name:name
							,desc:$('#txtDesc').val()
							,url:$('#txtUrl').val()
							,icon:$('#txtIcon').val()
							,stat:$('#sltStat').val()
						};
						$.getJSON(url,params,function(json){
							if(json.err){
								asyncbox.tips(json.err,'error');								
							}else{
								asyncbox.tips("操作网址成功！","success");							
								$("#tblAuri tbody").append(addUri(json.data));
							}							
							dialog.close();
						});
					});
					$("#btnCancel1").click(function(){
						 dialog.close();
					});
			   }};
				var dialog=$.dialog(set);
				return false;
			}else{
				asyncbox.tips('该节点不支持添加网址！','success');
			}
		}else{
			asyncbox.tips('请先选中节点！','success');
		}
	});
	$('#btnUpdateNode').click(function(){
		var node=tree.getSelected();
		if(node){
			var data=node.data;
			   var dialog;
			   var set={
			   title:"网址"
			   //,url:uri.taskTypeAdd
			   ,content:getNodeEdit()
			   ,width:700
			   ,render:function(){
					//load
					$('#txtName').val(data.text);	
					$('#ntype').attr('disabled',true).val(data.ntype);
					$('#stat').val(data.stat);
					//
					$("#btnOk1").click(function(){
						var url=uri.forAdmin+'postNode';
						var name=$('#txtName').val();
						var params={
							id:data.id
							,name:name
							,ntype:$('#ntype').val()
							,stat:$('#stat').val()
						};
						$.getJSON(url,params,function(json){
							if(json.err){
								asyncbox.tips(json.err,'error');								
							}else{
								asyncbox.tips("操作成功！","success");
								//tree.update(node.target, params);//todo
								var dpnode=tree.getParentTreeItem(node.target);
								var pid=$(dpnode).attr('id')||-1;
								loadOneNode(dpnode,pid);
							}							
							dialog.close();
						});
					});
					$("#btnCancel1").click(function(){
						 dialog.close();
					});
			   }};	
				dialog=$.dialog(set);
				return false;			   
		}else{
			asyncbox.tips('请先选中节点！','success');
		}
	});	
	$('#btnUpNode').click(function(){
		nodeUpDown(1);
	});	
	$('#btnDownNode').click(function(){
		nodeUpDown(0);
	});

	//uri
	$('#chkHide').click(function(){
		if($(this).attr('checked')){
			$("#tblAuri tbody div[data=0]").parents('tr').hide();
		}else{
			$("#tblAuri tbody div[data=0]").parents('tr').show();
		}
	});
	$("#tblAuri :checkbox").live('click',function(){
		$("#tblAuri :checkbox").attr('checked',false);
		$(this).attr('checked',true);
	});
	$('#btnUpdate').click(function(){
		var node=tree.getSelected();
		if(node){
			var data=node.data;
			if(data.ntype==2){
			   if($("#tblAuri :checked").length==0){			
					asyncbox.tips('请先选中网址！','success');
					return;
			   }
			   var dialog;
			   var set={
			   title:"网址"
			   //,url:uri.taskTypeAdd
			   ,content:getUriEdit()
			   ,width:700
			   ,render:function(){
					//load
					var tr=$("#tblAuri :checked").parents('tr');
					var oldName=tr.find('td:eq(2)').text();
					$('#txtName').val(oldName);	
					$('#txtDesc').val(tr.find('td:eq(3)').text());
					$('#txtUrl').val(tr.find('td:eq(4)').text());
					$('#txtIcon').val(tr.find('td:eq(5) div').attr('data'));
					$('#sltStat').val(tr.find('td:eq(6) div').attr('data'));
					//
					$("#btnOk1").click(function(){
						var url=uri.forAdmin+'postUri';
						var name=$('#txtName').val();
						var params={
							id:data.id
							,oldName:oldName
							,name:name
							,desc:$('#txtDesc').val()
							,url:$('#txtUrl').val()
							,icon:$('#txtIcon').val()
							,stat:$('#sltStat').val()
						};
						$.getJSON(url,params,function(json){
							if(json.err){
								asyncbox.tips(json.err,'error');								
							}else{
								asyncbox.tips("操作网址成功！","success");								
								node.target.click();
								tree.selectNode(node.target);
								//$("#tblAuri tbody").append(addUri(json.data));
							}							
							dialog.close();
						});
					});
					$("#btnCancel1").click(function(){
						 dialog.close();
					});
			   }};	
				dialog=$.dialog(set);
				return false;			   
			}else{
				asyncbox.tips('该节点不支持网址！','success');
			}
		}else{
			asyncbox.tips('请先选中节点！','success');
		}
	});
	//
	$('#btnUp').click(function(){
		uriUpDown(1);
	});	
	$('#btnDown').click(function(){
		uriUpDown(0);
	});
	$('#btnCheck').click(function(){
		location.href='/';
	});
	
	function uriUpDown(up){
		var node=tree.getSelected();
		if(node){
			var data=node.data;
			if(data.ntype==2){
			   if($("#tblAuri :checked").length==0){			
					asyncbox.tips('请先选中网址！','success');
					return;
			   }
			   	var tr=$("#tblAuri :checked").parents('tr');
				var name=tr.find('td:eq(2)').text();
				var url=uri.forAdmin+'postUriUp';
				var params={
					id:data.id
					,name:name
					,up:up
				};
				$.getJSON(url,params,function(json){
					if(json.err){
						asyncbox.tips(json.err,'error');								
					}else{
						asyncbox.tips("操作成功！","success");
						node.target.click();
						tree.selectNode(node.target);
					}							
				});
			   
			}else{
				asyncbox.tips('该节点不支持网址！','success');
			}
		}
	}
	function nodeUpDown(up){
		var node=tree.getSelected();
		if(node){
			var data=node.data;
 			var dpnode=tree.getParentTreeItem(node.target);
			var pid=$(dpnode).attr("id")||-1;
			var url=uri.forAdmin+'postNodeUp';
			var params={
				pid:pid
				,id:data.id
				,up:up
			};
			$.getJSON(url,params,function(json){
				if(json.err){
					asyncbox.tips(json.err,'error');								
				}else{
					asyncbox.tips("操作成功！","success");
					loadOneNode(dpnode,pid);
					//location=location;
				}							
			});
		}else{
			asyncbox.tips('请先选中节点！','success');
		}
	}
	function loadOneNode(dnode,id){
		if(id==-1){
			location=location;
		}else{
			var url=uri.forAdmin+'getSubs'+'?id='+id;
			//var param={id:id};
			$('>ul',dnode).html('');
			tree.loadData(dnode, url);			
		}
	}
	function addNode(e){
		if(e){
			var data=e.data;
			if(data.ntype==2){
				asyncbox.tips('该节点不支持子节点！','success');
			}else{
			
			   var set={title:"栏目"
               //,url:uri.taskTypeAdd
               ,content:getNodeEdit()
               ,width:700
			   ,render:function(){
					if(data.id==-1){
						$('#ntype').attr('disabled',true).val(1);
					}
                    $("#btnOk1").click(function(){
						var url=uri.forAdmin+'putSub';
						var name=$('#txtName').val();
						if(!name){
							asyncbox.tips("栏目名称不能为空！","success");
							return;
						}
						var params={
							id:data.id
							,name:name
							,ntype:$('#ntype').val()
							,stat:$('#stat').val()
						};
						$.getJSON(url,params,function(json){
							if(json.err){
								asyncbox.tips(json.err,'error');
								return;
							}							
							asyncbox.tips("添加栏目成功！","success");
							loadOneNode(e.target,data.id);
							//tree.append(e.target,json.data);
							dialog.close();
						});
                    });
                    $("#btnCancel1").click(function(){
                         dialog.close();
                    });
               }};
               var dialog=$.dialog(set);
               return false;
			}
		}else{
			asyncbox.tips('请先选中节点！','success');
		}
	}//endof addNode 
	function addUri(adata){
		var irows=$("#tblAuri tbody tr").length;
		return fnDrawTrs(adata,[],{sKey:'',aaAddCol:[[0,function(td,i,k,tr){
			return ''+(i+1+irows);
		}],[0,function(td,i,k,tr){
			return '<input type="checkbox"/>';
		}]],aaCall:[[3,function(td){
			var sa='<a href="###" class="u_marginr">查看</a><a href="###" class="u_marginr">编辑</a><a href="###">删除</a>';
			return '<div data="{1}">{0}</div>'.format(sa,td);
		}],[4,function(td){
			return '<div data="{1}">{0}</div>'.format(td==1?'显示':'隐藏',td);
		}]]});
	}
	function getUriEdit(){
		return '<table class="u_tableA"><tbody>'
			   +'<tr><td>名称：</td><td><input type="text" id="txtName"/></td></tr>'
			   +'<tr><td>简介：</td><td><textarea name="" id="txtDesc" cols="30" rows="10" style="width:400px;height:100px;"></textarea></td></tr>'
			   +'<tr><td>URL：</td><td><input type="text" id="txtUrl" class="u_xl"/></td></tr>'
			   +'<tr><td>图标：</td><td><input type="text" id="txtIcon"/></td></tr>'
			   +'<tr><td>状态：</td><td><select name="" id="sltStat"><option value="1">显示</option><option value="0">隐藏</option></select></td></tr>'	   
			   +'<tr><td></td><td><input type="button" class="w_buttonA" value="确定" id="btnOk1"/><input type="button" class="w_buttonA" value="取消" id="btnCancel1"/></td></tr>'
			   +'</tbody></table>';
	}
	function getNodeEdit(){
		return '<table class="u_tableA"><tbody>'
               +'<tr><td>栏目名称:</td><td><input type="text" id="txtName"/></td></tr>'
               +'<tr><td>类型:</td><td><select name="" id="ntype"><option value="2">叶子节点</option><option value="1">普通节点</option></select></td></tr>'
               +'<tr><td>状态:</td><td><select name="" id="stat"><option value="1">显示</option><option value="0">隐藏</option></select></td></tr>'
               +'<tr><td></td><td><input type="button" class="w_buttonA" value="确定" id="btnOk1"/><input type="button" class="w_buttonA" value="取消" id="btnCancel1"/></td></tr>'
               +'</tbody></table>';
	}
	//
});

  