<template>
    <Row style="background:#eee;height:100vh;">
        <Col span="5" class="leftbox" >
            <Card :shadow="true" :dis-hover="true" v-if="type =='page'">
                <div>商品活动</div>
                <div style="overflow: hidden;">
                    <draggable class="drop-box1" :value="modules" :options="options" :sort="false"  >
                    <span class="mbitem" v-for="(item,index) in modules" :key="index" v-if="item.gtype == 'g'" @click="addm(item)">
                        <Card class="cupitem"  >
                            <Icon :type="item.icon" style="font-size:0.5rem"  />
                            <div >{{item.title}}</div>
                        </Card>
                    </span>
                    </draggable>
                </div>
            </Card>
            <Card class="mt20" :shadow="true" :dis-hover="true">
                <div>其他组件</div>
                <div style="overflow: hidden;">
                    <draggable class="drop-box1"  :value="modules" :options="options" :sort="false"  >
                    <span class="mbitem" v-for="(item,index) in modules" :key="index" v-if="item.gtype != 'g'" @click="addm(item)">
                        <Card class="cupitem" >
                            <Icon :type="item.icon" style="font-size:0.5rem"   />
                            <div >{{item.title}}</div>
                        </Card>
                    </span>
                    </draggable>
                </div>
            </Card>
        </Col>
        <Col span="12" >
            <Row>
                <Col span="6">
                    &nbsp;
                </Col>
                <Col span="12">
                    <Card class="viewbox" style="margin-top:10px;position:relative;">
                        <div style="overflow-y:scroll;height:45vw;padding-bottom:100px;">
                            <draggable class="drop-box2" v-model="items" :options="options" @add="log" >
                                <div v-for="(item, index) in items" class="showitem" :class="{'article_view_selected':actitem == item.id && item.name != 'fix' && item.name != 'sub'}" @click="actitemfn(item.id,item.name)" @mouseover="moveactfn(item.id)" @mouseleave="moveactfn('0')" :style="{position:item.name == 'fix' || item.name == 'sub' ? 'unset' : 'relative'}">
                                    
                                    <dsearch v-if="item.name == 'search'" :item="item"></dsearch>
                                    <dimage v-if="item.name == 'image'" :item="item"></dimage>
                                    <dgoods v-if="item.viewtemp == 'goods'" :item="item"></dgoods>
                                    <dnav v-if="item.name == 'nav'" :item="item"></dnav>
                                    <dtitle v-if="item.name == 'title'" :item="item"></dtitle>
                                    <ddownget v-if="item.name == 'downget'" :item="item"></ddownget>
                                    <dslide v-if="item.name == 'slide'" :item="item"></dslide>
                                    <dspace v-if="item.name == 'space'" :item="item"></dspace>
                                    <dshop v-if="item.name == 'shop'" :item="item"></dshop>
                                    <!-- <dsub v-if="item.name == 'sub'" :item="item"></dsub> -->
                                    <dmodal v-if="item.name == 'modal'" :item="item"></dmodal>
                                    <dvideo v-if="item.name == 'video'" :item="item"></dvideo>
                                    <dgwtc v-if="item.name == 'gwtc'" :item="item"></dgwtc>
                                    <dkill v-if="item.name == 'kill'" :item="item"></dkill>
                                    <dquest v-if="item.name == 'quest'" :item="item"></dquest>
                                    <dform v-if="item.name == 'form'" :item="item"></dform>
                                    <dshoprank v-if="item.name == 'shoprank'" :item="item"></dshoprank>

                                    <duserhead v-if="item.name == 'userhead'" :item="item"></duserhead>
                                    <dusercard v-if="item.name == 'usercard'" :item="item"></dusercard>
                                    <duserorder v-if="item.name == 'userorder'" :item="item"></duserorder>
                                    <duserlist v-if="item.name == 'userlist'" :item="item"></duserlist>
                                    <duserfx v-if="item.name == 'userfx'" :item="item"></duserfx>

                                    <div class="del_modules" v-if="moveact == item.id && item.name != 'fix' && item.name != 'sub'" @click="delitem(index)" >删除</div>
                                    <div :class="{'article_view_selected':actitem == item.id}" style="position:absolute;" v-if="item.name == 'fix'" class="app-fix-box" :style="{'background':item.params.mbg,'padding':item.params.padding+'px','top':item.params.top+'%','right':'calc('+item.params.right+'% + 16px)','width':320*item.params.width/100+'px','border-radius':item.params.radius+'px'}">
                                        <dfix :item="item"></dfix>
                                        <div class="del_modules" v-if="moveact == item.id" @click="delitem(index)">删除</div>
                                    </div>
                                    <div :class="{'article_view_selected':actitem == item.id}" style="width: 100%;top: 0;" :style="{'position':item.params.showtype == 0 ? 'relative' : 'absolute'}" v-if="item.name == 'sub'" >
                                        <dsub :item="item"></dsub>
                                        <div class="del_modules" v-if="moveact == item.id" @click="delitem(index)">删除</div>
                                    </div>
                                </div>
                            </draggable>
                        </div>

                        <div v-if="op == 'designindex'"   @click="actitemfn('bar','bar')" >

                            <draggable class="nav_list item_cell_box fixbgimg " :class="{'actbar' : actitem == 'bar'}"  v-model="bar.data"  @add="log" :style="{'background-image':'url('+bar.bgimg+')','background-color':bar.bgcolor,'padding-top':bar.paddingtop + 'px','padding-bottom':bar.paddingbot + 'px','border-top':'1px solid '+bar.bjcolor}">
                                <div v-for="item in bar.data" class="item_cell_flex nav_list_item">
                                    <div class="nav_list_img" :style="{'padding-bottom':bar.padfont+'px'}">
                                        <img :style="{'width':bar.iconwidth+'px','height':bar.iconwidth+'px'}" :src="item.img" >
                                    </div>
                                    <div class="nav_list_name" :style="{'color':bar.color,'font-size':bar.fontsize+'px'}">{{item.name}}</div>
                                </div>
                            </draggable>

                        </div>

                        <div  style="position:absolute;right:-90px;bottom:0;z-index:51;">
                            <div class="mt20">
                                <Button type="primary" @click="save">保存数据</Button>
                            </div>
                            <template v-if="type == 'page'">
                                <div class="mt20" v-if="op == 'designindex'">
                                    <Button type="success" @click="reset('page')">还原首页</Button>
                                </div>
                                <div class="mt20" v-if="op == 'designindex'">
                                    <Button type="success" @click="reset('bar')">重置导航</Button>
                                </div>
                            </template>
                            <div class="mt20">
                                <Button type="warning" @click="back">返回上页</Button>
                            </div>
                        </div>

                    </Card>
                </Col>
                <Col span="6">
                    &nbsp;
                </Col>
            </Row>
        </Col>
        <Col span="7" style="height:100%;">
            <Card style="height:100%;background:#fff;overflow-y:scroll;">
                <div v-for="(item, index) in items" >
                    
                    <esearch v-if="item.name == 'search' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota"></esearch>
                    <eimage v-if="item.name == 'image' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></eimage>
                    <egoods v-if="item.viewtemp == 'goods' && actitem == item.id" :item="item" :sort="goodsort" :alltagdata="alltag" :clickEvents="clickEvents"  @showgoodsfn="showgoodsfn" :siteroot="siteroota"></egoods>
                    <enav v-if="item.name == 'nav' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></enav>
                    <etitle v-if="item.name == 'title' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></etitle>
                    <edownget v-if="item.name == 'downget' && actitem == item.id" :item="item" :sort="goodsort" :clickEvents="clickEvents" :siteroot="siteroota"></edownget>
                    <eslide v-if="item.name == 'slide' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></eslide>
                    <espace v-if="item.name == 'space' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" ></espace>
                    <eshop v-if="item.name == 'shop' && actitem == item.id" :item="item" :clickEvents="clickEvents" :shopsort="linkss.shopsort" :siteroot="siteroota" @showgoodsfn="showgoodsfn" @showlinksfn="showlinksfn"></eshop>
                    <esub v-if="item.name == 'sub' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></esub>
                    <emodal v-if="item.name == 'modal' && actitem == item.id" :item="item" @showgoodsfn="showgoodsfn" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></emodal>
                    <evideo v-if="item.name == 'video' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></evideo>
                    <div v-if="item.name == 'gwtc' && actitem == item.id" :item="item" :clickEvents="clickEvents">不需要装修，数组自动展示</div>
                    <ekill v-if="item.name == 'kill' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></ekill>
                    <efix v-if="item.name == 'fix' && actitem == item.id" :item="item" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></efix>
                    <equest v-if="item.name == 'quest' && actitem == item.id" :item="item" :questsort="questsort" :clickEvents="clickEvents" :siteroot="siteroota" @showlinksfn="showlinksfn"></equest>

                    <euserhead v-if="item.name == 'userhead' && actitem == item.id" :item="item"></euserhead>
                    <eusercard v-if="item.name == 'usercard' && actitem == item.id" :item="item"></eusercard>
                    <euserorder v-if="item.name == 'userorder' && actitem == item.id" :item="item"></euserorder>
                    <euserlist :clickEvents="clickEvents" @showlinksfn="showlinksfn" v-if="item.name == 'userlist' && actitem == item.id" :item="item"></euserlist>
                    <euserfx v-if="item.name == 'userfx' && actitem == item.id" :item="item"></euserfx>

                    <eform v-if="item.name == 'form' && actitem == item.id"></eform>
                </div>
                <ebar v-if="actitem == 'bar'" :item="bar" :clickEvents="clickEvents" :siteroot="siteroota" @showgoodsfn="showgoodsfn" @showlinksfn="showlinksfn"></ebar>
            </Card>
        </Col>

        <Modal v-model="showgoods" title="选择数据" :styles="{top:0}">
            <template v-if="showgoodstype == 'goods'">
                <div>
                    <Button shape="circle" size="small" :type="showgoodtype == -1 ? 'primary':'default'" @click="showgoodtype = -1">全部</Button>
                    <Button shape="circle" size="small" :type="showgoodtype == 0 ? 'primary':'default'" @click="showgoodtype = 0">普通</Button>
                    <Button shape="circle" size="small" :type="showgoodtype == 1 ? 'primary':'default'" @click="showgoodtype = 1">限抢</Button>
                    <Button shape="circle" size="small" :type="showgoodtype == 2 ? 'primary':'default'" @click="showgoodtype = 2">拼团</Button>
                    <Button shape="circle" size="small" :type="showgoodtype == 3 ? 'primary':'default'" @click="showgoodtype = 3">砍价</Button>
                    <Button shape="circle" size="small" :type="showgoodtype == 4 ? 'primary':'default'" @click="showgoodtype = 4">报名</Button>
                    <Button shape="circle" size="small" :type="showgoodtype == 5 ? 'primary':'default'" @click="showgoodtype = 5">秒杀</Button>
                    <Button shape="circle" size="small" :type="showgoodtype == 6 ? 'primary':'default'" @click="showgoodtype = 6">抽奖</Button>
                    <Button shape="circle" size="small" :type="showgoodtype == 7 ? 'primary':'default'" @click="showgoodtype = 7">套餐</Button>
                </div>
                <div class="mt10">
                    <Input class="w300" search enter-button="搜索" placeholder="输入商品id" @on-search="seachg" />
                </div>
                <Row v-for="inn in linkss.goods" v-if="(sgid <= 0 && (showgoodtype < 0 || (showgoodtype >= 0 && inn.type == showgoodtype))) || (sgid > 0 && inn.id == sgid) " class="mt10" style="border-bottom:1px solid #eee;">
                    <Col span="4" class="frm_title">
                        <Avatar shape="square" icon="ios-person" :src="inn.thumb" size="large" />
                    </Col>
                    <Col span="14" class="frm_content">
                        <div>{{inn.title}}</div>
                        <div>￥{{inn.price}}</div>
                    </Col>
                    <Col span="4" offset="2" class="frm_title">
                        <Button shape="circle" size="small" @click="selectg(inn)">选择</Button>
                    </Col>
                </Row>
            </template>
            <template v-if="showgoodstype == 'jizi'">
                <Row v-for="inn in linkss.alljizi" type="flex" align="middle" class="mt10" style="border-bottom:1px solid #eee;">
                    <Col span="18" class="frm_content">
                        <div>{{inn.title}}</div>
                    </Col>
                    <Col span="4" offset="2" class="frm_title">
                        <Button shape="circle" size="small" @click="selectg(inn)">选择</Button>
                    </Col>
                </Row>
            </template>
            <template v-if="showgoodstype == 'shop'">
                <Row v-for="inn in linkss.allshop" type="flex" align="middle" class="mt10" style="border-bottom:1px solid #eee;">
                    <Col span="18" class="frm_content">
                        <div>{{inn.name}}</div>
                    </Col>
                    <Col span="4" offset="2" class="frm_title">
                        <Button shape="circle" size="small" @click="selectg(inn)">选择</Button>
                    </Col>
                </Row>
            </template>
        </Modal>

        <Modal v-model="isshowlink" title="选择" :styles="{top:0}" width="500" :scrollable="true">
            <Row  type="flex" >
                <Col span="4" class="frm_content">
                    <ButtonGroup vertical>
                        <Button v-for="item in urlarr" :type="linkkey == item.key ? 'primary':'default'" @click="linkkey = item.key">{{item.name}}</Button>
                    </ButtonGroup>
                </Col>
                <Col span="19" offset="1" class="frm_title" style="height:500px;overflow-y:auto;">
                    
                    <template v-for="item in urlarr" v-if="linkkey == item.key">
                        <div class="mt10" v-if="item.key == 'goods'">
                            <Input search enter-button="搜索" placeholder="输入商品id" @on-search="seachg" />
                        </div>
                        <Row  v-for="inn in item.data" v-if="item.key != 'goods' || sgid*1 <= 0 || ( sgid*1 > 0 && item.key == 'goods' && inn.id == sgid )" class="mt10" style="border-bottom:1px solid #eee;">
                            <Col span="4" class="">
                                {{inn.id}}
                            </Col>
                            <Col span="17" class="">
                                {{inn.title ? inn.title : inn.name}}
                            </Col>
                            <Col span="2" class="">
                                <Button shape="circle" size="small" @click="selectlink(inn)">选择</Button>
                            </Col>
                        </Row>
                    </template>

                </Col>
            </Row>
        </Modal>

    </Row>
