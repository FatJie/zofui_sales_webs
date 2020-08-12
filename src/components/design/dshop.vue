<template>
    <div class="temp_item temp_item_good" :style="{'padding':item.params.paddingv+'px 5px','background':item.params.bgcolor}">
        <div class="showgood_num" v-if="item.params.showtype == 1">显示分类下的{{item.params.goodnum}}个店铺</div>

        <div class="showgood_num" v-if="item.params.showtype == 2">显示距离最近的{{item.params.goodnum}}个店铺</div>

        <div class="showgood_num" v-if="item.params.showtype == 0 && item.params.data.length > 0">按选择的显示{{item.params.data.length}}个店铺</div>
        
        <div style="height:100px;text-align: center;color: #999;line-height:100px;" v-if="item.params.showtype == 0 && item.params.data.length <= 0">请选择显示的店铺</div>
        
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