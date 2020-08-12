<template>
	<div>

        <Spin size="large" fix v-if="loading"></Spin>

        <div style="text-align:center;">

            <Alert show-icon v-if="settings.shoppay == 1 || (shop.auth && shop.auth.ispay == 1)">
                扫上方二维码进入收款页面
            </Alert>

            <template v-else>
                <img :src="qr" style="width:200px;height: 200px;margin-bottom:20px;">

                <Alert show-icon>
                    扫上方二维码进入收款页面
                </Alert>
            </template>
            
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
                qr : '',
                shop : {},
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
                        self.qr = res.obj.payqr;
                        self.shop = res.obj.shop;
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