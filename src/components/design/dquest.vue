<template>
    <div class="temp_item temp_item_good" :style="{'padding':item.params.paddingv+'px 5px','background':item.params.bgcolor}">

        <div class="item_cell_box quest_in">
            <div class="quest_inl">
                <img :src="item.params.img" :style="{width:item.params.width+'px',height:item.params.height+'px'}" />
            </div>
            <div class="item_cell_flex quest_inr" >
                <div class="quest_item">演示提问的内容，前端会显示真实数据。</div>
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

.quest_in{
    align-items: center;
}
.quest_inl{
    margin-right:5px;
}
.quest_inl img{
    width:25px;
    height:25px;
    display:block;
}
.quest_inr .van-swipe{
    height:25px;
    line-height:25px;
}
.quest_item{
    font-size:14px;
    -webkit-line-clamp: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>