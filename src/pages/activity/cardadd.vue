<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="cardadd" @on-click="changetab">
            <TabPane label="优惠券列表" name="cardlist" ></TabPane>
            <TabPane label="添加优惠券" name="cardadd" ></TabPane>
            <TabPane label="领取记录" name="cardlog" ></TabPane>
            <TabPane label="红包记录" name="cardredbaglog" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    提示
                </Col>
                <Col span="18" class="frm_content">
                    只有普通商品，限抢商品，拼团，秒杀类商品可使用优惠券。此处添加的优惠券是平台优惠券，抵扣的金额平台承担
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    卡券名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.name" placeholder="" class="w400"  />
                    <p class="frm_tip">例：5元优惠券</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    排序序号
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.number" placeholder="越大越靠前" class="w400"  />
                    <p class="frm_tip">越大越靠前</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    前端展示
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.isshow">
                        <Radio label="0" >展示</Radio>
                        <Radio label="1">不展示</Radio>
                    </RadioGroup>
                    <p class="frm_tip">若选择不展示，那么不会在店铺和商品内展示</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    卡券类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.type">
                        <Radio label="0" >在线下单使用</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    卡券面值
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.fee" placeholder="" class="w400"  />
                    <p class="frm_tip">填面值，例填5，可抵扣5元。</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    每人可领
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.maxtake" placeholder="" class="w400"  />
                    <p class="frm_tip">每人可领取的数量，例填5，每人最多领取5次。</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    使用条件
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.use" placeholder="" class="w400"  />
                    <p class="frm_tip">订单满此金额才能使用。应考虑到会员商品价格，会员价格低于此值也不能使用此券</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    卡券数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.stock" placeholder="" class="w400"  />
                    <p class="frm_tip">每被领取一次扣一张</p>
                </Col>
            </Row>

            <Row class="frm_group" v-if="settings.getcquth == 0">
                <Col span="3" class="frm_title">
                    领取权限
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.auth">
                        <Radio label="0" >所有用户可领取</Radio>
                        <Radio label="1">仅限会员领取</Radio>
                        <Radio label="2" v-if="settings.twoucard == 1">仅限高级会员领取</Radio>
                        <Radio label="3" >不允许领取</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    允许赠送
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.iszs">
                        <Radio label="0" >不可赠送</Radio>
                        <Radio label="1">可赠送其他用户</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    领取时间
                </Col>
                <Col span="18" class="frm_content">
                    <DatePicker type="daterange" :value="prize.showtime" placement="bottom-end" placeholder="选择时间" class="w400" @on-change="searchdate"  ></DatePicker>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    有效期
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.usetime" placeholder="" class="w400"  />
                    <p class="frm_tip">单位/天，从领取后此时间段内可使用</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    可使用商品id
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.gid" placeholder="" class="w400"  />
                    <p class="frm_tip">多个商品id请使用空格分隔</p>

                    <div class="mt10">
                        <Poptip
                            class="mr10 mb10"
                            v-for="(item,index) in allbind"
                            confirm
                            title="确定删除吗？"
                            @on-ok="delbind(index)">
                            <Button  size="small" shape="circle">
                                {{item.gid}}
                            </Button>
                        </Poptip>
                    </div>

                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">保存</Button>
                </Col>
            </Row>
        </div>

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
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                prize : {name:'',showtime:[]},
                uploadurl : '',
                allbind : [],
                start : '',
                end : '',
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            shopedit(e){
                this.$set(this.shop,'content',e);
            },
            addthis(){
                this.shop.params.push({itemt:''});
            },
            delbind(index){
                this.allbind.splice(index,1);
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            searchdate(e){
                this.start = e[0];
                this.end = e[1];
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'create',
                    fromajax : 1,
                    name : this.prize.name,
                    fee : this.prize.fee,
                    use : this.prize.use,
                    stock : this.prize.stock,
                    number : this.prize.number,
                    maxtake : this.prize.maxtake,
                    auth : this.prize.auth,
                    isshow : this.prize.isshow,
                    time : {start:this.start,end:this.end},
                    iszs : this.prize.iszs,
                    usetime : this.prize.usetime,
                    gid : this.prize.gid,
                    id : this.prize.id > 0 ? this.prize.id : 0,
                }

                var bind = [];
                for (var i = 0; i < this.allbind.length; i++) {
                    bind.push( this.allbind[i].gid );
                }
                postdata.bind = bind;

                self.$util.http('card','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success('已保存');
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var postdata = {
                    op : 'edit',
                    fromajax : 1,
                    id : id,
                }
                if( id <= 0 ){
                    self.loading = false;
                    return false;
                }

                self.$util.http('card','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info && res.obj.info.id ){
                            self.prize = res.obj.info;
                            self.start = self.prize.time ? self.prize.time.start : '';
                            self.end = self.prize.end ? self.prize.time.end : '';

                            self.allbind = res.obj.allbind ? res.obj.allbind : [];
                        }
                        
                        self.loading = false;

                    }else{
                        self.$Message.error(res.message);
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