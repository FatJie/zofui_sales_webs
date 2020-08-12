<template>
	<div>

        <Tabs value="adminmoneydraw" @on-click="changetab">
            <TabPane label="资金记录" name="adminmoneylog" ></TabPane>
            <TabPane label="余额提现" name="adminmoneydraw" ></TabPane>
            <TabPane label="积分记录" name="adminjifenlog" ></TabPane>
            <TabPane v-if="settings.isdzpay == 1" label="活动余额记录" name="actmoneylog" ></TabPane>
        </Tabs>
        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    提现金额
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="money" placeholder="" class="w400"  />
                    <div class="frm_tip">
                        <p>您的余额{{shop.money}}元，最低提现{{settings.smindraw}}</p>
                        <p v-if="settings.sdrawserver > 0">提现手续费{{settings.sdrawserver}}%</p>
                        <p v-if="admin">
                            资金将发放到超级管理员微信号内。
                        </p>
                        <p v-else>你还没设置提现到账管理员，请先设置管理员，<a href="javascript:;" @click="link" data-url="/adminadmin">设置管理员</a></p>
                    </div>
                </Col>
            </Row>
            
            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">提交</Button>
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
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                params : {},
                shop : {},
                old : '',
                money : '',
                admin : false,
	  		}
	  	},
        created:function(){
            this.initData();
        },
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            smusic(e){
                this.info.musicname = e.name;
                this.info.params.musicid = e.id;
                this.showmusic();
            },
            showmusic(e){
                this.isshowmusic = !this.isshowmusic;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            delrule(e){
                this.info.params.rule.splice(e,1);
            },
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            save(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'getdraw',
                    fromajax : 1,
                    money : this.money,
                }
                self.$util.http('money','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已提交');
                        self.money = '';
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    p:'admin',
                    op : 'info',
                    fromajax : 1,
                }

                self.$util.http('money','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.shop = res.obj.shop;
                        self.admin = res.obj.admin ? res.obj.admin : false;
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