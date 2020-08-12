<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

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
	  		}
	  	},
        created:function(){
            this.$router.push('settingset');
        },
	  	methods: {
            setText(obj,point){

            },
            setend(e){
                this.shop.end = e;
            },
            uploadend(e){
                if( e.attachment ){
                    this.$set(this.shop,'headimg',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
            },
            uploadendthumb(){
                if( e.attachment ){
                    this.$set(this.shop,'cover',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
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
                    op : 'addshop',
                    fromajax : 1,
                    shop : this.shop,
                    shopid : this.shop.id > 0 ? this.shop.id : 0,
                    joinid : this.joinid,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success('已保存');
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){

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