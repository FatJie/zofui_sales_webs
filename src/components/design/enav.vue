<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
            <TabPane label="数据参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图标高度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.imgheight"></Slider>
                    <p class="frm_tip">屏幕宽度的%</p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    图标宽度
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.imgwid" :min="0" :max="50"></Slider>
                    <p class="frm_tip">屏幕宽度的%</p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    圆角处理
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.radius"></Slider>
                    <p class="frm_tip">像素</p>
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
            <Row class="frm_group" type="flex" align="middle" >
                <Col span="6" class="frm_title">
                    文字距上距离
                </Col>
                <Col span="18" class="frm_content">
                    <Slider v-model="item.params.martop"></Slider>
                    <p class="frm_tip">像素</p>
                </Col>
            </Row>

            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    文字颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.params.fontcolor" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>

        </div>
        <div v-if="etype == 1">
            <draggable class="drop-box2"  v-model="item.params.data" >
                <Card v-for="(inn,idx) in item.params.data" class="mt20">
                    <Row class="mb10" type="flex" align="middle">
                        <Col span="24" >
                            <Row class="mb10" type="flex" align="middle" >
                                <Col span="6" class="frm_title">
                                    导航名称
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Input v-model="inn.title"  class=""  placeholder="" />
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
                            <Row class="mb10" type="flex" align="middle">
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
                            <Row class="mb10" type="flex" align="middle" v-if="inn.type == 'url'">
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
                            <Row class="mb10" type="flex" align="middle" v-if="inn.type == 'tel'">
                                <Col span="6" class="frm_title">
                                    电话号码
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Input v-model="inn.tel"  class=""  placeholder=""  />
                                </Col>
                            </Row>
                            <div v-if="inn.type == 'other'">
                                <Row class="mb10" type="flex" align="middle" >
                                    <Col span="6" class="frm_title">
                                        小程序appid
                                    </Col>
                                    <Col span="18" class="frm_content">
                                        <Input v-model="inn.appid"  class=""  placeholder=""  />
                                    </Col>
                                </Row>
                                <Row class="mb10" type="flex" align="middle" >
                                    <Col span="6" class="frm_title">
                                        页面路径
                                    </Col>
                                    <Col span="18" class="frm_content">
                                        <Input v-model="inn.appurl"  class=""  placeholder=""  />
                                    </Col>
                                </Row>
                            </div>
                            <Row class="mb10" type="flex" align="middle" v-if="inn.type == 'weburl'">
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
                    <Icon type="ios-trash" color="#ffffff" class="rightdel" @click="delgoods(idx)" />
                </Card>
            </draggable>
            <div class="tc mt20">
                <Button  icon="ios-add" type="primary" @click="addnav">添加</Button>
            </div>
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
            delgoods(e){
                var self = this;
                if( this.item.params.data.length <= 1 ){
                    return false;
                }
                this.$Modal.confirm({
                    content : '确定删除吗?',
                    onOk : function(){
                        self.item.params.data.splice(e,1);
                    }
                });
            },
            showlinks(inid,type){
                this.$emit('showlinksfn',{id:this.item.id,inid:inid,type:type});
            },
            addnav(e){
                
                var id = 'g'+new Date().getTime();
                var newgood = JSON.parse(JSON.stringify(this.item.params.data[0]))
                newgood.id = id;
                this.item.params.data.push(newgood);
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