<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="排序方式" @on-change="shaixuan($event,'orderby')" style="width:150px">
                    <Option v-for="item in otype" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.nick" @on-enter="search" @on-click="search" placeholder="输入用户昵称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.userid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                <div class="">
                    
                </div>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="head">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.headimg" />
                    </template>
                    <template slot-scope="{ row }" slot="money">
                        <p>余额:{{row.money}}</p>
                    </template>
                    
                    <template slot-scope="{ row }" slot="shopnum">
                        {{row.downnum > 0 ? row.downnum : 0}}
                    </template>
                    
                    <template slot-scope="{ row }" slot="agentper">
                        {{row.agentper <= 0 ? settings.agentper : row.agentper}}%
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'shoplist?agentid='+row.id"  >查看商户</a>
                            <Poptip
                                confirm
                                title="确定关闭吗？"
                                @on-ok="dealthis(row.id,'closeagent')"
                                placement="left">
                                <a>关闭代理</a>
                            </Poptip>
                        </p>

                        <Dropdown placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                修改佣金比例
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入数值" />
                                    
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'editagentper')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>

                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                <!-- <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deletealluser">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown> -->
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
                    {title:'ID',key:'id',width:100},
                    {title:'头像',key:'head',slot: 'head',},
                    {title:'昵称',key:"nickname",},
                    {title:'区域',key:"agentarea",},
                    {title:'手机',key:'tel'},
                    {title:'佣金比例',key:'agentper',slot:'agentper'},
                    {title:'余额',key:'money'},
                    {title:'邀请码',key:'agentcode'},
                    {title:'商户数',key:'shopnum',slot:'shopnum'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                otype : [
                    {label:'默认排序',value:0},
                    {label:'分销余额排序',value:1},
                    {label:'支付余额排序',value:2},
                    {label:this.settings.jfbname+'数量排序',value:3},
                ],
                page : {
                    pdata : {
                        doo : 'agent',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
                        orderby : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                allsort : [],
                alltwosort : [],
                selected : [],
                money : '',
                pass1 : '',
                pass2 : '',
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            to(type){
                window.open(this.shopurl);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    uid : id,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            editmoney(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    sid : id,
                    value : this.money,
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
                self.$util.http('agent','GET',postdata,function(res){
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
                        self.shopurl = res.obj.shopurl;

                        
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