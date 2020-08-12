<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="jifencode" @on-click="changetab">
            <TabPane label="商品列表" name="jifenlist" ></TabPane>
            <TabPane label="添加商品" name="jifenadd" ></TabPane>
            <TabPane label="商品分类" name="jifensort" ></TabPane>
            <TabPane label="等待发奖" name="jifenwait" ></TabPane>
            <TabPane label="已经发奖" name="jifensended" ></TabPane>
            <TabPane label="已经完成" name="jifencomed" ></TabPane>
            <TabPane label="等待支付" name="jifenwaitpay" ></TabPane>
            <TabPane label="积分卡密" name="jifencode" ></TabPane>
        </Tabs>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                 <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button type="primary" @click="loadcode">下载卡密</Button>
                <Button type="primary" @click="addsort">生成卡密</Button>
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
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        {{row.days}}天
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
                生成数量
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.number" placeholder="" clearable  />
                <P class="frm_tip"></P>
            </Col>
            
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                积分数量
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.jifen" placeholder="" clearable  />
                <P class="frm_tip"></P>
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
                uploadurl : '',
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:100},
                    {title:'ID',key:'id'},
                    {title:'卡密',key:"code"},
                    {title:'积分',key:"days",},
                    {title:'使用人',key:'use',slot: 'use',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'全部',value:0},{label:'未使用',value:1},{label:'已使用',value:2},],
                page : {
                    pdata : {
                        doo : 'jifen',
                        op : 'card',
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
            changetab(e){
                this.$router.push(e);
            },
            confirm(){
                var self = this;
                var postdata = {
                    op : 'addcode',
                    fromajax : 1,
                    fid : self.sort.id ? self.sort.id : 0,
                    num : self.sort.number,
                    jifen : self.sort.jifen,
                    type : self.sort.type,
                    ctype : 1
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
                self.$util.http('jifen','GET',postdata,function(res){
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
            loadcode(e){
                var url = this.$util.Murl('jifen','card') + '&down=1';
                location.href = url;
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
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