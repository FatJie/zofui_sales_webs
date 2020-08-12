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
                    <ColorPicker v-model="item.params.bgcolor" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    空白高度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.height"></Slider>
                    <p class="frm_tip">像素</p>
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