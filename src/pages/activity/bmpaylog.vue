<template>
    <div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="bmpaylog" @on-click="changetab">
            <TabPane label="报名设置" name="bmadd"  ></TabPane>
            <TabPane label="报名记录" name="bmlog" ></TabPane>
            <TabPane label="支付记录" name="bmpaylog" ></TabPane>
        </Tabs>
        
        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" style="width: 150px" />
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">

                    <template slot-scope="{ row }" slot="user">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.user.headimg" />
                        <p>{{row.user.nickname}}（{{row.user.id}}）</p>
                    </template>
                    <template slot-scope="{ row }" slot="dataid">
                        <p >{{row.params.fid}}</p>
                    </template>
                    
                    <template slot-scope="{ row }" slot="status">

                        <template v-if="row.status == 0">
                            未支付
                        </template>
                        <template v-if="row.status == 1">
                            <p class="font-">已支付</p>
                        </template>
                    </template>

                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
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
                isall : false,
                params : {},
                list : [],
                allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'支付者',key:'user',slot:'user'},
                    {title:'数据id',key:"dataid",slot: 'dataid',},
                    {title:'时间',key:"showtime"},
                    {title:'状态',key:'status',slot:'status'},
                    
                ],
                status : [{label:'全部',value:0},{label:'未支付',value:1},{label:'已支付',value:2},],
                page : {
                    pdata : {
                        doo : 'subform',
                        op : 'paylog',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        uid : '',
                        qid : '',
                        gid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                selected : [],
                money : '',
                pass1 : '',
                pass2 : '',
            }
        },
        created:function(){
            this.initData();

        },
        methods: {
            changetab(e){
                this.$router.push(e);
            },
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('quest','GET',postdata,function(res){
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
                    op : type,
                    fromajax : 1,
                    sid : id,
                    value : this.money,
                }
                self.$util.http('quest','GET',postdata,function(res){
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
                    op : e,
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('quest','GET',postdata,function(res){
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