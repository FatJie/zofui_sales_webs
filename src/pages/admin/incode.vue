<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        
        <Row style="margin-bottom:10px;">
            <Col span="24">

                <Select  placeholder="筛选类型" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button type="primary" @click="addsort">导入核销码</Button>
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
                        <p v-if="row.status == 0">未使用</p>
                        <template v-if="row.status == 1">
                            <p>已使用</p>
                            <p v-if="row.orderid">订单：{{row.orderid}}</p>
                            <p>使用：{{row.showusetime}}</p>
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
                            <Poptip
                                confirm
                                title="确定删除吗？"
                                @on-ok="dealthis(row.id,'deletecode')"
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
                        <DropdownItem name="deleteallcode">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

    <Modal title="" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
        
        <Row class="frm_group " type="flex"  >
            <Col span="3" class="frm_title">
                核销码列表
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="codelist" type="textarea" placeholder="" clearable :rows="20" />
                <P class="frm_tip">复制核销码粘贴填入此处，每行一个，重复的核销码将只能导入一个。</P>
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
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'核销码',key:'code'},
                    {title:'导入时间',key:"showtime"},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'good',
                        op : 'incode',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        gid : '',
                        status : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                status : [
                    {label:'全部',value:0},
                    {label:'未使用',value:1},
                    {label:'已使用',value:2},
                ],
                selected : [],
                codelist : '',
                showadd : false,
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            addsort(e){
                this.showadd = true;
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
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
            editmoney(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    sid : id,
                    value : this.money,
                }
                self.$util.http('good','signin',postdata,function(res){
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
            confirm(){
                var self = this;
                var postdata = {
                    p:'admin',
                    op:'incodeall',
                    fromajax : 1,
                    gid : this.page.pdata.gid,
                    code : this.codelist,
                }
                self.$util.http('good','POST',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.showadd = false;
                        self.codelist = '';
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
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
                if( params.gid > 0){
                    this.page.pdata.gid = params.gid;
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