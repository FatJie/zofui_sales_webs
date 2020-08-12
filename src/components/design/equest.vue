<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    左侧图标
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.img"  placeholder=""  >
                    	<Button slot="append" icon="ios-cloud-upload" @click="uploadimg()"></Button>
                    </Input>

                    <p class="frm_tip viewimg" v-if="item.params.img">
                        <Avatar shape="square" :src="item.params.img" size="large" />
                        <Icon type="md-close" class="closebtn" size="16" @click="item.params.img = ''" />
                    </p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图标宽度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.width" :max="300"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图标高度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.height" ></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <!-- <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    右边箭头
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.ricon">
                        <Radio :label="0" >不显示</Radio>
                        <Radio :label="1" >显示</Radio>
                    </RadioGroup>
                </Col>
            </Row> -->
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
                        <Radio :label="0" >自动显示</Radio>
                        <Radio :label="1" >按分类自动显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    显示数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.num"  class="w200"  placeholder="" />
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
                        <Radio :label="1" >按最多回复排序</Radio>
                    </RadioGroup>
                    
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.showtype == 1">
                <Col span="6" class="frm_title">
                    选择分类
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.sortid" @on-change="changesort">
                        <Radio :label="iinn.id" v-for="(iinn,iidx) in questsort">{{iinn.name}}</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    跳转的页面
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.totype">
                        <Radio :label="0" >问答详情</Radio>
                        <Radio :label="1" >问答主页</Radio>
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
        props : ['item','sort','goods','questsort'],
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
            uploadimg(idx){
                this.uptarget = idx;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                this.$set(this.item.params,'img',e.url);
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