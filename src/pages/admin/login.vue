<template>
	<div class="loginbg" :style="{'background-image':'url('+bg+')'}">

        <Row>
            <Col :xs="0" :sm="0" :md="16" :lg="16">
                &nbsp;
            </Col>
            <Col :xs="24" :sm="24" :md="8" :lg="8">
                <Card style="position: absolute;width:300px;top:30px;" class="mt20">
                    <Row class="mb20">
                        <Input prefix="ios-contact" v-model="username" placeholder="输入账户(手机号)" style="width: 100%" />
                    </Row>
                    <Row class="mb20">
                        <Input prefix="md-lock" type="password" v-model="password" placeholder="输入密码" style="width: 100%" />
                    </Row>
                    <Row class="mb20">
                        <Col span="14">
                            <Input  placeholder="输入验证码" v-model="verify" style="width: 100%" />
                        </Col>
                        <Col span="8" offset="2">
                            <img :src="codeurl" style="width:100%;height: 30px;cursor:pointer;" @click="changecode">
                        </Col>
                    </Row>
                    <Row class="mb20">
                        <Col span="24">
                            <Checkbox v-model="isrember">记住账户</Checkbox>
                        </Col>
                    </Row>
                    <Row class="mb20">
                        <Button :loading="loading" @click="login" type="success" style="width:100%;">登录</Button>
                    </Row>
                </Card>
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
	  			codeurl : '',
                isrember : true,
                verify : '',
                username : '',
                password : '',
                bg:'',
	  		}
	  	},
        created:function(){
            var self = this;
            this.codeurl = this.$util.Aurl('captcha','info') +'&t=' +Math.random();
            var name = this.$util.cookie.get('adminloginaccount');
            if( name ) this.username = name;
            
            var postdata = {
                p : 'admin',
                op : 'info',
                fromajax : 1,
            }
            console.log('123')
            self.$util.http('login','GET',postdata,function(res){
                self.bg = res.obj.bg;
            });

        },
	  	methods: {
            changecode(e){
                this.codeurl = this.$util.Aurl('captcha','info') + '&t='+Math.random();
            },
            shopedit(e){
                this.$set(this.article,'content',e);
            },
            addthis(){
                this.shop.params.push({itemt:''});
            },
            delbind(index){
                this.allbind.splice(index,1);
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            searchdate(e){
                this.start = e[0];
                this.end = e[1];
            },

            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if( this.uptarget == 'thumb' ){
                    this.$set(this.article,'thumb',e.attachment);
                    this.$set(this.article,'showthumb',e.url);
                }
            },
            login(){
                var self = this;
                var postdata = {
                    p : 'admin',
                    op : 'sublogin',
                    fromajax : 1,
                    username : this.username,
                    password : this.password,
                    verify : this.verify,
                }
                self.loading = true;

                if( self.isrember && postdata.username ){
                    self.$util.cookie.set('adminloginaccount',postdata.username,999999); 
                }

                self.$util.http('login','GET',postdata,function(res){
                    self.loading = false;
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.$router.push('adminindex');
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                        self.verify = '';
                        self.changecode();
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
.loginbg{
    position: absolute;
    top: 0;
    width: 100%;
    height: 410px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    margin-top: 100px;
    z-index: 1;
}

</style>