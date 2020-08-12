<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="user">
                        {{row.user.nickname}}
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">待审核</p>
                        <p class="font" v-if="row.status == 1">已通过</p>
                        <p class="font" v-if="row.status == 2">未通过</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <p>姓名：{{row.name}}</p>
                        <p>电话：{{row.tel}}</p>
                    </template>


                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deletefxjoin')"
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
                        <DropdownItem name="deleteallfxjoin">删除数据</DropdownItem>
                        <DropdownItem name="passucardjoin">审核通过</DropdownItem>
                        <DropdownItem name="refusefxjoin">审核不通过</DropdownItem>
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
                uploadurl : '',
                isall : false,
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'申请会员',key:"user",slot: 'user',},
                    {title:'申请时间',key:"jointime"},
                    {title:'数据',key:'data',slot: 'data',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'全部',value:0},{label:'待审核',value:1},{label:'已通过',value:2},{label:'未通过',value:3}],
                page : {
                    pdata : {
                        doo : 'user',
                        op : 'ucardapply',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                showadd : false,
                selected : [],
                sort: {},
                sorttwo : '',
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	activated:function(e){},
	  	methods: {
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            confirm(){
                var self = this;
                var postdata = {
                    op : 'addgoodsort',
                    fromajax : 1,
                    fid : self.sort.id ? self.sort.id : 0,
                    name : self.sort.name,
                    status : self.sort.status,
                    number : self.sort.number,
                    img : self.sort.img,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.showadd = false;
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            uploadend(e){
                if( e.attachment ){
                    this.$set(this.sort,'img',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
            },
            shaixuan(e,type){
                this.page.pdata[`${type}`] = e;
				this.page.pdata.page = 1;
                this.onLoad();
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
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
            remove(e){
                var self = this;
                var postdata = {
                    op : 'list',
                    fromajax : 1,
                }
                self.$util.http('goods','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.res ) self.$Message.error(res.res);
                        for (var i = 0; i < self.list.length; i++) {
                            if(self.list[i].id == e){

                                self.list.splice(i,1);
                                self.list = self.list;

                            }
                        }
                        
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
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