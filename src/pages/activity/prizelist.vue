<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="0" @on-click="changetab">
            <TabPane label="奖品管理" name="0" ></TabPane>
            <TabPane label="添加奖品" name="1" ></TabPane>
            <TabPane label="中奖记录" name="2" ></TabPane>
        </Tabs>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="type">
                        <p v-if="row.type == 0">未中奖</p>
                        <p v-if="row.type == 1">优惠券</p>
                        <p v-if="row.type == 2">{{settings.jfbname}}</p>
                        <p v-if="row.type == 3">余额</p>
                    </template>
                    <template slot-scope="{ row }" slot="stock">
                        <p v-if="row.type == 0">无</p>
                        <p v-if="row.type == 1">{{row.card.stock}}</p>
                        <p v-if="row.type == 2 || row.type == 3">{{row.stock}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="per">
                        {{row.per}}%
                    </template>
                    
                    <template slot-scope="{ row }" slot="status">

                        <template v-if="row.type == 0">
                            正常
                        </template>
                        <template v-if="row.type == 1">
                            <template v-if="row.card.stock <= 0">
                                <p>已抽完</p>
                            </template>
                            <template v-else>
                                <p v-if="row.card.end < nowtime">已过期</p>
                                <p>正常</p>
                            </template>
                        </template>
                        <template v-if="row.type == 2 || row.type == 3">
                            <template v-if="row.stock <= 0">
                                已抽完
                            </template>
                            <template v-else>正常</template>
                        </template>

                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'prizeadd?id='+row.id"  >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'delete')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>

                        </p>
                        
                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                <Button @click="handleSelectAll">{{isall ? '取消' : '全选'}}</Button>
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteall">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                
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
                isall : false,
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:'name'},
                    {title:'类型',key:"type",slot: 'type',},
                    {title:'库存',key:"stock",slot: 'stock',},
                    {title:'中奖概率',key:"per",slot: 'per',},
                    {title:'已抽中',key:"taked"},
                    {title:'状态',key:'status',slot:'status'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'prize',
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
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            changetab(e){
                if( e == 0 ){
                    this.$router.push('prizelist');
                }
                if( e == 1 ){
                    this.$router.push('prizeadd');
                }
                if( e == 2 ){
                    this.$router.push('prizelog');
                }
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('prize','GET',postdata,function(res){
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
                    sid : id,
                    value : this.money,
                }
                self.$util.http('prize','GET',postdata,function(res){
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
                self.$util.http('prize','GET',postdata,function(res){
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