<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="ucardadd" @on-click="changetab">
            <TabPane label="赠送卡券列表" name="ucardlist" ></TabPane>
            <TabPane label="添加购卡赠券" name="ucardadd" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    提示
                </Col>
                <Col span="18" class="frm_content">
                    此功能是粉丝开通会员卡后赠送优惠券，优惠券需要在商户后台添加
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.name" placeholder="" class="w400"  />
                    <p class="frm_tip">例：5元红包</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    排序序号
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="prize.number" placeholder="越大越靠前" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    赠送的优惠券
                </Col>
                <Col span="18" class="frm_content">
                    <Select filterable v-model="prize.cardid" class="w400">
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
            save(e){
                var self = this;
                var postdata = {
                    op : 'adducard',
                    fromajax : 1,
                    name : this.prize.name,
                    number : this.prize.number,
                    cardid : this.prize.cardid,
                    fid : this.prize.id > 0 ? this.prize.id : 0,
                }
                self.$util.http('ajax','GET',postdata,function(res){
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
                    op : 'ucard',
                    fromajax : 1,
                    id : id,
                }

                self.$util.http('user','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( id > 0 && res.obj.list ){
                            for (var i = 0; i < res.obj.list.length; i++) {
                                if(res.obj.list[i].id == id){
                                    self.prize = res.obj.list[i];
                                }
                            }
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