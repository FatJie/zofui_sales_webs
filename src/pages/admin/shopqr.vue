<template>
	<div>

        <Spin size="large" fix v-if="loading"></Spin>

        <Row>
            <Col span="6">
                <div style="text-align:center;" class="pd10">
                    <img :src="qr" style="width:200px;height: 200px;margin-bottom:20px;">

                    <Alert show-icon>
                        扫上方二维码进入店铺主页
                    </Alert>
                </div>
            </Col>
            <Col span="6">
                <div style="text-align:center;" class="pd10">
                    <img :src="hxqr" style="width:200px;height: 200px;margin-bottom:20px;">

                    <Alert show-icon>
                        <p>1. {{settings.fontsty > 0 ? '买家' : '学员'}}根据领取地址来领取，出示订单中的二维码或领取编码。</p> 
                        <p>2.管理员使用微信扫描{{settings.fontsty > 0 ? '买家' : '学员'}}出示的{{settings.hxbname}}二维码即可{{settings.hxbname}}订单。</p>
                        <p>3.非管理员需要进入上方二维码页面，输入{{settings.fontsty > 0 ? '买家' : '学员'}}出示的领取编码{{settings.hxbname}}订单。</p>
                    </Alert>
                </div>
            </Col>
            <Col span="6">
                <div style="text-align:center;" class="pd10"  v-if="!(settings.shoppay == 1 || (shop.auth && shop.auth.ispay == 1))">
                    <img :src="payqr" style="width:200px;height: 200px;margin-bottom:20px;">

                    <Alert show-icon>
                        扫上方二维码进入收款页面
                    </Alert>
                </div>
            </Col>
            <Col span="6">
                <div style="text-align:center;" class="pd10" v-if="settings.isgkf == 1" >
                    <img :src="kefuqr" style="width:200px;height: 200px;margin-bottom:20px;">

                    <Alert show-icon>
                        扫上方二维码进入客服接待页面
                    </Alert>
                </div>
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
                shop : {},
                qr : '',
                hxqr : '',
                payqr : '',
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            handleOpen(){
                this.visible = true;
            },
            handleClose(){
                this.visible = false;
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
                    op : 'shop',
                    fromajax : 1,
                }
                self.$util.http('set','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loading = false;
                        self.shop = res.obj.shop;
                        self.qr = res.obj.shopqr;
                        self.hxqr = res.obj.hxqr;
                        self.payqr = res.obj.payqr;
                        self.kefuqr = res.obj.kfqr;
                    }else{
                        self.$Message.error(res.res);
                    }
                });
            },
	  		onLoad() {
	  			var self = this;
                if( !self.isonbottom ){
                    self.page.doing = false;
                    return false;
                } 
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>