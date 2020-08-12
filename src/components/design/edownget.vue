<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    商品样式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.style" >
                        <Radio :label="0" >单排</Radio>
                        <Radio :label="1" >双排</Radio>
                        <Radio :label="3" >横排</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    上下边距
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.paddingv"></Slider>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    排序方式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.ordertype">
                        <Radio :label="0" >按最新排序</Radio>
                        <Radio :label="1" >按销量排序</Radio>
                        <Radio :label="2" >按近到远排序</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    显示方式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.showtype">
                        <Radio :label="0" >全部商品</Radio>
                        <Radio :label="1" >按分类自动显示</Radio>
                        <Radio :label="2" >按商品类型显示</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.showtype == 1">
                <Col span="6" class="frm_title">
                    选择分类
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.sortid" @on-change="changesort">
                        <Radio :label="iinn.id" v-for="(iinn,iidx) in sort">{{iinn.name}}</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.showtype == 1">
                <Col span="6" class="frm_title">
                    子分类
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.sorttwo">
                        <Radio :label="0" >所有</Radio>
                        <Radio :label="iinn.id" v-for="(iinn,iidx) in sorttwo">{{iinn.name}}</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle"  v-if="item.params.showtype == 2">
                <Col span="6" class="frm_title">
                    选择类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.gtype">
                        <Radio :label="0" >普通商品</Radio>
                        <Radio :label="1" >限抢商品</Radio>
                        <Radio :label="2" >拼团商品</Radio>
                        <Radio :label="3" >砍价商品</Radio>
                        <Radio :label="4" >报名活动</Radio>
                        <Radio :label="5" >抽奖活动</Radio>
                        <Radio :label="6" >秒杀商品</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>

        </div>
        <div v-if="etype == 1">
            没有数据参数
        </div>

        <upload ref="uploadref" @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import draggable from 'vuedraggable'
    import upload from '../upload';
	export default {
        components: {
            draggable,upload
        },
        props : ['item','sort'],
	    data : function(){
            return {
                etype : 0,
                uptarget : '',
                sorttwo : [],
            }
        },
	    created(){
            var self = this;
            if( this.item.params.sortid > 0 && this.sort ){
                this.changesort(this.item.params.sortid);
            }
	    },
        methods : {
            changetype(e){
                this.etype = e;
            },

            changesort(e){
                for (var i = 0; i < this.sort.length; i++) {
                    if( this.sort[i].id == e ){
                        this.sorttwo = this.sort[i].down ? this.sort[i].down : [];
                    }
                }
            },
            uploadmethod(e){
                this.$set(this.item.params.data[this.uptarget],'img',e.url);
            },
        }
	}
</script>

<style type="text/css">


</style>