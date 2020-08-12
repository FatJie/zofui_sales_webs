<template>
    <Carousel autoplay  loop :radius-dot="true" :dots="item.params.showpoint == 0 ? 'inside' : 'none'" :autoplay-speed="6000" style="min-height:50px;">
        <CarouselItem v-for="inn in item.params.data" >
            <img :src="inn.img" style="width:100%" :style="{'height':320*item.params.imgheight/100+'px'}">
        </CarouselItem>
        
    </Carousel>
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