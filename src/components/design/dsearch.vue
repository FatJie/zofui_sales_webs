<template>
    <div class="temp_item temp_item_search item_cell_box" :style="{'padding':item.params.paddingv+'px '+ item.params.paddingh + 'px' ,'background':item.params.bgcolor}" style="align-items: center;">
        <div class="search_input_box item_cell_flex" :style="{'border-radius':item.params.radius+'px','background-color':item.params.incolor,'color':item.params.placolor}">
            {{item.params.pla}}
        </div>
        <div class="search_input_r" style="color:#999;font-size:13px;padding:0 5px;">分类</div>
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