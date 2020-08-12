<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        <posterhead :type="pptype" v-if="dev != 'admin'"></posterhead>

        <div v-if="!loading">
            
            <Row>
                <Col span="10">
                    <Card>
                        <div class="mobile_body" :style="{'background-image':'url('+pbg+')'}" style="background-repeat: no-repeat;background-size: 100% auto;width:320px;height:638px;margin: 0 auto;position: relative;">
                            <template v-for="(item,index) in pitems">
                                <VueDragResize @activated="activated(index,item)" :isActive="actindex == index ? true : false" :w="item.params.width" :h="item.params.height" :minw="20" :minh="5" :x="item.params.left" :y="item.params.top" v-on:resizing="resize" v-on:dragging="dragging">
                                    <img style="width:100%;height:100%;" class="border pointer" :src="item.params.img" v-if="item.name == 'qrcode' || item.name == 'headimg' || item.name == 'thumb' || item.name == 'shopimg' || item.name == 'shopcover' || item.name == 'jizithumb' ">
                                    <div style="width:100%;height:100%;" class="border pointer" v-if="item.name == 'nick' || item.sname == 'gtitle' || item.name == 'shopname' || item.name == 'gtitle' " :style="{color:item.params.color,'font-size':item.params.fontsize+'px'}">{{item.params.txt}}</div>
                                    
                                    <Icon v-if="actindex == index" style="position: absolute;top:-10px;right:1px;color: #fff;font-size: 20px;z-index:11;cursor:pointer;background: #000;border-radius: 50%;" type="ios-trash-outline" @click="delpitem(index)"></Icon>

                                </VueDragResize>
                            </template>
                        </div>
                    </Card>
                </Col>
                <Col span="12" push="2">
                    <Card >
                        <Row class="frm_group">
                            <Col span="4" >
                                页面元素
                            </Col>
                            <Col span="20" >
                                <Button size="small" v-for="(item,index) in pmodules" class="mb10 mr10" style="margin-bottom: 5px;" @click="addm(item)">{{item.title}}</Button>
                            </Col>
                        </Row>
                        <Row class="frm_group">
                            <Col span="4" >
                                背景图片
                            </Col>
                            <Col span="20" >
                                <Button icon="ios-cloud-upload-outline" @click="uploadimg('bg')">选择图片</Button>
                                <p class="frm_tip viewimg" v-if="pbg">
                                    <Avatar shape="square" :src="pbg" size="large" />
                                </p>
                                <p class="frm_tip">提示：背景尺寸640X1008(像素)，用jpg格式的图片，在左边预览框内拖动元素可移动位置，点击图片右下角可缩放和放大图片</p>
                            </Col>
                        </Row>
                        <template v-if="actindex && pitems[actindex] && (pitems[actindex].sname == 'gtitle' || pitems[actindex].name == 'gtitle' || pitems[actindex].name == 'nick'  || pitems[actindex].name == 'price')">
                            <Row class="frm_group">
                                <Col span="4" >
                                    颜色
                                </Col>
                                <Col span="20" >
                                    <ColorPicker v-model="color" @on-active-change="changeColor" />
                                </Col>
                            </Row>
                            <Row class="frm_group">
                                <Col span="4" >
                                    尺寸
                                </Col>
                                <Col span="20" >
                                    <Slider v-model="size"  @on-input="changesize"></Slider>
                                </Col>
                            </Row>
                        </template>
                        <Row class="frm_group">
                            <Col span="4" >
                                &nbsp;
                            </Col>
                            <Col span="20" >
                                <Button type="primary" @click="save">保存预览</Button>

                                <Poptip
                                    confirm
                                    title="确定恢复初始化数据吗？"
                                    @on-ok="del"
                                    placement="left">
                                    <Button >恢复初始数据</Button>
                                </Poptip>
                            </Col>
                        </Row>

                        <Row class="frm_group">
                            <Col span="4" >
                                &nbsp;
                            </Col>
                            <Col span="20" >
                                <img v-if="posterres.status == 200" :src="posterres.res.url" style="width: 200px;">
                                <p v-else class="font-error">{{posterres.res}}</p>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

        </div>
        <upload ref="uploadref" :type="dev" :sid="shopid ? shopid : ''" :uniacid="uniacid ? uniacid : ''" @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import VueDragResize from 'vue-drag-resize'
    import posterhead from './posterhead'
    import upload from '../../components/upload';
	export default {
	  	components: {
            VueDragResize,posterhead,upload
	  	},
        props : ['settings','op','type','gtype','ptype','dev','shopid','uniacid'],
	  	data : function(){
	  		return {
                loading : true,
                pptype : this.ptype ? this.ptype : 'pagegoods0',
                oop : this.op ? this.op : 'goods0',
	  			params : {},
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                prize : {name:'',showtime:[]},
                uploadurl : '',
                pitems : [],
                pbg : '',
                posterres : {},
                inittype : this.type ? this.type : 'goods',
                initgtype : this.gtype ? this.gtype : 0,
                actindex : -1,
                color : '#000000',
                size : 14,
                pmodules : [
                    {
                        id : 0,
                        name:'headimg',
                        title : '粉丝头像',
                        isedit : 0,
                        params:{
                            img : './../addons/zofui_sales/public/images/default_head.jpg',
                            width : 100,
                            height : 100,
                            left:100,
                            top:100
                        },
                    },
                    {
                        id : 1,
                        name: "nick",
                        title: "粉丝昵称",
                        sname : 'gtitle',
                        isedit : 1,
                        params:{
                            txt: '用户昵称',
                            left:100,
                            top:100,
                            color : '#000000',
                            fontsize : 14,
                        },
                    },
                    {
                        id : 3,
                        name:'qrcode',
                        title:'二维码',
                        params:{
                            img : './../addons/zofui_sales/public/images/qrcode.png',
                            width : 100,
                            height : 100,
                            left:100,
                            top:100
                        },
                    },
                ],
                gid : 0,
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
            //this.setModules();
        },
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            delpitem(e){
                this.pitems.splice(e,1);
            },
            activated(e,row){
                this.actindex = e;
                if( row.sname == 'gtitle' ){
                    this.color  = row.params.color;
                    this.size  = row.params.fontsize;
                }
            },
            changeColor(e){
                this.pitems[this.actindex].params.color = e;
            },
            changesize(e){

                this.pitems[this.actindex].params.fontsize = e;
            },
            uploadend(e){
                if( e.attachment ){
                    this.pbg = e.url;
                }else{
                    this.$Message.error(e.message);
                }
            },
            addm(item){

                var newitem = JSON.parse(JSON.stringify(item))
                newitem.id = 'i'+ new Date().getTime();
                this.pitems.push(newitem);
            },
            resize(e){
                this.pitems[this.actindex].params.width = e.width;
                this.pitems[this.actindex].params.height = e.height;
            },
            dragging(e){
                this.pitems[this.actindex].params.left = e.left;
                this.pitems[this.actindex].params.top = e.top;
            },
            addthis(){
                this.shop.params.push({itemt:''});
            },
            delbind(index){
                this.allbind.splice(index,1);
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            searchdate(e){
                this.start = e[0];
                this.end = e[1];
            },
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                var self = this;
                if( self.uptarget == 'bg' ){
                    var image = new Image();
                    image.src = e.url;
                    image.onload =function(){    
                        var width = image.width;
                        if( width != 640 ){
                            self.$Modal.error({
                                title : '提示',
                                content : '图片尺寸宽度不是640像素，请调整图片宽度再上传'
                            });
                        }else{
                            self.pbg = e.url;
                        }
                    }  
                }
            },
            del(){
                var self = this;
                if( self.dev == 'admin' ){
                    var postdata = {
                        p:'admin',
                        gid : self.gid,
                        op : 'initposter',
                        fromajax : 1,
                        type : this.inittype,
                        gtype : this.initgtype
                    }
                }else{
                    var postdata = {
                        op : 'initposter',
                        fromajax : 1,
                        type : this.inittype,
                        gtype : this.initgtype
                    }
                }

                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已初始化数据');
                        self.initData('reset');
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            save(e){
                var self = this;

                if( self.dev ){
                    var postdata = {
                        p:'admin',
                        op : 'savapostertemp',
                        fromajax : 1,
                        data : JSON.stringify(this.pitems),
                        bgimg : this.pbg,
                        type : this.inittype,
                        gid : this.gid
                    }
                    self.$util.http('ajax','POST',postdata,function(res){
                        if( res.status == 200 ){
                            self.$Message.success('已保存');
                            self.initData('reset');
                        }else{
                            self.$Message.error(res.res);
                        }
                    },true);
                }else{
                    var postdata = {
                        op : 'savapostertemp',
                        fromajax : 1,
                        data : JSON.stringify(this.pitems),
                        bgimg : this.pbg,
                        type : this.inittype,
                        gtype : this.initgtype
                    }
                    self.$util.http('ajax','POST',postdata,function(res){
                        if( res.status == 200 ){
                            self.$Message.success('已保存');
                            self.initData('reset');
                        }else{
                            self.$Message.error(res.res);
                        }
                    },true);
                }

            },
            initData(type){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                if( params.gid ){
                    id = params.gid;
                    self.gid = id;
                }
                var postdata = {
                    op : this.op ? this.op : 'goods0',
                    fromajax : 1,
                    type : this.gtype ? this.gtype : '0',
                }
                if( self.dev ){
                    postdata.p = self.dev;
                    postdata.op = 'poster';
                    postdata.id = id;

                    self.$util.http('good','GET',postdata,function(res){
                        if( res.status == 200 ){
                            
                            self.pitems = res.obj.pitems ? res.obj.pitems : [];
                            self.pbg = res.obj.pbg;
                            self.posterres = res.obj.posterres;
                            self.loading = false;
                            if( type != 'reset' ) self.setModules();
                        }else{
                            self.$Message.error(res.res);
                        }
                    });

                }else{
                    self.$util.http('page','GET',postdata,function(res){
                        if( res.status == 200 ){
                            
                            self.pitems = res.obj.pitems ? res.obj.pitems : [];
                            self.pbg = res.obj.pbg;
                            self.posterres = res.obj.posterres;
                            self.loading = false;
                            if( type != 'reset' ) self.setModules();
                        }else{
                            self.$Message.error(res.res);
                        }
                    });
                }



            },
	  		setModules() {
	  			var self = this;
                //self.pmodules = [];
                
                var goodstitle =  {
                    id : 4,
                    name: "gtitle",
                    sname : 'gtitle',
                    title: "商品标题",
                    isedit : 1,
                    params:{
                        txt: '商品标题',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var goodsthumb =  {
                    id : 4,
                    name: "thumb",
                    title: "商品封面图",
                    isedit : 1,
                    params:{
                        img : './../addons/zofui_sales/public/images/goods.jpg',
                        width : 100,
                        height : 100,
                        left:100,
                        top:100
                    },
                };
                var goodsold =  {
                    id : 4,
                    name: "oldprice",
                    sname : 'gtitle',
                    title: "商品原价",
                    isedit : 1,
                    params:{
                        txt: '原价',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var goodsprice =  {
                    id : 4,
                    name: "price",
                    sname : 'gtitle',
                    title: "商品现价",
                    isedit : 1,
                    params:{
                        txt: '现价',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var goodsbot =  {
                    id : 4,
                    name: "botprice",
                    sname : 'gtitle',
                    title: "砍价底价",
                    isedit : 1,
                    params:{
                        txt: '底价',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var goodsgroup =  {
                    id : 4,
                    name: "group",
                    sname : 'gtitle',
                    title: "拼团人数",
                    isedit : 1,
                    params:{
                        txt: '团人数',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var groupprice =  {
                    id : 4,
                    name: "groupprice",
                    sname : 'gtitle',
                    title: "拼团价格",
                    isedit : 1,
                    params:{
                        txt: '拼团价格',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var saled =  {
                    id : 4,
                    name: "saled",
                    sname : 'gtitle',
                    title: "已售数量",
                    isedit : 1,
                    params:{
                        txt: '已售数量',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var sacaned =  {
                    id : 4,
                    name: "sacaned",
                    sname : 'gtitle',
                    title: "浏览量",
                    isedit : 1,
                    params:{
                        txt: '浏览量',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                
                if( this.inittype == 'goods' ){
                    this.pmodules.push(goodstitle);
                    this.pmodules.push(goodsthumb);
                    this.pmodules.push(goodsold);
                    this.pmodules.push(goodsprice);
                    this.pmodules.push(saled);
                    this.pmodules.push(sacaned);

                    if( this.gtype == 2 ){
                        this.pmodules.push(goodsgroup);
                        this.pmodules.push(groupprice);
                    }
                    if( this.gtype == 3 ){
                        this.pmodules.push(goodsbot);
                    }
                }

                if( this.inittype == 'shop' ){
                    this.pmodules = [
                        {
                            id : 0,
                            name:'shopimg',
                            title : '店铺头像',
                            isedit : 0,
                            params:{
                                img : './../addons/zofui_sales/public/images/default_head.jpg',
                                width : 100,
                                height : 100,
                                left:100,
                                top:100
                            },
                        },
                        {
                            id : 0,
                            name:'shopcover',
                            title : '店铺封面',
                            isedit : 0,
                            params:{
                                img : './../addons/zofui_sales/public/images/cover.jpg',
                                width : 300,
                                height : 180,
                                left:0,
                                top:0
                            },
                        },
                        {
                            id : 1,
                            name: "shopname",
                            title: "店铺名称",
                            sname : 'gtitle',
                            isedit : 1,
                            params:{
                                txt: '店铺名称',
                                left:100,
                                top:100,
                                color : '#000000',
                                fontsize : 14,
                            },
                        },
                        {
                            id : 3,
                            name:'qrcode',
                            title:'店铺二维码',
                            params:{
                                img : './../addons/zofui_sales/public/images/qrcode.png',
                                width : 100,
                                height : 100,
                                left:100,
                                top:100
                            },
                        },
                    ];
                }

                var jizititle =  {
                    id : 4,
                    name: "jizititle",
                    title: "活动标题",
                    sname : 'gtitle',
                    isedit : 1,
                    params:{
                        txt: '活动标题',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var jizifee =  {
                    id : 4,
                    name: "jizifee",
                    title: "活动价值",
                    sname : 'gtitle',
                    isedit : 1,
                    params:{
                        txt: '活动价值',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var jizithumb =  {
                    id : 4,
                    name: "jizithumb",
                    sname : 'thumb',
                    title: "活动封面图",
                    isedit : 1,
                    params:{
                        img : './../addons/zofui_sales/public/images/goods.jpg',
                        width : 100,
                        height : 100,
                        left:100,
                        top:100
                    },
                };
                var jizifont =  {
                    id : 4,
                    name: "jizifont",
                    title: "集字文字内容",
                    sname : 'gtitle',
                    isedit : 1,
                    params:{
                        txt: '集字文字内容',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };

                if( this.inittype == 'jizi' ){
                    this.pmodules.push(jizititle);
                    this.pmodules.push(jizifee);
                    this.pmodules.push(jizithumb);
                    this.pmodules.push(jizifont);
                }

                var cardname =  {
                    id : 4,
                    name: "cardname",
                    title: "优惠券名称",
                    sname : 'gtitle',
                    isedit : 1,
                    params:{
                        txt: '优惠券名称',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };
                var cardfee =  {
                    id : 4,
                    name: "cardfee",
                    title: "优惠券面值",
                    sname : 'gtitle',
                    isedit : 1,
                    params:{
                        txt: '活动价值',
                        left:100,
                        top:100,
                        color : '#000000',
                        fontsize : 14,
                    },
                };

                if( this.inittype == 'card' ){
                    this.pmodules.push(cardname);
                    this.pmodules.push(cardfee);
                }
	  		},

	  	}
  	}
</script>

<style type="text/css" scoped>


</style>