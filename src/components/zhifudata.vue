<template>
    
    <div>
        <Row style="margin-bottom:10px;">
            <Col span="24">
                
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'types')" style="width:150px">
                    <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                
                <DatePicker type="date" placeholder="筛选时间" class="w200" @on-change="changetime"></DatePicker>

                
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="id">
                        <p>{{row.id}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="user">
                        <p>{{row.nickname}}</p>
                    </template>
                     <template slot-scope="{ row }" slot="users">
                        <p>{{row.parentname}}</p>
                    </template>
                     <template slot-scope="{ row }" slot="userss">
                        <p>{{row.parentgrade}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="fee">
                        <p>{{row.money}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        
                         <p>{{row.aftermoney}}</p>
                    </template>
                    <template slot-scope="{ row }" slot="other">
                        <p>{{row.type}}</p>
                    </template>
                    
                    <template slot-scope="{ row }" slot="status">
                         <p>{{row.createtime}}</p>
                        
                    </template>

                    

                    <template slot-scope="{ row, index }" slot="action">
                       <p>{{row.remark}}</p>
                        

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
        props : ['op','settings','type'],
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
                    {title:'id',key:'id',slot: 'id',width:80},
                    {title:'用户名',key:'user',slot: 'user',width:100},
                    {title:'直推上级',key:'users',slot: 'users',width:90},
                    {title:'直推等级',key:'userss',slot: 'userss',width:90},
                    {title:'金额',key:"fee",slot: 'fee',width:90},
                    {title:'支付后金额',key:"data",slot: 'data',width:100},
                    {title:'类型',key:'other',slot: 'other',width:100},
                    {title:'时间',key:'status',slot: 'status',width:150},
                    {title:'描述',key:'33',slot: 'action'},
                ],
                types : [{label:'商品支付',value:10},{label:'会员支付',value:8},{label:'在线买单',value:13}],
                page : {
                    pdata : {
                        p : this.type == 'admin' ? 'admin' : '',
                        doo : 'order',
                        op : this.op,
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
                         date:'',

                    },
                    isend : false,
                    doing : false,
                    geting : false,
                   
                },
                money : '',
            }
        },
	    created(){
            this.initData();
	    },
        methods : {
            
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('order','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        if( res.message ) self.$Message.error(res.message);
                    }
                },true);
            },
            editmoney(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                    value : this.money,
                }
                if( type == 'editpp' ){
                    postdata.uid = id;
                    postdata.pid = this.money;
                }
                if( type == 'changemoneyuser' ){
                    postdata.type = 'user';
                }
                if( type == 'testmess' ){
                    postdata.uid = id;
                    postdata.mess = this.money;
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.money = 0;
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            }, 
            changetime(obj){
            console.log(obj);
             var self = this;
                self.page.pdata.date = obj;
                self.initData();
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
                self.$util.http('order','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        if( res.message ) self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        if( res.message ) self.$Message.error(res.message);
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
                if( params.id > 0 ){
                    self.page.pdata.userid = params.id;
                }
                
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

<style type="text/css">
/*tabbar*/
.fix-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 101;
    background-color: #fff;
    transform: translateZ(0);
}

.app-tabbar {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 56px;
    box-shadow: 0 0 1.5px 0 rgba(0,0,0,0.2);
    transform: translateZ(0);
}

.app-tabbar:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0.5px;
    background-color: rgba(0,0,0,0.33);
}

.app-tabbar .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-flex: 1;
    flex: 1;
    padding-top: 5px;
    font-size: 10px;
    line-height: 18px;
    color: #666;
}
.app-tabbar .item img{
    width: 28px;
}
.app-tabbar .item .icon {
    width: 25px;
    height: 25px;
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: 100%;
}

.app-tabbar .item.active .icon {
    background-position: center bottom;
}
</style>