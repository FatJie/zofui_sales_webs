<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="bmlog" @on-click="changetab">
            <TabPane label="报名设置" name="bmadd"  ></TabPane>
            <TabPane label="报名记录" name="bmlog" ></TabPane>
            <TabPane label="支付记录" name="bmpaylog" ></TabPane>
        </Tabs>
        
        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="输入商户ID" style="width: 150px" />
                <DatePicker confirm type="daterange" placement="bottom-end" placeholder="筛选时间" class="w150" @on-ok="searchdate" @on-change="changedate" @on-clear="cleartime"></DatePicker>
                <Button type="primary" @click="down">导出数据</Button>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="user">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.user.headimg" />
                        <p>{{row.user.nickname}}（{{row.user.id}}）</p>
                    </template>
                    <template slot-scope="{ row }" slot="shop">
                        <div v-if="row.shop">
                            <p >{{row.shop.name}}（{{row.shop.id}}）</p>
                        </div>
                        <div v-else>无</div>
                    </template>
                    <template slot-scope="{ row }" slot="title">
                        <div v-for="(item,index) in row.form">
                            {{item.name}}:{{item.value}}
                        </div>
                    </template>
                    
                    <template slot-scope="{ row }" slot="status">

                        <template v-if="row.status == 0">
                            <p class="font-error">未支付</p>
                        </template>
                        <template v-if="row.status == 1">
                            正常
                        </template>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <!-- <a @click="link" :data-url="'prizeadd?id='+row.id"  >编辑</a> -->
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'deleteform')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
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
                        <DropdownItem name="deleteallform">删除数据</DropdownItem>
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
                    {title:'提交内容',key:'title',slot: 'title',},
                    {title:'提交用户',key:"user",slot: 'user',},
                    {title:'提交时间',key:"showtime"},
                    {title:'来自商户',key:"shop",slot: 'shop',},
                    {title:'状态',key:'status',slot:'status'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'全部',value:0},{label:'未支付',value:1},{label:'正常',value:2},],
                page : {
                    pdata : {
                        doo : 'subform',
                        op : 'log',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        uid : '',
                        time : '',
                        shopid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                selected : [],
                money : '',
                sdate : '',
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
                self.$util.http('subform','GET',postdata,function(res){
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
                self.$util.http('subform','GET',postdata,function(res){
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
                self.$util.http('subform','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            down(){
                let url = this.$util.Murl('subform','log') + '&down=1';
                for(var t in this.page.pdata){
                    if( t != 'fromajax' && t != 'page' && t != 'pnum' ){
                        url += '&'+t+'='+this.page.pdata[t]
                    }
                }
                if( this.page.pdata.time ){
                    url += '&time[start]='+this.page.pdata.time.start;
                    url += '&time[end]='+this.page.pdata.time.end;
                }
                location.href = url;
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