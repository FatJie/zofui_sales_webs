<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="signadd" @on-click="changetab">
            <TabPane label="签到礼包列表" name="signlist" ></TabPane>
            <TabPane label="添加签到礼包" name="signadd" ></TabPane>
            <TabPane label="商户签到活动" name="actsign" ></TabPane>
        </Tabs>

        <div v-if="!loading">

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    礼包名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.name" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    发放类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.sendtype">
                        <Radio label="0" >签到完成店铺达到指定数量发放</Radio>
                        <Radio label="1">签到成功店铺达到指定数量发放</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    发放条件值
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.need" placeholder="" class="w400"  />
                    <p class="frm_tip">此参数和‘发放类型’参数配套有效</p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    礼包图片
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.img" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('img')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">建议设置成正方形图片，尺寸400X400(像素)</p>
                    <img v-if="prize.showimg" :src="prize.showimg" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    礼包类型
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.type">
                        <Radio label="0" >卡券</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    是否扣库存
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="prize.disstock">
                        <Radio label="0" >不扣库存</Radio>
                        <Radio label="1">扣库存</Radio>
                    </RadioGroup>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    选择优惠券
                </Col>
                <Col span="18" class="frm_content">
                    <Select filterable v-model="prize.card" class="w400">
                        <Option v-for="item in allcard" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
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
                loading : false,
	  			params : {},
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                prize : {name:''},
                uploadurl : '',
                allcard : [],
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
                this.$set(this.shop,'content',e);
            },
            addthis(){
                this.shop.params.push({itemt:''});
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
                if( this.uptarget == 'img' ){
                    this.$set(this.prize,'img',e.attachment);
                    this.$set(this.prize,'showimg',e.url);

                }
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'create',
                    fromajax : 1,
                    name : this.prize.name,
                    need : this.prize.need,
                    img : this.prize.img,
                    type : this.prize.type,
                    card : this.prize.card,
                    sendtype : this.prize.sendtype,
                    disstock : this.prize.disstock,
                    ptype : 1,
                    id : this.prize.id > 0 ? this.prize.id : 0,
                }
                self.$util.http('act','GET',postdata,function(res){
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
                var id = params.id ? params.id : 0;
                var postdata = {
                    op : 'signset',
                    fromajax : 1,
                    id : id,
                }

                self.$util.http('act','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info ){
                            self.prize = res.obj.info;
                        }
                        self.allcard = res.obj.allcard;
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