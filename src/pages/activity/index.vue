<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <a v-for="(item,index) in html" :key="index" @click="link" :data-url="item.appurl" class="actblock" :style="{'background-image': 'url(' + item.icon +')','background-color':item.bg}">
            {{item.name}}
        </a>
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
                page : {
                    pdata : {
                        doo : 'activity',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                html : [],
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
            initData(){
                var self = this;
                var params = this.$route.query;
                if( params.id > 0 ){
                    self.page.pdata.userid = params.id;
                }
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.html = res.obj.html;
                    }
                });
            },
	  	}
  	}
</script>

<style type="text/css" scoped>

    .actblock{
        display: inline-block;
        width: 200px;
        height: 100px;
        background: #000;
        color: #fff!important;
        border-radius: 10px;
        font-size: 20px;
        text-align: left;
        padding: 20px;
        font-weight: bold;
        background-size: 60px auto;
        background-repeat: no-repeat;
        background-position: 140px 34px;
        margin: 0 20px 30px 0;
    }
</style>