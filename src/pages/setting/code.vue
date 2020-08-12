<template>

    <div>
        <Spin size="large" fix v-if="!loaded"></Spin>
        <div v-if="loaded">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    设置秘钥
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="key.key" placeholder="" class="w400"  />
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
                shop : '',
                agent : '',
                fenchen : '',
                key : {},
                loaded : false,
                data : {},
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
            save(){
                var self = this;
                var postdata = {
                    op : 'savekey',
                    fromajax : 1,
                    key : self.key.key,
                }
                self.$util.http('setting','get',postdata,function(res){
                    if( res.type == 'success' ){
                        
                        self.$Message.error('已保存');
                        
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                var postdata = {
                    op : 'code',
                    fromajax : 1,
                }
                self.$util.http('setting','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loaded = true;
                        self.key = res.obj.akey;
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