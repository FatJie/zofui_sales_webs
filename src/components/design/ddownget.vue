<template>
    <div class="temp_item temp_item_good" :style="{'padding':item.params.paddingv+'px 5px','background':item.params.bgcolor}">
        <div class="showgood_num" >下拉自动加载商品</div>
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