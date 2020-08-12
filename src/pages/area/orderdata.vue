<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        
        <div class="mb10">
            <DatePicker type="date" placeholder="筛选时间" class="w200" @on-change="changetime"></DatePicker>
        </div>

        <card class="mb10">
            <Row>
                <Col span="6" v-for="(item,index) in data" class="data-in">
                    <Row type="flex">
                        <div class="data-l" >
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <div class="data-name">{{item.name}}</div>
                            <div >{{item.dayy ? '今日：' : ''}} <span class="data-num">{{item.num*100/100}}</span> {{item.per}}</div>
                            <div class="data-dayy" v-if="item.dayy">{{item.dayy}}： {{item.dayynum*100/100}} {{item.per}}</div>
                        </div>
                    </Row>
                </Col>
            </Row>
        </card>
        
        <!--<card class="mb10">
            <Row class="">
                <Col span="12">
                    <ve-line :data="chartData"></ve-line>
                    <div class="tc" style="position:absolute;top:0">商品数据</div>
                </Col>
                <Col span="12">
                    <ve-line :data="chartData1"></ve-line>
                    <div class="tc" style="position:absolute;top:0">其他数据</div>
                </Col>
            </Row>
        </card>

        <card class="mb10">
            <Row class="">
                <ve-histogram :data="rank"></ve-histogram>
                <div class="tc" style="position:absolute;top:0">商户排行(已完成的订单金额)</div>
            </Row>
        </card> -->
    </div>
</template>

<script type="text/javascript">
    import ICountUp from 'vue-countup-v2';
    import VeLine from 'v-charts/lib/line.common'
    import VeHistogram from 'v-charts/lib/histogram.common'
	export default {
	  	components: {
            ICountUp,VeLine,VeHistogram
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
                data : [],
                date : '',
                chartData : {
                    columns: ['date', '商品订单量', '商品交易额', '完成核销量'],
                    rows: []
                },
                chartData1 : {
                    columns: ['date', '购买会员卡', '购买会员卡金额', '商户入驻订单','商户入驻订单金额','充值余额订单','充值余额订单金额'],
                    rows: []
                },
                rank : {},
	  		}
	  	},
        created:function(){
            this.initData();
        },
	  	methods: {
            changetime(obj){
                this.date = obj;
                this.initData();
            },
            setend(e){
                this.shop.end = e;
            },
            uploadend(e){
                if( e.attachment ){
                    this.$set(this.shop,'headimg',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
            },
            uploadendthumb(){
                if( e.attachment ){
                    this.$set(this.shop,'cover',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
            },
            shopedit(e){
                this.$set(this.shop,'content',e);
            },
            addthis(){
                this.shop.params.push({itemt:''});
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            initData(){
                var self = this;
                var postdata = {
                    op : 'info',
                    fromajax : 1,
                    dayy : this.date,
                    p:'area'
                }
                self.$util.http('index','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.loading = false;
                        self.data = res.obj.data;

                    }else{
                        self.$Message.error(res.res);
                    }
                });

                self.$util.http('data','GET',{op:'orderchart',fromajax:1},function(res){
                    if( res.status == 200 ){
                        
                        self.chartData.rows = res.obj.row ? res.obj.row : [];
                        self.chartData1.rows = res.obj.row1 ? res.obj.row1 : [];
                        self.rank = res.obj.rank ? res.obj.rank : {};
                    }else{
                        self.$Message.error(res.res);
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
.data-l{
    background: #d6deea;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    font-size: 30px;
    margin-right: 10px;
}
.data-in{
    padding: 20px;
    border-bottom: 1px solid #eee;
}
.data-name{
    font-size: 15px;
    font-weight: bold;
}
.data-num{
    font-weight: bold;
    color: #2d8cf0;
    font-size: 18px;
}
.data-dayy{
    color: #999;
}
</style>