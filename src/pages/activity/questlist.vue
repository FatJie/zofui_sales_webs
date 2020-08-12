<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="questlist" @on-click="changetab">
            <TabPane label="问答列表" name="questlist"  ></TabPane>
            <TabPane label="问答分类" name="questsort" ></TabPane>
            <TabPane label="回答内容" name="questanswer" ></TabPane>
        </Tabs>
        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select @on-change="shaixuan($event,'sortid')" placeholder="筛选分类" style="width:150px">
                    <Option v-for="item in allsort" :value="item.id" :label="item.name" :key="item.id" >{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="输入商品ID" style="width: 150px" />
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="user">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.user.headimg" />
                        <p>{{row.user.nickname}}（{{row.user.id}}）</p>
                    </template>
                    <template slot-scope="{ row }" slot="goods">
                        <div v-if="row.gid > 0">
                            <Avatar icon="ios-person" size="large" shape="square" :src="row.gthumb" />
                            <p >{{row.gtitle}}</p>
                        </div>
                        <div v-else>无</div>
                    </template>

                    
                    <template slot-scope="{ row }" slot="status">

                        <template v-if="row.status == 0">
                            正常
                        </template>
                        <template v-if="row.status == 1">
                            <p class="font-error">待审核</p>
                        </template>
                        <template v-if="row.status == 2">
                            已下架
                        </template>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <!-- <a @click="link" :data-url="'prizeadd?id='+row.id"  >编辑</a> -->
                            <Poptip
                                v-if="row.status == 1"
                                confirm
                                title="确定通过审核吗？"
                                @on-ok="dealthis(row.id,'pass')"
                                placement="left">
                                <a>通过</a>
                            </Poptip>
                            <Poptip
                                v-if="row.status == 0"
                                confirm
                                title="确定下架吗？"
                                @on-ok="dealthis(row.id,'down')"
                                placement="left">
                                <a>下架</a>
                            </Poptip>
                            <Poptip
                                v-if="row.status == 2"
                                confirm
                                title="确定上架吗？"
                                @on-ok="dealthis(row.id,'up')"
                                placement="left">
                                <a>上架</a>
                            </Poptip>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'deletequest')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                        </p>
                        <p>
                            <a @click="link" :data-url="'questanswer?id='+row.id"  >查看回答</a>
                        </p>
                        
                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                <Button @click="handleSelectAll(isall)">{{isall ? '取消' : '全选'}}</Button>
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteallquest">删除数据</DropdownItem>
                        <DropdownItem name="allup">上架</DropdownItem>
                        <DropdownItem name="alldown">下架</DropdownItem>
                        <DropdownItem name="allpass">通过审核</DropdownItem>
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
                isall : false,
	  			params : {},
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'标题',key:'title'},
                    {title:'发布者',key:"user",slot: 'user',},
                    {title:'商品',key:"goods",slot: 'goods',},
                    {title:'回复数量',key:"retimes"},
                    {title:'状态',key:'status',slot:'status'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'全部',value:0},{label:'待审核',value:1},{label:'已下架',value:2},],
                page : {
                    pdata : {
                        doo : 'quest',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        uid : '',
                        sortid : '',
                        gid : '',
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
                }
                self.$util.http('quest','GET',postdata,function(res){
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
                    op : type,
                    fromajax : 1,
                    sid : id,
                    value : this.money,
                }
                self.$util.http('quest','GET',postdata,function(res){
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
                self.$util.http('quest','GET',postdata,function(res){
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
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
                        self.total = res.obj.total;
                        self.allsort = res.obj.allsort ? res.obj.allsort : [];
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