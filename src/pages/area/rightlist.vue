<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    

                    <template slot-scope="{ row,index  }" slot="auth">
                        <Row class="frm_group mt10" v-for="(item,ii) in role" :key="ii">
                            <Col span="3" class="frm_title">
                                {{item.name}}
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox  v-for="(inn,idx) in item.list"  v-model="row.auth[ii].list[idx].value == 1"  :key="idx" @on-change="saveauth($event,index,ii,idx,row.id)">{{inn.name}} </Checkbox>
                            </Col>
                        </Row>
                        <!-- <Row class="frm_group mt10"  >
                            <Col span="3" class="frm_title">
                                参数设置
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.setting.set"  @on-change="saveauth">参数设置</Checkbox>
                                <Checkbox v-model="auth.setting.admin" @on-change="saveauth">管理人员</Checkbox>
                                <Checkbox v-model="auth.setting.explain" @on-change="saveauth">说明设置</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                运营数据
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.data.order" @on-change="saveauth">订单数据</Checkbox>
                                <Checkbox v-model="auth.data.user" @on-change="saveauth">用户数据</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                商品管理
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.goods.list" @on-change="saveauth">商品列表</Checkbox>
                                <Checkbox v-model="auth.goods.sort" @on-change="saveauth">商品分类</Checkbox>
                                <Checkbox v-model="auth.goods.music" @on-change="saveauth">音乐管理</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                用户管理
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.user.list" @on-change="saveauth">用户列表</Checkbox>
                                <Checkbox v-model="auth.user.code" @on-change="saveauth">会员卡密</Checkbox>
                                <Checkbox v-model="auth.user.fxjoin" @on-change="saveauth">申请分销</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                商户管理
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.shop.list" @on-change="saveauth">商户列表</Checkbox>
                                <Checkbox v-model="auth.shop.add" @on-change="saveauth">添加商户</Checkbox>
                                <Checkbox v-model="auth.shop.verify" @on-change="saveauth">审核申请</Checkbox>
                                <Checkbox v-model="auth.shop.sort" @on-change="saveauth">商户分类</Checkbox>
                                <Checkbox v-model="auth.shop.trade" @on-change="saveauth">商圈管理</Checkbox>
                                <Checkbox v-model="auth.shop.city" @on-change="saveauth">城市管理</Checkbox>
                                <Checkbox v-model="auth.shop.help" @on-change="saveauth">帮助中心</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                代理管理
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.agent.list" @on-change="saveauth">代理列表</Checkbox>
                                <Checkbox v-model="auth.agent.verify" @on-change="saveauth">审核代理</Checkbox>
                                <Checkbox v-model="auth.agent.explain" @on-change="saveauth">代理说明</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                订单管理
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.order.list" @on-change="saveauth">商品订单</Checkbox>
                                <Checkbox v-model="auth.order.chou" @on-change="saveauth">抽奖支付订单</Checkbox>
                                <Checkbox v-model="auth.order.uprize" @on-change="saveauth">会员礼包订单</Checkbox>

                                <Checkbox v-model="auth.order.join" @on-change="saveauth">入驻支付订单</Checkbox>
                                <Checkbox v-model="auth.order.addtime" @on-change="saveauth">商户续费订单</Checkbox>
                                <Checkbox v-model="auth.order.addm" @on-change="saveauth">充值订单</Checkbox>
                                <Checkbox v-model="auth.order.shoppay" @on-change="saveauth">收款订单</Checkbox>
                                <Checkbox v-model="auth.order.comment" @on-change="saveauth">订单评价</Checkbox>
                                <Checkbox v-model="auth.order.goodcomm" @on-change="saveauth">好评展示</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                活动管理
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.act.cut" @on-change="saveauth">砍价记录</Checkbox>
                                <Checkbox v-model="auth.act.group" @on-change="saveauth">拼团记录</Checkbox>
                                <Checkbox v-model="auth.act.chou" @on-change="saveauth">抽奖记录</Checkbox>
                                <Checkbox v-model="auth.act.sign" @on-change="saveauth">签到活动</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                diy页面
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.page.designindex" @on-change="saveauth">设置首页</Checkbox>
                                <Checkbox v-model="auth.page.list" @on-change="saveauth">专题页面管理</Checkbox>
                                <Checkbox v-model="auth.page.goods0" @on-change="saveauth">普通商品海报</Checkbox>
                                <Checkbox v-model="auth.page.goods1" @on-change="saveauth">限抢商品海报</Checkbox>

                                <Checkbox v-model="auth.page.goods2" @on-change="saveauth">拼团商品海报</Checkbox>
                                <Checkbox v-model="auth.page.goods3" @on-change="saveauth">砍价商品海报</Checkbox>
                                <Checkbox v-model="auth.page.goods4" @on-change="saveauth">报名活动海报</Checkbox>
                                <Checkbox v-model="auth.page.goods5" @on-change="saveauth">抽奖活动海报</Checkbox>
                                <Checkbox v-model="auth.page.goods6" @on-change="saveauth">秒杀活动海报</Checkbox>
                                <Checkbox v-model="auth.page.invite" @on-change="saveauth">邀请海报</Checkbox>
                                <Checkbox v-model="auth.page.agent" @on-change="saveauth">代理邀请海报</Checkbox>
                                <Checkbox v-model="auth.page.shop" @on-change="saveauth">店铺主页海报</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                提现管理
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.money.waitpay" @on-change="saveauth">微信提现</Checkbox>
                                <Checkbox v-model="auth.money.alipay" @on-change="saveauth">支付宝提现</Checkbox>
                                <Checkbox v-model="auth.money.payed" @on-change="saveauth">已支付</Checkbox>
                                <Checkbox v-model="auth.money.back" @on-change="saveauth">已退回</Checkbox>
                                <Checkbox v-model="auth.money.refuse" @on-change="saveauth">已拒绝</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                分销管理
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.fx.log" @on-change="saveauth">分销记录</Checkbox>
                                <Checkbox v-model="auth.fx.quest" @on-change="saveauth">分销问答</Checkbox>
                                <Checkbox v-model="auth.fx.fxjoin" @on-change="saveauth">审核分销</Checkbox>
                            </Col>
                        </Row>
                        <Row class="frm_group "  >
                            <Col span="3" class="frm_title">
                                营销活动
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox v-model="auth.activity.redbaglist" @on-change="saveauth">红包营销</Checkbox>
                                <Checkbox v-model="auth.activity.prizelist" @on-change="saveauth">下单抽奖</Checkbox>
                                <Checkbox v-model="auth.activity.zhuanpanlist" @on-change="saveauth">每日抽奖</Checkbox>
                                <Checkbox v-model="auth.activity.signlist" @on-change="saveauth">到店签到</Checkbox>
                                <Checkbox v-model="auth.activity.gwfclog" @on-change="saveauth">购物分成</Checkbox>
                                <Checkbox v-model="auth.activity.givecardlist" @on-change="saveauth">购物会员卡</Checkbox>
                                <Checkbox v-model="auth.activity.ucardlist" @on-change="saveauth">购卡赠券</Checkbox>

                                <Checkbox v-model="auth.activity.paklist" @on-change="saveauth">套餐商品</Checkbox>
                                <Checkbox v-model="auth.activity.jifenlist" @on-change="saveauth">积分商城</Checkbox>
                                <Checkbox v-model="auth.activity.yhcode" @on-change="saveauth">优惠码</Checkbox>

                                <Checkbox v-model="auth.activity.cardlist" @on-change="saveauth">优惠券</Checkbox>
                                <Checkbox v-model="auth.activity.articlelist" @on-change="saveauth">营销文章</Checkbox>
                            </Col>
                        </Row>
 -->
                    </template>
                    
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
            </Col>
            <Col span="18">
                
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
                    {title:'账户',key:'name',width:'100'},
                    {title:'权限',key:"auth",slot: 'auth',},
                ],
                page : {
                    pdata : {
                        doo : 'card',
                        op : 'list',
                        p:'area',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        uid : '',
                        gid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                auth : {
                    setting:{},
                    order:{},
                    data:{},
                    goods:{},
                    user:{},
                    shop:{},
                    agent:{},
                    act:{},
                    page:{},
                    money:{},
                    fx:{},
                    activity:{},
                },
                alltwosort : [],
                selected : [],
                role : {},
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            saveauth(e,i,j,k,id){
                var self = this;
                var b = e ? 1 : 2;

                self.$set(self.list[i].auth[j].list[k],'value',b);
                
                var postdata = {
                    op : 'saveauth',
                    fromajax : 1,
                    auth : self.list[i].auth,
                    id : id,
                }
                self.$util.http('ajax','POST',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
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
                self.$util.http('copy','GET',postdata,function(res){
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
                        self.role = res.obj.role;
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