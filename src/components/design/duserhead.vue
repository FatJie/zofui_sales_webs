<template>
    <div class="headtop item_cell_box" :style="{'color':item.params.color,'background-color':item.params.bg,'padding-left':item.params.pv+'px','padding-right':item.params.pv+'px','padding-top':item.params.ptop+'px','padding-bottom':item.params.pbot+'px','border-radius':item.params.bordr==1?'0 0 320px 320px/0 0 25px 25px' : '0'}">
        <div class="headtop_head">
            <Avatar icon="ios-person" size="large" />
        </div>
        <div class="item_cell_flex headtop_name">
            <div class="headtop_nickname">
                用户昵称
            </div>
            <p class="userid" v-if="item.params.uid == 1">用户ID:152</p>
            <p class="userid" v-if="item.params.parent == 1">邀请人ID:12</p>
        </div>
        <div class="headtop_r">
            <template v-if="item.params.mtype == 0">
                <p class="headtop_m" v-if="item.params.ism == 1">金币:2552</p>
                <p class="headtop_m" v-if="item.params.isjf == 1">积分:2552</p>
            </template>
            <template v-if="item.params.mtype == 1">
                <div class="headtop_v" v-if="item.params.ism == 1">
                    <p class="">2552</p>
                    <p class="">金币</p>
                </div>
                <div class="headtop_v" v-if="item.params.isjf == 1">
                    <p class="">2552</p>
                    <p class="">积分</p>
                </div>
            </template>
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

.headtop{
    align-items: center;
}
.headtop_name{
    padding-left: 10px!important;
}
.userid{
    font-size: 12px;
    display: inline-block;
    border:1px solid #fff;
    padding: 1px 5px;
    border-radius: 40px;
}
.headtop_nickname{
    font-weight: bold;
    font-size: 16px;
}
.headtop_m{
    padding: 5px 0;
}
.headtop_v{
    display: inline-block;
    padding: 0 5px;
    text-align: center;
}
</style>