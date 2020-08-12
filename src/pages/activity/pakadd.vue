<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="pakadd" @on-click="changetab">
            <TabPane label="套餐列表" name="paklist" ></TabPane>
            <TabPane label="添加套餐" name="pakadd" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    商品标题
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.title" type="textarea" :rows="4" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    封面图片(正方形)
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.thumb" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('thumb')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">建议设置成正方形图片，尺寸200X200(像素)</p>
                    <img v-if="goods.showthumb" :src="goods.showthumb" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    封面图片(长方形)
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.thumbh" placeholder=""  class="w400" >
                        
                        <Button slot="append" size="small" @click="uploadimg('thumbh')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">尺寸尺寸300X180(像素)</p>
                    <img v-if="goods.showthumbh" :src="goods.showthumbh" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    轮播图片
                </Col>
                <Col span="18" class="frm_content">
                    
                    <Button  size="small" @click="uploadimg('img')" icon="ios-cloud-upload-outline">选择图片</Button>
                    <Row type="flex" class="mt10">

                        <div class="demo-upload-list" v-for="(item,index) in goods.showimg" :key="index">
                            <img :src="goods.showimg[index]">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-trash-outline" @click.native="delimg(index)"></Icon>
                            </div>
                        </div>
                    </Row>
                    <p class="frm_tip">请保持图片尺寸一致</p>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    原价
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.oldprice" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，这个只做展示作用。不填或填0则不显示</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    虚拟销量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.falsesaled" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，前端会显示此数据加真实销量</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    虚拟分享
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.falseshare" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，前端会显示此数据加真实分享</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    虚拟浏览
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.falsescan" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，前端会显示此数据加真实浏览</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    排序序号
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.number" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，越大越靠前</p>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    限制购买/参与
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.isuser">
                        <Radio label="0" >都可以购买</Radio>
                        <Radio label="1">仅限会员购买</Radio>
                        <Radio label="2" v-if="settings.twoucard == 1">仅限高级会员购买</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    商品库存
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.stock" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，到0即不可再购买</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    套餐价格
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.price" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    套餐会员价格
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.userprice" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    位置经纬度
                </Col>
                <Col span="18" class="frm_content">
                    经度<Input v-model="goods.lng" placeholder="" class="w150"  />
                    纬度<Input v-model="goods.lat" placeholder="" class="w150"  />
                    <p class="frm_tip">
                        <a target="_blank" href="https://jingweidu.51240.com/">可到此去查询获得</a>
                    </p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="settings.fxlevel != 3 && settings.isptfx == 1">
                <Col span="3" class="frm_title">
                    分销参数
                </Col>
                <Col span="18" class="frm_content">
                    <div class="mb5">
                        上级分销佣金<Input v-model="goods.fxmoney" placeholder="" class="w100"  />%
                        ,会员上级分销佣金<Input v-model="goods.userfxmoney" placeholder="" class="w100"  />%
                    </div>
                    <div class="mb5" v-if="settings.fxlevel >= 1">
                        上上级分销佣金<Input v-model="goods.fxmoneya" placeholder="" class="w100"  />%
                        ,会员上上级分销佣金<Input v-model="goods.userfxmoneya" placeholder="" class="w100"  />%
                    </div>
                    <div class="mb5" v-if="settings.fxlevel >= 2">
                        上上上级分销佣金<Input v-model="goods.fxmoneyb" placeholder="" class="w100"  />%
                        ,会员上上上级分销佣金<Input v-model="goods.userfxmoneyb" placeholder="" class="w100"  />%
                    </div>
                    <p class="frm_tip">此分销佣金在支付订单后立即发放</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    限购数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.quicklimit" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，填0不限制</p>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    限时抢购
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="limittime">
                        <Radio :label="0" >不限制</Radio>
                        <Radio :label="1" >限制</Radio>
                    </RadioGroup>
                </Col>
            </Row>

            <Row class="frm_group" v-if="limittime == 1">
                <Col span="3" class="frm_title">
                    抢购时间
                </Col>
                <Col span="18" class="frm_content">
                    <DatePicker type="daterange" :value="goods.time" placement="bottom-end" placeholder="筛选时间" class="w400" @on-change="searchdate"  ></DatePicker>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    活动须知
                </Col>
                <Col span="18" class="frm_content">
                    <div v-if="goods.know" class="mb10" v-for="(item,index) in goods.know">
                        <Input v-model="goods.know[index]" placeholder="" class="w400"  />
                        <a href="javascript:;" @click="delrule(index)">删除</a>
                    </div>
                    
                    <a href="javascript:;" @click="addrule">添加一项</a>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    套餐商品
                </Col>
                <Col span="18" class="frm_content">
                    <Card class="w500 mb10" style="margin-bottom:10px;" v-for="(item,index) in goodsarr" :key="index">
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                商品
                            </Col>
                            <Col span="18" class="frm_content">
                                {{item.goods.title}}
                            </Col>
                        </Row>
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                发给商户收入
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="item.shopfee" placeholder="" class="w200"  />
                                <p class="frm_tip">填入数字，发给商户的收益</p>
                            </Col>
                        </Row>
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                发给代理收入
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="item.agentfee" placeholder="" class="w200"  />
                                <p class="frm_tip">填入数字，发给商户代理的收益</p>
                            </Col>
                        </Row>
                        <Row class="frm_group" type="flex" align="middle">
                            <Col span="3" class="frm_title">
                                所属商户
                            </Col>
                            <Col span="18" class="frm_content">
                                {{item.shop.name}}
                            </Col>
                        </Row>
                        <Button class="mt10" type="error" size="small" @click="del(index)">删除</Button>
                    </Card>
                    <Button class="mt10" type="info" size="small" @click="addthis">添加一项</Button>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    详情介绍
                </Col>
                <Col span="18" class="frm_content">
                    <editor :editorhtml="goods.content" fnname="shopedit" @shopedit="shopedit" ></editor>
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
                </ButtonGroup>
            </Col>
            <Col span="20" class="frm_title" v-if="showgoodstype == 0">
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
                goods : {title:'',img:[],showimg:[],know:[]},
                uploadurl : '',
                isshowgoods : false,
                allcard : [],
                allgoods : [],
                showgoodstype : 0,
                goodsarr : [],
                limittime : 0,
                start : '',
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
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if( this.uptarget == 'thumb' ){
                    this.$set(this.goods,'thumb',e.attachment);
                    this.$set(this.goods,'showthumb',e.url);

                }else if(  this.uptarget == 'thumbh' ){
                    this.$set(this.goods,'thumbh',e.attachment);
                    this.$set(this.goods,'showthumbh',e.url);
                }else if(  this.uptarget == 'img' ){
                    if( !this.goods.img ){
                        this.goods.img = [];
                        this.$set(this.goods,'showimg',[]);
                    }
                    this.goods.img.push(e.attachment);
                    this.goods.showimg.push(e.url);
                    this.$set(this.goods,'showimg',this.goods.showimg);
                }
            },

            shopedit(e){
                this.$set(this.goods,'content',e);
            },
            addrule(){
                if( !this.goods.know ){
                    this.$set(this.goods,'know',['']);
                }else{
                    this.goods.know.push('');
                }
            },
            delrule(e){
                this.goods.know.splice(e,1);
            },
            del(e){
                this.goodsarr.splice(e,1);
            },
            delimg(e){
                this.goods.img.splice(e,1);
                this.goods.showimg.splice(e,1);
            },
            addthis(){
                this.isshowgoods = !this.isshowgoods;
            },
            searchdate(e){
                console.log(e)
                this.start = e[0];
                this.end = e[1];
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            sitem(data){
                if( !this.goodsarr ){
                    this.goodsarr = [];
                }

                this.goodsarr.push({
                    gid : data.id,
                    shopfee : '',
                    agentfee : '',
                    goods : {title:data.title,id:data.id},
                    shop : {id:data.shopid},
                });
                this.addthis();
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'addtcgoods',
                    fromajax : 1,
                    data : {
                        title : this.goods.title,
                        thumb : this.goods.thumb,
                        thumbh : this.goods.thumbh,
                        img : this.goods.img,
                        oldprice : this.goods.oldprice,
                        falsesaled : this.goods.falsesaled,
                        falseshare : this.goods.falseshare,
                        falsescan : this.goods.falsescan,
                        number : this.goods.number,
                        isuser : this.goods.isuser,
                        price : this.goods.price,
                        userprice : this.goods.userprice,
                        stock : this.goods.stock,
                        lng : this.goods.lng*1000000,
                        lat : this.goods.lat*1000000,
                        fxmoney : this.goods.fxmoney,
                        userfxmoney : this.goods.userfxmoney,
                        fxmoneya : this.goods.fxmoneya,
                        userfxmoneya : this.goods.userfxmoneya,
                        fxmoneyb : this.goods.fxmoneyb,
                        userfxmoneyb : this.goods.userfxmoneyb,
                        quicklimit : this.goods.quicklimit,
                        start : this.limittime == 1 ? this.start : 0,
                        end : this.limittime == 1 ? this.end : 0,
                        know : this.goods.know,
                        goodsarr : this.goodsarr,
                        content : this.goods.content,
                        type : 7,
                    },
                    gid : this.goods.id > 0 ? this.goods.id : 0,
                }
                self.$util.http('ajax','post',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
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
                    op : 'addpak',
                    fromajax : 1,
                    id : id,
                }

                self.$util.http('goods','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info && res.obj.info.id ){
                            self.goods = res.obj.info;
                            
                            self.goods.showimg = res.obj.info.showimg ? res.obj.info.showimg : [];
                            self.goodsarr = res.obj.goodsarr ? res.obj.goodsarr : [];
                            self.limittime = res.obj.info.start*1 > 0 ? 1 : 0;
                        }
                        
                        self.allgoods = res.obj.allgoods;
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