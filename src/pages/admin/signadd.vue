<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="adminsignadd" @on-click="changetab">
            <TabPane label="活动列表" name="adminsign" ></TabPane>
            <TabPane label="添加活动" name="adminsignadd" ></TabPane>
            <TabPane label="参与记录" name="adminsignjoinlog" ></TabPane>
            <TabPane label="签到记录" name="adminsignsignlog" ></TabPane>
        </Tabs>

        <div v-if="!loading">

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    活动名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.name" placeholder="" class="w400"  />
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
                    <img v-if="prize.showthumb" :src="prize.showthumb"  class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    每人可参与次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.manytimes" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，每循环签到完成一次算一次，若填大于1的数字。签到完成后可以继续重新开始签到活动</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    需要签到次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.num" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，签到达到此次数即发放礼包</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    库存数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.stock" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，完成1名减少1份，到0不可再参与活动</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    活动时间
                </Col>
                <Col span="18" class="frm_content">
                    <DatePicker confirm :value="[start,end]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w400" @on-change="quickdate"  ></DatePicker>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    可签到门店
                </Col>
                <Col span="18" class="frm_content">
                    <Select v-model="allshop" multiple style="width:400px">
                        <Option v-for="item in shoplist" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <P class="frm_tip">提示：可在其他{{settings.fsbname}}功能内添加{{settings.fsbname}}</P>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    活动规则
                </Col>
                <Col span="18" class="frm_content">
                    <div v-if="rule" class="mb10" v-for="(item,index) in rule">
                        <Input v-model="rule[index]" placeholder="" class="w400"  />
                        <a href="javascript:;" @click="delknow(index)">删除</a>
                    </div>
                    
                    <a href="javascript:;" @click="addknow">添加一项</a>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    礼包内容
                </Col>
                <Col span="18" class="frm_content">
                    <Card>
                        
                        <Card class="pd10 mb10" style="position:relative;" v-for="(item,index) in pak">
                            <Row class="frm_group "  >
                                <Col span="4" class="frm_title">
                                    礼包名称
                                </Col>
                                <Col span="18" class="frm_title">
                                    <Input v-model="item.pname" placeholder="" class="w400"  />
                                </Col>
                            </Row>
                            <Row class="frm_group "  >
                                <Col span="4" class="frm_title">
                                    礼包图片
                                </Col>
                                <Col span="18" class="frm_title">
                                    <Input v-model="item.pimg" placeholder=""  class="w400" >
                                        <Button slot="append" size="small" @click="uploadimg('pimg',index)" icon="ios-cloud-upload-outline">选择图片</Button>
                                    </Input>
                                    <p class="frm_tip">建议设置成长方形图片，尺寸300X180(像素)</p>
                                    <img v-if="item.showpimg" :src="item.showpimg" class="showupimg" >
                                </Col>
                            </Row>
                            <Row class="frm_group "  >
                                <Col span="4" class="frm_title">
                                    礼包类型
                                </Col>
                                <Col span="18" class="frm_title">
                                    <RadioGroup  class="frm_group" v-model="item.ptype">
                                        <Radio label="0" >卡券</Radio>
                                    </RadioGroup>
                                </Col>
                            </Row>
                            <Row class="frm_group "  >
                                <Col span="4" class="frm_title">
                                    是否扣库存
                                </Col>
                                <Col span="18" class="frm_title">
                                    <RadioGroup  class="frm_group" v-model="item.disstock">
                                        <Radio label="0" >不扣库存</Radio>
                                        <Radio label="1" >扣库存</Radio>
                                    </RadioGroup>
                                    <div class="frm_tip">若选择扣库存，每发放1份卡券，扣卡券1份库存</div>
                                </Col>
                            </Row>
                            <Row class="frm_group "  >
                                <Col span="4" class="frm_title">
                                    选择卡券
                                </Col>
                                <Col span="18" class="frm_title">
                                    <Select v-model="item.pcard" style="width:400px">
                                        <Option v-for="inn in allcard" :value="inn.id" :key="inn.id">{{ inn.name }}</Option>
                                    </Select>
                                    <p class="frm_tip">请确保卡券有足够的库存，并且在可领取的时间内</p>
                                </Col>
                            </Row>
                            <Icon type="md-trash" @click="delpak(index)" style="position: absolute;right: 0;top: 0;font-size: 20px;cursor:pointer;" />
                        </Card>
                        <Button type="primary" size="small" @click="addpak">添加一项礼包</Button>
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
        <upload ref="uploadref" type="admin" :sid="shop.id" :uniacid="shop.uniacid" @uploadmethod="uploadmethod"></upload>
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
                allshop : [],
                shoplist : [],
                shop : {},
                rule : [],
                start : '',
                end : '',
                pak : [],
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
            quickdate(e){
                this.start = e[0];
                this.end = e[1];
            },
            addknow(){
                if( !this.rule ){
                    this.$set(this,'rule',['']);
                }else{
                    this.rule.push('');
                }
            },
            delknow(e){
                this.rule.splice(e,1);
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
                this.pak.push({pname:'',disstock:'0',ptype:'0'});
            },
            delpak(e){
                this.pak.splice(e,1);
            },
            save(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'createsign',
                    fromajax : 1,
                    name : this.prize.name,
                    stock : this.prize.stock,
                    num : this.prize.num,
                    manytimes : this.prize.manytimes,
                    thumb : this.prize.thumb,
                    know : this.rule,
                    time : {start:this.start,end:this.end},
                    shoplist : this.allshop,
                    gid : this.prize.id > 0 ? this.prize.id : 0,
                    pname : [],
                    ptype : [],
                    pimg : [],
                    pcard : [],
                    pgoods : [],
                    disstock : [],
                }

                for(var t in this.pak){
                    postdata.pname.push( this.pak[t].pname );
                    postdata.ptype.push( this.pak[t].ptype );
                    postdata.pimg.push( this.pak[t].pimg );
                    postdata.pcard.push( this.pak[t].pcard );
                    postdata.pgoods.push( this.pak[t].pgoods );
                    postdata.disstock.push( this.pak[t].disstock );
                }

                self.$util.http('signin','POST',postdata,function(res){
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
                var id = params.id ? params.id : 0;
                var postdata = {
                    p:'admin',
                    op : 'edit',
                    fromajax : 1,
                    id : id,
                }

                if( id <= 0 ) postdata.op = 'add';

                self.$util.http('signin','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info ){
                            self.prize = res.obj.info;
                            self.rule = res.obj.info.content;
                            self.pak = res.obj.info.prize ? res.obj.info.prize : [];
                            self.allshop = res.obj.info.shoplist ? res.obj.info.shoplist : [];

                            self.start = res.obj.info.time ? res.obj.info.time.start : '';
                            self.end = res.obj.info.time ? res.obj.info.time.end : '';
                        }
                        self.allcard = res.obj.allcard;
                        self.shoplist = res.obj.shoplist;
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