<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="adminjizijoinlog" @on-click="changetab">
            <TabPane label="活动列表" name="adminjizi" ></TabPane>
            <TabPane label="添加活动" name="adminjiziadd" ></TabPane>
            <TabPane label="参与记录" name="adminjizijoinlog" ></TabPane>
        </Tabs>
        <Row style="margin-bottom:10px;">
            <Col span="24">

                <Select  placeholder="筛选类型" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.user" @on-enter="search" @on-click="search" placeholder="输入用户昵称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.actid" @on-enter="search" @on-click="search" placeholder="输入活动ID" style="width: 150px" />
               
            </Col>

        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="name">
                        {{row.act.title}}
                    </template>
                    <template slot-scope="{ row }" slot="user">
                        {{row.user.nickname}}
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p v-if="row.status == 0">未完成</p>
                        <template v-else-if="row.status == 1">
                            <p>已完成</p>
                        </template>
                        
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        已收集：
                        <template v-if="row.geted.length > 0">
                            <span v-for="inn in row.geted">{{inn.font}}，</span>
                        </template>
                        <span v-else>无</span>

                    </template>
                    
                    <template slot-scope="{ row, index }" slot="action">
                        <div>
                            <p>
                                <a @click="link" :data-url="'adminjizihelplog?id='+row.id"  >帮助记录</a>
                            </p>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'deletejoin')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                        </div>
                        
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
                        <DropdownItem name="deletealljoin">删除数据</DropdownItem>
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
	  			params : {},
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'活动名称',key:'name',slot: 'name',},
                    {title:'参与粉丝',key:"user",slot: 'user',},
                    {title:'参与时间',key:"showtime",},
                    {title:'数据',key:'data',slot: 'data',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'jizi',
                        op : 'joinlog',
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
                status : [
                    {label:'未完成',value:1},
                    {label:'已完成',value:2},
                ],
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
                    sid : id,
                    value : this.money,
                }
                self.$util.http('jizi','signin',postdata,function(res){
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
                    p:'admin',
                    op : e,
                    fromajax : 1,
                    checkall : self.selected,
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
                if( params.id > 0){
                    this.page.pdata.actid = params.id;
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