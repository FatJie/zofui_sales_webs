<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户id" class="mb5 w150" />
            </Col>
        </Row>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="user">
                        <p>{{row.user.nickname}}</p>
                        <p>ID:{{row.user.id}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="parent">
                        <p>{{row.parent.nickname}}</p>
                        <p>ID:{{row.parent.id}}</p>
                        <p>获得提成:{{row.givep}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="pp">
                        <template v-if="row.pp">
                            <p>{{row.pp.nickname}}</p>
                            <p>ID:{{row.pp.id}}</p>
                            <p>获得提成:{{row.givepp}}</p>
                        </template>
                        <template v-else>
                            无
                        </template>

                    </template>
                    <template slot-scope="{ row }" slot="ppp">

                        <template v-if="row.ppp">
                            <p>{{row.ppp.nickname}}</p>
                            <p>ID:{{row.ppp.id}}</p>
                            <p>获得提成:{{row.givepp}}</p>
                        </template>
                        <template v-else>
                            无
                        </template>

                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteallfxgx">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" :page-size="page.pdata.pnum" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>
    </div>
</template>

<script type="text/javascript">
	export default {
	  	components: {
            
	  	},
        props : ['settings','set','type'],
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
                    {title:'用户',key:"user",slot: 'user',},
                    {title:'上级',key:'parent',slot: 'parent',},
                    {title:'上上级',key:'pp',slot: 'pp',},
                    {title:'上上上级',key:'ppp',slot: 'ppp',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'good',
                        op : 'fxgx',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        uid : '',
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
                self.$util.http('good','GET',postdata,function(res){
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
                    p:'admin',
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
                    p:'admin',
                    op : e,
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('good','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
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
                if( params.gid > 0 ){
                    self.page.pdata.id = params.gid;
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
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>