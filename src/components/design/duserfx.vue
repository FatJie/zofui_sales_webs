<template>
    <div class="headfx" :style="{color:item.params.color,'margin-top':item.params.mv+'px'}">
        <div v-if="item.params.style == 0" class="headfx1-style item_cell_box" >
            <div class="item_cell_flex">
                <div class="headfx1-tips">{{item.params.stext}}</div>
                <div class="headfx1-desc">已邀请12人，已赚得0.00元</div>
            </div>
            <div class="headfx1-btn" v-if="item.params.btn">{{item.params.btn}}</div>
        </div>
        <div class="headfx2-style" v-if="item.params.style == 1">
            <div class="item_cell_box headfx2-top">
                <div class="item_cell_flex headfx2-draw">
                    <p class="headfx2-numt">1222</p>
                    <p class="headfx2-numb">可提现资金（元）</p>
                </div>
                <div class="headfx2-btn" v-if="item.params.dbtn">{{item.params.dbtn}}</div>
            </div>
            <div class="item_cell_box headfx2-bot">
                <div class="headfx2-num">
                    <p class="headfx2-numt">12222</p>
                    <p class="headfx2-numb">已获收益（元）</p>
                </div>
                <div class="item_cell_flex headfx2-num">
                    <p class="headfx2-numt">12</p>
                    <p class="headfx2-numb">已经邀请（位）</p>
                </div>
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
.headfx{
    border-radius: 8px;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    margin:0 10px;
}
.headfx1-style{
    background-size: auto 100%;
    background-position: 100% 0;
    background-repeat: no-repeat;
    align-items: center;
    background-image: url('http://img11.360buyimg.com/ddimg/jfs/t1/94310/9/6434/38114/5df382bfE5b3479b2/16b30ab4aac68d6a.png');
    padding: 10px;
}
.headfx1-tips{
    font-size: 16px;
    font-weight: bold;
    color: #000;
    padding-bottom: 10px;
}
.headfx1-desc{
    padding-top: 10px;
    color: #999;
    font-size: 12px;
}
.headfx1-btn,.headfx2-btn{
    color: #fff;
    background: red;
    padding: 0 10px;
    border-radius: 3px;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
}
.headfx2-style{
    padding: 10px;
}
.headfx2-top{
    padding-bottom: 10px;
    border-bottom: 1px solid #fcfcfc;
}
.headfx2-bot{
    padding-top: 10px;
}
.headfx2-numb{
    font-size: 12px;
    color: #999;
}
.headfx2-numt{
    color: #333;
    font-weight: bold;
    font-size: 16px;
}
.headfx2-num{
    width: 50%;
    text-align: left;
}
</style>