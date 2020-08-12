<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="zhuanpanset" @on-click="changetab">
            <TabPane label="奖品管理" name="zhuanpanlist" ></TabPane>
            <TabPane label="添加奖品" name="zhuanpanadd" ></TabPane>
            <TabPane label="参数设置" name="zhuanpanset" ></TabPane>
            <TabPane label="中奖记录" name="zhuanpanlog" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    每天抽奖次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="info.params.feetimes" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    邀请好友参与获得抽奖次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="info.params.maxyq" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    抽奖需消耗积分
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="info.params.jifen" placeholder="" class="w400"  />
                    <p class="frm_tip">填0则不需要积分，填大于0则每次抽奖需要消耗积分</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    活动规则
                </Col>
                <Col span="18" class="frm_content">
                    <div v-if="info.params && info.params.rule" class="mb10" v-for="(item,index) in info.params.rule">
                        <Input v-model="info.params.rule[index]" placeholder="" class="w400"  />
                        <a href="javascript:;" @click="delrule(index)">删除</a>
                    </div>
                    
                    <a href="javascript:;" @click="addrule">添加规则</a>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    背景音乐
                </Col>
                <Col span="18" class="frm_content">
                    <div>{{info.musicname}}</div>
                    <div>
                        <Button type="primary" size="small" @click="showmusic">选择音乐</Button>
                        <Button type="warning" size="small" @click="info.musicname = '';info.params.musicid = 0">删除音乐</Button>
                        <p class="mt10">
                            <a href="javascript:;" @click="link" data-url="/goodsmusic">去添加背景音乐</a>
                        </p>
                    </div>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">保存</Button>
                </Col>
            </Row>
        </div>

    <Modal title="选择音乐" v-model="isshowmusic" :styles="{top: '20px'}" :loading="true">

        <Row class="frm_group " type="flex" align="middle" v-for="item,index in allmusic">
            <Col span="18" class="frm_title">
                {{item.name}}
            </Col>
            <Col span="6" class="frm_content">
                <Button type="primary" size="small" @click="smusic(item)">选择</Button>
                <Button type="info" size="small" @click="play(item)">播放</Button>
            </Col>
        </Row>
        
    </Modal>

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
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                prize : {name:''},
                params : {},
                allmusic : [],
                info : {params:{}},
                isshowmusic : false,
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
            addrule(){
                if( !this.info.params.rule ){
                    this.$set(this.info.params,'rule',['']);
                }else{
                    this.info.params.rule.push('');
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
            play(){

            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'saveset',
                    fromajax : 1,
                    info : this.info.params,
                }
                self.$util.http('zhuanpan','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success('已保存');
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'params',
                    fromajax : 1,
                }

                self.$util.http('zhuanpan','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( !res.obj.info.id ){
                            console.log('111')
                            res.obj.info.params = {feetimes:0,maxyq:0,rule:[],musicid:0};
                        }

                        self.info = res.obj.info;

                        self.allmusic = res.obj.music;
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