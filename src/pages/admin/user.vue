<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">

                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
                
            </Col>
        </Row>   

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="head">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.headimg" />
                    </template>
                    <template slot-scope="{ row }" slot="type">
                        {{row.fxauth == 1 ? settings.fxbname+'员' : '普通用户'}}
                        
                    </template>
                    <template slot-scope="{ row, index }" slot="action">

                        <a href="javascript:;" @click="dealthis(row.id,'tofx')" v-if="row.fxauth == 0">设为{{settings.fxbname}}员</a>
                        <a href="javascript:;" @click="link" :data-url="'/adminuserdown?parent='+row.uid" >查看下级</a>
                        <Poptip
                            confirm
                            title="确定删除此条数据吗？"
                            @on-ok="dealthis(row.id,'deluser')"
                            placement="left">
                            <a>删除</a>
                        </Poptip>
                        
                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>
    </div>
</template>

<script type="text/javascript">
    
	export default {
        name : 'settingadmin',
	  	components: {

	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
                total : 0,
	  			params : {},
	  			list : [],
	  			pagedata : [],
	  			datalist : [],
                locname : '',
                showloc : false,
                isonbottom : false,
	  			page : {
	  				pdata : {
                        p:'admin',
	  					doo : 'user',
                        pnum : 10,
	  					op : 'list',
	  					page : 1,
	  					uid : '',
                        fromajax : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : true,
	  			},
                columns : [
                    {type: 'selection'},
                    {title:'ID',key:'uid'},
                    {title:'头像',key:"headimg",slot: 'head',},
                    {title:'昵称',key:'nickname'},
                    {title:'类型',key:'type',slot: 'type',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                adminuid : '',
                data : {},
                bindurl : '',
                rand : 1,
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            upqr(){
                this.rand = Date.parse(new Date())/1000;
            },
            handleOpen(){
                this.visible = true;
            },
            handleOpenqr(){
                this.visibleqr = true;
            },
            handleClose(){
                this.visible = false;
                this.visibleqr = false;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
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
                self.$util.http('signin','GET',postdata,function(res){
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
                console.log(e)
                this.onLoad();
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
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