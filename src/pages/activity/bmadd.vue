<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="bmadd" @on-click="changetab">
            <TabPane label="报名设置" name="bmadd"  ></TabPane>
            <TabPane label="报名记录" name="bmlog" ></TabPane>
            <TabPane label="支付记录" name="bmpaylog" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    清空数据
                </Col>
                <Col span="18" class="frm_content">
                    <Button type="primary" @click="clearshare">清空转发、浏览、点赞数据</Button>
                    <p class="frm_tip">清空后所有商户的转发，浏览，点赞数据都变成0</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    开关报名
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="info.status">
                        <Radio label="0" >关闭</Radio>
                        <Radio label="1">开启</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    报名需支付
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="info.fee" placeholder="" class="w400"  />
                    <p class="frm_tip">填0不需要支付</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    报名结束时间
                </Col>
                <Col span="18" class="frm_content">
                    <DatePicker type="date" @on-change="setend" :value="info.showend" placeholder="选择到期时间" class="w400"></DatePicker>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    表单数据
                </Col>
                <Col span="18" class="frm_content">
                    <myform :form="form"  @setform="setform"></myform>
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
    import myform from '../../components/form';
	export default {
	  	components: {
            myform
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                info : {status:'0',fee:0,},
                uploadurl : '',
                allcard : [],
                form : [],
                provalue : '',
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
            setend(e){
                this.info.showend = e;
            },
            setform(e){
                this.form = e;
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'saveset',
                    fromajax : 1,
                    status : self.info.status,
                    fee : self.info.fee,
                    subform : self.form,
                    end : self.info.showend,
                }
                self.$util.http('subform','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已保存');
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            clearshare(){
                var self = this;
                var postdata = {
                    op : 'clearshare',
                    fromajax : 1,
                    status : self.info.status,
                }

                self.$Modal.confirm({
                    title : '提示',
                    content : '确定要清空吗？',
                    onOk : function(){
                        self.$util.http('subform','GET',postdata,function(res){
                            if( res.status == 200 ){
                                self.$Message.success('已清空');
                            }else{
                                self.$Message.error(res.res);
                            }
                        },true);
                    }
                })

            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var postdata = {
                    op : 'info',
                    fromajax : 1,
                    id : id,
                }

                self.$util.http('subform','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info ){
                            self.info = res.obj.info;
                            if( res.obj.info.formarr ){
                                self.form = res.obj.info.formarr;
                            }
                        }
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