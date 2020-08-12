<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="redbaglist" @on-click="changetab">
            <TabPane label="红包列表" name="redbaglist" ></TabPane>
            <TabPane label="添加红包" name="redbagadd" ></TabPane>
            <TabPane label="领取记录" name="redbaglog" ></TabPane>
        </Tabs>
        <Row style="margin-bottom:10px;">
            <Col span="24">

                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.name" @on-enter="search" @on-click="search" placeholder="输入名称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.id" @on-enter="search" @on-click="search" placeholder="输入优惠券id" style="width: 150px" />
                
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="time">
                        <p>开始:{{row.showstart}}</p>
                        <p>结束:{{row.showend}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <p>面值：{{row.fee}}</p>
                        <p>使用：{{row.use}}</p>
                        <p>剩余：{{row.stock}}</p>
                    </template>
                    
                    <template slot-scope="{ row }" slot="status">
                        <p v-if="row.start > nowtime">
                            未开始
                        </p>
                        <p v-else-if="row.end < nowtime">
                            已过期
                        </p>
                        <p v-else-if="row.stock <= 0">
                            已领完
                        </p>
                        <p v-else>
                            正常
                        </p>

                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'redbagadd?id='+row.id"  >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'delete')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                        </p>
                        <p>
                            <a @click="link" :data-url="'redbaglog?id='+row.id"  >查看领取记录</a>
                        </p>
                        
                        <a v-if="settings.account && (settings.account.type == 4 || settings.account.type == 7)" href="javascript:;" :data-copy="'/zofui_sales/redbag/info?id='+row.id" @click="bindtap($event,'copy')" >复制路径</a>
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

                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                <Button @click="handleSelectAll">{{isall ? '取消' : '全选'}}</Button>
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteall">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
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
                isall : false,
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:'name'},
                    {title:'时间',key:"time",slot: 'time',},
                    {title:'数据',key:"data",slot: 'data',},
                    {title:'状态',key:'status',slot:'status'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'redbag',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        name : '',
                        id : '',
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
                status : [{label:'全部',value:0},{label:'未过期',value:1},{label:'已过期',value:2},],
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            changetab(e){
                this.$router.push(e);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('redbag','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            editmoney(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    sid : id,
                    value : this.money,
                }
                self.$util.http('redbag','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.money = 0;
                    }else{
                        if( res.res ) self.$Message.error(res.res);
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
                self.$util.http('redbag','GET',postdata,function(res){
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
				this.page.pdata.page = 1;
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
                        self.shopurl = res.obj.shopurl;
                    }
                });
            },
	  		onLoad() {
	  			var self = this;
                if( self.page.doing ){
                    return false;
                }
                self.loading = true;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.obj ){
	                	self.list = res.obj.list;
						self.total = res.obj.total;
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>