<template>
<div >
    <img :src="item.params.img" :style="{'width':'100%','height':320*item.params.height/100+'px'}">
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