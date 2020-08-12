<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Button type="primary" @click="addsort">添加打印机</Button>
                <Button type="default" @click="test">测试打印</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    
                    <template slot-scope="{ row }" slot="type">
                        <p class="font" v-if="row.type == 0">飞印</p>
                        <p class="font" v-if="row.type == 1">飞鹅</p>
                        <p class="font" v-if="row.type == 2">365</p>
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">正常</p>
                        <p class="font-error" v-if="row.status == 1">已禁用</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <p>编码：{{row.code}}</p>
                        <p>秘钥：{{row.key}}</p>
                        <p>设备：{{row.devno}}</p>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a href="javascript:;" @click="edit(row)" >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'delete')"
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
                
            </Col>
            <Col span="18">
                
            </Col>
        </Row>

    <Modal title="添加分类" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                备注名称
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.name" placeholder="" clearable  />
                <P class="frm_tip"></P>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                设备类型
            </Col>
            <Col span="18" class="frm_content">
                <RadioGroup v-model="sort.type">
                    <Radio label="0" value="0">飞印</Radio>
                    <Radio label="1" value="1">飞鹅</Radio>
                    <Radio label="2" value="2">365</Radio>
                </RadioGroup>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                商户账户
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.code" placeholder="" clearable  />
                <p class="frm_tip">飞印的商户编码或飞鹅的用户名，365打印机可不填</p>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                密钥
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.key" placeholder="" clearable  />
                <p class="frm_tip">飞印的API密钥或飞鹅的UKEY、365打印机的key</p>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                终端编号
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.devno" placeholder="" clearable  />
                <p class="frm_tip">打印设备携带的终端编号</p>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                打印联数
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.times" placeholder="" clearable  />
                <p class="frm_tip"></p>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                状态
            </Col>
            <Col span="18" class="frm_content">
                <RadioGroup v-model="sort.status">
                    <Radio label="0" value="0">正常</Radio>
                    <Radio label="1" value="1">禁用</Radio>
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
                loading : false,
	  			params : {},
                uploadurl : '',
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:"name"},
                    {title:'类型',key:"type",slot: 'type',},
                    {title:'参数',key:'data',slot: 'data',},
                    {title:'联数',key:'times'},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'printa',
                        op : 'list',
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
        },
	  	activated:function(e){},
	  	methods: {
            confirm(){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'addprinta',
                    fromajax : 1,
                    fid : self.sort.id ? self.sort.id : 0,
                    name : self.sort.name,
                    type : self.sort.type,
                    code : self.sort.code,
                    status : self.sort.status,
                    key : self.sort.key,
                    devno : self.sort.devno,
                    times : self.sort.times,
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
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('printa','GET',postdata,function(res){
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
                self.$util.http('goods','GET',postdata,function(res){
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
            test(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'testprint',
                    fromajax : 1,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.$Modal.warning({
                            title:'打印结果',
                            content:res.res
                        })
                        
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
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>