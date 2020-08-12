<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Button type="primary" @click="addsort">添加城市</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    
                    <template slot-scope="{ row }" slot="type">
                        <p class="font" v-if="row.level == 2">市</p>
                        <p class="font-error" v-if="row.level == 3">区县</p>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deletecity')"
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
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteallcity">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

    <Modal title="添加城市" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true" width="700">
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                筛选省市
            </Col>
            <Col span="18" class="frm_content">
                <Select filterable class="w200" @on-change="changep">
                    <Option v-for="item in pList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                城市
            </Col>
            <Col span="18" class="frm_content">
                <ButtonGroup shape="circle" v-for="(item,index) in citylist" :key="index" style="margin:0 5px 5px 0;">
                    <Button type="info">{{item.name}}</Button>
                    <Button @click="addcity(item,2)">添加城市</Button>
                    <!-- <Button @click="changec(item.id)">展开区县</Button> -->
                </ButtonGroup>
            </Col>
        </Row>
        <!-- <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                区县
            </Col>
            <Col span="18" class="frm_content">
                <ButtonGroup shape="circle" v-for="(item,index) in country" :key="index" style="margin:0 5px 5px 0;">
                    <Button type="info">{{item.fullname}}</Button>
                    <Button @click="addcity(item,3)">添加城市</Button>
                </ButtonGroup>
            </Col>
        </Row> -->
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
                uploadurl : '',
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:100},
                    {title:'ID',key:'id'},
                    {title:'名称',key:"name"},
                    {title:'类型',key:'type',slot: 'type',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'shop',
                        op : 'city',
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
                pList : [],
                citylist : [],
                country : [],
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	activated:function(e){},
	  	methods: {
            confirm(){
                var self = this;
                var postdata = {
                    op : 'addcode',
                    fromajax : 1,
                    fid : self.sort.id ? self.sort.id : 0,
                    num : self.sort.number,
                    type : self.sort.type,
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
            changep(e){
                var self = this;
                var postdata = {
                    op : 'getaddressdown',
                    fromajax : 1,
                    id : e,
                    level : 2,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.citylist = res.obj.down;
                        self.country = [];
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            // changec(e){
            //     var self = this;
            //     var postdata = {
            //         op : 'getaddressdown',
            //         fromajax : 1,
            //         id : e,
            //         level : 3,
            //     }
            //     self.$util.http('ajax','GET',postdata,function(res){
            //         if( res.status == 200 ){
            //             self.country = res.obj.down;
            //         }else{
            //             if( res.res ) self.$Message.error(res.res);
            //         }
            //     },true);
            // },
            addcity(e,level){
                var self = this;
                var postdata = {
                    op : 'addcity',
                    fromajax : 1,
                    id : e.id,
                    pname : e.fullname,
                    level : level,
                    pyin : e.pinyin ? e.pinyin[0] : '',
                    lat : e.location.lat,
                    lng : e.location.lng,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已添加');
                        self.initData();
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
                this.showadd=false;
            },
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('shop','GET',postdata,function(res){
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
                self.$util.http('shop','GET',postdata,function(res){
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
                        self.pList = res.obj.pList;
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