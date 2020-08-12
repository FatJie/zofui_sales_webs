<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="adminjizi" @on-click="changetab">
            <TabPane label="活动列表" name="adminjizi" ></TabPane>
            <TabPane label="添加活动" name="adminjiziadd" ></TabPane>
            <TabPane label="参与记录" name="adminjizijoinlog" ></TabPane>
        </Tabs>


        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" class="mb5 w150">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
        </Row>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="thumb">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.thumb" />
                    </template>
                    <template slot-scope="{ row }" slot="user">
                        <p>{{row.user.nickname}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <p>参与：{{row.joined}}</p>
                        <p>完成：{{row.comed}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="status">
                             
                        <template v-if="row.sstatus == 0">
                            <template v-if="row.status == 0">
                                <template v-if="row.end < nowtime">
                                    已结束
                                </template>
                                <template v-else-if="row.start > nowtime">
                                    <p class="font-error">未开始</p>
                                </template>
                                <template v-else>
                                    <p v-if="row.stock <= 0">已领完</p>
                                    <p v-else>正常</p>
                                </template>
                            </template>
                            <template v-else>
                                <p class="font-error">下架</p>
                            </template>
                        </template>
                        <template v-else>
                            <p class="font-error">被关闭</p>
                        </template>
                    </template>
                    
                    <template slot-scope="{ row, index }" slot="action">
                        
                        <a @click="link" :data-url="'adminjiziadd?id='+row.id" >编辑</a>
                        <Poptip
                            confirm
                            title="确定删除吗？"
                            @on-ok="dealthis(row.id,'deletejizi')"
                            placement="left">
                            <a>删除</a>
                        </Poptip>
                        <div>
                            <a @click="link" :data-url="'adminjizijoinlog?id='+row.id" >参与记录</a>
                        </div>
                        <div>
                            <a @click="open" href="javascript:;" :data-url="row.downurl" >下载二维码</a>

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
                <!-- <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deletesign">删除数据</DropdownItem>
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
                data : {},
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'编号',key:'id'},
                    {title:'名称',key:'title',},
                    {title:'图片',key:'thumb',slot:'thumb'},
                    {title:'剩余',key:'stock',},
                    {title:'数据',key:"data",slot: 'data',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [
                    {label:'未开始',value:1},
                    {label:'进行中',value:2},
                    {label:'已结束',value:3},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'jizi',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                allsort : [],
                alltwosort : [],
                selected : [],
                money : '',
                data : {},
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            changetab(e){
                 this.$router.push(e);
            },
            open(e){
                location.href = e.currentTarget.dataset.url
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('jizi','GET',postdata,function(res){
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
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                    value : this.money,
                }
                if( type == 'copyact' ){
                    postdata.type = 'sign';
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
                self.$util.http('act','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            changedate(e){
                this.sdate = {start:e[0],end:e[1]};
            },
            searchdate(e){
                if( this.sdate ){
                    this.page.pdata.time = this.sdate;
                }
                this.onLoad();
            },
            cleartime(){
                this.page.pdata.time = '';
                this.onLoad();
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
                if( params.id > 0 ){
                    self.page.pdata.userid = params.id;
                }
                
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