<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="操作人员昵称" class="mb5 w300" />
                <DatePicker confirm type="daterange" placement="bottom-end" placeholder="筛选时间" class="w300" @on-ok="searchdate" @on-change="changedate" @on-clear="cleartime"></DatePicker>
            </Col>
        </Row>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="name">
                        <p>{{row.name}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="goods">
                        <p>{{row.createtime}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="order">
                        <p >{{row.ip}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="hxer">
                        <p>{{row.title}}</p>
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
                    {title:'操作姓名',key:'name',slot: 'name'},
                    {title:'操作时间',key:'goods',slot: 'goods',},
                    {title:'IP地址',key:"order",slot: 'order',},
                    {title:'操作内容',key:"hxer",slot: 'hxer',},
                ],
                page : {
	  				pdata : {
	  					doo : 'user',
	  					op : 'operationlog',
	  					page : 1,
	  					style : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : true,
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
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            
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
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                var postdata = {
                    op : 'operationlog'
                }
                self.$util.http('user','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
                        self.total = res.obj.total;
                    }else{
                        self.$Message.error(res.message);
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