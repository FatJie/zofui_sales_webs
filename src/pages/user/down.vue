<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select @on-change="shaixuan($event,'renmaisx')" placeholder="一度人脉" style="width:150px">
                    <Option v-for="item in renmai" :value="item.value" :label="item.label" :key="item.value" >{{ item.label }}</Option>
                </Select>
                <Select @on-change="shaixuan($event,'level')" placeholder="筛选类型" style="width:150px">
                    <Option v-for="item in level" :value="item.value" :label="item.label" :key="item.value" >{{ item.label }}</Option>
                </Select>
                <Select  placeholder="排序方式" @on-change="shaixuan($event,'orderby')" style="width:150px">
                    <Option v-for="item in otype" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.userid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                <Button type="primary" @click="confirm">导出数据</Button>
                <span style="padding:5px 10px;font-weight: 700;">总人脉：{{data_renmai.zongrenmai}};</span>
                <span style="padding:5px 10px;font-weight: 700;">今日新增：{{data_renmai.newadd}};</span>
                <span style="padding:5px 10px;font-weight: 700;">一度人脉：{{data_renmai.zhitui}};</span>
                <span style="padding:5px 10px;font-weight: 700;">二度人脉：{{data_renmai.erdu}};</span>
                <span style="padding:5px 10px;font-weight: 700;">潜在人脉：{{data_renmai.qianzai}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="nick">
                        <p>{{row.nickname}}</p>
                        <p v-if="row.ctp">{{row.ctp}}，{{row.ctc}}，{{row.ctd}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="money">
                        <p>{{row.money}}</p>
                        <!--<a @click="link" href="javascript:;" :data-url="'usermoneylog?type=money&uid='+row.id">记录</a> -->
                    </template>
                    <template slot-scope="{ row }" slot="umoney">
                        <p>{{row.umoney}}<a @click="link" href="javascript:;" :data-url="'usermoneylog?type=umoney&uid='+row.id">记录</a></p>
                        
                        <!-- <p>{{settings.jfbname}}:{{row.jifen}}</p>-->
                    </template>
                    <template slot-scope="{ row }" slot="comsumer">
                        <p>{{row.consumption}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="ucard">

                        <p v-if="row.grade == 0 " >普通会员</p>
                        <p v-if="row.grade == 1 ">VIP</p>
                        <p v-if="row.grade == 2 ">服务商</p>
                        <p v-if="row.grade == 3 ">代理商</p>
                    </template>
                    <template slot-scope="{ row }" slot="renmai">
                        <p>总人脉：{{row.zongrenmai}}</p>
                        <p>今日新增人脉：{{row.newadd}}</p>
                        <p>一度人脉：{{row.zhitui}}</p>
                        <p>二度人脉：{{row.erdu}}</p>
                        <p>潜在人脉：{{row.qianzai}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="type">
                        <p v-if="row.parent == page.pdata.uid">下级</p>
                        <p v-else-if="row.pp == page.pdata.uid">下下级</p>
                        <p v-else-if="row.ppp == page.pdata.uid">下下下级</p>
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">正常</p>
                        <p class="font-error" v-if="row.status == 1">黑名单</p>
                        <p>登录:{{row.showlogintime}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="headimg">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.headimg" />
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a v-if="row.status == 1" @click="dealthis(row.id,'tocom')"  >恢复</a>
                            <a v-else @click="dealthis(row.id,'toblack')"  >拉黑</a>

                            <a v-if="row.status_frozen == 0" @click="dealthis(row.id,'dongjie')"  >冻结</a>
                            <a v-else @click="dealthis(row.id,'jiedong')"  style='color:red;' >解冻</a>

                            <Poptip confirm title="确定删除此条数据吗？" @on-ok="dealthis( row.id,'deleteuser')" placement="left"> <a>删除</a> </Poptip>

                        </p>
                        
                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                修改支付余额
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入数值" />
                                    <p class="frm_tip">增减值(数字前加-是减)</p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'changemoneyumoney')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                修改等级
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入数值" />
                                    <p class="frm_tip">0：普通会员 1：VIP 2 服务商 3：代理商</p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'changeuserlevel')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>


                        <div>
                            <!-- <a @click="link" :data-url="'/userdown?parent='+row.id">下级</a> -->
                            <Dropdown  placement="left" trigger="click">
                                <a href="javascript:void(0)">
                                    修改修改上级
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="money" placeholder="输入用户ID" />
                                        <p class="frm_tip">输入上级id，输入0即取消上级</p>
                                    </div>

                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'editpp')">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <p v-if="row.canfx == 1 && settings.fxauth >= 2">
                            <a href="javascript:;" class="closefx"  @click="editmoney(row.id,'closefx')">关闭{{settings.fxbname}}</a>
                        </p>

                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                发送通知
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入内容" />
                                    <p class="frm_tip"></p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'testmess')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>

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
                        <DropdownItem name="deletealluser">删除数据</DropdownItem>
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
        props : ['settings'],
	  	data : function(){
	  		return {
                offspring:0,
                showadd:false,
                loading : false,
	  			params : {},
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                otype : [
                    {label:'默认排序',value:0},
                    {label:'支付余额排序',value:1},
                    {label:'登录时间排序',value:2},
                ],
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    
                    {title:'头像',key:'headimg',slot: 'headimg',},
                    {title:'区域/昵称',key:"nickname",slot: 'nick',},
                    {title:'手机',key:"tel"},
                    {title:'冻结分红金额',key:'money',slot: 'money',},
                    {title:'支付余额',key:'umoney',slot: 'umoney',},
                    {title:'消费金额',key:'comsumer',slot: 'comsumer',},
                    {title:'会员卡',key:'ucard',slot: 'ucard',},
                    {title:'人脉统计',key:'renmai',slot: 'renmai',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'类型',key:'type',slot: 'type',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'全部',value:1},{label:'黑名单',value:2}],
                level : [
                    {label:'全部',value:0},
                    // {label:'普通会员',value:1},
                    {label:'VIP',value:2},
                    {label:'服务商',value:3},
                    {label:'代理商',value:4},
                ],
                data_renmai:{},
                renmai : [
                    {label:'一度人脉',value:0},
                    {label:'二度人脉',value:1},
                    {label:'潜在人脉',value:2},
                ],
                page : {
                    pdata : {
                        doo : 'user',
                        op : 'down',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
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
                usertype : 0,
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            confirm(){
                if(this.list.length==0){return};
                var url = this.$util.Murl('user','downoffspringr') + '&offspring=' + this.offspring  + '&parentid=' + this.list[0].parent + '&down=1';
                location.href = url;
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                    uid : id,
                }
                self.$util.http('user','GET',postdata,function(res){
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
                    uid : id,
                    value : this.money,
                }
                if( type == 'editpp' ){
                    postdata.uid = id;
                    postdata.pid = this.money;
                }
                if( type == 'changemoneyuser' ){
                    postdata.type = 'user';
                }
                if( type == 'testmess' ){
                    postdata.uid = id;
                    postdata.mess = this.money;
                }
                if( type == 'changecard' ){
                    postdata.cardlevel = this.usertype;
                }

                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.money = '';
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
                self.$util.http('user','GET',postdata,function(res){
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
                this.offspring=e;
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
                if( params.parent > 0 ){
                    self.page.pdata.uid = params.parent;
                }
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
                        self.total = res.obj.total;
                        self.data_renmai = res.obj.data;
                        
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