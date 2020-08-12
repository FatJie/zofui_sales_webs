<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <!-- <Row style="margin-bottom:10px;">
            <Col span="24">
                <Input icon="ios-search" v-model="page.pdata.nick" @on-enter="search" @on-click="search" placeholder="输入用户昵称" class="mb5 w150" />
                
            </Col>
        </Row> -->

        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="goods">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.img" />
                    </template>

                    <template slot-scope="{ row }" slot="user">
                        <p>{{row.tel}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="nick">
                        <p>{{row.nickname}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="content">
                        <p v-if="row.grade==0">普通会员</p>
                        <p v-if="row.grade==1">VIP</p>
                        <p v-if="row.grade==2">服务商</p>
                        <p v-if="row.grade==3">代理商</p>
                    </template>

                    <template slot-scope="{ row }" slot="status">
                        
                        <p>{{row.time}}</p>
                            
                    </template>

                    <template slot-scope="{ row }" slot="denglu">
                        
                        <p>{{row.logintime}}</p>
                        
                    </template>
                    

                    <template slot-scope="{ row, index }" slot="action">
                        
                        <p>{{row.num}}</p>
                        
                    </template>
                    <template slot-scope="{ row, index }" slot="money">
                        
                        <p>{{row.price}}</p>
                        
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
	  	components: {
            
	  	},
        props : ['settings','set','type'],
        data : function(){
	  		return {
                loading : false,
	  			list : [],
                total : 0,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id'},
                    {title:'头像',key:'goods',slot: 'goods',},
                    {title:'昵称',key:'nick',slot: 'nick',},
                    {title:'手机号',key:"user",slot: 'user',},
                    {title:'会员卡',key:'content',slot: 'content',},
                    {title:'最近消费',key:'status',slot: 'status',},
                    {title:'登录时间',key:'denglu',slot: 'denglu',},
                    {title:'消费次数',key:'33',slot: 'action',},
                    {title:'消费金额',key:'money',slot: 'money',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'order',
                        op : 'memberlist',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
	  		}
	  	},
        created:function(){
            this.initData();

        },
	  	methods: {
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                if( params.id > 0 ){
                    self.page.pdata.userid = params.id;
                }
                if( params.orderid ){
                    self.page.pdata.orderid = params.orderid;
                }
                
                if( this.type == 1 ){
                    self.page.pdata.isshow = 1;
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

<style type="text/css" scoped>


</style>