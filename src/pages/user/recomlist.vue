<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                
                <Input icon="ios-search" v-model="page.pdata.nick" @on-enter="search" @on-click="search" placeholder="输入上级昵称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.userid" @on-enter="search" @on-click="search" placeholder="输入推广人员ID" style="width: 150px" />
                
                <Button @click="update">更新数据</Button>
                <Button type="primary" @click="showadd=true">添加地推人员</Button>
            </Col>
        </Row>

        <Modal title="" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    输入绑定ID：
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="uid"  clearable style="width: 300px" />
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    输入推广人员ID：
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="recomid"  clearable style="width: 300px" />
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    输入有效时长：
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="effective"  clearable style="width: 300px" />
                </Col>
            </Row>
            
        </Modal>

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="nick">
                        <!-- 昵称 -->
                    </template>
                    <template slot-scope="{ row }" slot="tel">
                       <!-- 电话 -->
                    </template>
                    <template slot-scope="{ row }" slot="renmai">
                        <!-- 推广统计 -->
                    </template>
                    <template slot-scope="{ row }" slot="money">
                        <!-- 推广时效 -->
                    </template>
                    <template slot-scope="{ row }" slot="parent">
                        <!-- 上级 -->
                    </template>
                    <template slot-scope="{ row }" slot="headimg">
                        <!-- 头像 -->
                    </template>
                    <template slot-scope="{ row }" slot="codeimg">
                        <!-- 二维码 -->
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
                            <a @click="link" :data-url="'/userdown?parent='+row.id">下级</a>
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
                    {title:'二维码',key:'codeimg',slot: 'codeimg',},
                    {title:'区域/昵称',key:"nickname",slot: 'nick',},
                    {title:'手机',key:"tel",slot: 'tel'},
                    {title:'推广统计',key:"renmai",slot: 'renmai'},
                    {title:'推广时效',key:'money',slot: 'money',},
                    {title:'上级',key:'parent',slot: 'parent',},
                    {title:'操作',key:'33',slot: 'action',},
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
            // this.initData();

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