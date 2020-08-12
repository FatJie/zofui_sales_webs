<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    上下边距
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.paddingv"></Slider>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    左右边距
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.paddingh" :min="0" :max="100"></Slider>
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
                    设置文字
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.istext">
                        <Radio :label="0" >不设置</Radio>
                        <Radio :label="1" >设置</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    标题内容
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.content"  class=""  placeholder="" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    标题加粗
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.isbold">
                        <Radio :label="0" >不加粗</Radio>
                        <Radio :label="1" >加粗</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    背景线
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.isbgline">
                        <Radio :label="0" >不显示</Radio>
                        <Radio :label="1" >显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    标题尺寸
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.size" :min="0" :max="50"></Slider>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    标题颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.params.color" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    标题位置
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.pos">
                        <Radio label="left" >左边</Radio>
                        <Radio label="center" >中间</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    左边标识
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="item.params.leftbord">
                        <Radio :label="0" >显示</Radio>
                        <Radio :label="1" >不显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.leftbord == 0">
                <Col span="6" class="frm_title">
                    标识颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.params.bordbg" />
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    右边文字
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.rightfont"  class=""  placeholder="" />
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.rightfont">
                <Col span="6" class="frm_title">
                    右边文字颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.params.rfontcolor" />
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
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
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.type == 'url'">
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
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.type == 'tel'">
                <Col span="6" class="frm_title">
                    电话号码
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="item.params.tel"  class=""  placeholder=""  />
                </Col>
            </Row>
            <div v-if="item.params.type == 'other'">
                <Row class="frm_group" type="flex" align="middle" >
                    <Col span="6" class="frm_title">
                        小程序appid
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="item.params.appid"  class=""  placeholder=""  />
                    </Col>
                </Row>
                <Row class="frm_group" type="flex" align="middle" >
                    <Col span="6" class="frm_title">
                        页面路径
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="item.params.appurl"  class=""  placeholder=""  />
                    </Col>
                </Row>
            </div>
            <Row class="frm_group" type="flex" align="middle" v-if="item.params.type == 'weburl'">
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
            showlinks(inid,type){
                this.$emit('showlinksfn',{id:this.item.id,inid:false,type:type});
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