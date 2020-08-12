<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="articleadd" @on-click="changetab">
            <TabPane label="文章列表" name="articlelist" ></TabPane>
            <TabPane label="添加文章" name="articleadd" ></TabPane>
            <TabPane label="文章分类" name="articlesort" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    采集微信
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="wxurl" placeholder="" class="w400"  />
                    <Button size="small" type="info" @click="getwx">采集</Button>
                    <p class="frm_tip">采集微信文章，输入微信图文文章链接</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    文章标题
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="article.title" type="textarea" :rows="4" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    副标题
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="article.desc" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    所属分类
                </Col>
                <Col span="18" class="frm_content">
                    <Select filterable v-model="article.sortid" class="w400">
                        <Option v-for="item in allsort" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
            </Row>

            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    文章封面
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="article.thumb" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('thumb')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">尺寸320X180(像素)</p>
                    <img v-if="article.showthumb" :src="article.showthumb" class="showupimg">
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    文章类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="article.type">
                        <Radio label="0" >介绍商品</Radio>
                        <Radio label="1">介绍店铺</Radio>
                        <Radio label="2">跳转网页</Radio>
                    </RadioGroup>
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="article.type == 0">
                <Col span="3" class="frm_title">
                    商品id
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="article.gid" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="article.type == 1">
                <Col span="3" class="frm_title">
                    店铺id
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="article.sid" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="article.type == 2">
                <Col span="3" class="frm_title">
                    网页链接
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="article.url" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    虚拟阅读量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="article.falsescan" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    状态
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="article.status">
                        <Radio label="0" >正常</Radio>
                        <Radio label="1">下架</Radio>
                    </RadioGroup>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    文章内容
                </Col>
                <Col span="18" class="frm_content">
                    <editor :editorhtml="article.content" fnname="shopedit" @shopedit="shopedit" ></editor>
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
    import editor from '../../components/editor'
    import upload from '../../components/upload';
	export default {
	  	components: {
            editor,upload
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                article : {name:'',showtime:[]},
                uploadurl : '',
                allbind : [],
                wxurl : '',
                end : '',
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            shopedit(e){
                this.$set(this.article,'content',e);
            },
            addthis(){
                this.shop.params.push({itemt:''});
            },
            delbind(index){
                this.allbind.splice(index,1);
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            searchdate(e){
                this.start = e[0];
                this.end = e[1];
            },

            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if( this.uptarget == 'thumb' ){
                    this.$set(this.article,'thumb',e.attachment);
                    this.$set(this.article,'showthumb',e.url);
                }
            },
            getwx(){
                var self = this;
                var postdata = {
                    op : 'cwxat',
                    fromajax : 1,
                    url : this.wxurl,

                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.article.title = res.obj.title;
                        self.article.desc = res.obj.desc;
                        self.article.thumb = res.obj.thumb;
                        self.article.content = res.obj.c;
                        self.$Message.success('采集成功');
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'addarticle',
                    fromajax : 1,
                    data : {
                        title : this.article.title,
                        desc : this.article.desc,
                        sortid : this.article.sortid,
                        thumb : this.article.thumb,
                        falsescan : this.article.falsescan,
                        type : this.article.type,
                        gid : this.article.gid,
                        shopid : this.article.shopid,
                        sid : this.article.sid,
                        url : this.article.url,
                        content : this.article.content,
                    },
                    aid : this.article.id > 0 ? this.article.id : 0,
                    gewcqw : this.article.type,
                    fwqgqq : this.article.gid,
                    gewgww : this.article.sid,
                    gwgewc : this.article.url,
                }

                var bind = [];
                for (var i = 0; i < this.allbind.length; i++) {
                    bind.push( this.allbind[i].gid );
                }
                postdata.bind = bind;

                self.$util.http('ajax','post',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已保存');
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var postdata = {
                    op : 'edit',
                    fromajax : 1,
                    id : id,
                }

                self.$util.http('article','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info && res.obj.info.id ){
                            self.article = res.obj.info;
                        }
                        self.allsort = res.obj.allsort;
                        self.loading = false;

                    }else{
                        self.$Message.error(res.message);
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