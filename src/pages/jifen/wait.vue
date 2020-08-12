<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        
        <Tabs :value="'jifen' + (this.type ? this.type : 'wait') " @on-click="changetab">
            <TabPane label="商品列表" name="jifenlist" ></TabPane>
            <TabPane label="添加商品" name="jifenadd" ></TabPane>
            <TabPane label="商品分类" name="jifensort" ></TabPane>
            <TabPane label="等待发奖" name="jifenwait" ></TabPane>
            <TabPane label="已经发奖" name="jifensended" ></TabPane>
            <TabPane label="已经完成" name="jifencomed" ></TabPane>
            <TabPane label="等待支付" name="jifenwaitpay" ></TabPane>
            <TabPane label="积分卡密" name="jifencode" ></TabPane>
        </Tabs>

        <Row style="margin-bottom:10px;">
            <Col span="24">

                <Input icon="ios-search" v-model="page.pdata.name" @on-enter="search" @on-click="search" placeholder="输入姓名" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.tel" @on-enter="search" @on-click="search" placeholder="输入电话号码" style="width: 150px" />

                <Button type="primary" @click="load">下载表格</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="name">
                        {{row.goods.name}}
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">待发货</p>
                        <p class="font-error" v-if="row.status == 1">已发货</p>
                        <p class="font-error" v-if="row.status == 2">已完成</p>
                        <p class="font-error" v-if="row.status == 3">待支付</p>
                        
                    </template>
                    
                    <template slot-scope="{ row,index }" slot="rule">
                            <p>{{settings.jfbname}}:{{row.cost}}</p>
                            <p>支付:{{row.payed}}</p>
                            <P>{{row.rule}}</P>
                    </template>
                    <template slot-scope="{ row,index }" slot="user">
                        {{row.user.nickname}}
                    </template>
                    <template slot-scope="{ row,index }" slot="address">
                            <p>{{row.name}}</p>
                            <p>{{row.tel}}</p>
                            <p>{{row.address}}</p>
                            <p>{{row.exname}}</p>
                            <p>{{row.exnum}}</p>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deletetake')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                        </p>

                        <Dropdown v-if="row.status == 0 || row.status == 1" placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                {{row.status == 0 ? '发货' : '修改快递'}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Select v-model="expressname" placeholder="选择快递">
                                        <Option v-for="(item,index) in express" :value="item.name" :key="index">{{ item.name }}</Option>
                                    </Select>
                                </div>

                                

                                <div style="padding:10px">
                                    <Input v-model="exname" placeholder="其他名称" />
                                    <p class="frm_tip">选择了上方后此选项可不填</p>
                                </div>
                                <div style="padding:10px">
                                    <Input v-model="exnum" placeholder="输入快递编号" />
                                    <p class="frm_tip">快递编号</p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'dealjf',row.status == 0 ? 'send' : 'editex')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>

                        <p>
                            <Poptip
                                v-if="row.status == 1"
                                confirm
                                title="确定设为完成状态吗？"
                                @on-ok="editmoney(row.id,'dealjf','com')"
                                placement="left">
                                <a>完成</a>
                            </Poptip>
                            <Poptip
                                v-if="row.status == 2"
                                confirm
                                title="确定设为待发货状态吗？"
                                @on-ok="editmoney(row.id,'dealjf','reset')"
                                placement="left">
                                <a>待发货</a>
                            </Poptip>
                        </p>

                        
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
                        <DropdownItem name="deletealltake">删除数据</DropdownItem>
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
        props : ['settings','type'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
                uploadurl : '',
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:"name",slot:'name'},
                    {title:'粉丝',key:"user",slot: 'user',},
                    {title:'花费/规格',key:'rule',slot:'rule'},
                    {title:'地址',key:'address',slot:'address'},
                    {title:'提交时间',key:'showtime'},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'jifen',
                        op : this.type ? this.type : 'wait',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        name : '',
                        tel : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                showadd : false,
                selected : [],
                express: [],
                aurl : '',
                plaing : false,
                playindex : -1,
                expressname : '',
                exname : '',
                exnum : '',
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=audio&global=&dest_dir=';
        },
	  	activated:function(e){},
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            load(){
                let url = this.$util.Murl('order','list') + '&down=1';
                for(var t in this.page.pdata){
                    if( t != 'fromajax' && t != 'page' && t != 'pnum' ){
                        url += '&'+t+'='+this.page.pdata[t]
                    }
                }
                location.href = url;
            },
            loadmusic(id,did,name){
                var self = this;
                var postdata = {
                    op : 'loadmusic',
                    fromajax : 1,
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
            editmoney(id,type,dtype){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    oid : id,
                    exname : this.expressname,
                    exnamea : this.exname,
                }
                if( type == 'dealjf' ){
                    postdata.type = dtype;
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
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('jifen','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            search(){
                this.page.pdata.page = 1;
                this.onLoad();
            },
            selectTable(e,a){
                var arr = [];
                for (var i = 0; i < e.length; i++) {
                    arr.push(e[i].id);
                }
                this.selected = arr;
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
                self.$util.http('jifen','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            edit(e){
                this.sort = e;
                this.showadd = true;
            },
            addsort(){
                this.sort = {};
                this.showadd = true;
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
                        self.express = res.obj.express;
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
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>