<template>

        <router-view @loadmessage="loadmessage" v-if="currentpage == 'arealogin' || currentpage == 'adminlogin' || currentpage == 'login' || currentpage == 'applist' || currentpage == 'pageindex' || currentpage == 'pageuser'" v-bind:settings="settings"></router-view>
        <Layout v-else style="height:100%;min-height:100vh;min-width:1200px;" class="main">
            <Sider hide-trigger collapsible :width="160" :collapsed-width="64" v-model="collapsed" class="left-sider left-sider-default" :class="{'left-sider-defaultn':collapsed}" :style="{overflow:'hidden',background:webtype == 'admin' ? '#fff' : '#001529'}" >

                <div class="side-menu-wrapper">
                    <div class="logo-con" >
                        <img v-if="settings.ptlogo" :src="settings.ptlogo">
                        <div v-else style="margin-left:15px;">
                            {{collapsed ? '' : top.name}}
                        </div>
                    </div>
                    <Menu ref="side_menu" v-show="!collapsed" :active-name="activename" :open-names="opennames" :accordion="true" :theme="webtype == 'admin' ? 'light' : 'dark'" width="auto" @on-select="handleSelect">
                        <template v-for="(item,index) in menu">

                            <Submenu :name="index" v-if="item.list && item.list.length > 0 && !item.hide"  >
                                <template slot="title">
                                    <Icon :type="item.ic ? item.ic : ''"></Icon>
                                    {{item.name}}
                                </template>
                                <MenuItem v-for="(inn,idx) in item.list" :name="index + '-' + idx" v-if="!inn.hide" :to="inn.appurl" target="_self">{{inn.name}}</MenuItem>
                            </Submenu>
                            <MenuItem v-else-if="item.list.length <= 0" :name="index" :to="item.appurl">
                                <template >
                                    <Icon :type="item.ic ? item.ic : ''"></Icon>
                                        {{item.name}}
                                    <Icon type="ios-arrow-forward" class="menuto" />
                                </template>
                            </MenuItem>
                        </template>
                    </Menu>
                    <div class="menu-collapsed" v-show="collapsed">
                        <template v-for="item in menu">
                            
                            <Dropdown transfer-class-name="overshow" v-if="item.list && item.list.length >= 1 && !item.hide" ref="dropdown"  transfer placement="right"  style="text-align: center;padding:5px 0;position: relative;" @on-click="linkto">
                                <a class="drop-menu-a" type="text"  :style="{textAlign:'left'}">
                                    <Icon :type="item.ic" :color="webtype == 'admin' ? '#515a6e' : '#ffffff'" :size="25"/>
                                </a>

                                <DropdownMenu slot="list" >
                                    <div style="padding-left:15px;font-weight:bold;">{{item.name}}</div>
                                    <template v-for="inn in item.list">
                                        <DropdownItem :name="inn.appurl">
                                            <div>
                                                <span class="menu-title">{{inn.name}}</span>
                                                <Icon type="ios-arrow-forward" size="12" />
                                            </div>
                                        </DropdownItem>
                                    </template>
                                </DropdownMenu>
                            </Dropdown>

                            <Tooltip transfer v-else-if="item.list.length <= 0" :content="item.name" placement="right" style="text-align: center;width: 100%;padding:5px 0;cursor:pointer;" >
                                <Icon @click="link" :data-url="item.appurl" :type="item.ic" color="#ffffff" :size="25"/>
                            </Tooltip>
                        </template>
                    </div>
                </div>

            </Sider>
            <Layout>
                    <Header class="header-con">
                        <Row  align="middle" type="flex">
                            <Col span="2">
                                <div class="header-bar">
                                    
                                    <a @click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']">
                                        <Icon type="md-menu" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']" :size="30" />
                                    </a>
                                </div>
                            </Col>
                            <Col span="16">
                                <Breadcrumb>
                                    <BreadcrumbItem>{{bread[0]}}</BreadcrumbItem>
                                    <BreadcrumbItem>{{bread[1]}}</BreadcrumbItem>
                                </Breadcrumb>
                            </Col>
                            <Col span="6" v-if="webtype == 'web'">
                                <Button shape="circle" @click="bindtap($event,'weburl')" :data-weburl="top.backurl" v-if="backtype == 0">返回</Button>
                                <Button shape="circle" @click="tolist" v-if="backtype == 1">返回</Button>
                                <!-- <Button shape="circle" @click="setv" >使用旧版后台</Button> -->
                            </Col>
                            <Col span="6" v-else-if="webtype == 'admin'" >
                                
                                <Dropdown @on-click="topevent">
                                    <span>{{shop.name}}</span>
                                    <Avatar :src="shop.showheadimg" />
                                    <Icon type="md-arrow-dropdown" />
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="info">账户信息</DropdownItem>
                                        <DropdownItem name="out">退出登录</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                            <Col span="6" v-else >
                                <Button shape="circle" @click="logout">退出登录</Button>
                            </Col>
                        </Row>
                    </Header>
                    <Content class="main-content-con">
                        <Layout class="main-layout-con">
                            <div class="tag-nav-wrapper">
                            </div>
                            <Content class="content-wrapper" style="padding: 10px;">
                                <div style="background:#fff;padding:10px;">
                                    <router-view @loadmessage="loadmessage" v-bind:settings="settings" v-bind:menu="menu"></router-view>
                                </div>
                                <BackTop :duration="duration"></BackTop>
                            </Content>
                            <Footer class="layout-footer-center" v-html="copy"></Footer>
                        </Layout>
                    </Content>
            </Layout>
        </Layout>
