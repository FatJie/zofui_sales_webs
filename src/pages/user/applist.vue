<template>
	<div class="loginbg" >
        <header >
            <Menu mode="horizontal" theme="dark" active-name="1">
                <!-- <div class="layout-logo"></div> -->
                <div class="layout-nav">
                    <MenuItem name="4">
                        <Button shape="circle" @click="loginout">退出登录</Button>
                    </MenuItem>
                </div>
            </Menu>
        </header>
        <Content :style="{padding: '50px'}">

            <Col span="6" class="item" v-for="(item,index) in list" :key="index" >
                <Card class="itemin" @click.native="swich(item.uniacid)">
                    <div >
                        <Avatar icon="ios-person" size="large" :src="item.logo" />
                        <span class="name">{{item.name}}</span>
                    </div>
                    <div class="small">{{item.type == 4 || item.type == 7 ? '小程序' : '公众号'}}</div>
                </Card>
            </Col>

        </Content>

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
                fouder : 0,
                list : [],
	  		}
	  	},
        created:function(){
            this.initData();
            this.$emit('loadmessage',{type:'setback'});
        },
	  	methods: {
            
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
            ina(){
                let site = this.$util.apiUrl() . split('index.php');
                var url = site[0] + 'index.php?c=home&a=welcome&do=system&page=home';
                location.href = url;
            },
            swich(id){
                var self = this;
                console.log(id)
                var postdata = {
                    op : 'swichid',
                    uniacid : id,
                    fromajax : 1,
                }
                self.$util.http('website','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$emit('loadmessage',{type:'initwebmenu'});
                        self.$router.push('settingindex?from=1');
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            loginout(e){
                var self = this;
                var postdata = {
                    op : 'loginout',
                    fromajax : 1,
                }
                self.$util.http('website','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.error('已退出登录');
                        self.$router.push('login');
                        self.inited = true;
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var postdata = {
                    op : 'applist',
                    fromajax : 1,
                }

                self.$util.http('website','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.fouder = res.obj.fouder;
                        self.inited = true;
                    }else{
                        self.$Message.error(res.res);
                    }
                });


                var postdata = {
                    verify : this.verify,
                }
                let site = this.$util.apiUrl() . split('index.php');
                var url = site[0] + 'index.php?c=account&a=display&type=all&isajax=1&sign=1';

                self.$http.post(url,postdata,{emulateJSON : true}).then(function(res){
                    if( res.body ){
                        console.log(res.body)
                        if( res.body.type == 'ajax' && res.body.message && res.body.message.message ){
                            self.list = res.body.message.message;
                        }else{
                            self.$Message.error(res.body.message);
                        }
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
.item{
    padding: 30px;
}
.itemin{
    min-height:100px;
    position: relative;
    cursor: pointer;
}
.small{
    font-size: 10px;
    color: #999;
    position: absolute;
    bottom: 5px;
    left: 15px;
}
.name{
    font-size: 16px;
    font-weight: bold;
    color: #000;
}
</style>