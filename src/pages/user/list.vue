<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select @on-change="shaixuan($event,'iscard')" placeholder="筛选会员类型" style="width:150px">
                    <Option v-for="item in ucardtype" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选分销员" @on-change="shaixuan($event,'fenxiaoer')" style="width:150px">
                    <Option v-for="item in fxuser" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="排序方式" @on-change="shaixuan($event,'orderby')" style="width:150px">
                    <Option v-for="item in otype" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.nick" @on-enter="search" @on-click="search" placeholder="输入用户昵称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.userid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.tel" @on-enter="search" @on-click="search" placeholder="输入用户绑定手机号" style="width: 150px" />
                <Button @click="shaixuan($event,'endtime')">到期时间排序</Button>
                <Button @click="update">更新用户数据</Button>
                <Button type="primary" @click="showadd=true">导出用户数据</Button>
            </Col>
        </Row>

        <Modal title="" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="18" class="frm_content">
                    <Input v-model="uid" placeholder="输入用户ID" clearable style="width: 300px" />
                </Col>
            </Row>
        </Modal>

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="nick">
                        <p>{{row.nickname}}</p>
                        <p v-if="row.ctp">{{row.ctp}}，{{row.ctc}}，{{row.ctd}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="tel">
                        <!-- <p>{{row.tel}}</p> -->
                        <p v-if="row.account">账户:{{row.account}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="renmai">
                        <p>总人脉：{{row.zongrenmai}}</p>
                        <p>今日新增人脉：{{row.newadd}}</p>
                        <p>一度人脉：{{row.zhitui}}</p>
                        <p>二度人脉：{{row.erdu}}</p>
                        <p>潜在人脉：{{row.qianzai}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="money">
                        <p>{{row.money}}</p>
                        <!-- <a @click="link" href="javascript:;" :data-url="'usermoneylog?type=money&uid='+row.id">记录</a> -->
                    </template>
                    <template slot-scope="{ row }" slot="umoney">
                        <p>{{row.umoney}}<a @click="link" href="javascript:;" :data-url="'usermoneylog?type=umoney&uid='+row.id">记录</a></p>
                        
                        <!--  <p>{{settings.jfbname}}:{{row.jifen}}<a @click="link" href="javascript:;" :data-url="'userjifenlog?uid='+row.id">记录</a></p> -->
                    </template>
                    <template slot-scope="{ row }" slot="ucard">
                        <p v-if="row.grade == 0 " >普通会员</p>
                        <p v-if="row.grade == 1 ">VIP</p>
                        <p v-if="row.grade == 2 ">服务商</p>
                        <p v-if="row.grade == 3 ">代理商</p>
                        <p>会员到期时间：{{row.cardend}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="parent">
                        <p v-if="row.parent > 0">{{row.parentu.nickname}}（{{row.parent}}）</p>
                        <p v-else>无</p>
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

                            <!-- <Poptip confirm title="确定删除此条数据吗？" @on-ok="dealthis( row.id,'deleteuser')" placement="left"> <a>删除</a> </Poptip> -->

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

                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                修改会员时限
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="membertime" placeholder="输入数值" />
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'changemembertime')">确定</Button>
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
                <Button @click="handleSelectAll">{{isall ? '取消' : '全选'}}</Button>
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
                membertime:'',
                uid:'',
                showadd:false,
                loading : false,
	  			params : {},
	  			list : [],
                isall : false,
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    
                    {title:'头像',key:'headimg',slot: 'headimg',},
                    {title:'区域/昵称',key:"nickname",slot: 'nick',},
                    {title:'手机',key:"tel",slot: 'tel'},
                    {title:'人脉统计',key:"renmai",slot: 'renmai'},
                    {title:'冻结分红金额',key:'money',slot: 'money',},
                    {title:'支付余额/积分',key:'umoney',slot: 'umoney',},
                    {title:'会员卡',key:'ucard',slot: 'ucard',},
                    {title:'上级',key:'parent',slot: 'parent',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',width:150},
                ],
                status : [{label:'全部',value:1},{label:'黑名单',value:2}],
                ucardtype : [
                    {label:'全部',value:0},
                    {label:'普通会员',value:1},
                    {label:'VIP',value:2},
                    {label:'服务商',value:3},
                    {label:'代理商',value:4},
                ],
                fxuser : [
                    {label:'全部',value:0},
                    {label:'无上级',value:1},
                ],
                otype : [
                    {label:'默认排序',value:0},
                    {label:'分销余额排序',value:1},
                    {label:'支付余额排序',value:2},
                    {label:'积分数量排序',value:3},
                    {label:'登录时间排序',value:4},
                ],
                page : {
                    pdata : {
                        doo : 'user',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
                        tel : '',
                        asc:'',
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
                var url = this.$util.Murl('user','downuser') + '&uid=' + this.uid + '&down=1';
                location.href = url;
                this.showadd=false;
            },
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
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
                    membertime:this.membertime
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
                if(type=="endtime"){
                    this.page.pdata.asc='asc';
                };
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
            update(){
                var self = this;
                self.$util.http('ajax','GET',{op:'upuserdata'},function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            // updates(){
            //     var self = this;
            //     self.$util.http('ajax','GET',{op:'endtime'},function(res){
            //         if( res.status == 200 ){
            //             self.$Message.success(res.res);
            //             self.list=res.obj.list;
            //             self.total = res.obj.total;
            //         }else{
            //             if( res.res ) self.$Message.error(res.res);
            //         }
            //     },true);
            // },
            initData(){
                var self = this;
                var params = this.$route.query;
                if( params.id > 0 ){
                    self.page.pdata.userid = params.id;
                }
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
                        self.allsort = res.obj.topbar.sorta;
                        self.alltwosort = res.obj.topbar.sortb;
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