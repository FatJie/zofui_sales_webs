<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入分销者ID" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="输入商品ID" style="width: 150px" />
                <DatePicker confirm type="daterange" placement="bottom-end" placeholder="筛选时间" class="w150" @on-ok="searchdate" @on-change="changedate" @on-clear="cleartime"></DatePicker>
                <Button type="primary" @click="down">导出数据</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    
                    <template slot-scope="{ row }" slot="goods">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.good.thumb" />
                        <p>{{row.good.title}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="user">

                        
                        <p class="font-note" v-if="row.fxsaler">一级：{{row.fxsaler.nickname}}（{{row.fxsaler.id}}）</p>
                        <p class="font-note" v-if="row.fxsalera">二级：{{row.fxsalera.nickname}}（{{row.fxsalera.id}}）</p>
                        <p class="font-note" v-if="row.fxsalerb">三级：{{row.fxsalerb.nickname}}（{{row.fxsalerb.id}}）</p>


                    </template>
                    <template slot-scope="{ row }" slot="money">
                        <p>订单金额：{{row.fee}}</p>
                        <p>商家收入：{{row.shopfee}}</p>
                        <p>服务费用：{{row.sever}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p v-if="row.ispayfx == 0">未结算</p>
                        <p v-if="row.ispayfx == 1">已结算</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        
                        <p class="font-error" v-if="row.salerfee > 0">商户一级:{{row.salerfee}}</p>
                        <p class="font-error" v-if="row.salerfeea > 0">商户二级:{{row.salerfeea}}</p>
                        <p class="font-error" v-if="row.salerfeeb > 0">商户三级:{{row.salerfeeb}}</p>

                        <p class="font-error" v-if="row.ptsalerfee > 0">平台一级:{{row.ptsalerfee}}</p>
                        <p class="font-error" v-if="row.ptsalerfeea > 0">平台二级:{{row.ptsalerfeea}}</p>
                        <p class="font-error" v-if="row.ptsalerfeeb > 0">平台三级:{{row.ptsalerfeeb}}</p>
                        
                    </template>


                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'/shoplist?id='+row.shopid"  >查看商户</a>
                            <a @click="link" :data-url="'/goodslist?id='+row.gid"  >查看商品</a>
                        </p>
                        
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
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'订单编号',key:'orderid'},
                    {title:'商品',key:"goods",slot: 'goods',},
                    {title:'分销者',key:'user',slot: 'user',},
                    {title:'资金',key:"money",slot: 'money',},
                    {title:'数据',key:'data',slot: 'data',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'未结算',value:1},{label:'已结算',value:2}],
                page : {
                    pdata : {
                        doo : 'fx',
                        op : 'log',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        uid : '',
                        gid : '',
                        time : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                allsort : [],
                alltwosort : [],
                selected : [],
	  		}
	  	},
        created:function(){
            this.initData();

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
                self.$util.http('fx','GET',postdata,function(res){
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
                self.$util.http('fx','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
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
            down(){
                let url = this.$util.Murl('fx','log') + '&down=1';
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
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            remove(e){
                var self = this;
                var postdata = {
                    op : 'list',
                    fromajax : 1,
                }
                self.$util.http('fx','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.$Message.error(res.res);
                        for (var i = 0; i < self.list.length; i++) {
                            if(self.list[i].id == e){

                                self.list.splice(i,1);
                                self.list = self.list;

                            }
                        }
                        
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
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