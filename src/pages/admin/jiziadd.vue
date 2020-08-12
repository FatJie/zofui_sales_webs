<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="adminjiziadd" @on-click="changetab">
            <TabPane label="活动列表" name="adminjizi" ></TabPane>
            <TabPane label="添加活动" name="adminjiziadd" ></TabPane>
            <TabPane label="参与记录" name="adminjizijoinlog" ></TabPane>
        </Tabs>

        <div v-if="!loading">

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    活动名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.title" placeholder="" type="textarea" :rows="4" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    封面图片
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.thumb" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('thumb')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">建议设置成长方形图片，尺寸300X180(像素)</p>
                    <img v-if="prize.showthumb" :src="prize.showthumb" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    奖品数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.stock" placeholder="" class="w400"  />
                    <p class="frm_tip">每集成一个人减1，到0则不能再继续参与活动</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    奖品价值
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.fee" placeholder="" class="w400"  />
                    <p class="frm_tip">前端显示的价值金额</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    活动时间
                </Col>
                <Col span="18" class="frm_content">
                    <DatePicker confirm :value="[prize.showstart,prize.showend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w400" @on-change="quickdate"  ></DatePicker>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    活动状态
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.status">
                        <Radio label="0" >正常</Radio>
                        <Radio label="1" >下架</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    背景音乐
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.musicname" type="text" class="w400" readonly  placeholder="" >
                        <Button  slot="append" size="small" @click="isshowmusic = true;" icon="ios-cloud-upload-outline">选择音乐</Button>
                    </Input>
                </Col>
            </Row>

            <Modal title="选择音乐" v-model="isshowmusic" :styles="{top: '20px'}" :loading="true">

                <Row class="frm_group " type="flex" align="middle" v-for="item,index in allmusic">
                    <Col span="18" class="frm_title">
                        {{item.name}}
                    </Col>
                    <Col span="6" class="frm_content">
                        <Button type="primary" size="small" @click="smusic(item)">选择</Button>
                        <Button type="error" v-if="plaing && playindex == index" size="small" @click="stop">停止</Button>
                        <Button type="info" v-else size="small" @click="play(item.showurl,index)">播放</Button>
                    </Col>
                </Row>
            </Modal>
            <audio id="bgMusic">
                <source src="" type="audio/mp3">
            </audio>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    文字内容
                </Col>
                <Col span="18" class="frm_content">
                    <div v-if="font" class="mb10" v-for="(item,index) in font">
                        文字<Input v-model="item.font" placeholder="" class="w100"  />
                        ，获得概率<Input v-model="item.per" placeholder="" class="w100"  />%
                        <a href="javascript:;" @click="delfont(index)">删除</a>
                    </div>
                    
                    <a href="javascript:;" @click="addfont">添加一项</a>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    完成难度设置
                </Col>
                <Col span="18" class="frm_content">
                    <div v-if="nandu" class="mb10" v-for="(item,index) in nandu">
                        第<Input v-model="item.helps" placeholder="" class="w100"  />-
                        <Input v-model="item.helpe" placeholder="" class="w100"  />
                        位好友帮忙，抽到
                        <Input v-model="item.helpf" placeholder="" class="w100"  />字
                        <a href="javascript:;" @click="delnandu(index)">删除</a>
                    </div>
                    
                    <a href="javascript:;" @click="addnandu">添加一项</a>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    奖品内容
                </Col>
                <Col span="18" class="frm_content">
                    <Card>
                        
                        <Card class="pd10 mb10" style="position:relative;" v-for="(item,index) in pak">
                            <Row class="frm_group "  >
                                <Col span="4" class="frm_title">
                                    商品名称
                                </Col>
                                <Col span="18" class="frm_title">
                                    {{item.title}}
                                </Col>
                            </Row>
                            <Row class="frm_group "  >
                                <Col span="4" class="frm_title">
                                    商品编号
                                </Col>
                                <Col span="18" class="frm_title">
                                    {{item.id}}
                                </Col>
                            </Row>
                            <Icon type="md-trash" @click="delpak(index)" style="position: absolute;right: 0;top: 0;font-size: 20px;cursor:pointer;" />
                        </Card>
                        <Button type="primary" size="small" @click="addpak">添加奖品</Button>
                    </Card>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    活动详情
                </Col>
                <Col span="18" class="frm_content">
                    <editor class="w750" :editorhtml="prize.content" fnname="content" @content="content" ></editor>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">保存</Button>
                </Col>
            </Row>
        </div>

        <Modal title="选择数据" v-model="isshowgoods" :styles="{top: '20px'}" :loading="true">

            <Row class="frm_group " type="flex"  >
                <Col span="20" class="frm_title" >
                    <Row v-for="item,index in allgoods" class="mb5">
                        <Col span="4" class="frm_title">
                            {{item.id}}
                        </Col>
                        <Col span="4" class="frm_title">
                            <Avatar icon="ios-person" size="large" shape="square" :src="item.thumb" />
                        </Col>
                        <Col span="14" class="frm_title">
                            {{item.title}}
                        </Col>
                        <Col span="2" class="frm_content">
                            <Button type="primary" size="small" @click="sitem(item)">选择</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
        </Modal>

        <upload ref="uploadref" type="admin" :sid="shop.id" :uniacid="shop.uniacid" @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import editor from '../../components/editor';
    import upload from '../../components/upload';
	export default {
	  	components: {
            upload,editor
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                prize : {name:''},
                uploadurl : '',
                allcard : [],
                allshop : [],
                shoplist : [],
                shop : {},
                rule : [],
                pak : [],
                isshowmusic : false,
                allmusic : [],
                allgoods : [],
                font : [],
                nandu : [],
                isshowgoods : false,
                playindex: -1,
                plaing : false,
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
            content(e){
                this.$set(this.prize,'content',e);
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            quickdate(e){
                this.prize.showstart = e[0];
                this.prize.showend = e[1];
            },
            addnandu(){
                if( !this.nandu ){
                    this.$set(this,'nandu',[{}]);
                }else{
                    this.nandu.push({});
                }
            },
            stop(){
                var audio = document.getElementById("bgMusic");
                audio.pause();
                this.plaing = false;
            },
            play(url,index){
                var audio = document.getElementById("bgMusic");
                this.playindex = index;
                audio.src = url;
                audio.play();
                this.plaing = true;
            },
            delnandu(e){
                this.nandu.splice(e,1);
            },
            addfont(){
                if( !this.font ){
                    this.$set(this,'font',[{font:'',per:''}]);
                }else{
                    this.font.push({font:'',per:''});
                }
            },
            delfont(e){
                this.font.splice(e,1);
            },
            uploadimg(type,i){
                this.uptarget = type;
                this.uptargeti = i;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if( this.uptarget == 'thumb' ){

                    this.$set(this.prize,'thumb',e.attachment);
                    this.$set(this.prize,'showthumb',e.url);

                }else if( this.uptarget == 'pimg' ){
                    this.$set(this.pak[this.uptargeti],'pimg',e.attachment);
                    this.$set(this.pak[this.uptargeti],'showpimg',e.url);
                }
            },
            addpak(){
                this.isshowgoods = true;
                //this.pak.push({pname:'',disstock:'0',ptype:'0'});
            },
            delpak(e){
                this.pak.splice(e,1);
            },
            smusic(e){
                this.prize.musicname = e.name;
                this.prize.musicid = e.id;
                this.isshowmusic = false;
            },
            sitem(e){
                this.pak.push({title:e.title,id:e.id});
            },
            save(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'addjizi',
                    fromajax : 1,
                    fwqfwqfvq : this.prize.title,
                    gwegw : this.prize.thumb,
                    gwgewvwe : this.prize.stock,
                    gwwed : {start:this.prize.showstart,end:this.prize.showend},
                    gwqfwqfq : this.prize.content,
                    fwgqq : this.prize.status,
                    gewwqc : this.prize.fee,
                    musicid : this.prize.musicid,
                    gid : this.prize.id > 0 ? this.prize.id : 0,
                    fwqfwwa : [],
                    geqaaa : [],
                    hrerwa : [],
                    vewqca : [],
                    yecwa : [],
                    dherera : [],
                }

                for(var t in this.font){
                    postdata.fwqfwwa.push( this.font[t].font );
                    postdata.geqaaa.push( this.font[t].per );
                }
                for(var t in this.nandu){
                    postdata.hrerwa.push( this.nandu[t].helps );
                    postdata.vewqca.push( this.nandu[t].helpe );
                    postdata.yecwa.push( this.nandu[t].helpf );
                }
                for(var t in this.pak){
                    postdata.dherera.push( this.pak[t].id );
                }

                self.$util.http('ajax','POST',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success({
                            content : '已保存',
                            onClose : function(){
                                self.$router.push('/adminjizi');
                            }
                        });
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var postdata = {
                    p:'admin',
                    op : 'edit',
                    fromajax : 1,
                    id : id,
                }

                if( id <= 0 ) postdata.op = 'add';

                self.$util.http('jizi','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info ){
                            self.prize = res.obj.info;
                            self.font = res.obj.info.font;
                            self.nandu = res.obj.info.nandu;
                            self.pak = res.obj.gprize;
                            self.allshop = res.obj.info.shoplist ? res.obj.info.shoplist : [];

                            self.start = res.obj.info.time ? res.obj.info.time.start : '';
                            self.end = res.obj.info.time ? res.obj.info.time.end : '';
                        }
                        self.allcard = res.obj.allcard;
                        self.shoplist = res.obj.shoplist;
                        self.allmusic = res.obj.allmusic;
                        self.allgoods = res.obj.allgoods;
                        self.shop = res.obj.shop;


                        self.loading = false;

                    }else{
                        self.$Message.error(res.res);
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