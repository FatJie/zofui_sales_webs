<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    背景颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.params.bg" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    文字颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.params.color" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    左右边距
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.pv"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    距离顶部
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.ptop"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    距离下部
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.pbot"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    圆角处理
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.bordr">
                        <Radio :label="0" >正常</Radio>
                        <Radio :label="1" >圆角</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    显示用户id
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.uid">
                        <Radio :label="0" >不显示</Radio>
                        <Radio :label="1" >显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    显示邀请人id
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.parent">
                        <Radio :label="0" >不显示</Radio>
                        <Radio :label="1" >显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    显示余额
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.ism">
                        <Radio :label="0" >不显示</Radio>
                        <Radio :label="1" >显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    显示积分
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.isjf">
                        <Radio :label="0" >不显示</Radio>
                        <Radio :label="1" >显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    积分和余额显示方式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.mtype">
                        <Radio :label="0" >上下排列</Radio>
                        <Radio :label="1" >左右排列</Radio>
                    </RadioGroup>
                </Col>
            </Row>

        </div>

    </div>
</template>

<script type="text/javascript">
    import draggable from 'vuedraggable'
    import upload from '../upload';
	export default {
        components: {
            draggable,upload
        },
        props : ['item','clickEvents'],
	    data : function(){
            return {
                etype : 0,
                uptarget : '',
            }
        },
	    created(){
            var self = this;
            
	    },
        methods : {
            changetype(e){
                this.etype = e;
            },
            uploadimg(idx){
                this.uptarget = idx;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                this.$set(this.item.params,'poster',e.url);
            },
            upvedio(){
                
            },
        }
	}
</script>

<style type="text/css">


</style>