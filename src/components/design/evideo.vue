<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" >
                <Col span="6" class="frm_title">
                    封面图片
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.poster"  class=""  placeholder=""  >
                        <Button slot="append" icon="ios-cloud-upload" @click="uploadimg(idx)"></Button>
                    </Input>
                    <p class="frm_tip viewimg" v-if="item.params.poster">
                        <Avatar shape="square" :src="item.params.poster" size="large" />
                        <Icon type="md-close" class="closebtn" size="16" @click="item.params.poster = ''" />
                    </p>

                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    视频高度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.height"></Slider>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    背景颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.params.bgcolor" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    上下边距
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.paddingv"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>

            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    视频链接
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.url"  class=""  placeholder="" >
                        <Upload
                            accept="video/*"
                            slot="append"
                            :action="uploadurl" :on-success="upend" :show-upload-list="false">
                            <Button icon="ios-cloud-upload-outline" size="small">上传</Button>
                        </Upload>
                    </Input>
                    <p class="frm_tip">视频不要太大，否则会影响页面打开速度</p>
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
        props : ['item','clickEvents'],
	    data : function(){
            return {
                etype : 0,
                uptarget : '',
                uploadurl : '',
            }
        },
	    created(){
            var self = this;
            var host = this.$util.Host();
            this.uploadurl = window.location.protocol+ '//' + host + '/web/index.php?c=utility&a=file&do=upload&upload_type=video&global=&dest_dir=';
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
            upend(e){
                if( e.url ){
                    this.item.params.url = e.url;
                }else{
                    this.$Message.error(e.message);
                }
            },
        }
	}
</script>

<style type="text/css">


</style>