</template>

<script>
    export default {
      	name: 'App',
        components : {
            
        },
      	data : function(){
      		return {
                duration:300,
      			loaded : false,
                scrolltop : 0,
                show : true,
                menu : [],
                copy : '',
                top : [],
                activename : "0-0",
                opennames : [0],
                bread : ['参数设置','参数设置'],
                settings : {},
                designindex : '',
                settingurl : '',
                collapsed : false,
                activeName : '',
                showChildren : [],
                currentpage : '',
                webtype : '',
                shop:false,
                backtype : 0,
      		}
      	},
        created(){
            var self = this;
            //self.$router.push('/shopmoneylog');
            
            if( location.href.indexOf('p=admin') >= 0 ){

                this.webtype = 'admin';
                this.admininit();
                
                if( location.href.indexOf('#/admin') <= 0 ){
                    self.$router.push('/adminindex');
                }
                this.bread = ['数据预览','数据预览'];
                if( self.$router.history && self.$router.history.current.name ){
                    self.changeact(self.$router.history.current.name);
                }
            }else if( location.href.indexOf('p=area') >= 0 ){

                this.webtype = 'area';
                this.areainit();

                if( location.href.indexOf('#/area') <= 0 ){
                    self.$router.push('/areaindex');
                }
                this.bread = ['数据预览','数据预览'];
                if( self.$router.history && self.$router.history.current.name ){
                    self.changeact(self.$router.history.current.name);
                }
            }else{
                this.webtype = 'web';

                this.webinit();
                this.bread = ['参数设置','参数设置'];
            }
        },
        updated() {
            window.scroll(0, 0);
        },
        watch : {
            $route(to,from){
                var self = this;
                
                if( to.meta && to.meta.title ){
                    document.title = to.meta.title;
                }
                self.currentpage = to.name;
                if( this.currentpage != 'adminlogin' && this.currentpage != 'arealogin' && this.currentpage != 'pageindex' && this.currentpage != 'pageuser' ){
                    self.changeact(to.name);
                }
                if( self.webtype == 'admin' ){
                    var postdata = {
                        p:'admin',
                        op : 'getshop',
                        fromajax : 1,
                    }
                    self.$util.http('website','GET',postdata,function(res){
                        if( res.status == 200 ){
                            self.shop = res.obj.shop;
                        }
                    });
                }
                if( self.currentpage == 'applist' ){
                    self.webinit();
                }
            }
        },
        mounted() {
            if( this.currentpage != 'adminlogin' && this.currentpage != 'arealogin' && this.currentpage != 'pageindex' && this.currentpage != 'pageuser' ){
                this.$nextTick(() => {
                //   this.$refs.side_menu.updateOpened();
                    this.$refs.side_menu.updateActiveName();
                })
            }
        },
      	methods: {
            changeact(to){
                if( to == 'activity' ){
                    this.bread = ['营销',''];
                    this.activename = "12-0";
                    this.opennames = [12];
                }
                for (var i = 0; i < this.menu.length; i++) {
                    if( this.menu[i].list ){
                        for (var j = 0; j < this.menu[i].list.length; j++) {
                            if( this.menu[i].list[j].appurl && this.menu[i].list[j].appurl == to ){

                                this.bread = [this.menu[i].name,this.menu[i].list[j].name];

                                this.activename = i+"-"+j;
                                this.opennames = [i];
                            }
                        }
                    }
                }
                this.$nextTick(() => {
                //   this.$refs.side_menu.updateOpened();
                    this.$refs.side_menu.updateActiveName();
                })
            },
            handleSelect(){

            },
            handleChange(){
                this.collapsed = !this.collapsed;
            },
            logout(){
                var postdata = {
                    p:'area',
                    op : 'logout',
                    fromajax : 1,
                }
                this.$util.http('login','GET',postdata,res=>{
                    if( res.status == 200 ){
                        this.$router.push('/arealogin');
                    }
                },true);
            },
            topevent(e){
                var self = this;
                if( e == 'info' ){
                    self.$router.push('/adminindex');
                }else if(e == 'out'){
                    var postdata = {
                        p:'admin',
                        op : 'loginout',
                        fromajax : 1,
                    }
                    self.$util.http('login','GET',postdata,function(res){
                        if( res.status == 200 ){
                            self.$router.push('/adminlogin');
                        }
                    },true);
                }else if(e == 'old'){
                    var postdata = {
                        p:'admin',
                        op : 'setv',
                        type:'old',
                        fromajax : 1,
                    }
                    self.$util.http('ajax','GET',postdata,function(res){
                        if( res.status == 200 ){
                            location.reload();
                        }
                    },true);
                }

            },
            linkto(e){
                console.log(e);
                this.$router.push(e);
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            setv(){
                var self = this;
                var postdata = {
                    op : 'setv',
                    type : 'old',
                    fromajax : 1,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        var url = self.$util.Murl('setting','admin');
                        location.href = url;
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            tolist(){
                this.$router.push('applist');
            },
      		loadmessage(e){
                this.apptitle = e.title;
                if( e.type == 'setback' ){
                    this.backtype = 1;
                }else if( e.type == 'initwebmenu'){
                    this.getset();
                }
      		},
            back(){
                this.$router.go(-1);
            },
            webinit(){
                var self = this;
                var postdata = {
                    op : 'index',
                }
                self.$util.http('website','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.menu = res.obj.menu;
                        self.copy = res.obj.copy;
                        self.top = res.obj.top;
                        self.settings = res.obj.settings;
                        var href = location.href;
                        let query = self.$util.getQuery(location.href);
                        if( query && query.do ){
                            
                            if( query.do == 'data'){
                                self.$router.push('dataorder');
                            
                            }else if(query.do == 'setting'){

                            }else if(query.do == 'goods'){
                                self.$router.push('goodslist');
                            
                            }else if(query.do == 'user'){
                                self.$router.push('userlist');
                                self.changeact('userlist');
                            }else if(query.do == 'shop'){
                                self.$router.push('shoplist');
                                
                            }else if(query.do == 'agent'){
                                self.$router.push('agentlist');
                            
                            }else if(query.do == 'order'){
                                self.$router.push('orderlist');
                            
                            }else if(query.do == 'act'){
                                self.$router.push('actcut');
                                
                            }else if(query.do == 'page'){
                                self.$router.push('pagelist');
                                
                            }else if(query.do == 'money'){
                                self.$router.push('moneywaitpay');
                                
                            }else if(query.do == 'fx'){
                                self.$router.push('fxlog');
                                
                            }else if(query.do == 'activity'){
                                self.$router.push('activityindex');
                            
                            }else if(query.do == 'copy'){
                                self.$router.push('copylist');
                                
                            }
                        }
                    }else{
                        self.$Message.error('请重新登录');
                    }

                    self.changeact(self.$router.history.current.name);

                    self.$nextTick(() => {
                    //   self.$refs.side_menu.updateOpened();
                        self.$refs.side_menu.updateActiveName();
                    })
                },true);
                this.designindex = this.$util.Murl('page','designindex');
            },
            getset(){
                var self = this;
                var postdata = {
                    op : 'index',
                }
                self.$util.http('website','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.menu = res.obj.menu;
                        self.settings = res.obj.settings;
                    }
                })
            },
            admininit(){
                var self = this;
                var postdata = {
                    op : 'index',
                    p:'admin',
                }
                self.$util.http('website','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.menu = res.obj.menu;
                        self.top = res.obj.top;
                        self.settings = res.obj.settings;
                    }
                    self.$nextTick(() => {
                    //   self.$refs.side_menu.updateOpened();
                        self.$refs.side_menu.updateActiveName();
                    })
                },true);
            },
            areainit(){
                var self = this;
                var postdata = {
                    op : 'index',
                    p:'area',
                }
                self.$util.http('website','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.menu = res.obj.menu;
                        self.top = res.obj.top;
                        self.settings = res.obj.settings;
                    }
                    self.$nextTick(() => {
                    //   self.$refs.side_menu.updateOpened();
                        self.$refs.side_menu.updateActiveName();
                    })
                },true);
            },
      	}
    }