</template>

<script type="text/javascript">
    import draggable from 'vuedraggable'
    import dsearch from '../../components/design/dsearch';
    import dimage from '../../components/design/dimage';
    import dgoods from '../../components/design/dgoods';
    import dnav from '../../components/design/dnav';
    import dtitle from '../../components/design/dtitle';
    import ddownget from '../../components/design/ddownget';
    import dslide from '../../components/design/dslide';
    import dspace from '../../components/design/dspace';
    import dshop from '../../components/design/dshop';
    import dsub from '../../components/design/dsub';
    import dmodal from '../../components/design/dmodal';
    import dvideo from '../../components/design/dvideo';
    import dgwtc from '../../components/design/dgwtc';
    import dkill from '../../components/design/dkill';
    import dfix from '../../components/design/dfix';
    import dquest from '../../components/design/dquest';
    import dform from '../../components/design/dform';
    import dshoprank from '../../components/design/dshoprank';

    import duserfx from '../../components/design/duserfx';
    import duserlist from '../../components/design/duserlist';
    import duserorder from '../../components/design/duserorder';
    import dusercard from '../../components/design/dusercard';
    import duserhead from '../../components/design/duserhead';

    import esearch from '../../components/design/esearch';
    import eimage from '../../components/design/eimage';
    import egoods from '../../components/design/egoods';
    import edownget from '../../components/design/edownget';
    import emodal from '../../components/design/emodal';
    import evideo from '../../components/design/evideo';
    import enav from '../../components/design/enav';
    import etitle from '../../components/design/etitle';
    import eslide from '../../components/design/eslide';
    import espace from '../../components/design/espace';
    import esub from '../../components/design/esub';
    import eshop from '../../components/design/eshop';
    import ekill from '../../components/design/ekill';
    import efix from '../../components/design/efix';
    import ebar from '../../components/design/ebar';
    import equest from '../../components/design/equest';
    import eform from '../../components/design/eform';

    import euserfx from '../../components/design/euserfx';
    import euserlist from '../../components/design/euserlist';
    import euserorder from '../../components/design/euserorder';
    import eusercard from '../../components/design/eusercard';
    import euserhead from '../../components/design/euserhead';

    export default {
        components: {
            draggable,dsearch,dimage,dgoods,dnav,dtitle,ddownget,dslide,dspace,dshop,dsub,
            dmodal,dvideo,dgwtc,dkill,dfix,dquest,dform,dshoprank,
            esearch,eimage,egoods,edownget,emodal,evideo,enav,etitle,eslide,espace,esub,eshop,ekill,efix,ebar,equest,eform,
            duserfx,duserlist,duserorder,dusercard,duserhead,
            euserfx,euserlist,euserorder,eusercard,euserhead,
        },
        props : {'settings':{default:{}},type:{default:'page'}},
        data : function(){
            return {
                modules : [],
                options: { group: 'drag_list',ghostClass:'dragClass'},
                items : [],
                bar : {},
                moveact : '',
                actitem : '',
                actname : '',
                etype : 0,
                goodsort : [],
                sorttwo : [],
                goods : [],
                linkss : {},
                clickEvents : [
                    {name:'跳转页面',type:'url'},
                    {name:'其他小程序',type:'other'},
                    {name:'拨打电话',type:'tel'},
                    {name:'客服会话',type:'kefu'},
                    {name:'跳转网页',type:'weburl'},
                ],
                showgoods : false,
                sgid : 0,
                showgoodtype : -1,
                actgoodsitem : '',
                actgoodsitemin : '',
                actgoodstype : '',
                showgoodstype : '',
                siteroota : '',

                isshowlink : false,
                linktype : 'all',
                linkid : '',
                linkinid : '',
                urlarr : [],
                params : {},
                linkkey : 'page',

                pageid : 0,
                op : '',
                questsort : [],
                alltag : [],
            }
        },
        created:function(){
            var host = this.$util.Host();
            this.siteroota = window.location.protocol +'//' + host;

            this.setdata();
            this.initData();
            this.$Notice.warning({
                name : 'page',
                title: '使用说明',
                duration :0, 
                desc: '拖动左侧的元素到中间预览框中即可添加元素组件。点击中间预览框中的元素后，在右边编辑框中可编辑元素样式'
            });
        },
        beforeRouteLeave(to, form, next) {
            this.$Notice.close('page');
            next()
        },
        methods:{
            addm(e){
                var id = 'm'+new Date().getTime();
                var item = JSON.parse(JSON.stringify(e));
                item.id = id;
                
                if( this.actitem ){
                    for (var i = 0; i < this.items.length; i++) {
                        if( this.items[i].id == this.actitem ){
                            this.items.splice(i+1, 0, item);
                        }
                    }
                }else{
                    this.items.push(item);
                }
                this.actitem = id;
                
            },
            moveactfn(e){
                this.moveact = e;
            },
            back(){
                var self = this;
                this.$Modal.confirm({
                    content : '返回前请确保数据已经保存完毕。确定返回上一页吗?',
                    onOk : function(){
                        self.$router.back();
                    }
                });
            },
            save(){
                var self = this;
                var postdata = {
                    op : 'savepage',
                    fromajax : 1,
                    id: this.pageid ? this.pageid : 0 ,
                    data : JSON.stringify(this.items) ,
                    bar : this.op == 'designindex' ? this.bar : '',
                    type : this.type ? this.type : '',
                }

                this.$Modal.confirm({
                    content : '确定保存吗?',
                    onOk : function(){
                        self.$util.http('ajax','POST',postdata,function(res){
                            self.$Message.info(res.res);
                        })
                    }
                });
            },
            reset(e){
                var self = this;
                var postdata = {
                    op : 'resetindex',
                    fromajax : 1,
                    type : e,
                }

                this.$Modal.confirm({
                    content : '重置后现有数据会被删除，确定要重置吗？',
                    onOk : function(){
                        self.$util.http('ajax','GET',postdata,function(res){
                            self.$Message.info('已重置');
                            if( res.status == 200 ){
                                self.initData();
                            }
                        })
                    }
                });
            },
            actitemfn(e,name){
                this.actitem = e;
                this.actname = name;
            },
            log(e){
                var id = 'm'+new Date().getTime();
                var item = JSON.parse(JSON.stringify(this.items[e.newDraggableIndex]));
                item.id = id;
                
                this.$set(this.items,e.newDraggableIndex,item);

                //this.items[e.newDraggableIndex] = item;
                this.actitem = id;
            },
            delitem(e){
                var self = this;
                this.$Modal.confirm({
                    content : '确定删除吗?',
                    onOk : function(){
                        self.items.splice(e,1);
                    }
                });
                
            },
            showgoodsfn(e){
                this.showgoods = true;
                this.actgoodsitem = e.id;
                this.actgoodsitemin = e.inid;
                this.actgoodstype = e.type;
                this.showgoodstype = e.showtype;
                this.showgoodtype = -1;
                if( e.gtype ){
                    if( e.gtype == 'quickgoods') this.showgoodtype = 1;
                    if( e.gtype == 'groupgoods') this.showgoodtype = 2;
                    if( e.gtype == 'cutgoods') this.showgoodtype = 3;
                    if( e.gtype == 'bmgoods') this.showgoodtype = 4;
                    if( e.gtype == 'chougoods') this.showgoodtype = 6;
                }
            },
            showlinksfn(e){
                this.isshowlink = true;
                this.linktype = 'all';
                this.linkid = e.id;
                this.linkinid = e.inid ? e.inid : false;
            },
            seachg(e){
                this.sgid = e;
            },
            selectlink(e){
                if( this.linkid == 'bar' ){
                    for (var j = 0; j < this.bar.data.length; j++) {
                        if( this.bar.data[j].id == this.linkinid ){
                            this.$set(this.bar.data[j],'url',e.url);
                            this.$set(this.bar.data[j],'appurl',e.appurl);
                            this.$set(this.bar.data[j],'urlname',e.title ? e.title : e.name);
                            this.isshowlink = false;
                        }
                    }
                    return false;
                }
                for (var i = 0; i < this.items.length; i++) {
                    if( this.items[i].id == this.linkid ){
                        var item = this.items[i];
                        if( this.linkinid ) {                   
                            for (var j = 0; j < item.params.data.length; j++) {
                                if( item.params.data[j].id == this.linkinid ){

                                    this.$set(item.params.data[j],'url',e.url);
                                    this.$set(item.params.data[j],'appurl',e.appurl);
                                    this.$set(item.params.data[j],'urlname',e.title ? e.title : e.name);
                                    this.isshowlink = false;
                                }
                            }

                        }else{

                            this.$set(item.params,'url',e.url);
                            this.$set(item.params,'appurl',e.appurl);
                            this.$set(item.params,'urlname',e.title ? e.title : e.name);
                            this.isshowlink = false;
                        }
                    }
                }
            },
            selectg(e){
                var self = this;
                for (var i = 0; i < this.items.length; i++) {
                    if( this.items[i].id == this.actgoodsitem ){
                        if( this.actgoodstype == 'modal' ){
                            
                            var item = this.items[i];
                            for (var j = 0; j < item.params.data.length; j++) {
                                if( item.params.data[j].id == this.actgoodsitemin ){
                                    this.items[i].params.data[j].gid = e.id;
                                    this.items[i].params.data[j].title = e.title;
                                    this.showgoods = false;
                                }
                            }

                        }else{
                            var id = 'g'+new Date().getTime();
                            var newgood = JSON.parse(JSON.stringify(e));
                            newgood.id = id;
                            newgood.gid = e.id;
                            if( typeof this.items[i].params.data == 'undefined' ) this.items[i].params.data = [];
                            this.items[i].params.data.push(newgood);
                            self.$Message.success('已选择');
                        }
                    }
                }
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'designindex',
                    fromajax : 1,
                    type : this.type,
                }
                if( params.id > 0 || params.id == -1 ){
                    postdata.op = 'addpage';
                    postdata.id = params.id;
                }
                
                self.$util.http('page','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.items = res.obj.page  ? res.obj.page.params : [];
                        self.pageid = res.obj.page && res.obj.page.id  ? res.obj.page.id : 0;
                        self.op = res.obj.op  ? res.obj.op : '';

                        if( self.items && self.items[0] ){
                            self.actitem = self.items[0].id;
                        }
                        self.bar = res.obj.bar  ? res.obj.bar.data : {};
                        self.params = res.obj.params  ? res.obj.params : {};
                        
                        var goodsort = res.obj.goodsort  ? res.obj.goodsort : [];
                        var goodsortsarr = [];
                        var goodsortsarrtwo = [];
                        if( goodsort.length > 0 ){
                            for (var i = 0; i < goodsort.length; i++) {
                                goodsortsarr.push({
                                    id:goodsort[i].id,
                                    name:goodsort[i].name,
                                    title:goodsort[i].name,
                                    url:'/zofui_sales/sort/index?status='+goodsort[i].id,
                                    appurl:'/sortindex?status='+goodsort[i].id
                                });
                                if( goodsort[i].down ){
                                    for (var j = 0; j < goodsort[i].down.length; j++) {
                                        let item =  goodsort[i].down[j];
                                        goodsortsarrtwo.push({
                                            id:item.id,
                                            name:item.name,
                                            title:item.name,
                                            url:'/zofui_sales/sort/index?sorttwo='+item.id,
                                            appurl:'/sortindex?sorttwo='+item.id
                                        });
                                    }
                                }
                            }
                        }
                        self.goodsort = goodsortsarr;
                        self.sorttwo = goodsortsarrtwo;
                        self.questsort = res.obj.questsort  ? res.obj.questsort : [];
                        self.setlink();

                        var postdata = {
                            op : 'getlink',
                            fromajax : 1,
                        }
                        self.$util.http('ajax','GET',postdata,function(res){
                            if( res.status == 200 ){
                                self.linkss = res.obj  ? res.obj : {};

                                for (var i = 0; i < self.urlarr.length; i++) {
                                    if(self.urlarr[i].key == 'goods'){
                                        self.urlarr[i].data = self.linkss.goods;
                                    }else if(self.urlarr[i].key == 'shop'){
                                        self.urlarr[i].data = self.linkss.allshop;
                                    }else if(self.urlarr[i].key == 'card'){
                                        self.urlarr[i].data = self.linkss.allcard;
                                    }else if(self.urlarr[i].key == 'redbag'){
                                        self.urlarr[i].data = self.linkss.allredbag;
                                    }else if(self.urlarr[i].key == 'shopsort'){
                                        self.urlarr[i].data = self.linkss.shopsort;
                                    }else if(self.urlarr[i].key == 'pages'){
                                        self.urlarr[i].data = self.linkss.pages;
                                    }else if(self.urlarr[i].key == 'jizi'){
                                        self.urlarr[i].data = self.linkss.alljizi;
                                    }else if(self.urlarr[i].key == 'goodssorttwo'){
                                        self.urlarr[i].data = self.sorttwo;
                                    }else if(self.urlarr[i].key == 'tag'){
                                        self.urlarr[i].data = self.linkss.alltag;
                                        self.alltag = self.linkss.alltag;
                                    }

                                }
                            }
                        });

                    }else{
                        self.$Message.error(res.res);
                    }
                });
            },
            setdata(){
                this.modules = [];

                var modules = [
                    {
                        name : 'slide',
                        title : '幻灯片',
                        icon : 'ios-paper-plane-outline',
                        basic : 1,
                        params : {
                            ischange : 0,
                            changetime : 3,
                            paddingv : 0,
                            changelast : 500,
                            imgheight : 50,
                            pointcolor : '#dddddd',
                            actcolor : '#585656',
                            showpoint : 0,
                            data : [
                                {
                                    id : '00000001',
                                    img: this.siteroota+'/addons/zofui_sales/public/images/stemp.png',
                                    type : 'url',
                                }
                            ]
                        }
                    },
                    {
                        name : 'nav',
                        title : '导航',
                        icon : 'ios-log-in',
                        basic : 1,
                        params : {
                            radius : 0,
                            padding : 5,
                            paddingv : 10,
                            imgheight : 18,
                            imgwid : 18,
                            martop : 5,
                            bgcolor : '#ffffff',
                            fontcolor : '#000',
                            data : [
                                {
                                    id : '00000001',
                                    title : '导航名称',
                                    img: this.siteroota+'/addons/zofui_sales/public/images/thank.png',
                                    type : 'url',
                                    url : ''
                                },
                                {
                                    id : '00000002',
                                    title : '导航名称',
                                    img: this.siteroota+'/addons/zofui_sales/public/images/thank.png',
                                    type : 'url',
                                    url : ''
                                },
                                {
                                    id : '00000003',
                                    title : '导航名称',
                                    img: this.siteroota+'/addons/zofui_sales/public/images/thank.png',
                                    type : 'url',
                                    url : ''
                                },
                                {
                                    id : '00000004',
                                    title : '导航名称',
                                    img: this.siteroota+'/addons/zofui_sales/public/images/thank.png',
                                    type : 'url',
                                    url : ''
                                },                                                                  
                            ]
                        }
                    },
                    {
                        name : 'image',
                        title : '图片',
                        icon : 'ios-image-outline',
                        basic : 1,
                        params : {
                            padding : 10,
                            paddingv : 12,
                            pdimg : 100,
                            imgheight : 50,
                            type : 1,
                            istext : 0,
                            fontsize : 14,
                            fontcolor : '#333',
                            bgcolor : '#ffffff',
                            fonttop : 0,
                            pimg : 1,
                            trans : 5,
                            radius : 0,
                            data : [
                                {
                                    id : '00000001',
                                    img : this.siteroota+'/addons/zofui_sales/public/images/stemp.png',
                                    url : '',
                                    title : '',
                                    type : 'url',
                                }
                            ]

                        }
                    },
                    {
                        name : 'space',
                        title : '空白',
                        icon : 'ios-photos-outline',
                        basic : 1,
                        params : {
                            height : '10',
                            bgcolor : '#fff'
                        }
                    },
                    {
                        name : 'title',
                        title : '标题',
                        icon : 'ios-pricetag-outline',
                        basic : 1,
                        params : {
                            content : "标题内容",
                            paddingv : '10',
                            paddingh : '10',
                            bgcolor : '#ffffff',
                            color : '#333',
                            size : 14,
                            pos : 'left',
                            fonticon : 0,
                            fontimg : '',
                            fontwidth : 20,
                            
                            leftbord : 0,
                            bordbg : '#ed414a',
                            type : 'url',
                            url : '',
                            rightfont : '更多',
                            rfontcolor : '#999999',
                        }
                    },
                    {
                        name : 'fix',
                        title : '悬浮',
                        icon : 'ios-radio-button-off',
                        basic : 1,
                        params : {
                            img : this.siteroota+'/addons/zofui_sales/public/images/thank.png',
                            mbg : 'rgba(255, 255, 255, 0)',
                            padding : 0,
                            height : 25,
                            width : 25,
                            type : 'url',
                            top : 40,
                            right : 0,
                        }
                    },
                    {
                        name : 'search',
                        gtype:'g',
                        title : '搜索',
                        icon : 'ios-search',
                        params : {
                            bgcolor : '#fff',
                            incolor : '#ededed',
                            placolor : '#969696',
                            paddingv : 5,
                            paddingh : 5,
                            radius : 20,
                            pla:'请输入搜索内容'
                        }
                    },
                    {
                        name : 'shop',
                        viewtemp : 'shop',
                        edittemp : 'shop',
                        title : '店铺',
                        type : -1,
                        icon : 'ios-archive-outline',
                        params : {
                            bgcolor : '#eeeee',
                            style : 0,
                            paddingv : 5,
                            paddings : 5,
                            ordertype : 0,
                            isprice : 0,
                            showtype : 0,
                            goodnum : 10,
                            data : []
                        }
                    },
                    {
                        name : 'goods',
                        gtype:'g',
                        viewtemp : 'goods',
                        edittemp : 'goods',
                        title : '全部商品',
                        type : 0,
                        icon : 'ios-basket-outline',
                        params : {
                            bgcolor : '#eeeee',
                            style : 1,
                            paddingv : 5,
                            paddings : 5,
                            istitle : 0,
                            titlepos : 'left',
                            ordertype : 0,
                            isprice : 0,
                            showtype : 0,
                            goodnum : 10,
                            data : []
                        }
                    },
                    {
                        name : 'quickgoods',
                        gtype:'g',
                        viewtemp : 'goods',
                        edittemp : 'goods',
                        title : '限购商品',
                        type : 1,
                        icon : 'ios-basket-outline',
                        params : {
                            bgcolor : '#eeeee',
                            style : 1,
                            paddingv : 5,
                            paddings : 5,
                            istitle : 0,
                            titlepos : 'left',
                            ordertype : 0,
                            isprice : 0,
                            showtype : 0,
                            goodnum : 10,
                            data : []
                        }
                    },
                    {
                        name : 'groupgoods',
                        gtype:'g',
                        viewtemp : 'goods',
                        edittemp : 'goods',
                        title : '拼团商品',
                        type : 2,
                        icon : 'ios-people-outline',
                        params : {
                            bgcolor : '#eeeee',
                            style : 1,
                            paddingv : 5,
                            paddings : 5,
                            istitle : 0,
                            titlepos : 'left',
                            ordertype : 0,
                            isprice : 0,
                            showtype : 0,
                            goodnum : 10,
                            data : []
                        }
                    },
                    {
                        name : 'cutgoods',
                        gtype:'g',
                        viewtemp : 'goods',
                        edittemp : 'goods',
                        title : '砍价商品',
                        type : 3,
                        icon : 'ios-pie-outline',
                        params : {
                            bgcolor : '#eeeee',
                            style : 4,
                            paddingv : 5,
                            paddings : 5,
                            istitle : 0,
                            titlepos : 'left',
                            ordertype : 0,
                            isprice : 0,
                            showtype : 0,
                            goodnum : 10,
                            data : []
                        }
                    },
                    {
                        name : 'bmgoods',
                        gtype:'g',
                        viewtemp : 'goods',
                        edittemp : 'goods',
                        type : 4,
                        title : '报名活动',
                        icon : 'ios-basket-outline',
                        params : {
                            bgcolor : '#eeeee',
                            style : 1,
                            paddingv : 5,
                            paddings : 5,
                            istitle : 0,
                            titlepos : 'left',
                            ordertype : 0,
                            isprice : 0,
                            showtype : 0,
                            goodnum : 10,
                            data : []
                        }
                    },
                    {
                        name : 'chougoods',
                        gtype:'g',
                        viewtemp : 'goods',
                        edittemp : 'goods',
                        type : 5,
                        title : '特权商品',
                        icon : 'ios-trophy-outline',
                        params : {
                            bgcolor : '#eeeee',
                            style : 5,
                            paddingv : 5,
                            paddings : 5,
                            istitle : 0,
                            titlepos : 'left',
                            ordertype : 0,
                            isprice : 0,
                            showtype : 0,
                            goodnum : 10,
                            data : []
                        }
                    },
                    {
                        name : 'downget',
                        gtype:'g',
                        title : '自动加载',
                        icon : 'ios-more',
                        params : {
                            bgcolor : '#eeeee',
                            gtype : 1,
                            style : 1,
                            paddingv : 5,
                            ordertype : 0,
                            showtype : 0
                        }
                    },
                    {
                        name : 'kill',
                        gtype:'g',
                        title : '秒杀活动',
                        icon : 'ios-clock-outline',
                        params : {
                            goodnum :10,
                            style : 1,
                            paddingv : 10,
                            ordertype : 2,
                            showtype : 0,
                            leftfont : '',
                        }
                    },
                    
                    {
                        name : 'gwtc',
                        viewtemp : 'gwtc',
                        title : '购物提成',
                        icon : 'ios-card-outline',
                    },
                    {
                        name : 'modal',
                        type:'g',
                        title : '页面弹窗',
                        icon : 'ios-calendar-outline',
                        basic : 1,
                        params : {
                            data : [{style:0,gid:0,title:'',id:1}]
                        }
                    },
                    {
                        name : 'video',
                        title : '播放视频',
                        icon : 'ios-videocam-outline',
                        basic : 1,
                        params : {
                            paddingv : 5,
                            paddingh : 0,
                            url : '',
                            posrer : '',
                            height : 50,
                            bgcolor : '#ffffff',
                        }
                    },
                    {
                        name : 'quest',
                        title : '提问列表',
                        icon : 'ios-list-box-outline',
                        params : {
                            img:'http://img11.360buyimg.com/ddimg/jfs/t1/80063/3/15159/5880/5dc9221cEd305def5/0af55a7c9204a377.png',
                            paddingv : 5,
                            bgcolor : '#eeeee',
                            width:25,
                            height:25,
                            showtype : 0,
                            ordertype : 0,
                            totype : 0,
                            num : 10,
                        }
                    },

                ];

                if( this.settings.subform == 1 ){
                    modules.push({
                        name : 'form',
                        title : '提交表单',
                        icon : 'ios-checkbox-outline',
                        params : {
                            showtype : 0,
                            
                        }
                    });
                    modules.push({
                        name : 'shoprank',
                        title : '商户排名',
                        icon : 'ios-checkbox-outline',
                        params : {}
                    });
                }

                if( this.settings.accounttype == 'wxapp' ){
                    modules.push({
                        name : 'sub',
                        title : '关注公号',
                        icon : 'ios-checkbox-outline',
                        params : {
                            showtype : 0,
                        }
                    });
                }
                
                if( this.type == 'user' ){
                    var newmodule = [];
                    for (var i = 0; i < modules.length; i++) {
                        if( modules[i].basic == 1 ){
                            newmodule.push(modules[i]);
                        }
                    }
                    newmodule.push({
                        name : 'userhead',
                        title : '顶部头像',
                        icon : 'ios-contact-outline',
                        params : {
                            showtype : 0,
                            bg : '#E758B4',
                            color : '#fff',
                            pv : 10,
                            ptop : 20,
                            pbot : 40,
                            bordr : 0,
                            uid : 1,
                            parent : 0,
                            ism : 1,
                            isjf : 1,
                            mtype : 1,
                        }
                    });
                    newmodule.push({
                        name : 'usercard',
                        title : '会员卡组件',
                        icon : 'ios-card',
                        params : {
                            showtype : 0,
                            bg:'#272425',
                            color : '#f1e6c3',
                            top:5,
                            style:0,
                        }
                    });
                    newmodule.push({
                        name : 'userorder',
                        title : '订单中心',
                        icon : 'ios-copy-outline',
                        params : {
                            bindtype : 0,
                            isbind : 0,
                            mv : 10,
                            btext : '绑定手机号，保护账号安全',
                            bindtype : 0,
                            data : [
                                {id:1,name:'待付款',img:'https://img11.360buyimg.com/ddimg/jfs/t1/31313/27/12380/2746/5cb72c40E788d5295/0712d7835e8ca3a7.png'},
                                {id:2,name:'已支付',img:'https://img11.360buyimg.com/ddimg/jfs/t1/37628/32/2952/3519/5cb72c35E5b4efdf1/04788e1f9e544d65.png'},
                                {id:3,name:'待完成',img:'https://img11.360buyimg.com/ddimg/jfs/t1/37103/1/1609/2106/5cb72c45E0a79794c/642f456358179607.png'},
                                {id:4,name:'待评价',img:'https://img11.360buyimg.com/ddimg/jfs/t1/34845/34/3031/1649/5cb72c3bE2927dac5/dfe5b887b421237a.png'},
                            ]
                        }
                    });
                    newmodule.push({
                        name : 'userlist',
                        title : '功能列表',
                        icon : 'ios-list-box-outline',
                        params : {
                            showtype : 0,
                            stl : 0,
                            icon : 0,
                            color : '#666',
                            data : [{id:1,name:'名称',img:'',type:'url',url:'',urlname:''}]
                        }
                    });
                    newmodule.push({
                        name : 'userfx',
                        title : '分销数据',
                        icon : 'ios-contacts-outline',
                        params : {
                            style : 0,
                            mv : 10,
                            color : '#333333',
                            stext : '成为合伙人，立即赚钱',
                            btn : '查看详情',
                            dbtn : '立即提现',
                        }
                    });
                    modules = newmodule;
                }

                this.modules = modules;
            },
            setlink(){
                this.urlarr = [];
                
                var urlarr = [];
                urlarr.push({
                    name : '主要页面',
                    key : 'page',
                    data : [
                        {title:'主页',url:'/zofui_sales/pages/index/index',appurl:'/'},
                        {title:'会员',url:'/zofui_sales/pages/ucard/ucard',appurl:'/ucard'},
                        {title:'好店',url:'/zofui_sales/pages/shop/list',appurl:'/shop'},
                        {title:'好评',url:'/zofui_sales/pages/comment/comment',appurl:'/comment'},
                        {title:'我的',url:'/zofui_sales/pages/user/user',appurl:'/user'},

                         {title:'邀请海报',url:'/zofui_sales/pages/user/poster',appurl:'/poster'},

                        {title:'分类商品列表',url:'/zofui_sales/sort/index',appurl:'/sortindex'},
                        {title:'普通商品列表',url:'/zofui_sales/pages/good/list',appurl:'/goodlist'},
                        {title:'限抢商品列表',url:'/zofui_sales/quick/index',appurl:'/quickindex'},
                        {title:'拼团商品列表',url:'/zofui_sales/group/index',appurl:'/groupindex'},
                        {title:'砍价商品列表',url:'/zofui_sales/cut/list',appurl:'/cutlist'},
                        {title:'报名商品列表',url:'/zofui_sales/act/index',appurl:'/actindex'},
                        {title:'抽奖活动列表',url:'/zofui_sales/lottery/index',appurl:'/lotteryindex'},
                        {title:'秒杀活动列表',url:'/zofui_sales/kill/index',appurl:'/killindex'},
                        {title:'特权商品列表',url:'/zofui_sales/shop/index',appurl:'/speciallist'},
                        {title:'精选商品列表',url:'/zofui_sales/shop/index',appurl:'/finelist'},
                        {title:'礼包商品列表',url:'/zofui_sales/shop/index',appurl:'/memberbag'},
                        {title:'红包列表',url:'/zofui_sales/redbag/list',appurl:'/redbaglist'},
                        {title:'搜索商品',url:'/zofui_sales/sort/search',appurl:'/sortsearch'},
                        {title:'购买会员',url:'/zofui_sales/ucard/buycard',appurl:'/buycard'},
                        {title:'充值余额',url:'/zofui_sales/user/addm',appurl:'/useraddm'},
                        {title:'余额明细',url:'/zofui_sales/user/mymoney',appurl:'/usermymoney'},

                        {title:'订单列表',url:'/zofui_sales/order/orderlist',appurl:'/orderlist'},
                        {title:'我的收藏',url:'/zofui_sales/user/collect',appurl:'/collect'},
                        {title:'减价主页',url:'/zofui_sales/cut/list',appurl:'/cutlist'},
                        {title:'我的减价',url:'/zofui_sales/cut/mylist',appurl:'/cutmylist'},
                        {title:'拼单主页',url:'/zofui_sales/group/index',appurl:'/groupindex'},
                        {title:'我的拼单',url:'/zofui_sales/group/mylist',appurl:'/groupmylist'},
                        {title:'我的红包',url:'/zofui_sales/redbag/mylist',appurl:'/redbagmylist'},
                        {title:'分销店铺主页',url:'/zofui_sales/fenxiao/index',appurl:'/fenxiaoindex'},
                        {title:'分销商品列表',url:'/zofui_sales/fenxiao/goods',appurl:'/fenxiaogoods'},
                        {title:'分销结算中心',url:'/zofui_sales/fenxiao/user',appurl:'/fenxiaouser'},
                        {title:'分销提现中心',url:'/zofui_sales/fenxiao/get_money',appurl:'/fenxiaoget_money'},
                        {title:'核销订单',url:'/zofui_sales/admin/hexiao',appurl:'/adminhexiao'},

                        {title:'积分商城',url:'/zofui_sales/jifen/index',appurl:'/jifenindex'},
                        {title:'积分兑换订单',url:'/zofui_sales/jifen/order',appurl:'/jifenorder'},
                        {title:'积分记录',url:'/zofui_sales/jifen/log',appurl:'/jifenlog'},

                        {title:'签到活动列表',url:'/zofui_sales/sign/index',appurl:'/signindex'},
                        {title:'我的签到活动',url:'/zofui_sales/sign/mysign',appurl:'/signmysign'},

                        {title:this.params.agentname+'中心',url:'/zofui_sales/agent/index',appurl:'/agentindex'},
                        {title:'申请'+this.params.agentname,url:'/zofui_sales/agent/join',appurl:'/agentjoin'},
                        {title:this.params.agentname+'商户列表',url:'/zofui_sales/agent/shoplist',appurl:'/agentshoplist'},
                        {title:this.params.agentname+'分红记录',url:'/zofui_sales/agent/mlog',appurl:'/agentmlog'},

                        {title:'入驻申请',url:'/zofui_sales/shop/join',appurl:'/shopjoin'},
                        {title:'商户登录',url:'/zofui_sales/admin/login',appurl:'/adminlogin'},
                        {title:'商户主页',url:'/zofui_sales/admin/index',appurl:'/adminindex'},

                        {title:'每日抽奖',url:'/zofui_sales/zhuanpan/index',appurl:'/zhuanpan'},
                        {title:'我的优惠券',url:'/zofui_sales/card/mylist',appurl:'/cardmylist'},
                        {title:'领券中心',url:'/zofui_sales/card/list',appurl:'/cardlist'},
                        {title:'文章列表',url:'/zofui_sales/article/artlist',appurl:'/artlist'},
                        {title:'提问中心',url:'/zofui_sales/quest/index',appurl:'/questindex'},
                        {title:'我的问答',url:'/zofui_sales/quest/mylist',appurl:'/questmylist'},
                        
                    ],
                },{
                    name : '商品分类',
                    key : 'goodssort',
                    data : this.goodsort,
                },{
                    name : '子分类',
                    key : 'goodssorttwo',
                    data : this.sorttwo,
                },{
                    name : '商品',
                    key : 'goods',
                    data : [],
                },{
                    name : '店铺',
                    key : 'shop',
                    data : [],
                },{
                    name : '优惠券',
                    key : 'card',
                    data : [],
                },{
                    name : '红包',
                    key : 'redbag',
                    data : [],
                },{
                    name : '商户分类',
                    key : 'shopsort',
                    data : [],
                },{
                    name : '专题页面',
                    key : 'pages',
                    data : [],
                },{
                    name : '商品标签',
                    key : 'tag',
                    data : [],
                });

                if( this.params.iscart == 1 ){
                    urlarr[0].data.push({title:'购物车',url:'/zofui_sales/cart/cart',appurl:'/cart'});
                    urlarr[0].data.push({title:'商品分类',url:'/zofui_sales/sort/sort',appurl:'/sortsort'});
                }
                if( this.params.isjizi == 31 ){
                    urlarr[0].data.push({title:'集字活动',url:'/zofui_sales/jizi/index',appurl:'/jiziindex'});
                    urlarr.push({
                        name : '集字活动',
                        key : 'jizi',
                        data : [],
                    })
                }
                if( this.params.isgkf == 1 ){
                    //$scope.isgkf = 1;
                    urlarr[0].data.push({title:'客服对话列表',url:'/zofui_sales/kefu/list',appurl:'kefulist'});
                    urlarr[0].data.push({title:'官方客服',url:'/zofui_sales/kefu/index?role=user',appurl:'kefuindex?role=user'});
                }
                if( this.params.isvideo == 0 ){
                    urlarr[0].data.push({title:'视频专页',url:'/zofui_sales/vedio/index',appurl:'/vedioindex'});
                    urlarr[0].data.push({title:'视频列表',url:'/zofui_sales/vedio/list',appurl:'/vediolist'});
                }
                this.urlarr = urlarr;
            }
        }
    }
