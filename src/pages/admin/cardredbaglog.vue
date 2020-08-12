<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="admincardredbaglog" @on-click="changetab">
            <TabPane label="优惠券列表" name="admincard" ></TabPane>
            <TabPane label="添加优惠券" name="admincardadd" ></TabPane>
            <TabPane label="领取记录" name="admincardlog" ></TabPane>
            <TabPane label="发红包记录" name="admincardredbaglog" ></TabPane>
        </Tabs>
        <Row style="margin-bottom:10px;">
            <Col span="24">

                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.cardid" @on-enter="search" @on-click="search" placeholder="输入优惠券id" style="width: 150px" />
                
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="card">
                        {{row.card.name}}（{{row.card.id}}）
                    </template>
                    <template slot-scope="{ row }" slot="user">
                        {{row.user.nickname}}（{{row.user.id}}）
                    </template>
                    <template slot-scope="{ row }" slot="fxuser">
                        {{row.fxuser.nickname}}（{{row.fxuser.id}}）
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        生成：{{row.showcreatetime}}
                        <p v-if="row.showpaytime">发放：{{row.showpaytime}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <template v-if="row.status == 0">
                            未发放
                        </template>
                        <template v-else-if="row.status == 1">
                            已发放
                        </template>
                        <template v-else-if="row.status == 2">
                            资金不足未发放
                        </template>
                        <P v-if="row.level == 2">上级佣金</P>
                        <p v-if="row.error" class="font-error">{{row.error}}</p>
                    </template>
                    

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'deleteredbag')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                            <Poptip
                                v-if="row.status == 2"
                                confirm
                                title="确定补发吗？"
                                @on-ok="dealthis(row.id,'bufaredbag')"
                                placement="left">
                                <a>补发</a>
                            </Poptip>
                        </p>
                        
                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteallredbag">删除数据</DropdownItem>
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
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'卡券',key:'card',slot:'card'},
                    {title:'使用卡券人',key:'user',slot: 'user',},
                    {title:'分享获得红包人',key:'fxuser',slot: 'fxuser',},
                    {title:'金额',key:"fee",},
                    {title:'时间',key:'time',slot: 'time',},
                    {title:'状态',key:"status",slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'card',
                        op : 'redbaglog',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        cardid : '',
                        uid : '',
                        status : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                selected : [],
                money : '',
                pass1 : '',
                pass2 : '',
                status : [{label:'全部',value:0},{label:'未发放',value:1},{label:'已发放',value:2},],
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('card','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            editmoney(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    sid : id,
                    value : this.money,
                }
                self.$util.http('card','GET',postdata,function(res){
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
                    p:'admin',
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('card','GET',postdata,function(res){
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
                if( params.id > 0 ){
                    this.page.pdata.cardid = params.id;
                }
                
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