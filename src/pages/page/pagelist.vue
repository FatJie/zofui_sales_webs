<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        <Button @click="link" type="primary" data-url="pageindex?id=-1">添加页面</Button>
        <Row class="mt10">
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="type">

                        <p v-if="row.isindex == 1" class="font-error">首页</p>
                        <p v-else-if="row.type == 8" class="font-error">个人中心{{row.status == 1 ?'（已停用）':''}}</p>
                        <p v-else>专题页面</p>
                    </template>
                    
                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            
                            <a @click="link" :data-url=" row.type == 8 ? '/pageuser' : '/pageindex?id='+row.id" >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'delpage')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                            <Poptip
                                v-if="row.type == 8"
                                confirm
                                :title="row.status == 0 ? '停用后使用默认的个人中心，确定停用吗？' : '确定使用吗？'"
                                @on-ok="editmoney(row.id,'stopuser')"
                                placement="left">
                                <a>{{row.status == 0 ? '停用页面' : '用作个人中心'}}</a>
                            </Poptip>
                            <Poptip
                                v-if="row.type != 8"
                                confirm
                                title="确定复制此页面吗？"
                                @on-ok="editmoney(row.id,'copypage')"
                                placement="left">
                                <a>复制页面</a>
                            </Poptip>
                        </p>
                        <p v-if="row.type != 8">
                            <a @click="dealthis(row.id,'toindex')" >设为首页</a>

                            <Dropdown  placement="left" trigger="click">
                                <a href="javascript:void(0)">
                                    修改名称
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="row.name" placeholder="" />
                                        <p class="frm_tip"></p>
                                    </div>

                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'editvalue',row.name)">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>

                        </p>
                        <div v-if="row.type != 8">
                            

                            <a v-if="settings.account && (settings.account.type == 4 || settings.account.type == 7)" href="javascript:;" :data-copy="'/zofui_sales/pages/page/page?id='+row.id" @click="bindtap($event,'copy')" >复制路径</a>
                            <a v-else href="javascript:;" :data-copy="row.appurl" @click="bindtap($event,'copy')"  >复制路径</a>

                            <Dropdown trigger="hover" transfer>
                                <a href="javascript:void(0)">
                                    二维码
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list" class="w200" style="padding:10px;height:auto;text-align:center;">
									<img class="actimg" :src="row.urlimg" width="150px" height="150px">
								</DropdownMenu>
                            </Dropdown>

                        </div>
                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>
    </div>
</template>

<script type="text/javascript">
	export default {
	  	components: {
            
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:'name'},
                    {title:'类型',key:"type",slot: 'type',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'page',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
                        orderby : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                selected : [],
                money : '',
                pass1 : '',
                pass2 : '',
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            to(e){
                var url = this.$util.Murl('page','addpage') + '&id='+e;
                window.open(url);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('page','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            editmoney(id,type,value){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                    value : value,
                    name : 'pagename',
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            dealselect(e){
                var self = this;

                if( this.selected.length <= 0 ){
                    self.$Message.error('还没选择操作的数据');return false;
                }

                var postdata = {
                    op : e,
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('page','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            selectTable(e,a){
                var arr = [];
                for (var i = 0; i < e.length; i++) {
                    arr.push(e[i].id);
                }
                this.selected = arr;
            },
            search(){
                this.onLoad();
            },
            shaixuan(e,type){
                this.page.pdata[`${type}`] = e;
				this.page.pdata.page = 1;
                this.onLoad();
            },
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
                        self.total = res.obj.total;
                    }
                });
            },
	  		onLoad() {
	  			var self = this;
                self.loading = true;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.obj ){
	                	self.list = res.obj.list;
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>