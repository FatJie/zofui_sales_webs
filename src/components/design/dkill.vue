<template>
    <div class="temp_item temp_item_good" :style="{'padding':item.params.paddingv+'px 10px','background':item.params.bgcolor}">
        
        <div class="item_cell_box kill_group">
            <div class="item_cell_flex kill_l">{{item.params.leftfont == '' || !item.params.leftfont ? '秒杀9点场' : item.params.leftfont}}</div>
            <div class="kill_r">
                距开始 
                <span>1</span> :
                <span>22</span> :
                <span>33</span>
            </div>
        </div>
        
        <div class="showgood_num" >显示{{item.params.goodnum}}款秒杀商品</div>

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


</style>