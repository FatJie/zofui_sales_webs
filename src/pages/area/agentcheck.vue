<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="user">
                        {{row.user ? row.user.nickname : ''}}
                    </template>
                    <template slot-scope="{ row }" slot="headimg">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.user.headimg" />
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">待审核</p>
                        <p class="font-error" v-if="row.status == 1">已审核</p>
                        <p class="font-error" v-if="row.status == 2">未通过</p>

                    </template>
                    <template slot-scope="{ row }" slot="agent">
                        {{row.agent ? row.agent.nickname : ''}}
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        {{row.showtime}}
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'userlist?id='+row.uid"  >查看账户资料</a>
                        </p>
                        <div v-if="row.status == 0">
                            <Dropdown placement="left"  stop-propagation trigger="click">
                                <a href="javascript:void(0)">
                                    不通过
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="money" placeholder="输入原因" />
                                        <p>输入原因</p>
                                    </div>

                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'verifynopass')">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
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
                        <DropdownItem name="deletealla">删除数据</DropdownItem>
                        <DropdownItem name="pass">通过审核</DropdownItem>
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
                uploadurl : '',
                isall : false,
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:100},
                    {title:'ID',key:'id',width:100},
                    {title:'昵称',key:"user",slot:'user'},
                    {title:'头像',key:"headimg",slot:'headimg'},
                    {title:'姓名',key:"name",},
                    {title:'电话',key:'tel'},
                    {title:'地址',key:'address'},
                    {title:'提交时间',key:'time',slot: 'time',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'待审核',value:1},{label:'已审核',value:2},{label:'未通过',value:3}],
                page : {
                    pdata : {
                        doo : 'agent',
                        op : 'cut',
                        p:'area',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        status : 0,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                showadd : false,
                selected : [],
                sort: {},
                money : '',
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	activated:function(e){},
	  	methods: {
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            toaddshop(id){
                var self = this;
                this.$router.push('shopadd?joinid='+id);
            },
            uploadend(e){
                if( e.attachment ){
                    this.$set(this.sort,'img',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
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
            editmoney(id,type){
                var self = this;
                var postdata = {
                    op : 'verifynopass',
                    fromajax : 1,
                    uid : id,
                    reason : this.money,
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
            selectTable(e,a){
                var arr = [];
                for (var i = 0; i < e.length; i++) {
                    arr.push(e[i].id);
                }
                this.selected = arr;
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
                self.$util.http('agent','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            edit(e){
                this.sort = e;
                this.showadd = true;
            },
            addsort(){
                this.sort = {};
                this.showadd = true;
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