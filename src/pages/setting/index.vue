<template>
	
	<div>
		<div style="text-align:center;" v-if="!inited">
			<div style="text-align:center;display:inline-block;">
				<Spin size="large" ></Spin>
			</div>
		</div>
		
		

		<div class="settingindex" v-html="html" @click="clicktarget"></div>

	    <upload ref="uploadref" @uploadmethod="uploadmethod"></upload>
	    
	</div>

	

</template>

<script type="text/javascript">
    import $ from 'jquery'
    import upload from '../../components/upload';
    
	export default {
	  	components: {
	  		upload
	  	},
	  	props : ['settings','menu'],
	  	data : function(){
	  		return {
                inited : false,
	  			params : {},
	  			list : [],
	  			html : '',
	  			showup : false,
	  			uploadurl : '',
	  			uptarget : '',
	  		}
	  	},
        created:function(){
            var self = this;
            /*if( self.menu && self.menu[0]['list'][0]['appurl'] != 'settingindex' ){
            	self.$router.push(self.menu[0]['list'][0]['appurl']);
            	return false;
            }*/

            self.initdat();

            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';

	        self.$util.http('ajax','GET',{op:'queue'},function(res){});
	        
        },
	  	methods: {
	  		initdat(){
	  			var self = this;
	            var postdata = {
	                op : 'getset',
	                fromajax : 1,
	            }

	            self.$util.http('website','GET',postdata,function(res){
	                if( res.status == 200 ){
	                	if( res.obj.toindex ){
	                		self.$router.push(res.obj.toindex);
	                		return false;
	                	}

	                    self.html = res.obj.html;

	                    setTimeout(function(){
				            self.$util.http('ajax','GET',{op:'getkf'},function(res){
				                if( res.status == 200 ){
			                        $('#kftoken').text(res.obj.token);
			                        $('#kfkey').text(res.obj.key);
			                        $("#subset").attr('action',self.settings.seturl);
				                }
				            })

			                var settype = sessionStorage.getItem("setjs");
							if( settype ){
								$('.js_top').removeClass('selected');
								$('.js_top[showme="'+settype+'"]').addClass('selected').show();
								$('.settings_group').hide();
								$('.settings_group.'+settype).show();
							}
				            
	                    },1000);
	                    self.inited = true;

	                }else{
	                    self.$Message.error(res.res);
	                }
	            });
	  		},
            clicktarget(e){
            	var self = this;
            	this.uptarget = $(e.target);

            	var type = e.target.innerText;

                if( type == '选择图片' ){

	                this.$refs.uploadref.showbox();

                }else if( type == '删除缓存' || type == '清空用户生成的海报图片' || type == '删除后台设计的海报数据' ){

                	var ttype = 'cache';
                	if( type == '清空用户生成的海报图片' ) ttype = 'poster';
                	if( type == '删除后台设计的海报数据' ) ttype = 'posterdata';

		            var postdata = {
		                op : 'deletecache',
		                fromajax : 1,
		                type : ttype,
		            }
		            if( confirm('确定删除吗？') ){
			            self.$util.http('ajax','GET',postdata,function(res){
			                self.$Message.success('已删除');
			            },true);
		            }

                }else if( type == '立即设置' ){
		            var postdata = {
		                op : 'settid',
		                fromajax : 1,
		            }
		            self.$util.http('ajax','GET',postdata,function(res){
		                if( res.status == 200 ){
		                    self.initdat();
		                }else{
		                    self.$Message.error(res.res);
		                }
		            },true);

                }else if( type == '一键设置id' ){
		            var postdata = {
		                op : 'settidnew',
		                fromajax : 1,
		            }
		            self.$util.http('ajax','GET',postdata,function(res){
		                if( res.status == 200 ){
		                    $('input[name="gqvf2x"]').val(res.obj.tid);
		                    self.$Message.success(res.res);
		                }else{
		                    self.$Message.error(res.res);
		                }
		            },true);

                }else if( type == '发给管理员测试' ){

		            var postdata = {
		                op : 'sendtestmess',
		                fromajax : 1,
		            }
		            self.$util.http('ajax','GET',postdata,function(res){
		                self.$Message.info(res.res);
		            },true);

                }else if( type == '检测是否可用' ){

		            var postdata = {
		                op : 'testfz',
		                fromajax : 1,
		                name : $('input[name="htrvwqc"]').val(),
		                wxid : $('input[name="fwqczwrg"]').val(),
		            }
		            self.$util.http('ajax','GET',postdata,function(res){
		                self.$Message.info(res.res);
		            },true);

                }else if( type == '初始化' ){

		            var postdata = {
		                op : 'initbandapp',
		                fromajax : 1,
		            }
		            self.$util.http('ajax','GET',postdata,function(res){
		                self.$Message.info(res.res);
		            },true);

                }else if( type == '确定修改token' || type == '确定修改key' ){
                	var ttype = 'token';
                	var value = $('.kftoken').val();

                	if( type == '确定修改key' ) {
                		ttype = 'key';
                		value = $('.kfkey').val();
                	}

		            var postdata = {
		                op : 'editkf',
		                fromajax : 1,
		                type : ttype,
		                code : value,
		            }
		            self.$util.http('ajax','GET',postdata,function(res){
		                if( res.status == 200 ){
		                    self.$Message.success('已修改');
							if( postdata.type == 'token' ){
								$('#kftoken').text(postdata.code);
							}
							if( postdata.type == 'key' ){
								$('#kfkey').text(postdata.code);
							}
		                }else{
		                    self.$Message.error(res.res);
		                }
		            },true);
                }else if( type == '生成新的token' || type == '生成新的key' ){
                	var ttype = 'token';
                	if( type == '生成新的key' ) {
                		ttype = 'key';
                	}

					var token = '';
					for(var t=0;t<32;t++){
						token += "abcdefghijklmnopqrstuvwxyz0123456789"[parseInt(32*Math.random())]
					}
					var key = '';
					for(var t=0;t<43;t++){
						key += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[parseInt(61*Math.random()+1)]
					}
					var postdata = {
						op : 'resetkf',
						type : ttype,
						token : token,
						key : key,
					};
		            self.$util.http('ajax','GET',postdata,function(res){
		                if( res.status == 200 ){
		                    self.$Message.success('已修改');
							if( postdata.type == 'token' ){
								$('#kftoken').text(postdata.token);
							}
							if( postdata.type == 'key' ){
								$('#kfkey').text(postdata.key);
							}
		                }else{
		                    self.$Message.error(res.res);
		                }
		            },true);
                }

                if( $(e.target).attr('name') == 'submit' ){
                	var postdata = {op:'saveset'};
					var data = $('form').serializeArray();
					for (var i = 0; i < data.length; i++) {
						if( data[i].name.indexOf('[]') > 0 ){
							var key = data[i].name.split("[]");
							if( !postdata[key[0]] ) postdata[key[0]] = [];
							postdata[key[0]].push(data[i].value);
						}else{
							postdata[data[i].name] = data[i].value;
						}
						
 					}

					self.$util.http('website','POST',postdata,function(resa){
						if( resa.status == 200 ){
							self.$Message.success('已保存');
							self.$emit('loadmessage',{type:'initwebmenu'});
							self.initdat();
						}else{
							if( resa.res ) self.$Message.error(resa.res);
						}
						return false;
					},true,false);
					return false;
                }
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            uploadmethod(e){
                this.uptarget.parent().prev().val(e.attachment);
                this.uptarget.parent().parent().next().show().find('img').attr('src',e.url);
            }
	  	}
  	}


	$('body').on('click','input[name="submit"]',function(e){
		e.preventDefault();
	});


	$('body').on('click','.js_top',function(){

		if( $(this).parents('.setting-tab').length > 0 ){
			$('.form-row').show();
			$('input[name="sssskey"]').val('');
		}

		$('.js_top').removeClass('selected');
		var thisclass = $(this).attr('showme');
		$(this).addClass('selected');

		sessionStorage.setItem("setjs", thisclass); 

		$('.settings_group').each(function(){
			if($(this).hasClass(thisclass)){
				$(this).show();
			}else{
				$(this).hide();
			}
		})
	});


	$('body').on('click','.hide_item',function(){
		var elem = $(this).attr('hideitem');
		if( elem ){
			var arr = elem.split(",");
			for (var i = 0; i < arr.length; i++) {
				$(arr[i]).hide();
			}
		}
	});
	$('body').on('click','.show_item',function(){
		var elem = $(this).attr('showitem');
		if( elem ){
			var arr = elem.split(",");
			for (var i = 0; i < arr.length; i++) {
				$(arr[i]).show();
			}
		}
	});

	$('body').on('click','.input-group .close',function(){
		$(this).prev().attr('src','').parent().hide();
		$(this).parent().prev().find('input').val('');
	})

	//秒杀
	$('body').on('click','.addkill',function(){
		var str = '<div class="edit_item">'
		                +'每天<esui-text-box class="ui-ctrl ui-textbox">'
		                   +' <input type="text" class="input_100" name="kills[]" value="">'
		                +'</esui-text-box> 时开始限时秒杀'
		                +' <a href="javascript:;" class="deleteedititem">删除</a>'
		            +'</div>';
		$('.kill_edit_box').append(str);

	});

	$('body').on('click','.deleteedititem',function(){
		$(this).parents('.edit_item').remove();
	});

	$('body').on('click','#addmitem',function(){
		var html = '<div class="addmitem">'
                        +'每次充值满 '
                        +'<esui-text-box class="ui-ctrl ui-textbox ">'
                            +'<input class="input_100" type="text" name="umadd[]" value="">'
                        +'</esui-text-box>, '
                        +'赠送 '
                        +'<esui-text-box class="ui-ctrl ui-textbox ">'
                            +'<input class="input_100" type="text" name="umaddm[]" value="">'
                        +'</esui-text-box> '
                        +'<a href="javascript:;" class="delmm">删除</a>'
                    +'</div>'
		$('.addmitem_box').append(html);
	});

	$('body').on('click','.delmm',function(){
		$(this).parent().remove();
	})
	$('body').on('click','.edit_bot',function(){
		$(this).next().show();
	})
	$('body').on('click','.ui-table-editor-cancel',function(){
		$(this).parents('.dropdown_data_list').hide();
	})

	$('body').on('input propertychange','input[name="sssskey"]',function(){
		var value = $(this).val();

		if( value != '' ){
			$('.form-row,.tbar').hide();
			$('.needshow').show();
			$('.form-row').each(function(){
				var name = $(this).find('label').text();
				var tip = $(this).find('.note').text();
				var key = $(this).attr('key');
				key = key ? key : '';
				if( name.indexOf(value) != -1 || tip.indexOf(value) != -1 || key.indexOf(value) != -1 ){
					$(this).show();
					
					if( $(this).find('.show_item').length > 0 ){
						var showitem = $(this).find('.show_item:first').attr('showitem');
						if( showitem ){
							$(showitem).find('.form-row').show();
						}
					}
				}
			})
			$('.settings_group').show();
		}else{
			$('.settings_group').hide();
			$('.search_group,.tbar').show();
		}
	})

	$('body').on('click','.ui-select-out .ui-select',function(){

		var _this = $(this);
		if( _this.hasClass('ui-select-active') ){

			_this.removeClass('ui-select-active');
			_this.next().hide();
		}else{
			$('.ui-select-out .ui-select').each(function(){
				$(this).removeClass('ui-select-active');
				$(this).next().hide();
			});

			_this.addClass('ui-select-active');
			_this.next().show();
		}

	});

	$('body').on('click','.ui-select-out .ui-select-item',function(){
		var _this = $(this);
		var v = $.trim( _this.attr('data-value') );
		var name = $.trim( _this.find('span').text() );
		_this.parents('.ui-select-out').find('input.ui-select-input').val( v );
		if( name != '' && typeof name != 'undefined' ) _this.parents('.ui-select-out').find('.ui-select-text').text( name );
		
		_this.siblings().removeClass('ui-select-item-selected');
		_this.addClass('ui-select-item-selected');

		$('.ui-select-out .ui-select').each(function(){
			$(this).removeClass('ui-select-active');
			$(this).next().hide();
		});

		var mid = _this.attr('mid') * 1;
		if( mid > 0 ){
			_this.parents('.ui-select-out').next().find('.ui-select-item').hide();
			_this.parents('.ui-select-out').next().find('.ui-select-item[pid="'+mid+'"]').show();
		}
	});

	$('body').on('click','#addshopitem',function(){	
		var html = '<div class="addshopitem">'
                    +'时间 '
                    +'<esui-text-box class="ui-ctrl ui-textbox ">'
                        +'<input class="input_100" type="text" name="fgbbb[]" value="">'
                    +'</esui-text-box> 月,'
                    +'需支付 '
                    +'<esui-text-box class="ui-ctrl ui-textbox ">'
                        +'<input class="input_100" type="text" name="khnv[]" value="">'
                    +'</esui-text-box>元，'
                    +' 代理提成 '
                    +'<esui-text-box class="ui-ctrl ui-textbox ">'
                        +'<input class="input_100" type="text" name="outgs[]" value="">'
                    +'</esui-text-box>元。'
                    +'<a href="javascript:;" class="delmm"> 删除</a>'
                +'</div>'
		$('.addshopitem_box').append(html);
	});
	

</script>

<style type="text/css" >
.settingindex .ui-tab {
	overflow: hidden;
	background-color: #FFF;
	-webkit-border-radius: 0;
	-moz-border-radius: 0;
	border-radius: 0
}

.settingindex .ui-tab .ui-tab-content {
	padding: 20px
}

.settingindex .ui-tab-navigator {
	height: 50px;
	font-size: 16px;
	list-style: none;
	font-weight: normal;
	background-color: #fff;
	border-bottom: 1px solid #e8ebee;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	-ms-box-sizing: border-box;
	box-sizing: border-box;
	display: block
}

.settingindex .ui-tab-navigator:after {
	content: ".";
	display: block;
	height: 0;
	clear: both;
	visibility: hidden
}

.settingindex .ui-tab-navigator:after {
	content: ".";
	display: block;
	height: 0;
	clear: both;
	visibility: hidden
}

.settingindex .ui-tab-navigator:after {
	content: ".";
	display: block;
	height: 0;
	clear: both;
	visibility: hidden
}

.settingindex .ui-tab-item {
	float: left;
	height: 50px;
	min-width: 70px;
	padding: 0 10px;
	text-align: center;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	-ms-box-sizing: border-box;
	box-sizing: border-box;
	-webkit-border-radius: 0;
	-moz-border-radius: 0;
	border-radius: 0;
	cursor: pointer;
	-webkit-transition: background, color 0.3s;
	-moz-transition: background, color 0.3s;
	-ms-transition: background, color 0.3s;
	-o-transition: background, color 0.3s;
	transition: background, color 0.3s;
	-moz-transition: background color .3s;
	-webkit-transition: background color .3s;
	transition: background color .3s
}

.settingindex .ui-tab-item span,.ui-tab-item a {
	color: #666;
	line-height: 50px;
	text-align: center;
	display: inline-block;
	-webkit-transition: background, color 0.3s;
	-moz-transition: background, color 0.3s;
	-ms-transition: background, color 0.3s;
	-o-transition: background, color 0.3s;
	transition: background, color 0.3s;
	-moz-transition: background color .3s;
	-webkit-transition: background color .3s;
	transition: background color .3s
}

.settingindex .ui-tab-item span:visited,.ui-tab-item a:visited,.ui-tab-item span:active,.ui-tab-item a:active {
	color: #666
}

.settingindex .ui-tab-item span:hover,.ui-tab-item a:hover {
	color: #108cee
}

.settingindex .ui-tab-item-active {
	cursor: default;
	position: relative;
	border-bottom: 2px solid #108cee
}
.settingindex .ui-tab-item.selected {
    cursor: default;
    position: relative;
    border-bottom: 2px solid #108cee;
}
.settingindex .settings_group {
    display: none;
    margin-top: 35px;
}
.settingindex .settings_group:nth-of-type(1) {
    display: block;
}
.settingindex .main-wrap-new .form-row {
    margin: 0 0 20px;
}
.settingindex .form-row>label {
    float: left;
    display: inline-block;
    zoom: 1;
    width: 150px;
    height: 30px;
    line-height: 1.4;
    color: #666;
}
.settingindex .form-value {
    margin-left: 160px;
    padding: 0;
}
.settingindex .form-row {
    margin: 0 0 20px;
}
.settingindex .btn, .settingindex .ui-button, .settingindex .ui-numbertextline .ui-button {
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    color: rgb(16, 140, 238);
    background-color: rgb(234, 246, 254);
    font-family: 'Microsoft Yahei', 微软雅黑, Tahoma, Arial, Helvetica, STHeiti;
    -webkit-user-select: none;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
    box-sizing: content-box;
    border: none;
    outline: none;
    padding: 0px 12px;
    overflow: hidden;
    border-radius: 0px;
    transition: all 0.3s;
}
.settingindex .btn-primary, .settingindex .skin-ok-button, .settingindex .skin-create-button, .skin-primary-button, .settingindex .ui-numbertextline .ui-button, .settingindex .ui-dialog-ok-btn {
    color: #fff;
    background-color: #108cee;
}

.settingindex .ui-textbox input, .settingindex .ui-textbox textarea {
    width: 200px;
    font-size: 12px;
    background: #FFF;
    vertical-align: middle;
    color: #333;
    border: 1px solid #ccc;
    height: 28px;
    padding: 0 10px;
    line-height: 28px;
    font-family: 'Microsoft Yahei',Arial,Helvetica,sans-serif;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    -ms-box-sizing: content-box;
    box-sizing: content-box;
}
.ui-boxgroup-horizontal label {
    display: inline-block;
    zoom: 1;
    margin-right: 30px;
}
.ui-radio, .ui-checkbox, .ui-boxgroup-checkbox, .ui-boxgroup-radio {
    vertical-align: middle;
}
.settingindex input[type=radio] {
    position: relative;
    margin: 0;
    padding: 0;
    width: 14px;
    height: 14px;
    outline: none;
    cursor: pointer;
    vertical-align: -2px;
    border: 1px solid #108cee;
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-border-radius: 7px;
    -moz-border-radius: 7px;
    border-radius: 7px;
}
.ui-radio input, .ui-checkbox input, .ui-boxgroup-checkbox input, .ui-boxgroup-radio input {
    margin: 0 5px 0 0;
    vertical-align: middle;
}
.settingindex input[type=radio]:checked:before {
    background-color: #108cee;
}
.settingindex input[type=radio]:before {
    top: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    content: '';
    position: absolute;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
    -moz-transition: all .3s;
    -webkit-transition: all .3s;
    transition: all .3s;
}
.settingindex .mb05{
	margin-bottom: 5px;
}
.settingindex .input_100{
	width:100px!important;
}
.settingindex .input_200{
	width:200px!important;
}
.settingindex .ui-textbox textarea {
    width: 300px;
    height: 100px;
    overflow: auto;
    resize: none;
}
.settingindex .hideitem {
	display: none;
}
.settingindex .single_img_upload .form-control{
	height:30px;
	float: left;
	width:250px;
	border: 1px solid #ccc;
}
.settingindex .addmitem,.settingindex .addshopitem, .settingindex .edit_item{
	margin-bottom: 5px;
}
.single_img_upload .input-group{
	position: relative;

}
.settingindex .form-value .input-group {
    display: inline-block;
    position: relative;
    display: table;
    border-collapse: separate;
}
.settingindex .form-value .input-group .close{
	cursor: pointer;
}
.settingindex .ui-table-editor {
    background: #FFF;
    border: 1px solid #C7C7C7;
    padding: 20px;
    -moz-box-shadow: ;
    -webkit-box-shadow: ;
    box-shadow: ;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 1px 1px 8px rgba(0,0,0,0.2);
    -webkit-box-shadow: 1px 1px 8px rgba(0,0,0,0.2);
    box-shadow: 1px 1px 8px rgba(0,0,0,0.2);
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    position: absolute;
    right: 0;
    display: none;
    z-index: 5;
}
.settingindex .ui-table-editor-opt {
    overflow: hidden;
    zoom: 1;
}
.settingindex .ui-table-editor-opt{
	width:200px;
}
.settingindex .edit_table_item {
	position: relative;
}

.settingindex .ui-select, .ui-selectex, .ui-multiselect {
    height: 30px;
    outline: none;
    font-size: 12px;
    min-width: 100px;
    line-height: 30px;
    position: relative;
    padding: 0 30px 0 10px;
    vertical-align: middle;
    color: #108cee;
    background-color: #eaf6fe;
    border: 1px solid #eaf6fe;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
    -moz-transition: all .3s;
    -webkit-transition: all .3s;
    transition: all .3s;
    cursor: pointer;
}
.settingindex .ui-select-layer {
    text-align: left;
    font-size: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 156px;
    background-color: #FFF;
    padding: 4px 0;
    position: absolute;
    z-index: 1002;
    border-left: 1px solid #eaf6fe;
    border-right: 1px solid #eaf6fe;
    border-bottom: 1px solid #eaf6fe;
    -moz-box-shadow: ;
    -webkit-box-shadow: ;
    box-shadow: ;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 1px 1px 8px rgba(0,0,0,0.2);
    -webkit-box-shadow: 1px 1px 8px rgba(0,0,0,0.2);
    box-shadow: 1px 1px 8px rgba(0,0,0,0.2);
    padding: 0;
    margin: 0;
    list-style: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
}
.settingindex .ui-select-out .ui-layer {
    left: 0;
    top: 30px;
    width: 100%;
    display: none;
}
.settingindex .input_300{
	width: 300px!important;
}
.settingindex .ui-select-item, .ui-selectex-item {
    padding: 0 10px;
    line-height: 30px;
    color: #333;
    cursor: pointer;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
    -moz-transition: all .3s;
    -webkit-transition: all .3s;
    transition: all .3s;
}
.settingindex .ui-select-item span, .ui-selectex-item span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
}
.settingindex .ui-select:after, .ui-selectex:after, .ui-multiselect:after {
    right: 10px;
    top:11px;
    content: '\e605';
    position: absolute;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
    -moz-transition: all .3s;
    -webkit-transition: all .3s;
    transition: all .3s;
	font-size: 0;
	line-height: 0;
	border-width: 6px;
	border-color: #666;
	border-bottom-width: 0;
	border-style: dashed;
	border-top-style: solid;
	border-left-color: transparent;
	border-right-color: transparent;
}
.settingindex .ui-layer {
    position: absolute;
}
.settingindex .ui-select-out {
    position: relative;
}
</style>