</script>
<style type="text/css">
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.layout-footer-center{
    text-align: center;
}
#app>.ivu-layout{
    min-height: 100vh;
}

.menuto{
    position: absolute;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
}

/**/
.ivu-layout-sider {
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
    position: relative;
    background: #001529;
    min-width: 0;
    position: relative;
    z-index: 900;
}
.ivu-layout-sider-zero-width-trigger {
    position: absolute;
    top: 64px;
    right: -36px;
    text-align: center;
    width: 36px;
    height: 42px;
    line-height: 42px;
    background: #001529;
    color: #fff;
    font-size: 18px;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
    -webkit-transition: background .3s ease;
    transition: background .3s ease;
}
.ivu-menu-dark {
    background: #001529;
}
.main .header-con {
    background: #fff;
    padding: 0 20px;
    width: 100%;
}
.sider-trigger-a {
    text-align: center;
    color: #5c6b77;
}
.main .logo-con {
    height: 64px;
    padding: 10px;
    line-height: 44px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    z-index: 900;
}
.main .logo-con img {
    height: 44px;
    width: auto;
    display: block;
    margin: 0 auto;

}

.sider-trigger-a.collapsed i {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    border-right: none;
    color: #fff;
    background: #2d8cf0!important;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background: #000c17;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
    background: #001529;
}

