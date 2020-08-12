<template>
    <div class="app-images-box fixbgimg" :style="{'background-image':'url('+item.params.bgimg+')','background-color':item.params.bgcolor,'margin':item.params.padding+'px '+item.params.paddingv+'px'}">
        <div class="app-images" v-if="item.params.type <= 3 || item.params.type == 6">
            <li class="app_images_item" v-for="images in item.params.data" :style="{width:(item.params.type == 1 ? 100 : (item.params.type == 2 ? 50 : (item.params.type == 6 ? 25 : 33.3) )) +'%'}">
                <a href="javascript:;">
                    <div class="app_images_itemin" >
                        <img :src="images.img" :style="{'width':item.params.pdimg+'%','height':320*item.params.imgheight/100+'px','border-radius':item.params.radius+'px'}" style="display: block;" />
                    </div>
                    <p class="app-images-font" v-if="item.params.istext == 1" :style="{'font-size':item.params.fontsize+'px','color':item.params.fontcolor,'padding-top':item.params.fonttop+'px'}">{{images.title}}</p>
                </a>
            </li>
            <div class="clear"></div>
        </div>

        <div class="app-images app_images_type4 item_cell_box " v-if="item.params.type == 4">
            <div v-for="(images,$index) in item.params.data" v-if="$index == 0" :style="{width:'50%','padding-right':item.params.pimg/2+'px'}">
                <a href="javascript:;">
                    <div class="app_images_itemin">
                        <img :src="images.img" :style="{'width':item.params.pdimg+'%','height':(320*item.params.imgheight/100+item.params.pimg/2)+'px','border-radius':item.params.radius+'px'}" style="display: block;" />

                    </div>
                </a>
            </div>
            <div class="" style="width:50%">
                <div v-for="(images,$index) in item.params.data" v-if="$index > 0" :style="{width:'100%','padding-bottom':($index == 1 ? item.params.pimg/2+'px' : 0)}">
                    <a href="javascript:;">
                        <div class="app_images_itemin">
                            <img :src="images.img" :style="{'width':item.params.pdimg+'%','height':320*item.params.imgheight/100/2+'px','border-radius':item.params.radius+'px'}" style="display: block;" />
                        </div>
                    </a>
                </div>
            </div>      
        </div>  

        <div class="app-images app_images_type4 item_cell_box " v-if="item.params.type == 5" >
            <div class="" style="width:50%">
                <div v-for="(images,$index) in item.params.data" v-if="$index < 2" :style="{width:'100%','padding-bottom':($index == 0 ? item.params.pimg/2+'px' : 0)}">
                    <a href="javascript:;">
                        <div class="app_images_itemin">
                            <img :src="images.img" :style="{'width':item.params.pdimg+'%','height':320*item.params.imgheight/100/2+'px','border-radius':item.params.radius+'px'}" style="display: block;" />
                        </div>
                    </a>
                </div>
            </div>  
            <div v-for="(images,$index) in item.params.data" v-if="$index == 2" :style="{width:'50%','padding-left':item.params.pimg+'px'}">
                <a href="javascript:;">
                    <div class="app_images_itemin">
                        <img :src="images.img" :style="{'width':item.params.pdimg+'%','height':(320*item.params.imgheight/100+item.params.pimg/2)+'px','border-radius':item.params.radius+'px'}" style="display: block;" />
                    </div>
                </a>
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