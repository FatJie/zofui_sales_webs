<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs v-model="page.pdata.type" @on-click="changetype">
            <TabPane label="商户提现" name="0"></TabPane>
            <TabPane label="用户提现" name="1"></TabPane>
        </Tabs>

        <Row style="margin-bottom:10px;">
            <Col span="24">

                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" :placeholder="'输入'+ (page.pdata.type == 0 ? '商户' : '用户') +'ID'" class="mb5 w150" />
            </Col>
        </Row>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="goods">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.goods.thumb" />
                        <p>{{row.goods.title}}</p>
                        
                    </template>
                    <template slot-scope="{ row }" slot="user">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.user.headimg" />
                        <p>{{row.user.nickname}}</p>

                        <div v-if="row.shopid > 0">
                            商户：{{row.shopname}}（{{row.shopid}}）
                        </div>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <div>
                            <p>银行卡号：</p>
                            <p>{{row.card_num}}</p>
                            <p>开户行：</p>
                            <p>{{row.bank_account}}</p>
                            <p>持卡人：</p>
                            <p>{{row.name}}</p>
                            <p>手机号：</p>
                            <p>{{row.phone}}</p>
                        </div>
                    </template>

                    <template slot-scope="{ row }" slot="type"> 
                        <p>
                            {{row.type == 1 ? '商户提现' : ''}}
                            {{row.type == 2 ? '会员提现' : ''}}
                        </p>
                    </template>
                    <template slot-scope="{ row }" slot="status"> 
                        <p>
                            <p v-if="row.status == 0">待支付</p>
                            <div v-if="row.status == 1">
                                已支付
                                <p class="font_mini">{{row.payno}}</p>
                            </div>
                            <div v-if="row.status == 2">
                                已退回
                                <p class="font_mini">{{row.backreason}}</p>
                            </div>
                            <div v-if="row.status == 3">
                                已拒绝
                                <p class="font_mini">{{row.refusereason}}</p>
                            </div>
                        </p>
                    </template>
                    
                    <template slot-scope="{ row, index }" slot="action">
                        
                        <Poptip
                            confirm
                            title="确定删除吗？"
                            @on-ok="dealthis(row.id,'delete')"
                            placement="left">
                            <a>删除</a>
                        </Poptip>
                        
                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                修改提现进度
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="tixians" placeholder=""/>
                                    <p class="frm_tip">0：待支付；1：已支付；2：已退回；3：已拒绝；</p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="tixian(row.id)">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>

                    </template>
                </Table>
                
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
                tixians:'',
                loading : false,
	  			params : {},
                isall : false,
	  			list : [],
	  			allsort : [],
                total : 0,
                data : {},
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'编号',key:'id'},
                    {title:'提现人',key:'user',slot: 'user',},
                    {title:'提现金额',key:"money"},
                    {title:'服务费',key:"sever"},
                    {title:'提现时间',key:"showtime"},
                    {title:'收款账户',key:"data",slot: 'data',},
                    {title:'类型',key:"type",slot: 'type',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'money',
                        op : 'bank',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        type : 0,
                        uid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                allsort : [],
                alltwosort : [],
                selected : [],
                money : '',
                data : {},
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            tixian(id){
                var postdata = {
                    op:'tixian',
                    tixian:this.tixians,
                    id:id
                }
                this.$util.http('money','GET',postdata,(res)=>{
                    if( res.type == 'success' ){
                        this.$Message.success(res.message);
                        this.onLoad();
                    }else{
                        this.$Message.error(res.message);
                    }
                },true);
            },
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('money','GET',postdata,function(res){
                    if( res.type == 'success' ){
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
                    id : id,
                    value : this.money,
                }
                if( type == 'backfee' ){
                    postdata.oid = id;
                    postdata.fee = this.money;
                }
                if( type == 'changemoneyuser' ){
                    postdata.type = 'user';
                }
                if( type == 'testmess' ){
                    postdata.uid = id;
                    postdata.mess = this.money;
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.money = 0;
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
                self.$util.http('money','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            changedate(e){
                this.sdate = {start:e[0],end:e[1]};
            },
            searchdate(e){
                if( this.sdate ){
                    this.page.pdata.time = this.sdate;
                }
                this.onLoad();
            },
            changetype(){
                this.page.pdata.time = '';
                this.onLoad();
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
                    self.page.pdata.userid = params.id;
                }
                
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