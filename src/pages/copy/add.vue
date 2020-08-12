<template>

    <div>
        <Spin size="large" fix v-if="!loaded"></Spin>
        <div v-if="loaded">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    小程序设置版权
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="copy.iscopy">
                        <Radio label="0" >小程序可设置</Radio>
                        <Radio label="1">授权后才可以</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    上部图片
                </Col>
                <Col span="18" class="frm_content">

                    <Input v-model="copy.copytop" placeholder=""  class="w400" >
                        
                        <Button slot="append" size="small" @click="uploadimg('copytop')" icon="ios-cloud-upload-outline">选择图片</Button>
                        
                    </Input>
                    <p class="frm_tip">建议尺寸220X30</p>
                    <img v-if="copy.showcopytop" :src="copy.showcopytop" class="showupimg">

                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    左侧图标
                </Col>
                <Col span="18" class="frm_content">

                    <Input v-model="copy.copyimg" placeholder=""  class="w400" >
                        
                        <Button slot="append" size="small" @click="uploadimg('copyimg')" icon="ios-cloud-upload-outline">选择图片</Button>
                        
                    </Input>
                    <p class="frm_tip">建议尺寸200X50</p>
                    <img v-if="copy.showcopyimg" :src="copy.showcopyimg" class="showupimg">

                </Col>
            </Row>
            
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    文字一
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="copy.copyfa" placeholder="" class="w400"  />
                    <p class="frm_tip">例：XXXX平台技术服务</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    文字二
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="copy.copyfb" placeholder="" class="w400"  />
                    <p class="frm_tip">例：合作电话18888888888</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    点击动作
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="copy.copyt">
                        <Radio label="0" >拨打电话</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    电话号码
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="copy.copytel" placeholder="" class="w400"  />
                    <p class="frm_tip">填0不限制</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    按钮名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="copy.copybtn" placeholder="" class="w400"  />
                    <p class="frm_tip">填0不限制</p>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">保存</Button>
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
                uploadurl : '',
                loaded : false,
                agent : '',
                fenchen : '',
                copy : '',
                uptarget : '',
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';

        },
	  	methods: {
            handleOpen(){
                this.visible = true;
            },
            handleClose(){
                this.visible = false;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            uploadend(e){
                if( e.attachment ){
                    this.$set(this.copy,'copytop',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
            },
            uploadenda(e){
                if( e.attachment ){
                    this.$set(this.copy,'copyimg',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
            },
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if( this.uptarget == 'copyimg' ){
                    this.$set(this.copy,'copyimg',e.attachment);
                    this.$set(this.copy,'showcopyimg',e.url);
                }else if(  this.uptarget == 'copytop' ){
                    this.$set(this.copy,'copytop',e.attachment);
                    this.$set(this.copy,'showcopytop',e.url);
                }
            },
            save(){
                var self = this;
                var postdata = {
                    op : 'save',
                    fromajax : 1,
                    copy : self.copy,
                }
                self.$util.http('copy','get',postdata,function(res){
                    if( res.type == 'success' ){
                        
                        self.$Message.success('已保存');
                        
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                var postdata = {
                    op : 'explain',
                    fromajax : 1,
                }
                self.$util.http('copy','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.copy = res.obj.set ? res.obj.set : {};
                        self.loaded = true;
                    }else{
                        self.$Message.error(res.message);
                    }
                });
            },
	  		onLoad() {
	  			var self = this;
                if( !self.isonbottom ){
                    self.page.doing = false;
                    return false;
                } 
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>