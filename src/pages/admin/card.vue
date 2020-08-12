<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="admincard" @on-click="changetab">
            <TabPane label="优惠券列表" name="admincard" ></TabPane>
            <TabPane label="添加优惠券" name="admincardadd" ></TabPane>
            <TabPane label="领取记录" name="admincardlog" ></TabPane>
            <TabPane label="发红包记录" name="admincardredbaglog" ></TabPane>
        </Tabs>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="type">
                        <p v-if="row.type == 0">在线使用</p>
                        <p v-if="row.type == 1">到店使用</p>

                        <p v-if="row.auth == 0">所有粉丝领取</p>
                        <p v-if="row.auth == 1">仅限会员领取</p>
                        <p v-if="row.auth == 2">仅限高级会员领取</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <p class="font-note">面值：{{row.fee}}</p>
                        <p class="font-note">条件：{{row.use}}</p>
                        <p class="font-note">剩余：{{row.stock}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="share" v-if="settings.cardbag == 0">
                        <div class="font-note">
                            状态：
                            <template v-if="row.isredbag == 1">
                                <span class="font-error" v-if="row.redbag <= 0.3">资金不足</span>
                                <span class="font-error" v-else-if="row.startfee < 0.3">金额未设置</span>
                                <span class="font-info" v-else>已开启</span>
                                <a @click="editmoney(row.id,'closeredbag')" >关闭红包</a>
                            </template>
                            <template v-else>
                                <span class="font-error" >已关闭</span>
                                <a @click="editmoney(row.id,'openredbag')" >开启红包</a>
                            </template>
                        </div>
                        <p class="font-note">
                            剩余：{{row.redbag}}

                            <Dropdown trigger="click"  style="display:inline-block;">
                                <a href="javascript:void(0)" >
                                    充值
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div class="pd10">
                                        <div class="mb10">
                                            <RadioGroup v-model="row.paytype">
                                                <Radio :label="0">账户余额转红包余额</Radio>
                                                <Radio :label="1">扫码充值</Radio>
                                            </RadioGroup>
                                        </div>
                                        <div class="mb10" v-if="row.paytype == 0" >
                                            <Input v-model="row.paymoney" placeholder="输入金额"  />
                                        </div>
                                        <div class="tr">
                                            <Button type="primary" size="small" @click="editmoney(row.id,'addcardredbag',row)">确定</Button>
                                        </div>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown v-if="row.redbag > 0 && settings.bagtom == 0" trigger="click"  style="display:inline-block;">
                                <a href="javascript:void(0)" >
                                    转出
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div class="pd10">
                                        <div class="mb10"  >
                                            <Input v-model="row.outmoney" placeholder="输入金额"  />
                                        </div>
                                        <div class="tr">
                                            <Button type="primary" size="small" @click="editmoney(row.id,'outcardredbag',row)">确定</Button>
                                        </div>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </p>
                        <p class="font-note">已发：{{row.payedred}}</p>
                        <p class="font-note">
                            金额：{{row.startfee == row.endfee ? row.endfee : row.startfee +'-'+ row.endfee}}
                            <Dropdown trigger="click"  style="display:inline-block;">
                                <a href="javascript:void(0)" >
                                    修改
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div class="pd10">
                                        <div class="mb10" >
                                            分销者
                                            <Input v-model="row.startfee" placeholder="输入最小金额" class="w100" />至
                                            <Input v-model="row.endfee" placeholder="输入最多金额" class="w100" />
                                        </div>
                                        <div class="mb10" >
                                            分销者上级
                                            <Input v-model="row.startfeep" placeholder="输入最小金额" class="w100" />至
                                            <Input v-model="row.endfeep" placeholder="输入最多金额" class="w100" />
                                        </div>
                                        <div>最低0.3元。若填相同的金额则发固定的金额红包</div>
                                        <div class="tr">
                                            <Button type="primary" size="small" @click="editmoney(row.id,'editcardred',row)">确定</Button>
                                        </div>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </p>
                        <p class="">
                            <a @click="link" :data-url="'admincardredbaglog?id='+row.id"  >查看记录</a>
                        </p>
                        <p class="font-error" v-if="row.rederr">错误：{{row.rederr}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="status">

                        <template v-if="row.start > nowtime">
                            <p class="font-error">未开始</p>
                        </template>
                        <template v-else-if="row.end < nowtime">
                            <p class="font-error">已过期</p>
                        </template>
                        <template v-else-if="row.stock <= 0">
                            已领完
                        </template>
                        <template v-else>正常</template>

                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'admincardadd?id='+row.id"  >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'delete')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                            
                        </p>
                        <p>
                            <a @click="link" :data-url="'admincardlog?id='+row.id"  >领取记录</a>
                        </p>
                        <div>
                            
                            <a v-if="settings.account && (settings.account.type == 4 || settings.account.type == 7)" href="javascript:;" :data-copy="'/zofui_sales/card/info?id='+row.id" @click="bindtap($event,'copy')" >复制路径</a>
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
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:'name'},
                    {title:'类型',key:"type",slot: 'type',},
                    {title:'数据',key:"data",slot: 'data',},
                    {title:'红包数据',key:"share",slot: 'share',width:200},
                    {title:'状态',key:'status',slot:'status'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'card',
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
            changetab(e){
                this.$router.push(e);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('card','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            editmoney(id,type,obj){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    rid : id,
                    value : this.money,
                }
                if( type == 'addcardredbag' ){
                    postdata.fee = obj.paymoney ? obj.paymoney : 0;
                    postdata.paytype = obj.paytype ? obj.paytype : 0;
                }
                if( type == 'editcardred' ){
                    postdata.startfee = obj.startfee ? obj.startfee : 0;
                    postdata.endfee = obj.endfee ? obj.endfee : 0;
                    postdata.startfeep = obj.startfeep ? obj.startfeep : 0;
                    postdata.endfeep = obj.endfeep ? obj.endfeep : 0;
                }
                if( type == 'outcardredbag' ){
                    postdata.fee = obj.outmoney ? obj.outmoney : 0;
                }
                
                if( type == 'addcardredbag' && postdata.paytype == 0 ){
                    self.$Modal.confirm({
                        content: '转换后无法转回，确定要将余额转为此余额吗？',
                        onOk : function(){
                            self.http(postdata);
                        }
                    })
                }else if( type == 'outcardredbag' ){
                    self.$Modal.confirm({
                        content: '确定要将红包余额转出到账户余额吗？',
                        onOk : function(){
                            self.http(postdata);
                        }
                    })
                }else{
                    self.http(postdata);
                }

            },
            http(postdata){
                var self = this;
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        if( postdata.paytype == 1 ){
                            self.$Modal.info({
                                content : '<img style="margin-left:28px;" src="'+res.obj.payqr+'" width="250" height="250" >',
                            });
                        }else{
                            self.$Message.success(res.res);
                            self.onLoad();
                            self.money = 0;
                        }
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
                self.$util.http('card','GET',postdata,function(res){
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
                
                if( self.settings.cardbag == 1 ){
                    self.columns.splice(5,1);
                }

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