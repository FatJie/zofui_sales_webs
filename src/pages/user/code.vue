<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select @on-change="shaixuan($event,'status')" placeholder="筛选类型" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :label="item.label" :key="item.value" >{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                <DatePicker confirm type="daterange" placement="bottom-end" placeholder="筛选时间" class="w150" @on-ok="searchdate" @on-change="changedate" @on-clear="cleartime"></DatePicker>
                <Button type="primary" @click="loadcode">下载卡密</Button>
                <Button type="primary" @click="addsort">生成激活码</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="use">
                        {{row.user ? row.user.nickname : ''}} [用户ID:{{row.uid}}]
                    </template>
                    <template slot-scope="{ row }" slot="tuijian">
                        {{row.parent}} [用户ID:{{row.parentid}}]
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">未使用</p>
                        <p class="font-error" v-if="row.status == 1">已使用</p>
                        <!-- <p class="font-error" v-if="row.start > 0 && row.start > nowtime">
                            未到可使用时间
                        </p> -->
                        <!-- <p class="font-error" v-if="row.end > 0 && row.end < nowtime">
                            已过期
                        </p> -->
                        <p class="font" v-if="row.showstart">开始:{{row.showstart}}</p>
                        <p class="font" v-if="row.showstart">过期:{{row.showend}}</p>
                    </template>
                   
                    <template slot-scope="{ row }" slot="cardtype">
                        <p class="font" v-if="row.cardtype == 1">VIP</p>
                        <p class="font" v-if="row.cardtype == 2">服务商</p>
                        <p class="font" v-if="row.cardtype == 3">代理商</p>
                    </template>

                    <template slot-scope="{ row }" slot="cardtime">
                        <p class="font">{{row.activated}}</p>
                        <p class="font">有效期时长：{{row.end}}</p>
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
                        <!-- <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                修改有效期（月份）：
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="month" placeholder="输入数值1-12" />
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="changeMonth(row.id)">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown> -->
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
                <Button type="success">总数：{{total}}</Button>
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

    <Modal title="" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                上级ID：
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.parentids" placeholder="请输入要绑定的上级ID" clearable style="width: 300px" />
                <P class="frm_tip">不输入默认为0扫码不带锁客</P>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                生成数量
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.number" placeholder="" clearable style="width: 300px" />
                <P class="frm_tip"></P>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" v-if="settings.twoucard == 1">
            <Col span="3" class="frm_title">
                会员类型：
            </Col>
            <Col span="18" class="frm_content">
                <RadioGroup v-model="sort.cardtype">
                    <Radio :label="1" :value="1">VIP</Radio>
                    <Radio :label="2" :value="2">服务商</Radio>
                    <Radio :label="3" :value="3">代理商</Radio>
                </RadioGroup>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle">
            <Col span="3" class="frm_title">
                会员时限：
            </Col>
            <Col span="18" class="frm_content">
                <RadioGroup v-model="sort.cardtime">
                    <Radio :label="0" :value="0">永久</Radio>
                    <Radio :label="1" :value="1">一个月</Radio>
                    <Radio :label="2" :value="2">三个月</Radio>
                    <Radio :label="3" :value="3">六个月</Radio>
                    <Radio :label="4" :value="4">一年</Radio>
                </RadioGroup>
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
                month:'',
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
                    {title:'激活码',key:"code"},
                    {title:'类型',key:"cardtype",slot: 'cardtype',},
                    {title:'使用人',key:'use',slot: 'use',},
                    {title:'推荐人',key:'tuijian',slot: 'tuijian',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'激活时间',key:'cardtime',slot: 'cardtime',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [
                    {label:'全部',value:0},
                    {label:'已使用',value:1},
                    {label:'未使用',value:2},
                    {label:'已过期',value:3},
                    {label:'未到期',value:4},
                ],
                page : {
                    pdata : {
                        doo : 'user',
                        op : 'code',
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
                sort: {cardtype:0,cardtime:0,type:365,limit:0,start:0,end:0,parentids:0},
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
            changeMonth(id){
                var self=this;
                var postdata = {
                    op : 'changemonth',
                    fromajax : 1,
                    month:this.month,
                    id : id,
                }
                self.$util.http('user','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            confirm(){
                var self = this;
                var postdata = {
                    op : 'addcode',
                    fromajax : 1,
                    fid : self.sort.id ? self.sort.id : 0,
                    cardtype : self.sort.cardtype,
                    endtime : self.sort.cardtime,
                    num : self.sort.number,
                    type : self.sort.type,
                    days : self.sort.days,
                    limit : self.sort.limit,
                    start : self.sort.start,
                    end : self.sort.end,
                    parentids:self.sort.parentids
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.showadd = false;
                        self.loadcode1();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            loadcode1(){
                var url = this.$util.Murl('user','lastedcode') + '&down=' + this.sort.number;
                location.href = url;
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