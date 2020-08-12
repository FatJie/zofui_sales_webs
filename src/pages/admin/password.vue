<template>
	<div>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    原密码
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="old" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    新的密码
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="pass1" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    重复密码
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="pass2" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            
            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">修改</Button>
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
                pass1 : '',
                pass2 : '',
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
                    op : 'editpass',
                    fromajax : 1,
                    oldpassword : this.old,
                    password1 : this.pass1,
                    password2 : this.pass2,
                }
                self.$util.http('set','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已修改');
                        self.old = '';
                        self.pass1 = '';
                        self.pass2 = '';
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

                self.$util.http('set','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.shop = res.obj.shop;

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