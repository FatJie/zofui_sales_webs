<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="jifenlist" @on-click="changetab">
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
                <Input icon="ios-search" v-model="page.pdata.name" @on-enter="search" @on-click="search" placeholder="输入商品名称" style="width: 150px" />
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="thumb">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.thumb" />
                    </template>

                    <template slot-scope="{ row }" slot="price">
                        <template >
                            <p class="font-note">{{settings.jfbname}}：{{row.need}}</p>
                            <p class="font-note">支付：{{row.fee}}</p>
                        </template> 
                    </template>
                    <template slot-scope="{ row }" slot="num">
                        <p class="font" >剩余:{{row.stock}}</p>
                        <p class="font" >已兑换:{{row.taked}}</p>
                        
                    </template>

                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">
                            正常
                        </p>
                        <p class="font-error" v-if="row.status == 1">已下架</p>
                        
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            
                            <a @click="link" :data-url="'jifenadd?id='+row.id"  >编辑</a>

                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deletegoods')"
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
                        <DropdownItem name="deletealljifen">删除商品</DropdownItem>
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
        props : ['settings','op','set'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			list : [],
	  			allsort : [],
                mysettings : this.set ? this.set : this.settings,
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'图片',key:"thumb",slot: 'thumb',},
                    {title:'名称',key:"name"},
                    
                    {title:'价格',key:'price',slot: 'price',},
                    {title:'数量',key:'num',slot: 'num',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'jifen',
                        op : 'goods',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        sortid : '',
                        sorttwo : '',
                        status : '',
                        type : '',
                        title : '',
                        gid : '',
                        shopname : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                allsort : [],
                alltwosort : [],
                selected : [],
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
                    op : type,
                    fromajax : 1,
                    id : id,
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
            remove(e){
                var self = this;
                var postdata = {
                    op : 'list',
                    fromajax : 1,
                }
                self.$util.http('jifen','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.$Message.error(res.res);
                        for (var i = 0; i < self.list.length; i++) {
                            if(self.list[i].id == e){

                                self.list.splice(i,1);
                                self.list = self.list;

                            }
                        }
                        
                    }else{
                        self.$Message.error(res.res);
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
                        self.allsort = res.obj.topbar.sorta;
                        self.alltwosort = res.obj.topbar.sortb;
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