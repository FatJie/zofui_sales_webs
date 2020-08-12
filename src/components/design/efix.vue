<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            <Row class="frm_group" type="flex" >
                <Col span="6" class="frm_title">
                    悬浮图片
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.img"  class=""  placeholder=""  >
                        <Button slot="append" icon="ios-cloud-upload" @click="uploadimg()"></Button>
                    </Input>
                    <p class="frm_tip viewimg" v-if="item.params.img">
                        <Avatar shape="square" :src="item.params.img" size="large" />
                        <Icon type="md-close" class="closebtn" size="16" @click="item.params.img = ''" />
                    </p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图片高度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.height"></Slider>
                    <p class="frm_tip">% (屏幕宽度的百分比)</p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图片宽度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.width" :min="0" :max="100"></Slider>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    圆角处理
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.radius" :min="0" :max="200"></Slider>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    距离顶部
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.top" :min="0" :max="100"></Slider>
                    <p class="frm_tip">%</p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    距离右边
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.right" :min="0" :max="100"></Slider>
                    <p class="frm_tip">%</p>
                </Col>
            </Row>
            
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    点击动作
                </Col>
                <Col span="18" class="frm_content">
                    <Select v-model="item.params.type" >
                        <Option v-for="innn in clickEvents" :value="innn.type" :key="innn.type">{{ innn.name }}</Option>
                    </Select>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle" v-if="item.params.type == 'url'">
                <Col span="6" class="frm_title">
                    跳转页面
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.url"  class=""  placeholder="" >
                        <Button slot="append" icon="md-add-circle" @click="showlinks('all')"></Button>
                    </Input>
                    <p class="frm_tip">{{item.params.urlname}}</p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle" v-if="item.params.type == 'tel'">
                <Col span="6" class="frm_title">
                    电话号码
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.tel"  class=""  placeholder=""  />
                </Col>
            </Row>
            <div v-if="item.params.type == 'other'">
                <Row class="mt10" type="flex" align="middle" >
                    <Col span="6" class="frm_title">
                        小程序appid
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="item.params.appid"  class=""  placeholder=""  />
                    </Col>
                </Row>
                <Row class="mt10" type="flex" align="middle" >
                    <Col span="6" class="frm_title">
                        页面路径
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="item.params.appurl"  class=""  placeholder=""  />
                    </Col>
                </Row>
            </div>
            <Row class="mt10" type="flex" align="middle" v-if="item.params.type == 'weburl'">
                <Col span="6" class="frm_title">
                    网页链接
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.weburl"  class=""  placeholder=""  />
                    <p class="frm_tip">域名需要加入到小程序业务域名内</p>
                </Col>
            </Row>

        </div>
        <div v-if="etype == 1">
            没有参数数据
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
            changeimg(e){
                var nowlength = this.item.params.data.length;
                this.item.params.type = e;
                var num = e  > 3 ? 3 : e;
                var diff = num - nowlength;
                
                if( diff > 0 ) {
                    for (var i = 0; i < diff; i++) {
                        var mid = 'm'+i+new Date().getTime();
                        this.item.params.data.push({
                            id : mid,
                            img : '../addons/zofui_sales/public/images/stemp.png',
                            type : 'url',
                            url : '',
                            title : '',
                        })
                    }
                    
                }else if( diff < 0 ){
                    for (var i = -diff; i > 0; i--) {
                        this.item.params.data.splice(i,1);
                    }
                }
            },
            uploadimg(idx){
                this.uptarget = idx;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                this.$set(this.item.params,'img',e.url);
            },
            showlinks(inid,type){
                this.$emit('showlinksfn',{id:this.item.id,inid:false,type:type});
            },
        }
	}
</script>

<style type="text/css">


</style>