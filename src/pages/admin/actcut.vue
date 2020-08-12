<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" class="mb5 w150">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <Input icon="ios-search" v-model="page.pdata.user" @on-enter="search" @on-click="search" placeholder="输入用户昵称" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="商品ID" class="mb5 w150" />
            </Col>
        </Row>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="goods">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.good.thumb" />
                        <p>{{row.good.title}}</p>
                        
                    </template>
                    <template slot-scope="{ row }" slot="shop">
                        <p>{{row.shop.name}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="user">
                        <p>{{row.user.nickname}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <P>底价：{{row.good.cutbot}}</P>
                        <p>当前价：{{row.nowprice}}</p>
                        <p>结束时间：{{row.showend}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="status">
                             
                        <p v-if="row.status == 0 && row.endtime > nowtime">进行中</p>
                        <p v-else-if="row.status == 1">已完成</p>
                        <p v-else-if="row.status == 2">已失败</p>
                       
                    </template>
                    
                    <template slot-scope="{ row, index }" slot="action">
                        
                        <Poptip
                            confirm
                            title="确定删除吗？"
                            @on-ok="dealthis(row.id,'deletecut')"
                            placement="left">
                            <a>删除</a>
                        </Poptip>

                        <div>
                            <a @click="link" :data-url="'admingoods?id='+row.gid" >查看商品</a>
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
                    {title:'编号',key:'id'},
                    {title:'商品',key:'goods',slot: 'goods',},
                    {title:'参与人',key:"user",slot: 'user',},
                    {title:'数据',key:"data",slot: 'data',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [
                    {label:'未完成',value:1},
                    {label:'已完成',value:2},
                    {label:'已失败',value:3},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'act',
                        op : 'cut',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
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

        },
	  	methods: {
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('act','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
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
                self.$util.http('act','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        if( res.message ) self.$Message.error(res.message);
                    }
                },true);
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
                    self.page.pdata.id = params.id;
                }
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
                        self.total = res.obj.total;
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