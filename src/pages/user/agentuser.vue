<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select @on-change="shaixuan($event,'status')" placeholder="筛选类型" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :label="item.label" :key="item.value" >{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                <!--<Button type="primary" @click="loadcode">下载卡密</Button> -->
                <Button type="primary" @click="addsort">生成激活码</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="use">
                        {{row.user ? row.user.nickname : ''}}
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">未使用</p>
                        <p class="font-error" v-if="row.status == 1">已使用</p>
                        <p class="font-error" v-if="row.start > 0 && row.start > nowtime">
                            未到可使用时间
                        </p>
                        <p class="font-error" v-if="row.end > 0 && row.end < nowtime">
                            已过期
                        </p>
                        <p class="font" v-if="row.showstart">开始:{{row.showstart}}</p>
                        <p class="font" v-if="row.showstart">过期:{{row.showend}}</p>
                    </template>
                    
                    <template slot-scope="{ row }" slot="cardtype">
                        <p class="font" v-if="row.cardtype == 1">VIP</p>
                        <p class="font" v-if="row.cardtype == 2">服务商</p>
                        <p class="font" v-if="row.cardtype == 3">代理商</p>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deletecode')"
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
                        <DropdownItem name="deleteallcode">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

    <Modal title="" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                代理账号
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.number" placeholder="请输入代理账号" clearable style="width: 300px" />
                <P class="frm_tip"></P>
            </Col>
        </Row>
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
                <Select filterable class="w200" @on-change="changec">
                    <Option v-for="(item,index) in citylist" :key="index" :value="item.id">{{ item.name }}</Option>
                </Select>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                区县
            </Col>
            <Col span="18" class="frm_content">
                <Select filterable class="w200" @on-change="changef">
                    <Option v-for="(item,index) in country" :key="index" :value="item.id">{{ item.fullname }}</Option>
                </Select>
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
                isall : false,
                uploadurl : '',
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:100},
                    {title:'ID',key:'id'},
                    {title:'账户',key:"code"},
                   
                    {title:'类型',key:"cardtype",slot: 'cardtype',},
                    {title:'区域',key:'use',slot: 'use',},
                    {title:'使用人',key:'use',slot: 'use',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [
                    {label:'全部',value:0},
                    {label:'正常',value:1},
                    {label:'冻结',value:2},
                    
                ],
                page : {
                    pdata : {
                        doo : 'user',
                        op : 'agentuser',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        status : 0,
                        uid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                showadd : false,
                selected : [],
                sort: {cardtype:0,type:365,limit:0,start:0,end:0},
                sorttwo : '',

                //添加城市 
                pList : [],
                citylist : [],
                country : [],
                provinceid:'',
                cityid:'',
                areaid:''
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	activated:function(e){},
	  	methods: {
            //添加城市
            changep(e){
                this.provinceid=e;
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
            changec(e){
                this.cityid=e;
                var self = this;
                var postdata = {
                    op : 'getaddressdown',
                    fromajax : 1,
                    id : e,
                    level : 3,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.country = res.obj.down;
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            changef(e){
                this.areaid=e;
            },



            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            confirm(){
                var self = this;
                var postdata = {
                    op : 'addagent',
                    fromajax : 1,
                    num : self.sort.number,
                    provinceid:self.provinceid,
                    cityid:self.cityid,
                    areaid:self.areaid
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.showadd = false;
                    }else{
                        self.$Message.error(res.res);
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
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            changetime(e){
                this.sort.start = e[0];
                this.sort.end = e[1];
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
            search(){
                this.page.pdata.page = 1;
                this.onLoad();
            },
            shaixuan(e,type){
                this.page.pdata[`${type}`] = e;
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
                self.$util.http('user','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            edit(e){
                this.showadd = true;
            },
            addsort(){
                var self=this;
                var postdata={
                    op:'city',
                    doo:'shop',
                    page:1,
                    fromajax: 1,
                    pnum: 10
                }
                self.$util.http('shop','GET',postdata,function(res){
                    if( res && res.obj ){
                        self.pList = res.obj.pList;
                    }
                });
                this.showadd = true;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            loadcode(e){
                var url = this.$util.Murl('user','code') + '&down=1';
                location.href = url;
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