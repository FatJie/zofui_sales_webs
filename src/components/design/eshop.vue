<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    店铺样式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.style">
                        <Radio :label="0" >样式一</Radio>
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
                    显示方式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.showtype">
                        <Radio :label="0" >选择显示</Radio>
                        <Radio :label="1" >按分类自动显示</Radio>
                        <Radio :label="2" >自动显示距离最近的</Radio>
                    </RadioGroup>
                </Col>
            </Row>

            <Row class="frm_group" type="flex" align="middle" v-if="item.params.showtype == 1 || item.params.showtype == 2 || item.params.showtype == 3">
                <Col span="6" class="frm_title">
                    显示商品数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.goodnum"  class="w200"  placeholder="" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.showtype == 1">
                <Col span="6" class="frm_title">
                    选择分类
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.sortid" @on-change="changesort">
                        <Radio :label="iinn.id" v-for="(iinn,iidx) in shopsort">{{iinn.name}}</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>
            
            <div v-if="item.params.showtype == 0 || !item.params.showtype">
                <div class="tc">
                    <Button  icon="ios-add" type="primary" @click="showgoods('shop')">选择店铺</Button>
                </div>
                
                <draggable class="drop-box2"  v-model="item.params.data" >
                <Card class="mt20" v-for="(inn,idx) in item.params.data">
                    <Row>
                        <Col span="20" class="frm_content">
                            <div>{{inn.name}}</div>
                        </Col>
                    </Row>
                    <Icon type="ios-trash" color="#ffffff" class="rightdel" @click="delgoods(idx)" />
                </Card>
                </draggable>
            </div>
            
        </div>
        <div v-if="etype == 1">
            没有数据参数
        </div>

    </div>
</template>

<script type="text/javascript">
    import draggable from 'vuedraggable'
	export default {
        components: {
            draggable
        },
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
                this.$emit('showgoodsfn',{id:this.item.id,type:'shop',showtype:'shop'});
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