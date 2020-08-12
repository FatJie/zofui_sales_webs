<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" class="mb5 w150">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选推荐" @on-change="shaixuan($event,'isshow')" class="mb5 w150">
                    <Option v-for="item in show" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.nick" @on-enter="search" @on-click="search" placeholder="输入用户昵称" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.shopid" @on-enter="search" @on-click="search" placeholder="输入店铺ID" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="商品ID" class="mb5 w150" />
            </Col>
        </Row>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="goods">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.good.thumb" />
                        <p>{{row.good.title}}</p>
                        
                    </template>

                    <template slot-scope="{ row }" slot="user">
                        <p>{{row.user.nickname}}</p>
                        <p >{{row.tel}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <p>订单金额：{{row.fee}}</p>
                        <p>收入金额：{{row.shopfee}}</p>
                        <p>服务费用：{{row.sever}}</p>
                        
                        <p v-if="row.fanxianm > 0">返现金额：{{row.fanxianm}}</p>
                        
                        <p v-if="row.jifendis > 0">{{settings.jfbname}}抵扣：{{row.jifendis}}</p>
                        
                        <p v-if="row.jifen > 0">返现{{settings.jfbname}}：{{row.jifen}}</p>
                        
                        <p v-if="row.salerfee+row.salerfeea+row.salerfeeb > 0">{{settings.fxbname}}支出：{{row.salerfee+row.salerfeea+row.salerfeeb}}
                        </p>
                        

                        <p v-if="row.ptsalerfee+row.ptsalerfeea+row.ptsalerfeeb > 0">
                            平台{{settings.fxbname}}：{{row.ptsalerfee+row.ptsalerfeea+row.ptsalerfeeb}}
                        </p>

                        <p>下单数量：{{row.num}}</p>
                        <p>
                            支付方式：
                            {{!row.paytype || row.paytype == 0 ? '微信' : ''}}
                            {{row.paytype == 1 ? '余额' : ''}}
                            {{row.paytype == 2 ? '到店支付' : ''}}
                        </p>

                        <template v-if="row.agentfee > 0">
                            <p>{{settings.agentname}}：{{row.agent.nickname}}</p>
                            <p>分成：{{row.agentfee}}</p>
                        </template>
                        
                        <p v-if="row.rule">规格：{{row.rule}}</p>
                        
                        <p v-if="row.pakfee > 0">打包费：{{row.pakfee}}</p>
                        
                        <p v-if="row.expfee > 0">配送费：{{row.expfee}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="shop">
                        {{row.shop.name}}
                    </template>

                    <template slot-scope="{ row }" slot="content">
                        <div>星级:{{row.star <= 0 ? 5 : row.star}}</div>
                        <p>{{row.content}}</p>
                        <div>
                            <Avatar style="margin:0 5px 5px 0" v-for="(item,index) in row.img" icon="ios-person" size="large" shape="square" :src="item" />
                        </div>
                    </template>

                    <template slot-scope="{ row }" slot="status">
                        
                        <p v-if="row.status == 0">正常</p>
                        <p class="font-error" v-if="row.status == 1">隐藏</p> 

                        <p class="font-error" v-if="row.isshow == 1">推荐好评</p> 
                            
                    </template>
                    

                    <template slot-scope="{ row, index }" slot="action">
                        
                        <a @click="link" :data-url="'ordereditcomment?id='+row.id" >编辑</a>
                        
                        <Poptip
                            confirm
                            title="确定删除吗？"
                            @on-ok="dealthis(row.id,'deleteco')"
                            placement="left">
                            <a>删除</a>
                        </Poptip>

                        <div>
                            <a  @click="link" :data-url="'orderlist?orderid='+row.orderid" >查看订单</a>
                            <Poptip
                                v-if="row.isshow == 0"
                                confirm
                                title="确定推荐吗？"
                                @on-ok="dealthis(row.id,'tui')"
                                placement="left">
                                <a>推荐好评</a>
                            </Poptip>
                            <Poptip
                                v-if="row.isshow == 1"
                                confirm
                                title="确定推荐吗？"
                                @on-ok="dealthis(row.id,'cancel')"
                                placement="left">
                                <a>取消推荐</a>
                            </Poptip>
                        </div>
                        
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
                        <DropdownItem name="deleteallco">删除数据</DropdownItem>
                        <DropdownItem name="hideco">隐藏评价</DropdownItem>
                        <DropdownItem name="showco">显示评价</DropdownItem>
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
        props : ['settings','set','type'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			list : [],
	  			allsort : [],
                total : 0,
                data : {},
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id'},
                    {title:'商品',key:'goods',slot: 'goods',},
                    {title:'用户',key:"user",slot: 'user',},
                    {title:'商户',key:"shop",slot: 'shop',},
                    {title:'内容',key:'content',slot: 'content',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [
                    {label:'已显示',value:1},
                    {label:'已隐藏',value:2},
                ],
                show : [
                    {label:'已经推荐',value:1},
                    {label:'还未推荐',value:2},
                ],
                page : {
                    pdata : {
                        doo : 'order',
                        op : 'comment',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
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
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('order','GET',postdata,function(res){
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
                self.$util.http('order','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            down(){
                let url = this.$util.Murl('order','list') + '&down=1';
                for(var t in this.page.pdata){
                    if( t != 'fromajax' && t != 'page' && t != 'pnum' ){
                        url += '&'+t+'='+this.page.pdata[t]
                    }
                }
                location.href = url;
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
            cleartime(){
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
                if( this.type == 1 ){
                    self.page.pdata.isshow = 1;
                }
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
                        self.total = res.obj.total;
                        self.data = res.obj.data;
                        
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
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>