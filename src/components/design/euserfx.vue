<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    样式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.style">
                        <Radio :label="0" >样式一</Radio>
                        <Radio :label="1" >样式二</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    距离上部
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.mv"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <template v-if="item.params.style == 0">
                <Row class="frm_group" type="flex" align="middle" >
                    <Col span="6" class="frm_title">
                        提示文字
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="item.params.stext"  placeholder="" />
                    </Col>
                </Row>
                <Row class="frm_group" type="flex" align="middle" >
                    <Col span="6" class="frm_title">
                        按钮文字
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="item.params.btn"  placeholder="" />
                    </Col>
                </Row>
            </template>
            <template v-if="item.params.style == 1">
                <Row class="frm_group" type="flex" align="middle" >
                    <Col span="6" class="frm_title">
                        按钮文字
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="item.params.dbtn"  placeholder="" />
                    </Col>
                </Row>
            </template>

        </div>

    </div>
</template>

<script type="text/javascript">
	export default {
        components: {
            
        },
        props : ['item'],
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