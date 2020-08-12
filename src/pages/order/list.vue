<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select @on-change="shaixuan($event,'sortid')" placeholder="筛选分类" class="mb5 w150" >
                    <Option v-for="(item,index) in allsort" :value="item.name" :label="item.name" :key="index" >{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选子分类" @on-change="shaixuan($event,'sorttwo')" class="mb5 w150">
                    <Option v-for="(item,index) in alltwosort" :value="item.name" :label="item.name" :key="index">{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选配送方式" @on-change="shaixuan($event,'take')" class="mb5 w150">
                    <Option v-for="(item,index) in taketype" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选类型" @on-change="shaixuan($event,'type')" class="mb5 w150">
                    <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" class="mb5 w150">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="排序方式" @on-change="shaixuan($event,'orderby')" class="mb5 w150">
                    <Option v-for="item in otype" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <DatePicker confirm type="daterange" placement="bottom-end" placeholder="筛选时间" class="w150" @on-ok="searchdate" @on-change="changedate" @on-clear="cleartime"></DatePicker>
                
                <Input icon="ios-search" v-model="page.pdata.orderid" @on-enter="search" @on-click="search" placeholder="平台订单编号" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.uorderid" @on-enter="search" @on-click="search" placeholder="微信订单编号" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.nick" @on-enter="search" @on-click="search" placeholder="输入买家昵称" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.shopid" @on-enter="search" @on-click="search" placeholder="输入店铺ID" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="商品ID" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.code" @on-enter="search" @on-click="search" placeholder="输入核销码" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.tel" @on-enter="search" @on-click="search" placeholder="输入手机号" class="mb5 w150" />
                <Button type="primary" @click="down">导出订单</Button>
            </Col>
        </Row>
        
            <Card class=" mb10">
                <Row class="">
                    <Col span="6" class="tc">
                        <p>{{data.total}}</p>
                        <h3>订单数量</h3>
                    </Col>
                    <Col span="6" class="tc">
                        <p>{{data.totalfee}}</p>
                        <h3>订单总金额</h3>
                    </Col>
                    <Col span="6" class="tc">
                        <p>{{data.agentfee}}</p>
                        <h3>代理提成</h3>
                    </Col>
                    <Col span="6" class="tc">
                        <p>{{data.sever}}</p>
                        <h3>服务费用</h3>
                    </Col>
                </Row>
            </Card>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable" :loading="tableloading" :disabled-hover="true">


                    <template slot-scope="{ row }" slot="data">
                        <Card style="margin:10px;" :bordered="false">
                            <Row class="mb10" style="border-bottom:1px solid #eee;">
                                <Tag span="24" >
                                    <Avatar icon="ios-person" size="small" shape="square" :src="row.good.thumb" />
                                    {{row.good.title}}  
                                </Tag>
                                <Tag color="cyan" v-if="row.taketype == 1">
                                                还可以使用：{{row.hxtimes}}次
                                            </Tag>
                            </Row>
                            <Row class="mb10" style="border-bottom:1px solid #eee;">
                                <Col span="24" >
                                    商家名称：{{row.shopname}}，地区：{{row.cityname}}{{row.areaname}} &nbsp;&nbsp;&nbsp;&nbsp; 店铺ID:{{row.good.shopid}}，商品ID：{{row.good.id}}
                                </Col>
                            </Row>
                            <Row class="mb10" v-if="row.shopinfo" style="border-bottom:1px solid #eee;">
                                <Col span="24" >
                                    门店：{{row.shopinfo.name}}，地址：{{row.shopinfo.address}}，电话：{{row.shopinfo.tel}}
                                </Col>
                            </Row>
                            <Row class="mb10">
                                <Col span="24" >
                                    <div class="">
                                        <Tag color="cyan">订单编号:{{row.orderid}}</Tag>
                                        <Tag v-if="row.uorderid" color="cyan">微信订单编号:{{row.uorderid}}</Tag>
                                        <Tag v-if="row.wxorderid" color="cyan">微信订单编号:{{row.wxorderid}}</Tag>
                                        
                                    </div>
                                </Col>
                            </Row>

                            <Row class="mb10">
                                <Col span="24" >
                                    <div class="mb10">
                                        <Tag v-if="row.showcreatetime" color="cyan">下单时间:{{row.showcreatetime}}</Tag>
                                        <Tag v-if="row.comtime > 0" color="cyan">完成时间:{{row.showcomtime}}</Tag>

                                        <template v-if="row.gtype != 7">
                                            <Tag color="cyan" v-if="row.taketype == 1">
                                                到店使用
                                            </Tag>
                                            <Tag color="orange" v-if="row.taketype == 2">
                                                配送到家
                                                <font v-if="row.istaked == 1">已接单</font>
                                            </Tag>
                                        </template>

                                        买家：{{row.user.nickname}}，ID：{{row.user.id}}电话：{{row.tel}}
                                    </div>
                                </Col>
                            </Row>

                            <Row class="mb10">
                                <Col span="24" >
                                    
                                    <p class="datain-item">订单金额：{{row.fee}}，</p>
                                    <p class="datain-item">收入金额：{{row.shopfee}}，</p>
                                    <p class="datain-item">服务费用：{{row.sever}}，</p>
                                    
                                    <p class="datain-item" v-if="row.fanxianm > 0">返现金额：{{row.fanxianm}}，</p>
                                    
                                    <p class="datain-item" v-if="row.jifendis > 0">{{settings.jfbname}}抵扣：{{row.jifendis}}，</p>
                                    
                                    <p class="datain-item" v-if="row.jifen > 0">返现{{settings.jfbname}}：{{row.jifen}}，</p>
                                    
                                    <p class="datain-item" v-if="row.salerfee*1 +row.salerfeea*1 + row.salerfeeb*1 > 0">{{settings.fxbname}}支出：{{ (row.salerfee*1 +row.salerfeea*1 +row.salerfeeb*1).toFixed(2) }}，
                                    </p>
                                    
                                    <p class="datain-item" v-if="row.ptsalerfee*1 +row.ptsalerfeea*1 + row.ptsalerfeeb*1 > 0">
                                        平台{{settings.fxbname}}：{{ (row.ptsalerfee*1 +row.ptsalerfeea*1 +row.ptsalerfeeb*1).toFixed(2)}}，
                                    </p>

                                    <p class="datain-item">下单数量：{{row.num}}，</p>
                                    <p class="datain-item">
                                        支付方式：
                                        {{!row.paytype || row.paytype == 0 ? '微信' : ''}}
                                        {{row.paytype == 1 ? '余额' : ''}}
                                        {{row.paytype == 2 ? '到店支付' : ''}}，
                                    </p>

                                    <template v-if="row.agentfee > 0">
                                        <p class="datain-item" v-if="row.agent">{{settings.agentname}}：{{row.agent.nickname}}，</p>
                                        <p class="datain-item">分成：{{row.agentfee}}，</p>
                                    </template>
                                    
                                    <p class="datain-item" v-if="row.rule">规格：{{row.rule}}，</p>
                                    
                                    <p class="datain-item" v-if="row.pakfee > 0">打包费：{{row.pakfee}}，</p>
                                    
                                    <p class="datain-item" v-if="row.expfee > 0">配送费：{{row.expfee}}，</p>
                                    <p class="datain-item" v-if="row.yydate">预约：{{row.yydate+' '}} {{row.yytime}}，</p>

                                    <p class="datain-item" v-if="row.refunded > 0">已退款：{{row.refunded}}，</p>

                                    <template v-if="row.gtype != 7">
                                        <p class="datain-item" v-if="row.pttype == 0">{{settings.hxbname}}码：{{row.code}}，</p>
                                        <p class="datain-item">已经使用：{{row.oldhxtimes - row.hxtimes - row.refundnum > 0 ? row.oldhxtimes - row.hxtimes - row.refundnum : 0}}次，</p>
                                        <p v-if="row.refundnum" class="datain-item">已经退掉：{{row.refundnum}}次，</p>
                                        <p class="datain-item">还可使用：{{row.hxtimes}}次，</p>
                                        <p class="datain-item" v-for="inn in row.hxcode">
                                            {{inn.code}}（{{inn.status == 1 ? '已使用' : '未使用'}}），
                                        </p>
                                    </template>

                                </Col>
                            </Row>

                            <Row class="mb10">
                                <Col span="24" >

                                    <Tag color="default" v-if="row.fzstatus > 0" class="font-error">分账订单</Tag>
                                    <Tag color="default" v-if="row.isdzpay == 1" class="font-error">独立收款订单</Tag>
                                    <Tag color="default">
                                        {{row.gtype == 0 ? '普通商品' : ''}}
                                        {{row.gtype == 1 ? '限抢订单' : ''}}
                                        {{row.gtype == 2 ? '拼团订单' : ''}}
                                        {{row.gtype == 3 ? '砍价订单' : ''}}
                                        {{row.gtype == 4 ? '报名订单' : ''}}
                                        {{row.gtype == 7 ? '套餐订单' : ''}}
                                        {{row.gtype == 8 ? '特权订单' : ''}}
                                        {{row.gtype == 9 ? '礼包订单' : ''}}
                                    </Tag>
                                    <Tag color="default" v-if="row.isseverpay == 1">需分账服务费</Tag>
                                    <Tag color="default" v-if="row.isseverpay == 2">已分账服务费</Tag>
                                    <Tag color="error" v-if="row.isseverpay == 3" class="font-error">分账失败{{row.fzerr}}</Tag>

                                    <Tag color="default" v-if="row.gtype == 7 && row.bindoid*1 > 0" class="font-error">母订单id：{{row.bindoid}}</Tag>
                                    <Tag color="default" v-if="row.pttype == 1" class="font-error">票付通订单</Tag>
                                    <Tag color="default" v-if="row.pftcode" class="font-info">票付通核销码:{{row.pftcode}}</Tag>
                                    <Tag color="error" v-if="row.pfterr" class="font-error">错误:{{row.pfterr}}</Tag>

                                    <Tag color="default" v-if="row.hxuser" >{{settings.hxbname}}：{{row.hxuser.nickname}}</Tag>
                                    <Tag color="error" v-if="row.refunderr" class="font-error">退款：{{row.refunderr}}</Tag>
                                    <Tag color="error" v-if="row.gfxstatus == 1" class="font-error">活动资金不足，不可发放分销资金</Tag> 

                                </Col>
                            </Row>

                        </Card>
                    </template>

                    <template slot-scope="{ row, index }" slot="status">
                        <Tag color="default" class="font-error" v-if="row.unset == 1">已取消</Tag>  
                        <Tag :color="row.status == 5 ? 'error' : 'default'">
                            {{row.status == 0 ? '未支付' : ''}}
                            {{row.status == 1 ? '已支付' : ''}}
                            {{row.status == 2 ? '已发货' : ''}}
                            {{row.status == 3 ? '已完成待评价' : ''}}
                            {{row.status == 4 ? '已评价' : ''}}
                            {{row.status == 6 ? '待核销' : ''}}
                            <font v-if="row.status == 5" >已退款</font>
                        </Tag>
                        
                        <Tag color="error" v-if="row.isfail == 1" class="font-error">已超时失效</Tag> 

                        <Tag color="error" v-if="row.isback == 1 && (row.status == 1 || row.status == 2)" class="font-error">退款申请中</Tag>
                    </template>
                    
                    
                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'orderinfo?id='+row.id" >详情</a>
                        </p>

                        <Dropdown v-if="row.fee > 0 && row.paytype != 2 && (row.status == 1 || row.status == 2 || row.status == 3)" placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                退款
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入退款金额" />
                                </div>
                                <div style="padding:10px">
                                    <Input v-model="refundnum" placeholder="输入退款数量" />
                                </div>
                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'backfee')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                        
                        <Poptip
                            v-if="row.isback == 1" 
                            confirm
                            title="确定取消吗？"
                            @on-ok="dealthis(row.id,'cancelbackorder')"
                            placement="left">
                            <a>取消退款</a>
                        </Poptip>

                        <div>
                            <a v-if="row.gtype == 7" @click="link" :data-url="'orderlist?bindoid='+row.bindoid" >查看套餐订单</a>
                            <a v-else @click="link" :data-url="'shoplist?id='+row.shopid" >查看商户</a>
                        </div>

                        <Poptip
                            v-if="(row.status >= 1 && row.hxtimes > 0) || row.status == 1"
                            confirm
                            title="确定核销吗？"
                            @on-ok="dealthis(row.id,'comorder')"
                            placement="left">
                            <a>{{settings.hxbname}}订单</a>
                        </Poptip>
                        
                        <Poptip
                            v-if="row.unset == 1"
                            confirm
                            title="确定操作吗？"
                            @on-ok="dealthis(row.id,'topayed')"
                            placement="left">
                            <a>转为已支付</a>
                        </Poptip>
                        <Poptip
                            v-if="row.isfail == 1"
                            confirm
                            title="确定操作吗？"
                            @on-ok="dealthis(row.id,'tonofailed')"
                            placement="left">
                            <a>转为未失效</a>
                        </Poptip>
                        
                        <Poptip
                            v-if="row.gfxstatus == 1"
                            confirm
                            title="发放前请确保账户活动余额充足，在数据-数据预览内可查看。确定发放分销和返现资金吗？"
                            @on-ok="dealthis(row.id,'givefxmoney')"
                            placement="left">
                            <a>发放资金</a>
                        </Poptip>
                        <Poptip
                            v-if="row.isseverpay == 3"
                            confirm
                            title="确定要提交分服务费吗？"
                            @on-ok="dealthis(row.id,'getfzsever')"
                            placement="left">
                            <a>再次分服务费</a>
                        </Poptip>

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
                tableloading : true,
	  			params : {},
                isall : false,
	  			list : [],
	  			allsort : [],
                total : 0,
                data : {},
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {title:'数据',key:"data",slot: 'data',},
                    {title:'状态',key:'status',slot: 'status',width:130},
                    {title:'操作',key:'33',slot: 'action',width:120},
                ],
                status : [{label:'全部',value:1},{label:'黑名单',value:2}],
                type : [
                    {label:'普通商品',value:1},
                    {label:'限抢活动',value:2},
                    {label:'拼团商品',value:3},
                    {label:'砍价商品',value:4},
                    {label:'报名活动',value:5},
                    {label:'抽奖活动',value:6},
                    {label:'秒杀活动',value:7},
                    {label:'套餐商品',value:8},
                    {label:'特权商品',value:9},
                    {label:'礼包商品',value:10},
                ],
                status : [
                    {label:'待支付',value:1},
                    {label:'已支付',value:2},
                    {label:'已发货',value:3},
                    {label:'待评价',value:4},
                    {label:'已完成',value:5},
                    {label:'已退款',value:6},
                    {label:'申请退款中',value:7},
                    {label:'待核销',value:8},
                    {label:'已取消订单',value:10},
                    {label:'已失效',value:11},
                    
                ],
                otype : [
                    {label:'按最新排序',value:'id'},
                    {label:'按最近'+this.settings.hxbname+'排序',value:'hexiao'},
                    {label:'按完成排序',value:'com'},
                    {label:'按店铺排序',value:'shop'},
                    {label:'按金额排序',value:'fee'},
                    {label:'按数量排序',value:'num'},
                    {label:'按商品排序',value:'goods'},
                ],
                taketype : [{label:'到店领取',value:1},{label:'配送到家',value:2}],
                page : {
                    pdata : {
                        doo : 'order',
                        op : 'list',
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
                refundnum : '',
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
                    oid : id,
                    id:id,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res ? res.res : '操作失败');
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
                    postdata.num = this.refundnum;
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
                self.$util.http('user','GET',postdata,function(res){
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
                if( this.page.pdata.time ){
                    url += '&time[start]='+this.page.pdata.time.start;
                    url += '&time[end]='+this.page.pdata.time.end;
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
                this.page.pdata.page = 1;
                this.onLoad();
            },
            cleartime(){
                this.page.pdata.time = '';
                this.page.pdata.page = 1;
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
                if( params.groupid > 0 ){
                    self.page.pdata.groupid = params.groupid;
                }
                
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.tableloading = false;
                        self.list = res.obj.list;
                        self.allsort = res.obj.topbar.sortid;
                        self.alltwosort = res.obj.topbar.sorttwo;
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
                        self.total = res.obj.total;
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>
.datain-item{
    padding-right: 10px;
    display: inline-block;
    font-size: 13px;
    color: #999;
}


</style>