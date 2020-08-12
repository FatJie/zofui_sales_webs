<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    上下距离
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.mv" ></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    绑定手机
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.isbind">
                        <Radio :label="0" >显示</Radio>
                        <Radio :label="1" >不显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.isbind != 1">
                <Col span="6" class="frm_title">
                    绑定手机样式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.bindtype">
                        <Radio :label="0" >样式一</Radio>
                        <Radio :label="1" >样式二</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.isbind != 1">
                <Col span="6" class="frm_title">
                    提示文字
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.btext"  class=""  placeholder="" />
                </Col>
            </Row>

            <draggable class="drop-box2"  v-model="item.params.data" >
                <Card v-for="(inn,idx) in item.params.data" class="mt20">
                    <Row class="mb10" type="flex" align="middle">
                        <Col span="24" >
                            <Row class="mb10" type="flex" align="middle" >
                                <Col span="6" class="frm_title">
                                    名称
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Input v-model="inn.name"  class=""  placeholder="" />
                                    <p class="frm_tip"></p>
                                </Col>
                            </Row>
                            <Row class="mb10" type="flex" align="middle">
                                <Col span="6" class="frm_title">
                                    图片链接
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Input v-model="inn.img"  class=""  placeholder=""  >
                                        <Button slot="append" icon="ios-cloud-upload" @click="uploadimg(idx)"></Button>
                                    </Input>
                                    <p class="frm_tip viewimg" v-if="inn.img">
                                        <Avatar shape="square" :src="inn.img" size="large" />
                                        <Icon type="md-close" class="closebtn" size="16" @click="inn.img = ''" />
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </draggable>

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
                this.$set(this.item.params.data[this.uptarget],'img',e.url);
            },
        }
    }
</script>

<style type="text/css">


</style>