.left-sider-default .ivu-layout-sider-children{
    position: fixed;
    width: 160px;
    height: 100vh;
    overflow-y: scroll;
}
.left-sider-defaultn .ivu-layout-sider-children{
    width: 64px;
}
.left-sider .ivu-layout-sider-children::-webkit-scrollbar
{  
    width: 3px;
    height: 5px;  
    background-color: #F5F5F5;  
}  
.left-sider .ivu-layout-sider-children::-webkit-scrollbar-track  
{  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}   
.left-sider .ivu-layout-sider-children::-webkit-scrollbar-thumb  
{  
    border-radius: 10px;  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #c3c3c3;  
}
.left-sider .ivu-layout-sider-children::-o-scrollbar
{  
    width: 3px;
    height: 5px;  
    background-color: #F5F5F5;  
}  
.left-sider .ivu-layout-sider-children::-o-scrollbar-track  
{  
    -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}   
.left-sider .ivu-layout-sider-children::-o-scrollbar-thumb  
{  
    border-radius: 10px;  
    -o-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #c3c3c3;  
}
.left-sider .ivu-layout-sider-children::-ms-scrollbar
{  
    width: 3px;
    height: 5px;  
    background-color: #F5F5F5;  
}  
.left-sider .ivu-layout-sider-children::-ms-scrollbar-track  
{  
    -ms-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}   
.left-sider .ivu-layout-sider-children::-ms-scrollbar-thumb  
{  
    border-radius: 10px;  
    -ms-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #c3c3c3;  
}

.menu-collapsed .ivu-dropdown{
    display: block;
}

.overshow{
    overflow: initial!important;
    max-height: initial!important;
}

</style>