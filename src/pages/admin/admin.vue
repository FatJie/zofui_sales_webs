<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Dropdown trigger="click"  placement="bottom-start" style="margin-bottom: 10px">
            <a href="javascript:void(0)" @click="handleOpen">
                <Button type="primary">
                    添加管理员
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
            </a>
            <DropdownMenu slot="list">
                <div style="padding:10px">
                    <Input v-model="adminuid" placeholder="输入用户ID" />
                    <p>提示：按ID添加无法接收到公众号通知消息</p>
                </div>
                <div style="text-align: right;margin:10px;">
                    <Button type="primary" size="small" @click="addadmin">确定</Button>
                </div>
            </DropdownMenu>
        </Dropdown>

        <Dropdown trigger="click" placement="bottom-start" style="margin-bottom: 10px">
            <a href="javascript:void(0)" @click="handleOpenqr">
                <Button type="primary">
                    扫码添加
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
            </a>
            <DropdownMenu slot="list">
                <p style="padding:10px">
                    <Card style="width:100%;margin:0 5px;">
                        <div style="text-align:center">
                            <img style="width:200px;" :src="bindurl+'&t='+rand">
                            <h3>扫上方二维码绑定管理员</h3>
                            <Button @click="upqr" size="small">更新二维码</Button>
                        </div>
                    </Card>
                    <Card style="width:100%;margin:0 5px;margin-top:10px;" v-if="settings.subtip">
                        <div style="text-align:center">
                            <img style="width:200px;" :src="data.subqr">
                            <h3>{{settings.subtip}}</h3>
                        </div>
                    </Card>
                </p>
            </DropdownMenu>
        </Dropdown>        

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="head">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.user.headimg" />
                    </template>
                    <template slot-scope="{ row }" slot="nickname">
                        {{row.user.nickname}}（{{row.user.id}}）
                    </template>
                    <template slot-scope="{ row }" slot="hxname">

                        <Input placeholder="输入名称" size="small" v-model="row.user.hxname" style="width: auto" >
                            <Button size="small" slot="append" icon="md-cloud-upload" @click="savename(row.user.id,row.user.hxname)"></Button>
                        </Input>
                        
                    </template>
                    <template slot-scope="{ row }" slot="type">
                        {{row.level == 0 ? '普通管理员' : '超级管理员'}}
                    </template>
                    <template slot-scope="{ row }" slot="auth">

                        <template v-if="row.level == 0">
                            <Checkbox @on-change="changeauth(row,'hxorder')"  :value="row.auth.hxorder == 1 ? false : true">{{settings.hxbname}}订单</Checkbox>
                            <Checkbox @on-change="changeauth(row,'hxcard')" :value="row.auth.hxcard == 1 ? false : true">{{settings.hxbname}}卡券</Checkbox>
                            <Checkbox @on-change="changeauth(row,'login')" :value="row.auth.login == 1 ? false : true">登录商户中心</Checkbox>
                            <Checkbox @on-change="changeauth(row,'omess')" :value="row.auth.omess == 1 ? false : true">接收订单消息</Checkbox>
                            <Checkbox @on-change="changeauth(row,'kfmess')" :value="row.auth.kfmess == 1 ? false : true">接收客服消息</Checkbox>
                            <Checkbox @on-change="changeauth(row,'admin')" :value="row.auth.admin == 1 ? true : false">管理核销员</Checkbox>
                        </template>
                        <template v-else>
                            所有权限
                        </template>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">

                        <!--<a href="javascript:;" @click="edit(row)" v-if="row.level == 0">设为超管</a>-->
                        <Poptip
                            confirm
                            title="确定删除此条数据吗？"
                            @on-ok="remove(row.id)"
                            placement="left">
                            <a v-if="row.level == 0">删除</a>
                        </Poptip>
                        
                    </template>
                </Table>
                <Alert type="error" style="margin-top:20px;">提示：管理员可在前端进商户中心，超级管理员可提现到账（超级管理员只能设置一个）</Alert>
            </Col>
        </Row>

    </div>
</template>

<script type="text/javascript">
    
	export default {
        name : 'settingadmin',
	  	components: {

	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			list : [],
	  			pagedata : [],
	  			datalist : [],
                locname : '',
                showloc : false,
                isonbottom : false,
	  			page : {
	  				pdata : {
	  					doo : 'index',
	  					op : 'list',
	  					page : 1,
	  					style : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : true,
	  			},
                columns : [
                    {type: 'selection'},
                    {title:'ID',key:'id'},
                    {title:'微信头像',key:"headimg",slot: 'head',},
                    {title:'微信昵称',key:'nickname',slot:'nickname'},
                    {title: (this.settings.hxbname?this.settings.hxbname:'') +'别名',key:'hxname',slot:'hxname'},
                    {title:'权限',key:'auth',slot: 'auth',},
                    {title:'类型',key:'type',slot: 'type',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                visible : false,
                visibleqr : false,
                adminuid : '',
                data : {},
                bindurl : '',
                rand : 1,
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            upqr(){
                this.rand = Date.parse(new Date())/1000;
            },
            handleOpen(){
                this.visible = true;
            },
            handleOpenqr(){
                this.visibleqr = true;
            },
            handleClose(){
                this.visible = false;
                this.visibleqr = false;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            savename(e,name){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'bindchange',
                    type : 'hxname',
                    fromajax : 1,
                    id : e,
                    value : name,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已设置');
                        self.initData();
                    }else{
                        self.$Message.success(res.res);
                    }
                },true);
            },
            edit(row){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'tosuper',
                    fromajax : 1,
                    id : row.id,
                }
                self.$util.http('set','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已设置');
                        self.initData();
                    }else{
                        self.$Message.success(res.res);
                    }
                });
            },
            changeauth(row,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'adminauth',
                    fromajax : 1,
                    id : row.id,
                    type : type,
                    is : row.auth[`${type}`]*1 == 1 ? 0 : 1,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                    }else{
                        self.$Message.error(res.res);
                    }
                });
            },
            addadmin(){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'editadmin',
                    fromajax : 1,
                    uid : self.adminuid,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.$Message.success('已添加');
                        self.initData();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            remove(e){
                var self = this;
                var postdata = {
                    op : 'deleteadmin',
                    fromajax : 1,
                    id : e,
                }
                self.$util.http('setting','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.$Message.success(res.res);
                        for (var i = 0; i < self.list.length; i++) {
                            if(self.list[i].id == e){

                                self.list.splice(i,1);
                                self.list = self.list;
                            }
                        }
                        

                    }else{
                        self.$Message.error(res.res);
                    }
                    
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                var postdata = {
                    p:'admin',
                    op : 'bind',
                    fromajax : 1,
                }
                self.$util.http('set','GET',postdata,function(res){
                    if( res.status == 200 ){
                        

                        self.loading = false;
                        self.list = res.obj.alladmin;
                        self.bindurl = res.obj.bindurl;
                    }else{
                        self.$Message.error(res.message);
                    }

                    

                });
            },
	  		onLoad() {
	  			var self = this;
                if( !self.isonbottom ){
                    self.page.doing = false;
                    return false;
                } 
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>