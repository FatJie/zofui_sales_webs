<template>
    <div class="temp_item temp_item_title fixbgimg" :style="{'padding':item.params.paddingv+'px ' + item.params.paddingh+'px','background-image':'url('+item.params.bgimg+')','background-color':item.params.bgcolor}">
        
        <div class="item_cell_box" style="align-items: center;" :style="{'border-left':item.params.leftbord == 0 ? '6px solid '+item.params.bordbg : 0 }">
            <div class="temp_title_limg" v-if="item.params.lefticon">
                <img :style="{'width':item.params.lwidth+'px'}" :src="item.params.leftimg">
            </div>
            <div class="item_cell_flex temp_title_mfont" :style="{'text-align':item.params.pos,'font-size':item.params.size+'px','color':item.params.color,'font-weight':item.params.isbold == 1 ? 'bold' : 'initial'}">
                <img v-if="item.params.fonticon" :style="{'width':item.params.fontwidth+'px'}" :src="item.params.fontimg">
                <div class="title_in">
                    <span class="title_intext"> {{item.params.content}} </span>
                    <span class="title_inbg obg-pri" style="background-color:red;" v-if="item.params.isbgline == 1"></span> 
                </div>
            </div>
            <div class="temp_title_rfont" v-if="item.params.rightfont" :style="{'color':item.params.rfontcolor}">
                {{item.params.rightfont}}
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
.title_in{
    display: inline-block;
    position: relative;
    z-index: 1;
}
.title_intext{
    position: relative;
    z-index: 1;
}
.title_inbg{
    position: absolute;
    width: 105%;
    height: 7px;
    border-radius: 17.5px;
    background-color: #fff;
    bottom: 3.5px;
    z-index: 0;
    left: -2.5px;

}

</style>