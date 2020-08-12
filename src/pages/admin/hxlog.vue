<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Input icon="ios-search" v-model="page.pdata.nick" @on-enter="search" @on-click="search" :placeholder="'输入'+settings.hxbname+'者昵称'" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.bm" @on-enter="search" @on-click="search" :placeholder="'输入'+settings.hxbname+'者别称'" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="商品ID" class="mb5 w150" />
                <DatePicker confirm type="daterange" placement="bottom-end" placeholder="筛选时间" class="w150" @on-ok="searchdate" @on-change="changedate" @on-clear="cleartime"></DatePicker>
                <Button type="primary" @click="down">导出记录</Button>
            </Col>
        </Row>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="goods">
                        <p>{{row.goods.title}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="order">
                        <p>编号：{{row.orderid}}</p>
                        <p >金额：{{row.fee}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="hxer">
                        <p v-if="row.user">{{row.user.nickname}}</p>
                        <p v-if="row.user && row.user.hxname">别名:{{row.user.hxname}}</p>
                        <p>次数:{{row.times}}</p>
                        
                        
                    </template>
                    <template slot-scope="{ row }" slot="shop">
                        {{row.shop.name}}
                    </template>

                    <template slot-scope="{ row }" slot="content">
                        <div>星级:{{row.star <= 0 ? 5 : row.star}}</div>
                        <p>{{row.content}}</p>
                        <div>
                            <Avatar style="margin:0 5px 5px 0" v-for="(item,index) in row.img" icon="ios-person" size="large" shape="square" :src="item" />
                        </div>
                    </template>
                    
                    <template slot-scope="{ row, index }" slot="action">
                        <div>
                            <a  @click="link" :data-url="'adminorder?orderid='+row.orderid" >查看订单</a>
                            <a  @click="link" :data-url="'admingoods?gid='+row.gid" >查看商品</a>
                        </div>
                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
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
	  			params : {},
	  			list : [],
	  			allsort : [],
                total : 0,
                data : {},
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id'},
                    {title:'商品',key:'goods',slot: 'goods',},
                    {title:'订单',key:"order",slot: 'order',},
                    {title:'核销',key:"hxer",slot: 'hxer',},
                    {title:'时间',key:'showtime',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'order',
                        op : 'hexiao',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        bm : '',
                        gid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                allsort : [],
                alltwosort : [],
                selected : [],
                money : '',
                data : {},
	  		}
	  	},
        created:function(){
            this.initData();
            this.columns[2].title = this.settings.goodbname;
            this.columns[4].title = this.settings.hxbname;
        },
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('order','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            editmoney(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                    value : this.money,
                }
                if( type == 'backfee' ){
                    postdata.oid = id;
                    postdata.fee = this.money;
                }
                if( type == 'changemoneyuser' ){
                    postdata.type = 'user';
                }
                if( type == 'testmess' ){
                    postdata.uid = id;
                    postdata.mess = this.money;
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.money = 0;
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            dealselect(e){
                var self = this;

                if( this.selected.length <= 0 ){
                    self.$Message.error('还没选择操作的数据');return false;
                }

                var postdata = {
                    op : e,
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('order','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            down(){
                let url = this.$util.Aurl('order','hexiao') + '&down=1';
                for(var t in this.page.pdata){
                    if( t != 'fromajax' && t != 'page' && t != 'pnum' ){
                        url += '&'+t+'='+this.page.pdata[t]
                    }
                }
                if( this.page.pdata.time ){
                    url += '&time[start]='+this.page.pdata.time.start;
                    url += '&time[end]='+this.page.pdata.time.end;
                }
                location.href = url;
            },
            changedate(e){
                this.sdate = {start:e[0],end:e[1]};
            },
            searchdate(e){
                if( this.sdate ){
                    this.page.pdata.time = this.sdate;
                }
                this.onLoad();
            },
            cleartime(){
                this.page.pdata.time = '';
                this.page.pdata.page = 1;
                this.onLoad();
            },
            selectTable(e,a){
                var arr = [];
                for (var i = 0; i < e.length; i++) {
                    arr.push(e[i].id);
                }
                this.selected = arr;
            },
            search(){
				this.page.pdata.page = 1;
                this.onLoad();
            },
            shaixuan(e,type){
                this.page.pdata[`${type}`] = e;
				this.page.pdata.page = 1;
                this.onLoad();
            },
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                if( params.id > 0 ){
                    self.page.pdata.userid = params.id;
                }
                if( this.type == 1 ){
                    self.page.pdata.isshow = 1;
                }
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
                        self.total = res.obj.total;
                        self.data = res.obj.data;
                        
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
                        self.total = res.obj.total;
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>