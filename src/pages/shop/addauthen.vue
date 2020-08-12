<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    店铺名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="subject_name" placeholder="" class="w400"  />
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    法人姓名
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="legal_person" placeholder="" class="w400"  />
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    法人电话
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="legal_person_tel" placeholder="" class="w400"  />
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    执照号
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="license" placeholder="" class="w400"  />
                </Col>
            </Row>

            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    营业执照
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.thumbh" placeholder=""  class="w400" >
                        
                        <Button slot="append" size="small" @click="uploadimg('thumbh')" icon="ios-cloud-upload-outline">选择图片</Button>
                        
                    </Input>
                    <!-- <p class="frm_tip">建议尺寸568X340</p> -->
                    <img v-if="goods.showthumbh" :src="goods.showthumbh" style="width:1000px; height: auto;display: block;">
                </Col>
            </Row>

            <Row class="frm_group " type="flex" align="middle" v-if="!settings.fontsty || settings.fontsty == 0">
                <Col span="3" class="frm_title">
                    其他认证资料
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.thumbhs" placeholder=""  class="w400" >
                        
                        <Button slot="append" size="small" @click="uploadimg('thumbhs')" icon="ios-cloud-upload-outline">选择图片</Button>
                        
                    </Input>
                    <img v-if="goods.showthumbhs" :src="goods.showthumbhs" style="width:1000px; height: auto;display: block;">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Affix :offset-bottom="20" style="z-index: 1000;position: relative;">
                        <Button type="primary" @click="save">保存</Button>
                    </Affix>
                </Col>
            </Row>
        </div>

        <upload ref="uploadref" @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import upload from '../../components/upload';
	export default {
        components: {
            upload
        },
        props : ['settings'],
	  	data : function(){
	  		return {

                subject_name:'',
                legal_person:'',
                legal_person_tel:'',
                license:'',

                uploadurl:'',
                loading : false,
	  			params : {},
                list : [],
                uptarget : '',
                goods:{},
                id:this.$route.query.id,
            }
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	methods: {
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                var self = this;
                if(  this.uptarget == 'thumbh' ){
                    this.$set(this.goods,'thumbh',e.attachment);
                    this.$set(this.goods,'showthumbh',e.url);
                }else if(  this.uptarget == 'thumbhs' ){
                    this.$set(this.goods,'thumbhs',e.attachment);
                    this.$set(this.goods,'showthumbhs',e.url);
                }
            },
            save(e){
                console.log(this.goods);
                var self = this;
                var postdata = {
                    op : 'saveauthen',
                    fromajax : 1,
                    id:this.id,
                    subject_name:this.subject_name,
                    legal_person:this.legal_person,
                    legal_person_tel:this.legal_person_tel,
                    license:this.license,
                    legal_person_img:this.goods.thumbhs,
                    license_img:this.goods.thumbh
                }
                self.$util.http('shop','POST',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.$router.push('authentication');
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var id = this.$route.query.id ? this.$route.query.id : 0;
                var postdata = {
                    op : 'addauthen',
                    fromajax : 1,
                    id : id,
                }
                self.loading = false;
                self.$util.http('shop','GET',postdata,res=>{
                    if(res.status==200){
                        this.subject_name=res.obj.subject_name;
                        this.legal_person=res.obj.legal_person;
                        this.legal_person_tel=res.obj.legal_person_tel;
                        this.license=res.obj.license;
                        this.goods.thumbh=res.obj.license_imgs;
                        this.goods.showthumbh=res.obj.license_img;
                        this.goods.thumbhs=res.obj.legal_person_imgs;
                        this.goods.showthumbhs=res.obj.legal_person_img;
                    }else{
                        this.$Message.error(res.res);
                    }
                });
            },
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>