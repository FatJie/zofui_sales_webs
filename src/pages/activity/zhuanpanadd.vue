<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="zhuanpanadd" @on-click="changetab">
            <TabPane label="奖品管理" name="zhuanpanlist" ></TabPane>
            <TabPane label="添加奖品" name="zhuanpanadd" ></TabPane>
            <TabPane label="参数设置" name="zhuanpanset" ></TabPane>
            <TabPane label="中奖记录" name="zhuanpanlog" ></TabPane>
        </Tabs>

        <div v-if="!loading">

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    奖品名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.name" placeholder="" class="w400"  />
                    <p class="frm_tip">例：5元红包</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    中奖概率
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.per" placeholder="" class="w400"  />
                    <p class="frm_tip">单位/%</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    最多抽中次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.maxtake" placeholder="" class="w400"  />
                    <p class="frm_tip">每人最多抽中此奖品的次数。填0不限次数</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    奖品类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.type">
                        <Radio label="0" >未中奖</Radio>
                        <Radio label="1">优惠券</Radio>
                        <Radio label="2">{{settings.jfbname}}</Radio>
                        <Radio label="3">余额</Radio>
                    </RadioGroup>
                </Col>
            </Row>

            <Row class="frm_group" v-if="prize.type == 1">
                <Col span="3" class="frm_title">
                    优惠券
                </Col>
                <Col span="18" class="frm_content">
                    <Select filterable v-model="prize.cardid" class="w200">
                        <Option v-for="item in allcard" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
            </Row>

            <template v-if="prize.type == 2 || prize.type == 3">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        数值
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="prize.fee" placeholder="" class="w400"  />
                        <p class="frm_tip">发放{{settings.jfbname}}或者余额的数值</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        库存
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="prize.stock" placeholder="" class="w400"  />
                        <p class="frm_tip">每抽中一个扣除1</p>
                    </Col>
                </Row>
            </template>

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
                prize : {name:''},
                uploadurl : '',
                allcard : [],
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
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'addprize',
                    fromajax : 1,
                    name : this.prize.name,
                    fee : this.prize.fee,
                    per : this.prize.per,
                    type : this.prize.type,
                    cardid : this.prize.cardid,
                    stock : this.prize.stock,
                    maxtake : this.prize.maxtake,
                    ptype : 1,
                    id : this.prize.id > 0 ? this.prize.id : 0,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已保存');
                    }else{
                        self.$Message.error(res.res);
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

                self.$util.http('zhuanpan','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info ){
                            self.prize = res.obj.info;
                        }
                        self.allcard = res.obj.allcard;
                        self.loading = false;

                    }else{
                        self.$Message.error(res.res);
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