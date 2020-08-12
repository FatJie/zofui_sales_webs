<template>
    <div class="temp_item temp_item_good" :style="{'padding':item.params.paddingv+'px 5px','background':item.params.bgcolor}">
        <div class="showgood_num" v-if="item.params.showtype == 1">显示分类[{{ item.params.sorttname ? item.params.sorttname : item.params.sortname}}]下的{{item.params.goodnum}}款{{item.name == 'quickgoods' ? '限抢' : ''}}{{item.name == 'groupgoods' ? '拼团' : ''}}{{item.name == 'cutgoods' ? '砍价' : ''}}{{item.name == 'bmgoods' ? '报名' : ''}}{{item.name == 'chougoods' ? '抽奖' : ''}}商品</div>

        <div class="showgood_num" v-if="item.params.showtype == 3">显示商户[id：{{item.params.shopid}}]的{{item.params.goodnum}}款商品（按排序序号排序）</div>

        <div class="showgood_num" v-if="item.params.showtype == 4">显示标签[id：{{item.params.tagid}}]的{{item.params.goodnum}}款商品</div>

        <div class="showgood_num" v-if="item.params.showtype == 2">显示距离最近的{{item.params.goodnum}}款{{item.name == 'quickgoods' ? '限抢' : ''}}{{item.name == 'groupgoods' ? '拼团' : ''}}{{item.name == 'cutgoods' ? '砍价' : ''}}{{item.name == 'bmgoods' ? '报名' : ''}}{{item.name == 'chougoods' ? '抽奖' : ''}}商品</div>
        
        <div style="height:100px;text-align: center;color: #999;line-height:100px;" v-if="item.params.showtype == 0 && item.params.data.length <= 0">请选择显示的商品</div>
        
        <div class="temp_item_goodbox " :class="{'scrollleft':item.params.style == 2,'temp_item5_goodbox' : item.params.style == 5}"  v-if="item.params.showtype == 0 || !item.params.showtype">
            <div v-for="initem in item.params.data" v-if="item.params.style == 0" class="temp_good_item temp_good1_item">
                <div class="temp_good1_img">
                    <img :src="initem.thumb">
                </div>
                <div class="temp_good1_title" v-if="!item.params.istitle" :style="{'text-align':item.params.titlepos}">
                    {{initem.title}}
                </div>
                <div class="item_cell_box temp_good1_bot" v-if="!item.params.isprice">
                    <div class="temp_good1_botl" >
                        <span class="temp_good1_now">￥<font>{{initem.price}}</font></span>
                        <span class="temp_good1_old">￥{{initem.oldprice}}</span>
                    </div>
                    <div class="temp_good1_botr item_cell_flex" >
                        <span class="temp_good1_buy">立即购买</span>
                    </div>
                </div>
            </div>

            <div v-for="initem in item.params.data" v-if="item.params.style == 1" class="temp_good_item temp_good2_item">
                <div class="temp_good2_img">
                    <img :src="initem.thumb">
                </div>
                <div class="temp_good2_title" v-if="!item.params.istitle" :style="{'text-align':item.params.titlepos}">
                    {{initem.title}}
                </div>
                <div class="item_cell_box temp_good2_bot" v-if="!item.params.isprice">
                    <div class="temp_good2_botl">
                        <span class="temp_good2_now">￥<font>{{initem.price*100/100}}</font></span>
                        <span class="temp_good1_old">￥{{initem.oldprice*100/100}}</span>
                    </div>
                    <div class="temp_good2_botr item_cell_flex">
                        已售{{initem.saled*1}}
                    </div>
                </div>
            </div>

            <div v-for="initem in item.params.data " v-if="item.params.style == 2" class="temp_good_item temp_good2_item temp_goodsr_item">
                <div class="temp_good2_img temp_goodsr_img">
                    <img :src="initem.thumb">
                </div>
                <div class="item_cell_box temp_good2_bot">
                    <div class="temp_good2_botl">
                        <span class="temp_good2_now">￥<font>{{initem.price*100/100}}</font></span>
                        <span class="temp_good1_old">￥{{initem.oldprice*100/100}}</span>
                    </div>
                </div>
            </div>

            <div v-for="initem in item.params.data " v-if="item.params.style == 3" class="temp_good_item temp_goodh_item item_cell_box">
                <div class="temp_goodh_img" style="margin-right:10px;">
                    <img :src="initem.thumb">
                </div>
                <div class="item_cell_flex temp_goodh_bot" v-if="!item.params.isprice">
                    <div class="temp_good2_title" v-if="!item.params.istitle" :style="{'text-align':item.params.titlepos}">
                        {{initem.title}}
                    </div>
                    <div class="item_cell_box">
                        <div class="temp_good4_botl item_cell_flex">
                            <span class="temp_good4_now">￥<font>{{initem.price}}</font></span>
                            <span class="temp_good1_old">￥{{initem.oldprice*100/100}}</span>
                        </div>
                        <div class="temp_goodh_btn">
                            立即购买
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="item.params.style == 4" class="temp_good_item temp_goodcut_item bargin-swiper2">

                <Carousel autoplay  loop :radius-dot="true" dots="none" :autoplay-speed="6000" >
                    <CarouselItem v-for="initem in item.params.data" >
                        <div  class="item swiper-slide">
                            
                            <div class="top">
                                <div class="top_pic image-box __60">
                                    <img  :src="initem.thumb">
                                </div>
                                <div class="top_countdown" >
                                    距结束
                                    <template>
                                        <font>1</font> 天
                                    </template>
                                    <font>01</font> :
                                    <font>05</font> :
                                    <font>22</font>
                                </div>
                            </div>
                            <div class="btm">
                                <div class="btm_tit">{{initem.title}}</div>
                                <div class="btm-b">
                                    <div class="btm_price fmt-price">
                                        <div class="now color-pri" style="color:#ed414a;">
                                            <font class="dollar" >¥</font>
                                            <font class="price">{{initem.price*100/100}}</font>
                                        </div>
                                        <div class="old" style="color:#999;font-size:12px;text-decoration:line-through;">¥{{initem.oldprice*100/100}}</div>
                                        <div class="btm_count thin-border">仅剩7份</div>
                                    </div>
                                    <div>
                                        <div class="btm_button i-button bg-pri">去减价</div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </CarouselItem>
                </Carousel>
            </div>

            <div v-if="item.params.style == 5" class="temp_good_item temp_goodcut_item bargin-swiper2">
                <div v-for="initem in item.params.data" class="item swiper-slide temp_goodchou_item" >
                    <div class="top">
                        <div class="top_pic image-box __60">
                            <img  :src="initem.thumb">
                        </div>
                    </div>
                    <div class="btm">
                        <div class="btm_tit">{{initem.title}}</div>
                        <div class="btm-b" style="margin-bottom:5px;">
                            <div class="btm_price fmt-price item_cell_box" style="width: 100%;">
                                <div class="now color-pri item_cell_flex" style="color:#ed414a;">
                                    <font class="dollar " >价值</font>
                                    <font class="price">¥{{initem.oldprice*100/100}}</font>
                                </div>
                                <div class="thin-border chou_btn">参与抽奖</div>
                            </div>
                        </div>
                        <div class="item_cell_box">
                            <div class="item_cell_flex">12月12日 22:22 开奖</div>
                            <div>100人已参与</div>
                        </div>
                    </div>

                </div>
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