</script>

<style type="text/css" scoped>
body,html{
    overflow: hidden;
}
.cupitem{
    padding:0;
    float: left;
    width:33.3%;
    text-align: center;
    height: 0;
    padding-bottom: 33.3%;
    border-right: 1px solid #DCDCDC;
    border-bottom: 1px solid #DCDCDC;
    cursor: pointer;
}
.cupitem:nth-of-type(3) {
    border-top: 1px solid #DCDCDC;
}
.cupitem:nth-of-type(1) {
    border-top: 1px solid #DCDCDC;
}
.cupitem:nth-of-type(2) {
    border-top: 1px solid #DCDCDC;
}
.cupitem:nth-of-type(3n+1) {
    border-left: 1px solid #DCDCDC;
}
.drop-box1 .cupitem i{
    padding-top: 18%;
}
.drop-box2{
    min-height:200px;
    position: relative;
}
.drop-box2 .dragClass .cupitem{
    border: 1px solid #eee;
    float: initial;
    background: #eee;
    width:100%;
    padding: 0;
    min-height: 60px;
}
.showitem{
    position: relative;
}
.del_modules {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 0px 10px;
    background: rgba(0, 0, 0, 0.47);
    color: #fff;
    font-size: 12px;
    z-index: 50;
    cursor: pointer;
}
.article_view_selected{
    border: 1px dashed #02EC14;
}
.viewbox {
    margin-top: 10px;
    position: relative;
}
.leftbox{
    height:100vh;
    background: #fff;
    padding:10px;
    overflow-y:scroll;
}
.mbitem{
    display: block;
}
</style>