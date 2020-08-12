<template>
	<div>
		<Card title="商品" class="mb20">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    <img :src="goods.thumb" height="70px;">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    {{goods.title}}
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    商品ID:{{goods.id}}
                </Col>
            </Row>
		</Card>

		<Card title="买家" style="margin-top: 10px;">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    <img :src="user.headimg" height="70px;">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    {{user.nickname}}
                </Col>
            </Row>
		</Card>

        <Card v-if="orderinfo.pttype == 1 && orderinfo.params.pftqr" title="票付通参数" style="margin-top: 10px;">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    <img :src="'http://2v.dedecms.com/index.php/welcome/generate_qrcode?size=10&message='+orderinfo.params.pftcode" height="120px" width="120px">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    票付通订单号：{{orderinfo.params.ordernum}}
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    核销码：{{orderinfo.params.pftcode}}
                </Col>
            </Row>
        </Card>

		<Card title="订单" style="margin-top: 10px;">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    联系电话
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.tel}}
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    订单金额
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.fee}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.rule">
                <Col span="3" class="frm_title">
                    规格
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.rule}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.isleaderback == 1">
                <Col span="3" class="frm_title">
                    团长免单
                </Col>
                <Col span="18" class="frm_content">
                    已免单
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    收入金额
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.jiesuan}}  （ 让利金额：{{orderinfo.rangli}}  ）
                   <!-- （ 平台服务费{{orderinfo.sever}}，{{settings.fxbname}}支出 {{orderinfo.salerfee*1 + orderinfo.salerfeea*1 + orderinfo.salerfeeb*1 }} ,返现{{orderinfo.fanxianm}} ）-->
                </Col>
            </Row>
            <!-- <Row class="frm_group" fanxianm>
                <Col span="3" class="frm_title">
                    返现金额
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.fanxianm}}
                </Col>
            </Row> -->
             <!--<Row class="frm_group">
                <Col span="3" class="frm_title">
                    返现{{settings.jfbname}}
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.jifen}}
                </Col>
            </Row>-->
            <Row class="frm_group" v-if="orderinfo.yhmdis > 0">
                <Col span="3" class="frm_title">
                    优惠码减免
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.yhmdis}}，优惠码{{orderinfo.yhmcode}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.saler > 0" >
                <Col span="3" class="frm_title">
                    一级{{settings.fxbname}}金额收入者
                </Col>
                <Col span="18" class="frm_content">
                    {{saler.nickname}} ( {{saler.id}} )，商户设置{{orderinfo.salerfee}}，平台设置{{orderinfo.ptsalerfee}}
                    <p v-if="orderinfo.fxsharetype == 0">此分销者是买家的上级</p>
                    <p v-else>此分销者分享商品给买家获得分销佣金</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.salera > 0">
                <Col span="3" class="frm_title">
                    二级{{settings.fxbname}}金额收入者
                </Col>
                <Col span="18" class="frm_content">
                    {{salera.nickname}} ( {{salera.id}} )，商户设置{{orderinfo.salerfeea}}，平台设置{{orderinfo.ptsalerfeea}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.salerb > 0">
                <Col span="3" class="frm_title">
                    三级{{settings.fxbname}}金额收入者
                </Col>
                <Col span="18" class="frm_content">
                    {{salerb.nickname}} ( {{salerb.id}} )，商户设置{{orderinfo.salerfeeb}}，平台设置{{orderinfo.ptsalerfeeb}}
                </Col>
            </Row>

            <Row class="frm_group" v-if="orderinfo.cardfee > 0">
                <Col span="3" class="frm_title">
                    优惠券减免
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.cardfee}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.hbdis > 0">
                <Col span="3" class="frm_title">
                    红包减免
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.hbdis}}
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    订单id
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.orderid}}
                    <p>{{orderinfo.uorderid}}</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.mess">
                <Col span="3" class="frm_title">
                    留言
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.mess}}
                </Col>
            </Row>
            
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    状态
                </Col>
                <Col span="18" class="frm_content">
                    <p v-if="orderinfo.unset == 1">已取消</p>
                    <p v-else-if="orderinfo.isfail == 1">已失效</p>

                    <template v-else>
                    	<p v-if="orderinfo.status == 0">未支付</p>
                    	<p v-if="orderinfo.status == 1">已支付</p>
                    	<p v-if="orderinfo.status == 2">已发货</p>
                    	<p v-if="orderinfo.status == 3">已完成</p>
                    	<p v-if="orderinfo.status == 4">已评价</p>
                    	<p v-if="orderinfo.status == 5">已退款</p>
                    </template>

                </Col>
            </Row>

            <Row class="frm_group" v-if="orderinfo.usestart > 0">
                <Col span="3" class="frm_title">
                    使用时间
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.showusestart}}
                </Col>
            </Row>

            <Row class="frm_group" v-if="orderinfo.failtime > 0">
                <Col span="3" class="frm_title">
                    失效时间
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.showfailtime}}
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    配送方式
                </Col>
                <Col span="18" class="frm_content">
                    <p v-if="orderinfo.taketype == 1">到店使用</p>
                    <p v-if="orderinfo.taketype == 2">配送到家</p>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    支付方式
                </Col>
                <Col span="18" class="frm_content">
                	<p v-if="orderinfo.paytype == 0">微信支付</p>
                    <p v-if="orderinfo.paytype == 1">余额支付</p>
                    <p v-if="orderinfo.paytype == 2">到店支付</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.toshopname">
                <Col span="3" class="frm_title">
                    选择门店
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.toshopname}}
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    姓名
                </Col>
                <Col span="18" class="frm_content">
                	{{orderinfo.name}}
                </Col>
            </Row>

            <Row class="frm_group" v-if="orderinfo.address" >
                <Col span="3" class="frm_title">
                    联系地址
                </Col>
                <Col span="18" class="frm_content">
                	{{orderinfo.address}}
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    联系电话
                </Col>
                <Col span="18" class="frm_content">
                	{{orderinfo.tel}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.paytime > 0">
                <Col span="3" class="frm_title">
                    资金状态
                </Col>
                <Col span="18" class="frm_content">
                	已发放
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.fzstatus > 0">
                <Col span="3" class="frm_title">
                    分账状态
                </Col>
                <Col span="18" class="frm_content">
                    {{fzstatus == 1 ? '需要分账' : '已分账完成'}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.yydate">
                <Col span="3" class="frm_title">
                    预约时间
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.yydate+' '}} {{orderinfo.yytime}}
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    创建时间
                </Col>
                <Col span="18" class="frm_content">
                	{{orderinfo.showcreatetime}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.paytime > 0">
                <Col span="3" class="frm_title">
                    支付时间
                </Col>
                <Col span="18" class="frm_content">
                	{{orderinfo.showpaytime}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.comtime > 0">
                <Col span="3" class="frm_title">
                    完成时间
                </Col>
                <Col span="18" class="frm_content">
                	{{orderinfo.showcomtime}}
                </Col>
            </Row>

            <Row class="frm_group" v-if="orderinfo.subform &&  orderinfo.subform.length > 0">
                <Col span="3" class="frm_title">
                    提交数据
                </Col>
                <Col span="18" class="frm_content">
                	
		            <Row class="frm_group mt20" v-for="(item,index) in orderinfo.subform">
		                <Col span="3" class="frm_title">
		                    {{item.name}}：
		                </Col>
		                <Col span="18" class="frm_content">
		                	<div v-if="item.type == 'multi' || item.type == 'region' ">
		                		<p v-for="(inn,idx) in item.value">
		                			{{inn}}，
		                		</p>
		                	</div>
		                	<div v-else>
		                		{{item.value}}
		                	</div>
		                </Col>
		            </Row>

                </Col>
            </Row>
		</Card>

        <Card title="物流信息" style="margin-top: 10px;" v-if="orderinfo.exname || orderinfo.exnum">
            <Row class="frm_group" v-if="orderinfo.exname">
                <Col span="3" class="frm_title">
                    快递名称
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.exname}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="orderinfo.exnum">
                <Col span="3" class="frm_title">
                    快递编号
                </Col>
                <Col span="18" class="frm_content">
                    {{orderinfo.exnum}}
                </Col>
            </Row>
            <Row class="frm_group" v-if="express.length > 0">
                <Col span="3" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    <Steps :current="0" direction="vertical">
                        <Step v-for="item in express" :title="item.time" :content="item.desc"></Step>
                    </Steps>
                </Col>
            </Row>

        </Card>

		<Card :title="settings.hxbname+'记录'" class="mb20" v-if="hexiao && hexiao.length > 0" style="margin-top:20px;">
            <Row class="frm_group">
                <Col span="6" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    
		            <Row class="frm_group mt20" v-for="(item,index) in hexiao">
		                <Col span="6" class="frm_title">
		                    {{item.showtime}}：
		                </Col>
		                <Col span="18" class="frm_content">
		                	{{item.user && item.user.hxname ? item.user.hxname : item.user.nickname }} {{settings.hxbname}} {{item.times > 0 ? item.times : 1}}次
                            {{item.isfz == 1 ? '，资金分账处理，收款方'+item.fzname : ''}}
                            {{item.fzerr ? '分账遇到错误，资金已改为发放到账户余额，具体错误:'+item.fzerr : '' }}
		                </Col>
		            </Row>

                </Col>
            </Row>
		</Card>

		<Card title="返现记录" class="mb20" v-if="fanxm && fanxm.length > 0" style="margin-top:20px;">
            <Row class="frm_group">
                <Col span="6" class="frm_title">
                    &nbsp;
                </Col>
                <Col span="18" class="frm_content">
                    
		            <Row class="frm_group mt20" v-for="(item,index) in fanxm">
		                <Col span="6" class="frm_title">
		                    {{item.showfanxtime}}：
		                </Col>
		                <Col span="18" class="frm_content">
		                	{{item.money}}，  {{item.status == 0 ? '待返现' : '已返现'}}
		                </Col>
		            </Row>

                </Col>
            </Row>
		</Card>

		<Card title="评价" class="mb20" v-if="comment.content" style="margin-top:20px;">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    评价内容
                </Col>
                <Col span="18" class="frm_content">
                    
		            {{comment.content}}

                </Col>
            </Row>

            <Row class="frm_group" v-if="comment.backcontent">
                <Col span="3" class="frm_title">
                    回评内容
                </Col>
                <Col span="18" class="frm_content">
		            {{comment.backcontent}}
                </Col>
            </Row>
		</Card>

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
                data : {},
                nowtime : Date.parse(new Date())/1000,
                selected : [],
                money : '',
                data : {},
                orderinfo : {},
                fanxm : [],
                goods : {},
                user : {},
                saler : {},
                salera : {},
                salerb : {},
                hexiao : [],
                comment : {},
                express : [],
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            dealthis(id,type){
                var self = this;
                var postdata = {
                	p:'admin',
                    op : type,
                    fromajax : 1,
                    oid : id,
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
                	p:'admin',
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
                    p:'admin',
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
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                	p:'admin',
                	op : 'info',
                	fromajax : 1,
                }
                if( params.id > 0 ){
                    postdata.id = params.id;
                }
                if( params.oid > 0 ){
                    postdata.id = params.oid;
                }

                self.$util.http('order','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.orderinfo = res.obj.info;
                        self.fanxm = res.obj.fanxm ? res.obj.fanxm : [];
                        self.goods = res.obj.goods ? res.obj.goods : {};
                        self.user = res.obj.user ? res.obj.user : {};
                        self.saler = res.obj.saler ? res.obj.saler : {};
                        self.salera = res.obj.salera ? res.obj.salera : {};
                        self.salerb = res.obj.salerb ? res.obj.salerb : {};
                        self.hexiao = res.obj.hexiao ? res.obj.hexiao : [];
                        self.comment = res.obj.comment ? res.obj.comment : {};

                        if( self.orderinfo.exname && self.orderinfo.exnum ){
                            var postdata = {
                                p:'admin',
                                op : 'express',
                                name:self.orderinfo.exname,
                                num:self.orderinfo.exnum,
                                fromajax : 1,
                            }
                            self.$util.http('ajax','GET',postdata,function(res){
                                if( res.status == 200 ){
                                    self.express = res.obj;
                                }else{
                                    self.$Message.error(res.res);
                                }
                            });
                        }

                    }else{
                        self.$Message.error(res.res);
                    }
                },true);

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