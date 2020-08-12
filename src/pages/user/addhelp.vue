<template>

    <div>
        <Spin size="large" fix v-if="!loaded"></Spin>

        <div v-if="loaded">

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    问题内容
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="quest.quest" type="textarea" :rows="4" class="w400"  placeholder="输入问题" />
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    推荐序号
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="quest.number" placeholder="输入数字，越大越靠前" class="w400"  />
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    回答内容
                </Col>
                <Col span="18" class="frm_content">
                    <editor class="w750" :editorhtml="quest.answer" fnname="shopedit" @shopedit="shopedit" ></editor>
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
                loaded : false,
                quest : {},
                type : 0,
	  		}
	  	},
        created:function(){
            this.initData();
        },
	  	methods: {
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            shopedit(e){
                this.quest.answer = e;
            },
            save(){
                var self = this;
                var postdata = {
                    op : 'addhelp',
                    fromajax : 1,
                    id : self.quest.id ? self.quest.id : 0,
                    fwqfwqfvq : self.quest.quest,
                    ryeegefc : self.quest.answer,
                    gwgewvwe : self.quest.number,
                    type : self.type,
                }
                self.$util.http('help','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        
                        self.$Message.error('已保存');
                        self.$router.push('userhelplist');
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var type = params.type ? params.type : 0;
                self.type = type;
                if( id <= 0 ) {
                    self.loaded = true;
                    return false;
                }

                var postdata = {
                    op : 'add',
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('help','post',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loaded = true;
                        self.quest = res.obj.quest;
                        
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