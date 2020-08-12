<template>

    <div>
        <Spin size="large" fix v-if="!loaded"></Spin>
        <div v-if="loaded">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    评论内容
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="info.content" type="textarea" :rows="4" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    星级
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="info.star" placeholder="" class="w400"  />
                    <p class="frm_tip">输入1-5之间数字</p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    评价图片
                </Col>
                <Col span="18" class="frm_content">
                    
                    <Button  size="small" @click="uploadimg('img')" icon="ios-cloud-upload-outline">选择图片</Button>
                    <Row type="flex" class="mt10">

                        <div class="demo-upload-list" v-for="(item,index) in info.showimg" :key="index">
                            <img :src="info.showimg[index]">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-trash-outline" @click.native="delimga(index)"></Icon>
                            </div>
                        </div>
                    </Row>
                </Col>
            </Row>
            
            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">保存</Button>
                </Col>
            </Row>

        </div>
        <upload ref="uploadref"  @uploadmethod="uploadmethod"></upload>
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
                info : '',
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
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if(  this.uptarget == 'img' ){
                    if( !this.info.img ){
                        this.info.img = [];
                        this.$set(this.info,'showimg',[]);
                    }
                    this.info.img.push(e.attachment);
                    this.info.showimg.push(e.url);
                    this.$set(this.info,'showimg',this.info.showimg);
                }
            },
            delimga(e){
                this.info.img.splice(e,1);
                this.info.showimg.splice(e,1);
            },
            save(){
                var self = this;
                var postdata = {
                    op : 'editcom',
                    fromajax : 1,
                    content : self.info.content,
                    img : self.info.img,
                    star : self.info.star,
                    id:self.info.id,
                }
                self.$util.http('order','get',postdata,function(res){
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
                    op : 'editco',
                    fromajax : 1,
                    id:params.id,
                }
                self.$util.http('order','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.info = res.obj.info;
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