<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="redbagadd" @on-click="changetab">
            <TabPane label="红包列表" name="redbaglist" ></TabPane>
            <TabPane label="添加红包" name="redbagadd" ></TabPane>
            <TabPane label="领取记录" name="redbaglog" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    提示
                </Col>
                <Col span="18" class="frm_content">
                    在此处添加的红包，需要在商户后台添加、编辑商品里去选择使用红包
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    红包名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.name" placeholder="" class="w400"  />
                    <p class="frm_tip">例：5元红包</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    使用时间
                </Col>
                <Col span="18" class="frm_content">
                    <DatePicker type="daterange" :value="[redbag.time.start,redbag.time.end]" placement="bottom-end" placeholder="筛选时间" class="w400"  @on-change="changedate" ></DatePicker>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    红包面值
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.fee" placeholder="" class="w400"  />
                    <p class="frm_tip">单位/元</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    使用条件
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.use" placeholder="" class="w400"  />
                    <p class="frm_tip">单位/元，订单金额大于此值才能使用</p>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    库存
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.stock" placeholder="" class="w400"  />
                    <p class="frm_tip">每领取一个扣除1</p>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    需要邀请好友数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="redbag.invite" placeholder="" class="w400"  />
                    <p class="frm_tip">邀请此数量的好友后才能获得红包</p>
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
                redbag : {name:'',time:{start:'',end:''}},
                uploadurl : '',
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
            uploadend(e){
                if( e.attachment ){
                    this.$set(this.shop,'headimg',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
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
            changedate(e){
                this.redbag.time.start = e[0];
                this.redbag.time.end = e[1];
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'addbag',
                    fromajax : 1,
                    name : this.redbag.name,
                    fee : this.redbag.fee,
                    invite : this.redbag.invite,
                    start : this.redbag.start,
                    time : this.redbag.time,
                    stock : this.redbag.stock,
                    use : this.redbag.use,
                    id : this.redbag.id > 0 ? this.redbag.id : 0,
                }
                self.$util.http('ajax','GET',postdata,function(res){
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
                if( id <= 0 || !id ){
                    self.loading = false;
                    return false;
                }

                self.$util.http('redbag','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.redbag = res.obj.info;
                        self.loading = false;

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