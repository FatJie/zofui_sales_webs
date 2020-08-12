<template>
	<div>

        <Spin size="large" fix v-if="loading"></Spin>

        
        <Card class="mb10">
            <Row>
                <Col span="5">目前有{{mess}}条聊天记录消息</Col>
                <Col span="12">
                    <Button type="primary" @click="clear">清理一个月前的聊天记录消息</Button>
                </Col>
            </Row>
        </Card>
        <div style="text-align:center;">    
            <img :src="qr" style="width:200px;height: 200px;margin-bottom:20px;">

            <Alert show-icon>
                扫上方二维码进入客服中心
            </Alert>
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
                mess : 0,
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
            clear(e){
                var self = this;
                var params = this.$route.query;
                
                var postdata = {
                    op : 'delkefumess',
                    fromajax : 1,
                }
                self.$Modal.confirm({
                    content : '确定要删除吗？',
                    onOk : function(){
                        self.$util.http('ajax','GET',postdata,function(res){
                            self.$Message.info(res.res);
                            if( res.status == 200 ){
                                self.initData();
                            }
                            
                        },true);
                    }
                })
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                var postdata = {
                    op : 'kefu',
                    fromajax : 1,
                }
                self.$util.http('setting','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loading = false;
                        self.qr = res.obj.qr;
                        self.mess = res.obj.mess > 0 ? res.obj.mess : 0;
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