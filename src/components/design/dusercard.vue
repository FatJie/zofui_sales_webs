<template>
    <div class="headucard item_cell_box" :style="{'background-color':item.params.bg,color:item.params.color,'margin-top':item.params.top+'px'}">
        <template v-if="item.params.style == 1">
            <div class="ucard_icon">
                <img src="http://img11.360buyimg.com/ddimg/jfs/t1/91316/8/6068/1283/5df1c64eEa27dcc02/f723f0488e28e2a2.png">
            </div>
            <div class="ucard_info item_cell_flex">
                <div class="ucard_name">超级会员卡</div>
                <div class="ucard_desc">超级会员卡描述文字</div>
            </div>
            <div class="ucard_r">会员中心</div>
        </template>
        <template v-else>
            <div class="ucard_icon item_cell_flex">
                <div class="item_cell_box ucard_icon2">
                    <img src="http://img11.360buyimg.com/ddimg/jfs/t1/91316/8/6068/1283/5df1c64eEa27dcc02/f723f0488e28e2a2.png">
                    <div>超级会员卡</div>
                </div>
                <div class="ucard_desc">
                    超级会员卡描述文字
                </div>
            </div>
            <div class="ucard_r2">会员中心</div>
        </template>
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
.headucard{
    align-items: center;
    background-color: #272425;
    padding: 7px 12px;
    border-radius: 8px;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    margin:0 10px;
}
.ucard_icon{
    padding-right: 10px;
}
.ucard_icon img{
    width:20px;
    height: 20px;
}

.ucard_desc{
    font-size: 13px;
    color: #999;
}
.ucard_icon2{
    align-items: center;
    padding-bottom: 10px;
}
.ucard_icon2 img{
    margin-right: 10px;
    width:10px;
    height: 10px;
}
.ucard_r2{
    background-color: red;
    padding: 3px 10px;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
}
</style>