<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        <Button type="primary" @click="addsort" style="margin-bottom:10px;">添加问答</Button>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a href="javascript:;" @click="edit(row)"   >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deleteq')"
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
                        <DropdownItem name="deletequest">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

    <Modal title="添加分类" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                排序序号
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="quest.number" placeholder="" clearable  />
                <P class="frm_tip">填数字，数字越大越靠前</P>
            </Col>
            
        </Row>
        <Row class="frm_group">
            <Col span="3" class="frm_title">
                问题内容
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="quest.quest" type="textarea" :rows="4" class="w400"  placeholder="输入问题" />
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="3" class="frm_title">
                回答
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="quest.answer" type="textarea" :rows="4" class="w400"  placeholder="输入回答" />
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
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'问',key:"quest"},
                    {title:'答',key:"answer"},
                    {title:'序号',key:'number'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'fx',
                        op : 'quest',
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
                quest : {},
                selected : [],
                showadd : false,
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            confirm(){
                var self = this;
                var postdata = {
                    op : 'addquest',
                    fromajax : 1,
                    fid : self.quest.id ? self.quest.id : 0,
                    q : self.quest.quest,
                    w : self.quest.answer,
                    number : self.quest.number,
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
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('fx','GET',postdata,function(res){
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
                self.$util.http('fx','GET',postdata,function(res){
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
            edit(e){
                this.quest = e;
                this.showadd = true;
            },
            addsort(){
                this.quest = {};
                this.showadd = true;
            },
            search(){
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