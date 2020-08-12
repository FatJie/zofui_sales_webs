<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
            <TabPane label="数据参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图片类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.type" @on-change="changeimg">
                        <Radio :label="1" >单图</Radio>
                        <Radio :label="2" >双图</Radio>
                        <Radio :label="3" >三图</Radio>
                        <Radio :label="6" >四图</Radio>
                        <Radio :label="4" >积木1</Radio>
                        <Radio :label="5" >积木2</Radio>
                    </RadioGroup>
                    <p class="frm_tip" v-if="item.params.type == 4">图片尺寸建议：左图：400x402，右图400x200</p>
                    <p class="frm_tip" v-if="item.params.type == 5">图片尺寸建议：左图：400x200，右图400x402</p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图片宽度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.pdimg"></Slider>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图片高度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.imgheight" :min="0" :max="300"></Slider>
                    <p class="frm_tip">屏幕宽度的%</p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    上下边距
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.padding"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    左右边距
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.paddingv"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle" v-if="item.params.type > 3">
                <Col span="6" class="frm_title">
                    图片距离
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.pimg"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>
            <Row class="mt10" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    设置文字
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.istext">
                        <Radio :label="0" >不设置</Radio>
                        <Radio :label="1" >设置</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <div v-if="item.params.istext == 1">
                <Row class="mt10" type="flex" align="middle">
                    <Col span="6" class="frm_title">
                        文字颜色
                    </Col>
                    <Col span="18" class="frm_content">
                        <ColorPicker v-model="item.params.fontcolor" />
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="mt10" type="flex" align="middle">
                    <Col span="6" class="frm_title">
                        文字尺寸
                    </Col>
                    <Col span="18" class="frm_content">
                        <Slider v-model="item.params.fontsize" :max="30"></Slider>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </div>

        </div>
        <div v-if="etype == 1">
            <draggable class="drop-box2"  v-model="item.params.data" >
                <Card v-for="(inn,idx) in item.params.data" class="mt20">
                    <Row class="mt10" type="flex" align="middle">
                        <Col span="24" >
                            <Row class="mt10" type="flex" align="middle" v-if="item.params.istext == 1 && item.params.type <= 3">
                                <Col span="6" class="frm_title">
                                    标题内容
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Input v-model="inn.title"  class=""  placeholder="" />
                                    <p class="frm_tip"></p>
                                </Col>
                            </Row>
                            <Row class="mt10" type="flex" >
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
                            <Row class="mt10" type="flex" align="middle">
                                <Col span="6" class="frm_title">
                                    点击动作
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Select v-model="inn.type" >
                                        <Option v-for="innn in clickEvents" :value="innn.type" :key="innn.type">{{ innn.name }}</Option>
                                    </Select>
                                    <p class="frm_tip"></p>
                                </Col>
                            </Row>
                            <Row class="mt10" type="flex" align="middle" v-if="inn.type == 'url'">
                                <Col span="6" class="frm_title">
                                    跳转页面
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Input v-model="inn.url"  class=""  placeholder="" >
                                        <Button slot="append" icon="md-add-circle" @click="showlinks(inn.id,'all')"></Button>
                                    </Input>
                                    <p class="frm_tip">{{inn.urlname}}</p>
                                </Col>
                            </Row>
                            <Row class="mt10" type="flex" align="middle" v-if="inn.type == 'tel'">
                                <Col span="6" class="frm_title">
                                    电话号码
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Input v-model="inn.tel"  class=""  placeholder=""  />
                                </Col>
                            </Row>
                            <div v-if="inn.type == 'other'">
                                <Row class="mt10" type="flex" align="middle" >
                                    <Col span="6" class="frm_title">
                                        小程序appid
                                    </Col>
                                    <Col span="18" class="frm_content">
                                        <Input v-model="inn.appid"  class=""  placeholder=""  />
                                    </Col>
                                </Row>
                                <Row class="mt10" type="flex" align="middle" >
                                    <Col span="6" class="frm_title">
                                        页面路径
                                    </Col>
                                    <Col span="18" class="frm_content">
                                        <Input v-model="inn.appurl"  class=""  placeholder=""  />
                                    </Col>
                                </Row>
                            </div>
                            <Row class="mt10" type="flex" align="middle" v-if="inn.type == 'weburl'">
                                <Col span="6" class="frm_title">
                                    网页链接
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Input v-model="inn.weburl"  class=""  placeholder=""  />
                                    <p class="frm_tip">域名需要加入到小程序业务域名内</p>
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
        props : ['item','clickEvents','siteroot'],
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
                if(e == 6) num = 4;
                var diff = num - nowlength;
                
                if( diff > 0 ) {
                    for (var i = 0; i < diff; i++) {
                        var mid = 'm'+i+new Date().getTime();
                        this.item.params.data.push({
                            id : mid,
                            img : this.siteroot+'/addons/zofui_sales/public/images/stemp.png',
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
            showlinks(inid,type){
                this.$emit('showlinksfn',{id:this.item.id,inid:inid,type:type});
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