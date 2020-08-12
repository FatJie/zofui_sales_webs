<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row class="mb10">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户id" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.code" @on-enter="search" @on-click="search" placeholder="输入优惠码编号" style="width: 150px" />

                <Upload :action="uploadurla" :on-success="uploadend" name="inputfile" :show-upload-list="false" style="display:inline-block;">
                    <Button icon="ios-cloud-upload-outline">导入优惠码</Button>
                </Upload>
                <Button type="primary" @click="down">下载优惠码</Button>
                <Button type="primary" @click="addsort">生成优惠码</Button>
                
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="data">
                        <p>{{row.fee}}</p>
                        <p>{{row.lasttimes}}次</p>
                        
                    </template>
                    <template slot-scope="{ row }" slot="goods">
                        <p v-if="row.allbind.length > 0">
                            
                            <Poptip
                                v-for="item in row.allbind"
                                confirm
                                title="确定删除吗？"
                                @on-ok="editmoney(item.id,'delgidhcode')">
                                <Button  size="small" shape="circle">
                                    {{item.gid}}
                                </Button>
                            </Poptip>

                        </p>
                        <p v-else>所有商品</p>
                    </template>
                    <template slot-scope="{ row }" slot="shop">
                        <p v-if="row.allbinds.length > 0">
                            
                            <Poptip
                                v-for="item in row.allbinds"
                                confirm
                                title="确定删除吗？"
                                @on-ok="editmoney(item.id,'delsidhcode')">
                                <Button  size="small" shape="circle">
                                    {{item.sid}}
                                </Button>
                            </Poptip>
                        </p>
                        <p v-else>所有店铺</p>
                    </template>

                    <template slot-scope="{ row }" slot="user">
                        {{row.user ? row.user.nickname : ''}}
                    </template>
                    
                    <template slot-scope="{ row }" slot="status">

                        <template v-if="row.endtime > nowtime">
                            <p class="font-error" v-if="row.lasttimes <= 0">已使用完</p>
                            <p class="font-" v-else>正常</p>
                        </template>
                        <template v-else-if="row.endtime <= nowtime">
                            <p class="font-error">已过期</p>
                        </template>
                        <template v-else>
                            未使用
                        </template>
                        <p>{{row.showendtime}}</p>

                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'deletecode')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                        </p>
                        
                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                发给用户
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入用户id" />
                                    <p class="frm_tip"></p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'giveyhcode')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                绑定使用商品
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入商品id" />
                                    <p class="frm_tip"></p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'gidhcode')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                绑定店铺
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" placeholder="输入店铺id" />
                                    <p class="frm_tip"></p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'shopidhcode')">确定</Button>
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
                        <DropdownItem name="deleteallcode">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

        <Modal title="生成优惠码" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="false">
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    生成数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="sort.num" placeholder="填数字" clearable  />
                    <P class="frm_tip"></P>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    优惠金额
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="sort.fee" placeholder="可以优惠的金额" clearable  />
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    使用次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="sort.times" placeholder="" clearable  />
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    有效时间
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="sort.time" placeholder="" clearable  />
                    <p class="frm_tip">单位/天，生成后在此时间内可使用</p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    绑定商品
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="sort.gid" placeholder="输入商品id" clearable  />
                    <p class="frm_tip">多个商品用空格分开</p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    绑定店铺
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="sort.sid" placeholder="输入店铺id" clearable  />
                    <p class="frm_tip">多个店铺id使用空格分隔，绑定店铺id后只能此店铺的商品才可以使用</p>
                </Col>
            </Row>
        </Modal>

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
                isall : false,
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'优惠码',key:'code'},
                    {title:'优惠金额/使用次数',key:"data",slot: 'data',},
                    {title:'使用商品',key:"goods",slot: 'goods',},
                    {title:'使用店铺',key:"shop",slot: 'shop',},
                    {title:'使用人',key:"user",slot: 'user',},
                    {title:'状态/到期',key:'status',slot:'status'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'yhcode',
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
                showadd : false,
                sort : {},
                uploadurla : '',
                status : [
                    {label:'全部',value:0},
                    {label:'未使用',value:1},
                    {label:'已使用',value:2},
                ],
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.Murl('yhcode','import') + '&fromajax=1';
            this.uploadurla = site;
        },
	  	methods: {
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            uploadend(e){
                if( e.status == 200 ){
                    this.$Message.success(e.res);
                    this.initData();
                }else{
                    this.$Message.error(e.res);
                }
            },
            down(){
                let url = this.$util.Murl('yhcode','list') + '&down=1';
                for(var t in this.page.pdata){
                    if( t != 'fromajax' && t != 'page' && t != 'pnum' ){
                        url += '&'+t+'='+this.page.pdata[t]
                    }
                }
                location.href = url;
            },
            addsort(){
                this.showadd = true;
            },
            confirm(e){
                var self = this;
                var postdata = {
                    op : 'addyhcode',
                    fromajax : 1,
                    num : this.sort.num,
                    fee : this.sort.fee,
                    day : this.sort.time,
                    times : this.sort.times,
                    gid : this.sort.gid,
                    sid : this.sort.sid,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.sort = {};
                        self.showadd = false;
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
                
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('yhcode','GET',postdata,function(res){
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
                    cid : id,
                    value : this.money,
                }
                if( type == 'giveyhcode' || type == 'gidhcode' ){
                    postdata.uid = this.money;
                }
                if( type == 'delgidhcode' || type == 'delsidhcode' ){
                    postdata.bindid = id;
                }
                if( type == 'shopidhcode' ){
                    postdata.sid = this.money;
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
                self.$util.http('yhcode','GET',postdata,function(res){
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