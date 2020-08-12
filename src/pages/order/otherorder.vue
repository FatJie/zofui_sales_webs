<template>
    
    <div>
        <Row style="margin-bottom:10px;">
            <Col span="24">
                
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选类型" @on-change="shaixuan($event,'type')" style="width:150px">
                    <Option v-for="item in otype" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.uid" @on-enter="search" @on-click="search" placeholder="输入用户ID" class=" w150" />
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="user">
                        <p>{{row.user.nickname}}（{{row.user.id}}）</p>
                    </template>
                    <template slot-scope="{ row }" slot="orderid">
                        <P>{{row.orderid}}</P>
                        <P>{{row.uorderid}}</P>
                        <P>{{row.wxorderid}}</P>
                    </template>
                    <template slot-scope="{ row }" slot="data">
                        <p v-if="row.sever > 0 && row.type != 1">服务费:{{row.sever}}</p>

                        <p v-if="row.shopfee > 0 && row.type != 1">商户收入:{{row.shopfee}}</p>

                        <p v-if="row.salerfee > 0">一级{{settings.fxbname}}:{{row.salerfee}}</p>
                        <p v-if="row.salerfeea > 0">二级{{settings.fxbname}}:{{row.salerfeea}}</p>
                        <p v-if="row.salerfeeb > 0">三级{{settings.fxbname}}:{{row.salerfeeb}}</p>

                        <p v-if="row.carddays > 0 && row.type == 1">天数:{{row.carddays}}</p>

                        <p v-if="row.params && row.params.give > 0">赠送:{{row.params.give}}</p>

                        <p v-if="row.shop">店铺：{{row.shop.name}}</p>

                        <p v-if="row.jifen > 0">赠送{{settings.jfbname}}:{{row.jifen}}</p>
                        <p v-if="row.agentfee > 0">三级{{settings.agentname}}:{{row.agent.nickname}}</p>
                        <p v-if="row.agentfee > 0">分成：{{row.agentfee}}</p>

                        <p v-if="row.type == 8">礼包id:{{row.carddays}}</p>
                        <p v-if="row.type == 8">礼包名称:{{row.prize.name}}</p>
                        <p v-if="row.type == 1">{{row.params*1 >= 2 && settings.twoucard == 1 ? '高级会员' : ''}}</p>
                        <p v-if="row.type == 7 && row.yhmdis > 0">折扣优惠:{{row.yhmdis*1}}</p>
                        
                    </template>
                    <template slot-scope="{ row }" slot="other">
                            
                        <p v-if="row.name">姓名:{{row.name}}</p>
                        <p v-if="row.tel">电话:{{row.tel}}</p>
                        <p v-if="row.address">地址:{{row.address}}</p>
                        <p v-if="row.type == 10">商户充值积分</p>
                        <p v-if="row.type == 11">充值卡券</p>
                        <p v-if="row.type == 12">提交表单</p>
                    </template>
                    
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">未支付</p>
                        <p class="font" v-if="row.status >= 1">已支付</p>
                        <P>{{row.showtime}}</P>
                    </template>
                    <template slot-scope="{ row }" slot="headimg">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.headimg" />
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p >
                            
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
                    {title:'订单编号',key:'orderid',key:'orderid'},
                    
                    {title:'用户',key:'user',slot: 'user',},
                    {title:'金额',key:"fee",},
                    {title:'数据',key:"data",slot: 'data',},
                    {title:'其他',key:'other',slot: 'other',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'未支付',value:1},{label:'已支付',value:2}],
                otype : [
                	{label:'商户充值积分',value:10},
                	{label:'充值卡券红包',value:11},
                	{label:'表单支付',value:12},
                ],
                page : {
                    pdata : {
                        doo : 'order',
                        op : 'other',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        type : '',
                        uid : '',
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
            down(){
                let url = this.$util.Murl('order','card') + '&down=1';
                for(var t in this.page.pdata){
                    if( t != 'fromajax' && t != 'page' && t != 'pnum' ){
                        url += '&'+t+'='+this.page.pdata[t]
                    }
                }
                location.href = url;
            },
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