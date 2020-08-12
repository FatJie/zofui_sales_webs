<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    平台名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="about.name" placeholder="输入数字，越大越靠前" class="w400"  />
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    平台描述
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="about.desc" type="textarea" :rows="4" class="w400"  placeholder="输入问题" />
                </Col>
            </Row>
            
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    平台头像
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="about.head" placeholder=""  class="w400" >
                        <Upload slot="append" :action="uploadurl" :on-success="uploadend" :show-upload-list="false">
                            <Button size="small" icon="ios-cloud-upload-outline">选择图片</Button>
                        </Upload>
                    </Input>
                    <p class="frm_tip">建议尺寸：100X100</p>
                </Col>
                
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    列表内容
                </Col>
                <Col span="18" class="frm_content ">
                    
                    <Card class="w500 mb10" style="margin-bottom:10px;" v-for="(item,index) in about.params" :key="index">
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                项目名称
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="item.itemt" placeholder="输入名称" class="w300"  />
                            </Col>
                        </Row>
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                项目描述
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="item.itemd" placeholder="输入描述" class="w300"  />
                            </Col>
                        </Row>
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                点击动作
                            </Col>
                            <Col span="18" class="frm_content">
                                <RadioGroup v-model="item.type">
                                    <Radio label="0">无动作</Radio>
                                    <Radio label="callphone">拨打电话</Radio>
                                    <Radio label="copy">复制</Radio>
                                    <Radio label="toweburl">跳转网页</Radio>
                                    <Radio label="navigateto">跳转页面</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                动作内容
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="item.url" placeholder="根据动作填写电话/复制内容/链接/路径" class="w300"  />
                            </Col>
                        </Row>
                        <Button class="mt10" type="error" size="small" @click="del(index)">删除</Button>
                    </Card>
                    <Button class="mt10" type="info" size="small" @click="addthis">添加一项</Button>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">保存</Button>
                </Col>
            </Row>
        </div>

    </div>
</template>

<script type="text/javascript">
	export default {
	  	components: {
            
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                about : {params:[]},
                uploadurl : '',
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	methods: {
            uploadend(e){
                if( e.attachment ){
                    this.$set(this.about,'head',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
            },
            del(index){
                this.about.params.splice(index,1);
            },
            addthis(){
                if( !this.about.params ){
                    this.about.params = [];
                }
                this.about.params.push({itemt:''});
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'addabout',
                    fromajax : 1,
                    about : this.about,
                }
                self.$util.http('help','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        
                        self.$Message.success('已保存');
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var postdata = {
                    op : 'about',
                    fromajax : 1,
                }
                self.$util.http('help','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loading = false;
                        self.about = res.obj.about;
                        
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                });

            },
	  		onLoad() {
	  			var self = this;
                if( self.page.doing ){
                    return false;
                }
                self.loading = true;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.obj ){
	                	self.list = res.obj.list;
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>