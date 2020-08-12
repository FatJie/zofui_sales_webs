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
                        <Radio :label="4" v-if="item.name == 'cutgoods'">砍价样式</Radio>
                        <Radio :label="5" v-if="item.name == 'chougoods'">抽奖样式</Radio>
                        <Radio :label="0" >单排</Radio>
                        <Radio :label="1" >双排</Radio>
                        <Radio :label="3" >横排</Radio>
                        <Radio :label="2" >左拉滑动</Radio>
                    </RadioGroup>

                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.style == 2">
                <Col span="6" class="frm_title">
                    标题尺寸
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.goodssize">
                        <Radio :label="0" >小尺寸</Radio>
                        <Radio :label="1" >大尺寸</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    显示标题
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.istitle">
                        <Radio :label="0" >显示</Radio>
                        <Radio :label="1" >不显示</Radio>
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
                        <Radio :label="3" >显示商户的商品</Radio>
                        <Radio :label="4" >显示标签内的商品</Radio>
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
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.showtype == 3">
                <Col span="6" class="frm_title">
                    商户id
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.shopid"  class="w200"  placeholder="" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.showtype == 1">
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
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.showtype == 4">
                <Col span="6" class="frm_title">
                    选择标签
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.tagid">
                        <Radio :label="iinn.id" v-for="(iinn,iidx) in alltagdata">{{iinn.name}}</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>
            <div v-if="item.params.showtype == 0 || !item.params.showtype">
                <div class="tc">
                    <Button  icon="ios-add" type="primary" @click="showgoods('goods')">选择商品</Button>
                </div>
                <draggable class="drop-box2"  v-model="item.params.data" >
                    <Card class="mt20" v-for="(inn,idx) in item.params.data">
                        <Row>
                            <Col span="4" class="frm_title">
                                <img style="width:100%;" :src="inn.thumb">
                            </Col>
                            <Col span="20" class="frm_content">
                                <div>{{inn.title}}</div>
                                <div>￥{{inn.price}}</div>
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
        props : ['item','sort','goods','alltagdata'],
	    data : function(){
            return {
                etype : 0,
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
            showgoods(e){
                this.$emit('showgoodsfn',{id:this.item.id,type:'goods',showtype:'goods',gtype:this.item.name});
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
            changesort(e){
                for (var i = 0; i < this.sort.length; i++) {
                    if( this.sort[i].id == e ){
                        this.sorttwo = this.sort[i].down ? this.sort[i].down : [];
                    }
                }
            },
        }
	}
</script>

<style type="text/css">


</style>