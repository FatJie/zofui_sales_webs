<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="user">
                        <p >{{row.nickname}}（{{row.uid}}）</p>
                    </template>
                    <template slot-scope="{ row }" slot="poster">
                        <Dropdown trigger="hover" transfer>
                            <a href="javascript:void(0)">
                                <Avatar icon="ios-person" size="large" shape="square" :src="row.url" />
                            </a>
                            <DropdownMenu slot="list" style="padding:10px;height:auto;text-align:center;width:250px;">
                                <img class="actimg" :src="row.url" width="250px">
                            </DropdownMenu>
                        </Dropdown>
                    </template>

                    <template slot-scope="{ row }" slot="status">

                        <template v-if="row.expire > nowtime">
                            <p class="font-error">未过期</p>
                        </template>
                        <template v-else-if="row.expire < nowtime">
                            <p class="font-error">已过期</p>
                        </template>

                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'delgoodspst',row.dir)"
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
                <Button @click="handleSelectAll">{{isall ? '取消' : '全选'}}</Button>
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteallgoodpst">删除</DropdownItem>

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
                    {title:'标题',key:'title'},
                    {title:'路径',key:'path'},
                    {title:'code',key:'code'},
                    {title:'用户',key:'user',slot: 'user',},
                    {title:'海报',key:"poster",slot: 'poster',},
                    {title:'状态',key:'status',slot:'status'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'good',
                        op : 'posterlist',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        gid : '',
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
                isall : false,
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            changetab(e){
                this.$router.push(e);
            },
            dealthis(id,type,dir){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                    dir : dir,
                }
                self.$util.http('good','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
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
                    p:'admin',
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('good','GET',postdata,function(res){
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
                
                self.page.pdata.gid = params.gid;
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
                this.isall = false;
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