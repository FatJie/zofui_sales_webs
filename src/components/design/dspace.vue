<template>
    <div class="temp_item temp_item_space" :style="{height:item.params.height + 'px', background : item.params.bgcolor}" >
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