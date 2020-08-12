<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="givecardadd" @on-click="changetab">
            <TabPane label="会员卡礼包列表" name="givecardlist" ></TabPane>
            <TabPane label="添加会员卡礼包" name="givecardadd" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    提示
                </Col>
                <Col span="18" class="frm_content">
                    会员卡礼包是在参数设置-会员卡参数里切换到使用购物赠卡券功能后，出现在前端会员页面供用户购买此商品获得会员的功能
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    商品名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.name" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    价值
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.value" placeholder="" class="w400"  />
                    <p class="frm_tip">礼包的价值，展示作用</p>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    价格
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.price" placeholder="" class="w400"  />
                    <p class="frm_tip">需要支付的金额，单位/元</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    每人可购买次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.maxtimes" placeholder="" class="w400"  />
                    <p class="frm_tip">填数字，填0不限制</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="settings.twoucard == 1">
                <Col span="3" class="frm_title">
                    赠送会员类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="redbag.cardtype">
                        <Radio label="0" >普通会员</Radio>
                        <Radio label="1">高级会员</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    赠送会员时间
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.usertime" placeholder="" class="w400"  />
                    <p class="frm_tip">填数字。单位/月，每月按30天计算</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="settings.fxlevel != 3">
                <Col span="3" class="frm_title">
                    开通后上级提成
                </Col>
                <Col span="18" class="frm_content">
                    <div class="mb5">
                        上级<Input v-model="redbag.fx.p" placeholder="" class="w100"  />
                        会员上级<Input v-model="redbag.fx.up" placeholder="" class="w100"  />
                    </div>
                    <div class="mb5" v-if="settings.fxlevel >= 1">
                        上上级<Input v-model="redbag.fx.pp" placeholder="" class="w100"  />
                        会员上上级<Input v-model="redbag.fx.upp" placeholder="" class="w100"  />
                    </div>
                    <div class="mb5" v-if="settings.fxlevel >= 2">
                        上上上级<Input v-model="redbag.fx.ppp" placeholder="" class="w100"  />
                        会员上上上级<Input v-model="redbag.fx.uppp" placeholder="" class="w100"  />
                    </div>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    是否库存限制
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="redbag.disstock">
                        <Radio label="0" >不限制库存</Radio>
                        <Radio label="1">限制库存</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    状态
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="redbag.status">
                        <Radio label="0" >正常</Radio>
                        <Radio label="1">下架</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    礼包图片
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.img" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('img')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">建议设置成正方形图片，尺寸400X400(像素)</p>
                    <img v-if="redbag.showimg" :src="redbag.showimg" class="showupimg">
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    礼包内容
                </Col>
                <Col span="18" class="frm_content">
                    <Card class="w500 mb10" style="margin-bottom:10px;" v-for="(item,index) in redbag.prize" :key="index">
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                礼包类型
                            </Col>
                            <Col span="18" class="frm_content">
                                {{item.type == 1 ? '商品' : '卡券'}}
                            </Col>
                        </Row>
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                礼包名称
                            </Col>
                            <Col span="18" class="frm_content">
                                （{{item.pid}}）{{item.type == 1 ? item.goodtitle : item.cardname}}
                            </Col>
                        </Row>
                        
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                所属商户
                            </Col>
                            <Col span="18" class="frm_content">
                                {{item.shopname}}
                            </Col>
                        </Row>
                        <Button class="mt10" type="error" size="small" @click="del(index)">删除</Button>
                    </Card>
                    <Button class="mt10" type="info" size="small" @click="addthis">添加一项</Button>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    注意事项
                </Col>
                <Col span="18" class="frm_content">
                    <div v-if="redbag.know" class="mb10" v-for="(item,index) in redbag.know">
                        <Input v-model="redbag.know[index]" placeholder="" class="w400"  />
                        <a href="javascript:;" @click="delrule(index)">删除</a>
                    </div>
                    
                    <a href="javascript:;" @click="addrule">添加一项</a>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    详情介绍
                </Col>
                <Col span="18" class="frm_content">
                    <editor :editorhtml="redbag.content" fnname="shopedit" @shopedit="shopedit" ></editor>
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
            <Col span="4" class="frm_title">
                <ButtonGroup vertical>
                    <Button :type="showgoodstype == 0 ? 'primary':'default'" @click="showgoodstype = 0">商品</Button>
                    <Button :type="showgoodstype == 1 ? 'primary':'default'" @click="showgoodstype = 1">卡券</Button>
                </ButtonGroup>
            </Col>
            <Col span="20" class="frm_title" v-if="showgoodstype == 0">
                <Row v-for="item,index in allgoods" class="mb5">
                    <Col span="4" class="frm_title">
                        {{item.shop.name}}
                    </Col>
                    <Col span="4" class="frm_title">
                        <Avatar icon="ios-person" size="large" shape="square" :src="item.thumb" />
                    </Col>
                    <Col span="14" class="frm_title">
                        （{{item.id}}）{{item.title}}
                    </Col>
                    <Col span="2" class="frm_content">
                        <Button type="primary" size="small" @click="sitem(1,item)">选择</Button>
                    </Col>
                </Row>
            </Col>
            <Col span="20" class="frm_title" v-if="showgoodstype == 1">
                <Row v-for="item,index in allcard" class="mb5">
                    <Col span="4" class="frm_title">
                        {{item.shopid > 0 ?  item.shop.name : '平台'}}
                    </Col>
                    <Col span="18" class="frm_title">
                        （{{item.id}}）{{item.name}}
                    </Col>
                    <Col span="2" class="frm_content">
                        <Button type="primary" size="small" @click="sitem(2,item)">选择</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
        
    </Modal>
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
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                redbag : {name:'',prize:[],content:'',fx:{}},
                uploadurl : '',
                isshowgoods : false,
                allcard : [],
                allgoods : [],
                showgoodstype : 0,
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
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if( this.uptarget == 'img' ){
                    this.$set(this.redbag,'img',e.attachment);
                    this.$set(this.redbag,'showimg',e.url);

                }
            },
            shopedit(e){
                this.$set(this.redbag,'content',e);
            },
            addrule(){
                if( !this.redbag.know ){
                    this.$set(this.redbag,'know',['']);
                }else{
                    this.redbag.know.push('');
                }
            },
            delrule(e){
                this.redbag.know.splice(e,1);
            },
            del(e){
                this.redbag.prize.splice(e,1);
            },
            addthis(){
                this.isshowgoods = !this.isshowgoods;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            changedate(e){
                this.redbag.time.start = e[0];
                this.redbag.time.end = e[1];
            },
            sitem(type,data){
                if( !this.redbag.prize ){
                    this.$set(this.redbag,'prize',[]);
                }

                this.redbag.prize.push({
                    type : type,
                    pid : data.id,
                    cardname : data.name,
                    shopname : data.shop.name,
                    goodtitle : data.title,
                });
                this.addthis();
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'creategoods',
                    fromajax : 1,
                    redbag : this.redbag,
                    id : this.redbag.id > 0 ? this.redbag.id : 0,
                }
                self.$util.http('user','post',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var postdata = {
                    op : 'edituprize',
                    fromajax : 1,
                    id : id,
                }

                self.$util.http('user','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info ){
                            self.redbag = res.obj.info;
                            if( !self.redbag.fx ){
                                self.redbag.fx = {p:0,pp:0,ppp:0};
                            }
                        }
                        
                        self.allgoods = res.obj.allgoods;
                        self.allcard = res.obj.allcard;
                        self.loading = false;

                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);

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