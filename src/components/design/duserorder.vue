<template>
    <div class="headorder" :style="{color:item.params.color,'margin':item.params.mv+'px 10px'}">

        <div class="item_cell_box headorder_t">
            <div class="item_cell_flex headorder_title">我的订单</div>
            <div class="headorder_r">全部订单</div>
        </div>
        <div class="item_cell_box headorder_m">
            <div class="order-item" v-for="item in item.params.data">
                <img :src="item.img">
                <div>{{item.name}}</div>
            </div>
        </div>
        <div class="item_cell_box headorder_b " v-if="item.params.isbind != 1 && item.params.bindtype == 0">
            <div class="item_cell_flex">{{item.params.btext}}</div>
            <div>
                <span class="bindbtn">立即绑定</span>
            </div>
        </div>
        <div class="item_cell_box headorder_b headorder_b2" v-if="item.params.isbind != 1 && item.params.bindtype == 1">
            <div class="item_cell_flex">{{item.params.btext}}</div>
            <div style="color:red;">
                立即绑定
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        props : ['item'],
        data : function(){
            return {
            }
        },
        created(){
            var self = this;
            
        },
        methods : {

        }
    }
</script>

<style type="text/css">
@import "../../assets/css/design.css";

.headorder{
    margin: 0 10px;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    padding: 10px;
    border-radius: 5px;
}
.order-item{
    flex: 1;
    text-align: center;
    font-size: 13px;
    color: #999;
}
.order-item img{
    width: 30px;
    height: 30px;
    display: inline-block;
}
.headorder_t{
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}
.headorder_m{
    padding: 10px 0;
}
.headorder_b{
    padding-top: 10px;
    color: #999;
    align-items: center;
    font-size: 13px;
}
.bindbtn{
    display:inline-block;
    color: red;
    border:1px solid red;
    padding: 3px 10px;
    border-radius: 3px;
}
.headorder_b2{
    height: 26px;
    padding: 0 8px 0 8px;
    line-height: 26px;
    background-color: #fff8ed;
    border-radius: 4px;
}
.headorder_title{
    color: #333;
    font-weight: bold;
}
.headorder_r{
    color: #999;
    font-size: 12px;
}
</style>