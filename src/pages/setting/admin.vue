<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <!-- <Dropdown trigger="click"  placement="bottom-start" style="margin-bottom: 10px">
            <a href="javascript:void(0)" @click="handleOpen">
                <Button type="primary">
                    添加管理员
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
            </a>
            <DropdownMenu slot="list">
                <p style="padding:10px">
                    <Input v-model="adminuid" placeholder="输入用户ID" />
                </p>
                <div style="text-align: right;margin:10px;">
                    <Button type="primary" size="small" @click="addadmin">确定</Button>
                </div>
            </DropdownMenu>
        </Dropdown> -->

        <Dropdown trigger="click" placement="bottom-start" style="margin-bottom: 10px">
            <a href="javascript:void(0)" @click="handleOpenqr">
                <Button type="primary">
                    扫码添加管理员
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
            </a>
            <DropdownMenu slot="list">
                <p style="padding:10px">
                    <Card style="width:100%;margin:0 5px;">
                        <div style="text-align:center">
                            <img style="width:200px;" :src="data.bindurl+'&t='+rand">
                            <h3 class="mb10">扫上方二维码绑定管理员</h3>
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
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.headimg" />
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="error" size="small" @click="remove(row.id)">删除</Button>
                    </template>
                </Table>
                <Alert type="error" style="margin-top:20px;">提示：管理员可在公众号内接收一些重要通知。目前通知有：入驻申请</Alert>
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
                    {title:'微信昵称',key:'nickname'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                visible : false,
                visibleqr : false,
                adminuid : '',
                data : {},
                rand : Date.parse(new Date())/1000,
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
            addadmin(){
                var self = this;
                var postdata = {
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
                    op : 'admin',
                    fromajax : 1,
                }
                self.$util.http('setting','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loading = false;
                        self.list = res.obj.alladmin;
                        self.data = res.obj.data;
                        
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