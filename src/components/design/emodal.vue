<template>
    <div>
        <Tabs type="card" @on-click="changetype" >
            <TabPane label="样式参数" ></TabPane>
        </Tabs>
        <div v-if="etype == 0">
            
            
            <draggable class="drop-box2"  v-model="item.params.data" >
                
                <Card class="mt20" v-for="(inn,idx) in item.params.data">
                    <Row class="frm_group" type="flex" align="middle">
                        <Col span="6" class="frm_title">
                            显示类型
                        </Col>
                        <Col span="18" class="frm_content">
                            <Select v-model="inn.stype" >
                                <Option  :value="0" >活动商品倒计时</Option>
                                <Option  :value="1" >自定义图片</Option>
                                <Option  :value="2" >集字活动</Option>
                            </Select>
                            <p class="frm_tip"></p>
                        </Col>
                    </Row>
                    <Row class="frm_group" type="flex" align="middle" v-show="inn.stype == 0">
                        <Col span="6" class="frm_title">
                            选择商品
                        </Col>
                        <Col span="18" class="frm_content">
                            <Input v-model="inn.title"  class=""  placeholder="" search enter-button="选择" @on-search="showgoods(inn.id,'goods')" />
                            <p class="frm_tip">商品id：{{inn.gid}}</p>
                        </Col>
                    </Row>

                    <Row class="frm_group" type="flex" align="middle" v-show="inn.stype == 2">
                        <Col span="6" class="frm_title">
                            选择活动
                        </Col>
                        <Col span="18" class="frm_content">
                            <Input v-model="inn.title"  class=""  placeholder="" search enter-button="选择" @on-search="showgoods(inn.id,'jizi')" />
                            <p class="frm_tip">活动id：{{inn.gid}}</p>
                        </Col>
                    </Row>

                    <template v-if="inn.stype == 1">

                        <Row class="mb10" type="flex">
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

                    </template>

                    <Icon type="ios-trash" color="#ffffff" class="rightdel" @click="delgoods(idx)" />
                </Card>
            </draggable> 
              
            <div class="tc mt20">
                <Button  icon="ios-add" type="primary" @click="addmodal">添加</Button>
            </div>
            
            
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
        props : ['item','sort','goods','clickEvents'],
	    data : function(){
            return {
                etype : 0,
                sorttwo : [],
                uptarget : '',
            }
        },
	    created(){
            var self = this;
            if( this.item.params.sortid > 0 && this.sort ){
                this.changesort(this.item.params.sortid);
            }
	    },
        methods : {
            changetype(e){
                this.etype = e;
            },
            showgoods(e,type){
                this.$emit('showgoodsfn',{id:this.item.id,type:'modal',inid:e,showtype:type});
            },
            delgoods(e){
                var self = this;
                this.$Modal.confirm({
                    content : '确定删除吗?',
                    onOk : function(){
                        self.item.params.data.splice(e,1);
                    }
                });
            },
            addmodal(){
                var id = 'g'+new Date().getTime();
                var newgood = JSON.parse(JSON.stringify(this.item.params.data[0]))
                newgood.id = id;
                this.item.params.data.push(newgood);
            },
            changesort(e){
                for (var i = 0; i < this.sort.length; i++) {
                    if( this.sort[i].id == e ){
                        this.sorttwo = this.sort[i].down ? this.sort[i].down : [];
                    }
                }
            },
            uploadimg(idx){
                this.uptarget = idx;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                this.$set(this.item.params.data[this.uptarget],'img',e.url);
            },
            showlinks(inid,type){
                this.$emit('showlinksfn',{id:this.item.id,inid:inid,type:type});
            },
        }
	}
</script>

<style type="text/css">


</style>