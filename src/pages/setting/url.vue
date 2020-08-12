<template>

    <div v-html="html" class="urlboxx"  @click="copy">
        
    </div>


</template>

<script type="text/javascript">
	export default {
	  	components: {
            
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                html : '',
	  		}
	  	},
        created:function(){
            this.initData();
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
            copy(e){
                var e = {
                    currentTarget : {
                        dataset : {
                            copy : e.target.dataset.href,
                        }
                    }
                }
                this.bindtap(e,'copy');
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                var postdata = {
                    op : 'url',
                    fromajax : 1,
                }
                self.$util.http('setting','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.html = res.obj.html;
                        
                    }else{
                        if( res.message ) self.$Message.error(res.message);
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

<style type="text/css">
.urlboxx .form-row{
    display: flex;
    padding-bottom: 20px;
    position: relative;
}
.urlboxx .form-value{
    left: 100px;
    position: absolute;
}
</style>