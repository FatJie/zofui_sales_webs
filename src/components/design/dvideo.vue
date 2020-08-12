<template>
    <div class="app-video-box" :style="{padding:item.params.paddingv+'px 2px','background-color':item.params.bgcolor}">
        <video controls :src="item.params.url" :poster="item.params.poster" :style="{'width':'100%','height':320*item.params.height/100+'px'}"></video>
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