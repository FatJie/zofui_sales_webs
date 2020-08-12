<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    显示类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.showtype">
                        <Radio :label="0" >平铺</Radio>
                        <Radio :label="1" >置顶悬浮</Radio>
                    </RadioGroup>
                    <p class="frm_tip">只有用手机扫小程序二维码才能显示关注组件，组件只能放置一个。</p>
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