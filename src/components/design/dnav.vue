<template>
    <div class="app-mod-12 fixbgimg"  :style="{'background-color':item.params.bgcolor}">
        <div v-for="menu in item.params.data" class="app-mod-12-nav" :style="{'width': 100/item.params.data.length + '%','padding':item.params.paddingv + 'px 0'}">
            <div class="app-mod-12-img" :style="{'padding': '0 '+item.params.padding +'px'}">
                <img :src="menu.img" :style="{'border-radius':item.params.radius,'width':320*item.params.imgwid/100+'px','height':320*item.params.imgheight/100+'px'}" />
            </div>
            <div class="app-mod-12-text" v-if="menu.title" :style="{'color':item.params.fontcolor,'margin-top':item.params.martop+'px'}">
                <div>{{menu.title}}</div>
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


</style>