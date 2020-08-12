<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    
                    <template slot-scope="{ row }" slot="name">
                        
                        <p>{{row.good.title}}</p>
                    </template>


                    <template slot-scope="{ row }" slot="auth">

                        <p v-if="(!row.auth.iscopy && !settings.iscopy) || row.auth.iscopy == 1">可设置版权</p>
                        <p class="font-error" v-else>不可设置版权(显示平台版权)</p>
                        
                    </template>
                    
                    <template slot-scope="{ row, index }" slot="action">
                        
                        <Poptip
                            v-if="(!row.auth.iscopy && !settings.iscopy) || row.auth.iscopy == 1"
                            confirm
                            title="确定操作吗？"
                            @on-ok="dealthis(row.uniacid,'no')"
                            placement="left">
                            <a>设置不可编辑版权</a>
                        </Poptip>
                        <Poptip
                            v-else
                            confirm
                            title="确定操作吗？"
                            @on-ok="dealthis(row.uniacid,'yes')"
                            placement="left">
                            <a>设置可编辑版权</a>
                        </Poptip>
                        
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
                    {title:'小程序名称',key:'name'},
                    {title:'是否可设置版权',key:"auth",slot: 'auth',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'copy',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        uid : '',
                        gid : '',
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
                self.$util.http('copy','GET',postdata,function(res){
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
                self.$util.http('copy','GET',postdata,function(res){
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