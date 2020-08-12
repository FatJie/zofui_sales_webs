<template>
    <div>
        <Modal
            v-model="isshow"
            title="上传图片"
            width="800"
            :footer-hide="true"
            :styles="{top:'10px'}"
            @on-visible-change="showup"
            >

            <div class="head headaaa" >
                <Upload :multiple="true" :show-upload-list="false" accept="image/*" :action="action" :on-success="uploadend">
                    <Button icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
            </div>
            <div class="uploadcompa" >
                <div class="imgitem" :style="{'background-image':'url('+item.url+')'}" v-for="(item,index) in list" :key="index">
                    <div class="name">{{item.filename}}</div>
                    <div class="upload-list-cover">
                        <Icon type="md-add" @click="selectimg(item)" />
                        <Icon type="ios-trash-outline" v-if="item.id" @click="delimg(item.id,index)"></Icon>
                    </div>
                </div>
            </div>
            <div class="footer footeraaa" >
                <Page :total="total*1"  @on-change="changePage" @on-page-size-change="changePagenum" />
            </div>
        </Modal>     
    </div>
</template>

<script type="text/javascript">
	export default {
        props : ['type','sid','uniacid'],
	    data : function(){
            return {
                loaded : false,
                params : {},
                isshow : false,
                action : '',
                page : {
                    pdata : {
                        doo : 'website',
                        op : 'getimg',
                        page : 1,
                        fromajax : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                total : 0,
                pageurl : '',
                list : [],
            }
        },
	    created(){


	    },
        methods : {
            showup(){
                if( this.loaded ) return false;
                this.loaded = true;
                 console.log(this.type)
                if( this.type == 'admin' ){
                console.log(987987987)
                    let site = this.$util.apiUrl_admin({doo:'index'}) . split('index.php');
                    this.action = site[0] + 'index.php?i='+this.uniacid+'&c=utility&a=file&do=upload&type=image';
                    this.page.pdata.p = 'admin';
                }else{
                console.log(123456123456 )
                    let site = this.$util.apiUrl() . split('index.php');
                    this.action = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
                    this.delurl = site[0] + 'index.php?c=platform&a=material&do=delete';
                }

                this.initData();
            },
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            uploadend(e){
                var self = this;
                if( e.attachment ){
                    this.list.unshift(e);
                    if( this.type == 'admin' ){
                        var postdata = {
                            p:'admin',
                            op : 'addimg',
                            fromajax : 1,
                            sid : this.sid,
                            attachment : e.attachment,
                            name : e.name,
                        }
                        self.$util.http('website','GET',postdata,function(res){});
                    }
                }else{
                    if( e.message && e.message.message == '上传成功！' ){
                        self.page.pdata.page = 1;
                        self.list = [];
                        self.initData();
                    }else{
                        this.$Message.error(e.message);
                    }
                    
                }
            },
            selectimg(e){
                console.log('已选择的图片')
                console.log(e)
                this.$emit('uploadmethod', e);
                this.isshow = false;
                this.$Message.success('已选择图片');
            },
            showbox(){
                this.isshow = true;
            },
            delimg(id,index){
                var self = this;

                self.$Modal.confirm({
                    title: '提示',
                    content: '确定删除吗？',
                    onOk: () => {

                        if( self.type == 'admin' ){
                            var postdata = {
                                p:'admin',
                                op : 'delimg',
                                fromajax : 1,
                                id : id,
                            }
                            self.$util.http('website','GET',postdata,function(res){
                                if( res.status == 200 ){
                                    self.list.splice(index,1);
                                    self.$Message.info('已删除');
                                }
                            });
                        }else{
                            self.$http.post(
                                self.delurl,
                                {material_id:id,type:'image',server:'local',fromajax:1},
                                {emulateJSON : true}
                            ).then(function(res){
                                if( res.body.message.errno == 0 ){
                                    self.list.splice(index,1);
                                    self.$Message.info('已删除');
                                }
                            });
                        }
                    },
                });
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            initData(){
                var self = this;
                self.$util.pageList(this,this.page,function(res){    
                    if( res.status == 200 ){
                        self.list = res.obj.list ? res.obj.list : [];
                        self.total = res.obj.total;
                    }
                })
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
						self.total = res.obj.total;
                    }
                    self.loading = false;
                });
            },
        }
	}
</script>

<style type="text/css">
.headaaa{
    border-bottom:1px solid #eee;
    padding:0 10px 10px 10px;
}
.footeraaa{
    border-top:1px solid #eee;
    padding:10px;
}
.uploadcompa .imgitem{
    position:relative;
    display:inline-block;
    margin:0 10px 10px 0;
    border-radius:5px;
    background-color: #eee;
    background-size: contain;
    width: 110px;
    height:110px;
    text-align: center;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}
.uploadcompa .imgitem .name{
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,0.6);
    color: #fff;
    width:100%;
    padding:5px;
    white-space: nowrap;
}
.uploadcompa{
    padding:10px;
    height:400px;
    overflow-y:auto;
}
.uploadcompa .imgitem:hover .upload-list-cover{
    display:block;
}
.uploadcompa .upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.5);
}
.uploadcompa .upload-list-cover i{
    color: #fff;
    font-size: 25px;
    cursor: pointer;
    margin: 45px 0 0 18px;
}

</style>