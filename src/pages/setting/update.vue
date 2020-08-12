<template>
	<div>

        <Spin size="large" fix v-if="loading"></Spin>

        <div style="text-align:center;">
            <i-circle  :percent="percent" >
                {{percent >= 100 ? '更新完成' : '更新中'}}
            </i-circle>
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
                percent : 40,
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
                    op : 'info',
                    fromajax : 1,
                }
                self.$util.http('update','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loading = false;
                        self.percent = 100;
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