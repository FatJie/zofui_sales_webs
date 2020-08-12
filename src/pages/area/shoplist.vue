<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="12">
                
                <Input icon="ios-search" v-model="page.pdata.name" @on-enter="search" @on-click="search" placeholder="输入商户名称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.sid" @on-enter="search" @on-click="search" placeholder="输入商户ID" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.tel" @on-enter="search" @on-click="search" placeholder="输入登录账户" style="width: 150px" />
                <div class="">
                    
                </div>
            </Col>
            <Col span="12" push="2">
                <Button @click="editmoney(0,'addtestshop')">添加测试商户</Button>
                <Button type="primary" @click="link" data-url="/shopadd">添加商户</Button>
                <Button type="info" @click="to(1)">PC商户后台</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable" :loading="tableloading">

                    <template slot-scope="{ row }" slot="name">
                        <p>{{row.name}}</p>
                        <p v-if="row.bindid > 0">关联id:{{row.bindid}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="superior">
                        <p>上级ID:{{row.shangjiid}}</p>
                        <p>上级昵称:{{row.shangjiname}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="agency">
                        <p>代理商ID:{{row.agentid}}</p>
                        <p>代理商昵称:{{row.agentname}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="money">
                        <p>已发布:{{row.yifabu}}</p>
                        <p>已下架:{{row.yixiajia}}</p>
                        <p>在线:{{row.yizaixian}}</p>
                        <p>余额:{{row.money}}</p>
                        <p>积分:{{row.jifen}}</p>
                        <div v-if="settings.isdzpay == 1">
                            活动余额:{{row.actmoney}}
                            <Dropdown placement="left" trigger="click">
                                <a href="javascript:void(0)">
                                    修改
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="money" placeholder="输入数值" />
                                    </div>
                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'editactmoney')">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <p>可发布：{{row.maxpub > 0 ? row.maxpub : '无限制'}}</p>
                        <p v-if="row.parent">{{settings.agentname}}:{{row.parent.nickname}}</p>
                    </template>
                    
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.end > nowtime">正常</p>
                        <p class="font-error" v-else>已过期</p>
                        <p class="font-error" v-if="row.status == 1">已禁用</p>
                        
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'shopadd?id='+row.id" >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deleteshop')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>

                            <a @click="link" :data-url="'orderlist?shopid='+row.id"  >订单</a>
                        </p>
                        <p>
                            <a  :href="row.shopdata" target="_blank" >店铺数据</a>
                            <a  :href="row.shopurl" target="_blank" >管理后台</a>
                        </p>
                        <div>
                            <a @click="link" :data-url="'shopmoneylog?id='+row.id"  >余额记录</a>
                            <Dropdown placement="left" trigger="click">
                                <a href="javascript:void(0)">
                                    修改余额
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="money" placeholder="输入数值" />
                                        <p class="frm_tip">增减值(数字前加-是减)</p>
                                    </div>

                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'changemoneyshop')">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div>
                            <a @click="link" :data-url="'shopjifenlog?id='+row.id"  >积分记录</a>
                            <Dropdown placement="left" trigger="click">
                                <a href="javascript:void(0)">
                                    修改积分
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="money" placeholder="输入数值" />
                                        <p class="frm_tip">增减值(数字前加-是减)</p>
                                    </div>
                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'changejifenshop')">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div>
                            <a v-if="row.isshow == 0" @click="dealthis(row.id,'hide')"  >隐藏店铺</a>
                            <a class="font-error" v-if="row.isshow == 1" @click="dealthis(row.id,'show')"  >显示店铺</a>

                            <a v-if="row.ischain == 0" @click="dealthis(row.id,'hidechain')"  >显示连锁</a>
                            <a v-if="row.ischain == 1" @click="dealthis(row.id,'showchain')"  >隐藏连锁</a>

                        </div>

                        <Dropdown placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                修改密码
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="pass1" placeholder="新的密码" />
                                    <p class="frm_tip">输入新的密码</p>
                                </div>
                                <div style="padding:10px">
                                    <Input v-model="pass2" placeholder="确认密码" />
                                    <p class="frm_tip">确认新的密码</p>
                                </div>
                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'editpass')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                修改{{settings.agentname}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入数值" />
                                    <p class="frm_tip">{{settings.agentname}}id，可在{{settings.agentname}}列表查看</p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'editagent')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                关联ID
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入字符" />
                                    <p class="frm_tip">同一个关联id的商家可在签到功能里互相使用卡券</p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'bindid')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                        
                        <div>
                            <a v-if="settings.account && (settings.account.type == 4 || settings.account.type == 7)" href="javascript:;" :data-copy="'/zofui_sales/shop/shop?id='+row.id" @click="bindtap($event,'copy')" >复制路径</a>
                            <a v-else href="javascript:;" :data-copy="row.appurl" @click="bindtap($event,'copy')"  >复制路径</a>

                            <Dropdown trigger="hover" transfer>
                                <a href="javascript:void(0)">
                                    二维码
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list" class="w200" style="padding:10px;height:auto;text-align:center;">
                                    <img class="actimg" :src="row.urlimg" width="150px" height="150px">
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <p>
                            <a  href="javascript:;" @click="link" :data-url="'goodslist?shopid='+row.id" >查看商品</a>

                            <a v-if="row.frozen == 0" @click="dealthis(row.id,'dongjie')"  >冻结</a>
                            <a class="font-error" v-if="row.frozen == 1" @click="dealthis(row.id,'jiedong')"  >解冻</a>
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
                        <DropdownItem name="deleteallshop">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
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
                tableloading : true,
	  			params : {},
                isall : false,
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:'name',slot: 'name',},
                    {title:'备注(用户名称)',key:"mark",},
                    {title:'账户',key:"account"},
                    {title:'上级',key:"superior",slot: 'superior'},
                    {title:'代理商',key:"agency",slot: 'agency'},
                    {title:'数据',key:'money',slot: 'money',width:200,},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'shop',
                        op : 'list',
                        p:'area',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        name : '',
                        sid : '',
                        tel : '',
                        agentid : '',
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
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            to(type){
                window.open(this.shopurl);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('shop','GET',postdata,function(res){
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
                if( type == 'editpass' ){
                    postdata.pass1 = this.pass1;
                    postdata.pass2 = this.pass2;
                }
                if( type == 'editagent' ){
                    postdata.p = this.money;
                }
                if( type == 'bindid' ){
                    postdata.bindid = this.money;
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.money = 0;
                    }else{
                        if( res.res ) self.$Message.error(res.res);
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
                self.$util.http('shop','GET',postdata,function(res){
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
                if( params.id > 0 ){
                    self.page.pdata.sid = params.id;
                }
                if( params.shopid > 0 ){
                    self.page.pdata.sid = params.shopid;
                }
                if( params.agentid > 0 ){
                    self.page.pdata.agentid = params.agentid;
                }


                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.tableloading = false;
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