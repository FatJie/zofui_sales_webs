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
                    <RadioGroup v-model="item.params.style">
                        <Radio :label="1" >横排一</Radio>
                        <Radio :label="3" >横排二</Radio>
                        <Radio :label="2" >左拉滑动</Radio>
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
                    左侧文字
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.leftfont"  class="w200"  placeholder="" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    显示商品数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.goodnum"  class="w200"  placeholder="" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>

            <Row class="frm_group" type="flex" align="middle">
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
            
        </div>
        <div v-if="etype == 1">
            没有数据参数
        </div>

    </div>
</template>

<script type="text/javascript">
	export default {
        props : ['item','shopsort','goods'],
	    data : function(){
            return {
                etype : 0,
                sorttwo : [],
            }
        },
	    created(){
            var self = this;
            
	    },
        methods : {
            changetype(e){
                this.etype = e;
            },
            showgoods(e){
                this.$emit('showgoodsfn',{id:this.item.id,type:'goods',showtype:'goods'});
            },
            delgoods(e){
                var self = this;
                this.$Modal.confirm({
                    content : '确定删除吗?',
                    onOk : function(){
                        self.item.params.data.splice(e,1);
                    }
                });
            },
        }
	}
</script>

<style type="text/css">


</style>