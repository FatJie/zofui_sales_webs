<template>
	<div>

        <Spin size="large" fix v-if="loading"></Spin>

        

        <Divider>小程序空白检测</Divider>

        <Row class="frm_group">
            <Col span="5">
                <h3>1、https检测</h3>
            </Col>
            <Col span="19" v-html="httpsres"></Col>
        </Row>
        <Row class="frm_group">
            <Col span="5">
                <h3>
                    2、接口域名检测
                </h3>
            </Col>
            <Col span="19" v-html="appurlres"></Col>
        </Row>
        <Row class="frm_group">
            <Col span="5">
                <h3>3、服务器域名配置检测</h3>
            </Col>
            <Col span="19">
                <div>此步骤需要手动检查</div>
                <div>登录微信小程序后台-设置-开发设置-服务器域名中将域名设置成{$domain}(若不使用此域名请忽略此提示)</div>
                <div>
                    <img width="100%" :src="vurl">
                </div>
            </Col>
        </Row>

    </div>
</template>

<script type="text/javascript">
    
	export default {
        name : 'settingexplain',
	  	components: {

	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			vurl : '',
                httpsres : '',
                appurlres : '',
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
                    op : 'admin',
                    fromajax : 1,
                }
                self.$util.http('explain','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loading = false;
                        self.vurl = res.obj.vurl;
                        self.httpsres = res.obj.httpsres;
                        self.appurlres = res.obj.appurlres;
                        
                    }else{
                        self.$Message.error(res.message);
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