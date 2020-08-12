
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
            props : ['settings'],
            data : function(){
                return {
                    loading : false,
                    isrember : true,
                    username : '',
                    password : '',
                    bg:'http://ykd.lsh199.com/attachment/images/4/2020/05/ZvI3HMHvDDd1D0HHDW6THMWzMdZMHv.jpg',
                }
            },
            created:function(){
                var self = this;
                var name = this.$util.cookie.get('arealoginaccount');
                if( name ) this.username = name;
            },
            methods: {
                login(){
                    var self = this;
                    var postdata = {
                        p : 'area',
                        op : 'login',
                        fromajax : 1,
                        username : this.username,
                        password : this.password,
                    }
                    self.loading = true;

                    if( self.isrember && postdata.username ){
                        self.$util.cookie.set('arealoginaccount',postdata.username,666666);
                    }
                    
                    self.$util.http('login','POST',postdata,function(res){
                        self.loading = false;
                        if( res.status== 200 ){
                            self.$Message.success('登录成功！');
                            self.$router.push('orderdata');
                        }else{
                            self.$Message.error(res.res);
                        };
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
</template>