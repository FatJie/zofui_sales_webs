<template>
	<div>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    {{settings.shopbname}}头像
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.headimg" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('headimg')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">上传正方形的图片，建议尺寸200X200像素</p>
                    <img v-if="shop.showheadimg" class="showupimg" :src="shop.showheadimg" >
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    背景图片
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.cover" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('cover')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">建议尺寸300X180像素</p>
                    <img v-if="shop.showcover" :src="shop.showcover" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    {{settings.shopbname}}描述
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.desc" type="textarea" :rows="4" class="w400"  placeholder="输入经营描述" />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    分享标题
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.share_title" type="textarea" :rows="4" class="w400"  placeholder="输入店铺分享时的标题" />
                    <p class="frm_tip">建议添加{nick}</p>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    分享内容
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.share_content" type="textarea" :rows="4" class="w400"  placeholder="输入店铺分享时的内容" />
                </Col>
            </Row>
          
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    {{settings.shopbname}}电话
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.tel" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    是否开启在线买单
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.onlinepay" placeholder="" class="w400"  />
                    <p class="frm_tip">输入1为开通，0为不开通，默认没有开通</p>
                </Col>
                
            </Row>
            <Row class="frm_group" v-if="!settings.fontsty || settings.fontsty == 0">
                <Col span="3" class="frm_title">
                    营业范围
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.severkm" placeholder="" class="w400"  />
                    <p class="frm_tip">单位/米。填0不限制</p>
                </Col>
            </Row>
             <Row class="frm_group" v-if="!settings.fontsty || settings.fontsty == 0">
                <Col span="3" class="frm_title">
                    展示营业时间
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="opentime" placeholder="" class="w400"  />
                    <p class="frm_tip">若不设置展示下单时间</p>
                </Col>
            </Row>
          
            <Row class="frm_group" v-if="!settings.fontsty || settings.fontsty == 0">
                <Col span="3" class="frm_title">
                    营业时间
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="sh" placeholder="" class="w100"  />时，
                    <Input v-model="sm" placeholder="" class="w100"  />分，至
                    <Input v-model="eh" placeholder="" class="w100"  />时，
                    <Input v-model="em" placeholder="" class="w100"  />分
                    <p class="frm_tip">根据提示填，数字。不在范围内不能下单。以24小时制算。例如分别填8 30 20 30,那么营业时间是早上8点半到晚上20点半。都填0或不填，那么不做限制</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    起购金额
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="startm" placeholder="" class="w400"  />
                    <p class="frm_tip">配送到家的订单金额未达到此金额不能下单</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="!settings.fontsty || settings.fontsty == 0">
                <Col span="3" class="frm_title">
                    默认配送费
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="expfee" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="!settings.fontsty || settings.fontsty == 0">
                <Col span="3" class="frm_title">
                    默认包装费
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="pakfee" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
             <Row class="frm_group">
                <Col span="3" class="frm_title">
                    店铺介绍
                </Col>
                <Col span="18" class="frm_content">
                    <editor class="w750" :editorhtml="shop.content" fnname="shopedit" @shopedit="shopedit" type="admin" :shopid="shop.id" :uniacid="shop.uniacid" ></editor>
                </Col>
            </Row>
           <!-- <Row class="frm_group">
                <Col span="3" class="frm_title">
                    主页样式
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="idxstyle">
                        <Radio :label="0" >默认</Radio>
                        <Radio :label="1" >样式一</Radio>
                        <Radio :label="2" >样式二</Radio>
                    </RadioGroup>
                </Col>
            </Row> -->
            <Row class="frm_group" v-if="!(settings.shoppay == 1 || (shop.auth && shop.auth.ispay == 1))">
                <Col span="3" class="frm_title">
                    收款按钮
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="isshowpay">
                        <Radio :label="0" >店铺主页显示</Radio>
                        <Radio :label="1" >不显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <div v-if="settings.ispft == 11 && (shop.auth && shop.auth.ispft == 1)">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        票付通账户
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="pftac" placeholder="" class="w400"  />
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        票付通秘钥
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="pftpw" placeholder="" class="w400"  />
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </div>
            
            <Row class="frm_group" v-if="settings.shopgqun == 1">
                <Col span="3" class="frm_title">
                    加群提示
                </Col>
                <Col span="18" class="frm_content">
                    <Card>
                    <Row class="frm_group">
                        <Col span="3" class="frm_title">
                            加群标题
                        </Col>
                        <Col span="18" class="frm_content">
                            <Input v-model="qun.title" placeholder="" class="w400"  />
                            <p class="frm_tip">显示的标题</p>
                        </Col>
                    </Row>
                    <Row class="frm_group">
                        <Col span="3" class="frm_title">
                            加群描述
                        </Col>
                        <Col span="18" class="frm_content">
                            <Input v-model="qun.desc" placeholder="" class="w400"  />
                            <p class="frm_tip">提示的描述</p>
                        </Col>
                    </Row>
                    <Row class="frm_group" >
                        <Col span="3" class="frm_title">
                            回复关键字
                        </Col>
                        <Col span="18" class="frm_content">
                            <Input v-model="qun.key" placeholder="" class="w400"  />
                            <p class="frm_tip">提示回复的关键字</p>
                        </Col>
                    </Row>
                    <Row class="frm_group">
                        <Col span="3" class="frm_title">
                            群二维码
                        </Col>
                        <Col span="18" class="frm_content">
                            <Input v-model="qun.qr" placeholder=""  class="w400" >
                                <Button slot="append" size="small" @click="uploadimg('qun')" icon="ios-cloud-upload-outline">选择图片</Button>
                            </Input>
                            <img v-if="qun.showqr" :src="qun.showqr" class="showupimg">
                        </Col>
                    </Row>
                    </Card>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">保存</Button>
                </Col>
            </Row>
        </div>
        <upload ref="uploadref" type="admin" :sid="shop.id" :uniacid="shop.uniacid"  @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import editor from '../../components/editor';
    import upload from '../../components/upload';
	export default {
	  	components: {
            editor,upload
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                params : {},
                shop : {aut:{},severtime:{}},
                startm : '',
                pakfee : '',
                expfee : '',
                opentime : '',
                sh:'',
                sm:'',
                eh:'',
                em:'',
                idxstyle : 0,
                isshowpay : 0,
                qun : {},
                pftac : '',
                pftpw : '',
	  		}
	  	},
        created:function(){
            this.initData();
        },
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            shopedit(e){
                this.$set(this.shop,'content',e);
            },

            uploadmethod(e){

                if( this.uptarget == 'cover' ){
                    this.$set(this.shop,'cover',e.attachment);
                    this.$set(this.shop,'showcover',e.url);
                }else if(  this.uptarget == 'headimg' ){
                    this.$set(this.shop,'headimg',e.attachment);
                    this.$set(this.shop,'showheadimg',e.url);
                }else if(  this.uptarget == 'qun' ){
                    this.$set(this.qun,'qr',e.attachment);
                    this.$set(this.qun,'showqr',e.url);
                }
            },
            smusic(e){
                this.info.musicname = e.name;
                this.info.params.musicid = e.id;
                this.showmusic();
            },
            showmusic(e){
                this.isshowmusic = !this.isshowmusic;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            delrule(e){
                this.info.params.rule.splice(e,1);
            },
            uploadimg(type){
          
            console.log(type)
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            save(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'editshopinfo',
                    fromajax : 1,
                    desc : this.shop.desc,
                    share_title : this.shop.share_title,
                    share_content : this.shop.share_content,
                    img : this.shop.headimg,
                    cover : this.shop.cover,
                    tel : this.shop.tel,
                    aliname : this.shop.aliname,
                    content:   this.shop.content,
                    aliaccount : this.shop.aliaccount,
                    severkm : this.shop.severkm,
                    onlinepay:this.shop.onlinepay,
                    seversh : this.sh,
                    seversm : this.sm,
                    severeh : this.eh,
                    severem : this.em,
                    startm : this.startm,
                    pakfee : this.pakfee,
                    expfee : this.expfee,
                    opentime : this.opentime,
                    idxstyle : this.idxstyle,
                    isshowpay : this.isshowpay,
                    quntitle : this.qun.title ? this.qun.title : '',
                    qundesc : this.qun.desc ? this.qun.desc : '',
                    qunkey : this.qun.key ? this.qun.key : '',
                    qunqr : this.qun.qr ? this.qun.qr : '',
                    pftac : this.pftac,
                    pftpw : this.pftpw,
                }
                self.$util.http('ajax','POST',postdata,function(res){
                    if( res.status == 200 ){
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
                    p:'admin',
                    op : 'info',
                    fromajax : 1,
                }

                self.$util.http('set','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( !res.obj.shop.auth ){
                            res.obj.shop.auth = {};
                        }
                        if( !res.obj.shop.severtime ){
                            res.obj.shop.severtime = {};
                        }
                        self.shop = res.obj.shop;
                        self.qun = res.obj.qun ? res.obj.qun : {};

                        self.sh = self.shop.severtime.sh ? self.shop.severtime.sh : 0;
                        self.sm = self.shop.severtime.sm ? self.shop.severtime.sm : 0;
                        self.eh = self.shop.severtime.eh ? self.shop.severtime.eh : 0;
                        self.em = self.shop.severtime.em ? self.shop.severtime.em : 0;
                        self.startm = self.shop.auth.startm ? self.shop.auth.startm : 0;
                        self.pakfee = self.shop.auth.pakfee ? self.shop.auth.pakfee : 0;
                        self.expfee = self.shop.auth.expfee ? self.shop.auth.expfee : 0;
                        self.opentime = self.shop.auth.opentime ? self.shop.auth.opentime : '';
                        self.idxstyle = self.shop.auth.idxstyle ? self.shop.auth.idxstyle*1 : 0;
                        self.isshowpay = self.shop.auth.isshowpay ? self.shop.auth.isshowpay*1 : 0;
                        self.pftac = self.shop.pftac ? self.shop.pftac : '';
                        self.pftpw = self.shop.pftpw ? self.shop.pftpw : '';
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