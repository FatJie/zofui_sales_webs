<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    导航背景颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.bgcolor" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    文字默认颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.color" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" type="flex" align="middle">
                <Col span="6" class="frm_title">
                    文字激活颜色
                </Col>
                <Col span="18" class="frm_content">
                    <ColorPicker v-model="item.actcolor" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
                
            <Card class="mt20" v-for="(inn,idx) in item.data">
                <Row>
                    <Col span="24" >
                        <Row class="mb10" type="flex" align="middle">
                            <Col span="6" class="frm_title">
                                导航名称
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="inn.name"  class=""  placeholder=""  />
                                <p class="frm_tip"></p>
                            </Col>
                        </Row>
                        <Row class="mb10" type="flex" >
                            <Col span="6" class="frm_title">
                                默认图标
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="inn.img"  class=""  placeholder=""  >
                                    <Button slot="append" icon="ios-cloud-upload" @click="uploadimg(idx,'img')"></Button>
                                </Input>
                                <p class="frm_tip viewimg" v-if="inn.img">
                                    <Avatar shape="square" :src="inn.img" size="large" />
                                    <Icon type="md-close" class="closebtn" size="16" @click="inn.img = ''" />
                                </p>
                            </Col>
                        </Row>
                        <Row class="mb10" type="flex" >
                            <Col span="6" class="frm_title">
                                激活图标
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="inn.actimg"  class=""  placeholder=""  >
                                    <Button slot="append" icon="ios-cloud-upload" @click="uploadimg(idx,'actimg')"></Button>
                                </Input>
                                <p class="frm_tip viewimg" v-if="inn.actimg">
                                    <Avatar shape="square" :src="inn.actimg" size="large" />
                                    <Icon type="md-close" class="closebtn" size="16" @click="inn.actimg = ''" />
                                </p>
                            </Col>
                        </Row>
                        <Row class="mb10" type="flex" align="middle" v-if="idx > 0">
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
                <Icon type="ios-trash" color="#ffffff" class="rightdel" @click="delgoods(idx)" v-if="idx > 0" />
            </Card>
            <div class="tc mt20">
                <Button  icon="ios-add" type="primary" @click="addbar">添加导航</Button>
            </div>
            
        </div>
        <div v-if="etype == 1">
            没有数据参数
        </div>
        <upload ref="uploadref" @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import upload from '../upload';
	export default {
        components: {
            upload
        },
        props : ['item','clickEvents','siteroot'],
	    data : function(){
            return {
                etype : 0,
                sorttwo : [],
                uptarget : {},
            }
        },
	    created(){
            var self = this;
            
	    },
        methods : {
            changetype(e){
                this.etype = e;
            },
            showlinks(inid,type){
                this.$emit('showlinksfn',{id:'bar',inid:inid,type:type});
            },
            addbar(){
                if(this.item.data.length >= 5 ){
                    this.$Message.error('最多设置5个导航');
                    return false;
                }
                var id = 'b'+new Date().getTime();
                this.item.data.push({
                    id : id,
                    name : '导航',
                    img: this.siteroot + '/addons/zofui_sales/public/images/contact1.png',
                    actimg: this.siteroot + '/addons/zofui_sales/public/images/contact2.png',
                    url : '',
                    type : 'url',
                });
            },
            delgoods(e){
                var self = this;
                this.$Modal.confirm({
                    content : '确定删除吗?',
                    onOk : function(){
                        self.item.data.splice(e,1);
                    }
                });
            },
            uploadimg(idx,type){
                this.uptarget = {id:idx,type:type};
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                this.$set(this.item.data[this.uptarget.id],this.uptarget.type,e.url);
            },
        }
	}
</script>

<style type="text/css">


</style>