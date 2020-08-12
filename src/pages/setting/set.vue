<template>

    <div>
        <Spin size="large" fix v-if="!loaded"></Spin>
        <div v-if="loaded">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    商户协议
                </Col>
                <Col span="18" class="frm_content">
                    <editor :editorhtml="shop" fnname="shopedit" @shopedit="shopedit" ></editor>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    VIP服务协议
                </Col>
                <Col span="18" class="frm_content">
                    <editor :editorhtml="vip" fnname="vipedit" @vipedit="vipedit" ></editor>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    服务商服务协议
                </Col>
                <Col span="18" class="frm_content">
                    <editor :editorhtml="service" fnname="serviceedit" @serviceedit="serviceedit" ></editor>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    {{data.agentname}}说明
                </Col>
                <Col span="18">
                    <editor :editorhtml="agent" fnname="agentedit" @agentedit="agentedit" ></editor>

                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    分成说明
                </Col>
                <Col span="18">
                    <editor :editorhtml="fenchen" fnname="fencedit" @fencedit="fencedit" ></editor>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    商户提现须知
                </Col>
                <Col span="18">
                    <editor :editorhtml="draw" fnname="drawedit" @drawedit="drawedit" ></editor>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    {{data.fxbname}}提现须知
                </Col>
                <Col span="18">
                    <editor :editorhtml="drawa" fnname="drawaedit" @drawaedit="drawaedit" ></editor>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Affix :offset-bottom="20" style="z-index: 1000;position: relative;">
                        <Button type="primary" @click="save">保存</Button>
                    </Affix>
                </Col>
            </Row>
        </div>
    </div>


</template>

<script type="text/javascript">
    import editor from '../../components/editor'
	export default {
        name : 'settingadmin',
	  	components: {
            editor
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                shop : '',
                agent : '',
                fenchen : '',
                draw : '',
                drawa : '',
                vip : '',
                service : '',
                loaded : true,
                data : {},
	  		}
	  	},
        created:function(){
            this.initData();
            console.log(this.settings)
        },
	  	methods: {
            handleOpen(){
                this.visible = true;
            },
            handleClose(){
                this.visible = false;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            shopedit(e){
                this.shop = e;
            },
            agentedit(e){
                this.agent = e;
            },
            fencedit(e){
                this.fenchen = e;
            },
            drawedit(e){
                this.draw = e;
            },
            serviceedit(e){
                this.service = e;
            },
            vipedit(e){
                this.vip = e;
            },
            drawaedit(e){
                this.drawa = e;
            },
            save(){
                var self = this;
                var postdata = {
                    op : 'saveex',
                    fromajax : 1,
                    shop : self.shop,
                    agent : self.agent,
                    fenchen : self.fenchen,
                    draw : self.draw,
                    drawa : self.drawa,
                    service:self.service,
                    vip:self.vip,
                }
                self.$util.http('setting','post',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.$Message.success('已添加');
                        
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                
                var postdata = {
                    op : 'explain',
                    fromajax : 1,
                }
                setTimeout(function(){
                    self.loaded = false;
                },300);
                
                self.$util.http('setting','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.shop = res.obj.shop;
                        self.agent = res.obj.agent;
                        self.fenchen = res.obj.fenchen;
                        self.draw = res.obj.draw;
                        self.drawa = res.obj.drawa;
                        self.vip = res.obj.vip;
                        self.service = res.obj.service;
                        
                        self.data = res.obj.data;
                        
                        setTimeout(function(){
                            self.loaded = true;
                        },500);
                    }else{
                        self.$Message.error(res.message);
                    }
                });
            },
	  		onLoad() {
	  			var self = this;
                if( !self.isonbottom ){
                    self.page.doing = false;
                    return false;
                } 
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>