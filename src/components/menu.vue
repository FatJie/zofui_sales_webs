<template>
    

</template>

<script type="text/javascript">
	export default {
	    data : function(){
            return {
                Menu : {},
                isIPX : false,
                curPage : '',
                mainMenu : {},
                isneedchange : false,
                isshow : false,
                params : {},
                prepage : '',
                nowpage : '',
            }
        },
        watch : {
            $route(to,from){
                this.getPath();
                this.hideBar();
                this.registShare();
                let ishide = false;
                if( to.name == 'login' ) ishide = true;

                let isback = to.name && to.name == this.prepage;
                this.prepage = from.name;
                this.nowpage = to.name;
                var isshowback = true;

                if( this.mainMenu && this.mainMenu.data ){
                    for (var i = 0; i < this.mainMenu.data.length; i++) {
                        if( this.mainMenu.data[i].appurl == to.path ){
                            isshowback = false;
                        }
                    }
                }
                if( to.path == '/' ) isshowback = false;

                this.$emit('routechange',{isshowback:isshowback,isback:isback,ishide:ishide,title:to.meta.title});
            }
        },
	    created(){
            var self = this;
            self.curPage = this.$route.path;
            var postdata = {
                op : 'info',
            }
            self.$util.http('myinit','GET',postdata,function(res){
                if( res && !res.errno ){
                    self.Menu = res.data.footer;
                    self.mainMenu = res.data.footer;
                    self.copy = res.data.copy;
                    self.params = res.data.params;
                    self.getPath();
                }
            });
	    },
        methods : {
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            getPath(){
                this.curPage = this.$route.path;

                var fxlist = ['fenxiaoaliaccount','fenxiaobill','fenxiaocard_record','fenxiaocheckbill','fenxiaoget_money','fenxiaogoods','fenxiaoindex','fenxiaoinvite_shop','fenxiaomyteam','fenxiaoorder_record','fenxiaorank','fenxiaouser'];

                var adminlist = ['adminindex','adminmoney','adminorder','adminorderinfo','adminset','adminsignin','admingoods','admindraw','adminbadmin','adminbhelplist'];

                if( this.$route.name == 'cutmylist' || this.$route.name == 'cutlist' ){
                    this.isneedchange = true;
                    this.Menu = [{
                        appurl: "/",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/67488/12/2588/762/5d0dc358Ef9bc468f/b433e3b177c7ada2.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/36092/17/12886/1341/5d0dc35eE0e6ea68a/7b57a6ba612a8900.png",
                        title: "首页",
                    }, {
                        appurl: "/cutlist",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/66721/8/2622/686/5d0dc375Efee711aa/023818a1352e59e4.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/82071/22/2573/1169/5d0dc36eE5725f9cc/b498d34537b0c7f8.png",
                        title: "砍价"
                    }, {
                        appurl: "/cutmylist",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/59928/24/2533/1020/5d0dc364E96812b96/5a8562d5fb63ed91.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/48908/16/3017/1686/5d0dc369E85723da6/8df33344cdce38a4.png",
                        title: "我的"
                    }];

                }else if( this.$route.name == 'groupindex' || this.$route.name == 'groupmylist' ){
                    this.isneedchange = true;
                    this.Menu = [{
                        appurl: "/",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/67488/12/2588/762/5d0dc358Ef9bc468f/b433e3b177c7ada2.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/36092/17/12886/1341/5d0dc35eE0e6ea68a/7b57a6ba612a8900.png",
                        title: "首页",
                    }, {
                        appurl: "/groupindex",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/41653/5/7263/3120/5d0dd08cE74caaa81/af951cae21513b34.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/54684/15/3090/4113/5d0dd091E33174b7f/3dd09cebbd32eee5.png",
                        title: "拼单"
                    }, {
                        appurl: "/groupmylist",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/59928/24/2533/1020/5d0dc364E96812b96/5a8562d5fb63ed91.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/48908/16/3017/1686/5d0dc369E85723da6/8df33344cdce38a4.png",
                        title: "我的"
                    }];

                }else if( this.isInArray(fxlist,this.$route.name) ){
                    this.isneedchange = true;
                    this.Menu = [{
                        appurl: "/",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/66538/19/4014/3269/5d2351f9E53638303/d16ba3ba1f225e55.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/66538/19/4014/3269/5d2351f9E53638303/d16ba3ba1f225e55.png",
                        title: "首页",
                    }, {
                        appurl: "/fenxiaobill",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/49710/34/4519/3981/5d235a12E2cc284ad/a4a02c22c99b4b61.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/34162/25/14452/4622/5d235a15E1e64565f/3900800ba49583a9.png",
                        title: "资金",
                    }, {
                        appurl: "/fenxiaogoods",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/76564/29/4072/4005/5d235934E9e4fec12/485ebe5e6f2b173f.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/53034/40/4498/4044/5d235938E08362533/0b26e6d2c077df6b.png",
                        title: "销售"
                    }, {
                        appurl: "/fenxiaouser",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/45769/18/4567/6267/5d235b21Efff10c3e/507efc3f920d8740.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/72323/28/3988/6330/5d235b25E127fda9d/ecbb0c9f41cf8633.png",
                        title: "结算"
                    }];

                    if( this.params.pfs == 1 ){
                        this.Menu.splice(2,1);
                    }

                }else if( this.$route.name == 'jifenindex' || this.$route.name == 'jifenorder' ){
                    this.isneedchange = true;
                    this.Menu = [{
                        appurl: "/",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/66538/19/4014/3269/5d2351f9E53638303/d16ba3ba1f225e55.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/66538/19/4014/3269/5d2351f9E53638303/d16ba3ba1f225e55.png",
                        title: "首页",
                    }, {
                        appurl: "/jifenindex",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/75839/9/3954/8369/5d23579bE7e156ca4/451558d9f2e4221b.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/59479/18/4129/6117/5d23579fE8aade137/55f65f1ae83213ea.png",
                        title: "兑换"
                    }, {
                        appurl: "/jifenorder",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/47923/18/4516/4475/5d2357e9E8606243e/809b31b9c3534d70.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/45234/16/4409/3658/5d2357eeEcb706aa8/f88659b915ebf1cc.png",
                        title: "订单"
                    }];

                }else if( this.isInArray(adminlist,this.$route.name) ){
                    this.isneedchange = true;
                    this.Menu = [{
                        appurl: "/",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/66538/19/4014/3269/5d2351f9E53638303/d16ba3ba1f225e55.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/66538/19/4014/3269/5d2351f9E53638303/d16ba3ba1f225e55.png",
                        title: "首页",
                    }, {
                        appurl: "/adminindex",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/35938/15/13798/3947/5d235655Ed3eb0a0b/77d99c2b774d9d57.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/42293/22/8848/3257/5d23565bE9a518c91/1b4f6a5371c7bd6b.png",
                        title: "功能"
                    }, {
                        appurl: "/adminorder",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/80364/29/4062/4417/5d23528dE8e0cfc52/85f00a7d519d81da.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/64493/31/4034/3613/5d2352d6Ed530bdf9/1337841fc010375c.png",
                        title: "订单"
                    }, {
                        appurl: "/admingoods",
                        iconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/66682/39/4079/3846/5d2353abE3a420e1a/b062b30113205241.png",
                        selectedIconPath: "https://img11.360buyimg.com/ddimg/jfs/t1/63518/1/4025/3920/5d2353b0Eedcf527b/f1b0786a2532cdda.png",
                        title: "商品"
                    }];

                }else if(this.isneedchange){
                    this.Menu = this.mainMenu;
                    this.isneedchange = false;
                }
                
            },
            isInArray(arr,value){
                for(var i = 0; i < arr.length; i++){
                    if(value && value == arr[i]){
                        return true;
                    }
                }
                return false;
            },
            hideBar(){
                var hidelist = ['login','goodinfo','shopinfo','cardmyinfo','jiziinfo','adminbindadmin','adminhexiao','adminhexiaocard','commentinfo','orderinfo','mymoney','jifengoods','signinfo','zhuanpan','redbaginfo','commentorder','orderaddaddress','orderconfirm','orderaddress','groupinfo','agentjoin','adminpay','fenxiaoinvite_shop','buycard','adminsignin','cardinfo','adminpub','agentinvite','adminbaddcard','adminbcard','adminset','fenxiaojoinPartner','kefuindex','vedioindex'];
                var ishide = this.isInArray(hidelist,this.$route.name);
                if(ishide){
                    this.isshow = false;
                }else{
                    this.isshow = true;
                }                
            },
        }
	}
</script>

<style type="text/css">
/*tabbar*/
.fix-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 101;
    background-color: #fff;
    transform: translateZ(0);
}

.app-tabbar {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 56px;
    box-shadow: 0 0 1.5px 0 rgba(0,0,0,0.2);
    transform: translateZ(0);
}

.app-tabbar:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0.5px;
    background-color: rgba(0,0,0,0.33);
}

.app-tabbar .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-flex: 1;
    flex: 1;
    padding-top: 5px;
    font-size: 10px;
    line-height: 18px;
    color: #666;
}
.app-tabbar .item img{
    width: 28px;
}
.app-tabbar .item .icon {
    width: 25px;
    height: 25px;
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: 100%;
}

.app-tabbar .item.active .icon {
    background-position: center bottom;
}
</style>