<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <!-- <Select @on-change="shaixuan($event,'sortid')" placeholder="筛选分类" style="width:150px">
                    <Option v-for="item in allsort" :value="item.value" :label="item.name" :key="item.value" >{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选子分类" @on-change="shaixuan($event,'sorttwo')" style="width:150px">
                    <Option v-for="item in alltwosort" :value="item.value" :label="item.name" :key="item.value">{{ item.name }}</Option>
                </Select> -->
                <Select v-if="settings.jfpay*1 > 0 && settings.gjfmm*1 == 0" placeholder="参与积分抵扣" @on-change="shaixuan($event,'isjifen')" style="width:150px">
                    <Option v-for="item in isjifen" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选类型" @on-change="shaixuan($event,'type')" style="width:150px">
                    <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="排序方式" @on-change="shaixuan($event,'orderby')" style="width:150px">
                    <Option v-for="item in orderby" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input icon="ios-search" v-model="page.pdata.name" @on-enter="search" @on-click="search" placeholder="输入名称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="输入ID" style="width: 150px" />
                <Button type="default" class="ml10" v-if="settings.fontsty == 0 && !settings.hidetestg" @click="addtest">添加测试{{settings.goodbname}}</Button>
                <Button type="primary" class="ml10" @click="link" data-url="/adminaddgoods">添加{{settings.goodbname}}</Button>
                <Button v-if="settings.ispft == 11 && shop.auth && shop.auth.ispft == 1" type="primary" class="ml10" @click="setpft" >设置票付通商品</Button>
            </Col>

        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable" :loading="tableloading">
                    <template slot-scope="{ row }" slot="price">

                            <template v-if="row.type == 0 || row.type == 7 ">
                                <p class="font-note">原价：{{row.oldprice}}</p>
                                <p class="font-note">现价：{{row.price}}</p>
                                <p class="font-note" v-if="settings.isucard == 0">结算价：{{row.userprice}}</p>
                            </template>

                            <template v-if="row.type == 1">
                                <p class="font-note">原价：{{row.oldprice}}</p>
                                <p class="font-note" v-if="settings.isucard == 0">会员价：{{row.price}}</p>
                                <p class="font-note">结算价：{{row.userprice}}</p>
                            </template>

                            <template v-if="row.type == 2">
                                <p class="font-note">成团人数：{{row.groupmem}}</p>
                                <p class="font-note">拼团时间：{{row.grouptime}}小时</p>
                                <p class="font-note">拼团价格：{{row.groupprice}}</p>
                                <p class="font-note" v-if="settings.isucard == 0">结算价格：{{row.userprice}}</p>
                            </template>

                            <template v-if="row.type == 3">
                                <p class="font-note">砍价区间：{{row.cutmin}}-{{row.cutmax}}</p>
                                <p class="font-note">底价：{{row.cutbot}}</p>
                                <p class="font-note" v-if="settings.isucard == 0">会员底格：{{row.cutuserbot}}</p>
                            </template>

                            <template v-if="row.type == 4">
                                <p class="font-note">价格：{{row.price}}</p>
                                <p class="font-note">名额：{{row.stock}}</p>
                            </template>
                            

                            <template v-if="row.type == 5">
                                <p class="font-note">{{row.chouprice}}</p>
                            </template>


                            <template v-if="row.type == 6">
                                <p class="font-note">秒杀价：{{row.price}}</p>
                                <p class="font-note">会员秒杀价：{{row.userprice}}</p>
                            </template>
                            <template v-if="row.type == 8 ">
                                <p class="font-note">原价：{{row.oldprice}}</p>
                                
                            </template>

                            <template v-if="row.type == 9">
                                <p class="font-note">原价：{{row.oldprice}}</p>
                                <p class="font-note">会员价：{{row.price}}</p>
                                <p class="font-note" v-if="settings.isucard == 0">结算价：{{row.userprice}}</p>
                            </template>

                        <p class="font-note" v-if="row.userpricejb > 0">金币价：{{row.userpricejb}}</p>
                        
                        <p class="font-note" v-if="row.groupuserpricejb > 0">拼团金币价：{{row.groupuserpricejb}}</p>
                        
                    </template>
                    <template slot-scope="{ row }" slot="type">
                        <p class="font" v-if="row.type == 0">普通商品</p>
                        <p class="font" v-if="row.type == 1">限抢商品</p>
                        <p class="font" v-if="row.type == 2">拼团商品</p>
                        <p class="font" v-if="row.type == 3">砍价商品</p>
                        <p class="font" v-if="row.type == 4">报名活动</p>
                        <p class="font" v-if="row.type == 5">抽奖活动</p>
                        <p class="font" v-if="row.type == 6">秒杀活动</p>
                        <p class="font" v-if="row.type == 7">套餐商品</p>
                        <p class="font" v-if="row.type == 8">特权商品</p>
                        <p class="font" v-if="row.type == 9">礼包商品</p>
                        <p class="font-error" v-if="row.pttype == 1">票付通商品</p>

                        <Dropdown v-if="row.pttype == 1 && (row.type == 0 || row.type == 1 || row.type == 4)" placement="left" trigger="click" @on-click="changetype">
                            <a href="javascript:void(0)">
                                修改类型
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem :name="'0_'+row.id">普通商品</DropdownItem>
                                <DropdownItem :name="'1_'+row.id">限抢商品</DropdownItem>
                                <DropdownItem :name="'2_'+row.id">拼团商品</DropdownItem>
                                <DropdownItem :name="'3_'+row.id">砍价商品</DropdownItem>
                                <DropdownItem :name="'6_'+row.id">秒杀活动</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                    </template>
                    <template slot-scope="{ row }" slot="num">
                        
                            <p class="font-note" v-if="row.type == 5">名额：{{row.stock}}</p>
                            <template v-else>
                                <p class="font-note">库存：{{row.stock}}</p>
                                <p class="font-note">
                                    销量：{{row.saled}}
                                    <a href="javascript:;" @click="editmoney(row.id,'resetgoodstock')">更新</a>
                                </p>
                                <p class="font-note" v-if="row.givejf > 0">{{mysettings.jfbname}}：{{row.givejf*100/100}}</p>
                            </template>
                            
                            <template v-if="row.shopstatus == 0">
                                <p>正常</p>
                            </template>
                            <p class="font-error" v-if="row.status == 1">已下架</p>
                        
                            <template v-if="row.type == 0 || row.type == 6 || row.type == 7|| row.type == 8 || row.type == 9">
                                
                            </template>
                            <template v-else>
                                <template v-if="row.end < nowtime">

                                    <template v-if="row.type == 5">
                                        <p class="font-error" v-if="row.isopenlott == 1">已开奖</p>
                                        <p class="font-error" v-else-if="row.opentime == 0">已结束</p>
                                    </template>
                                    <template v-else>
                                        <p class="font-error">已结束</p>
                                    </template>
                                </template>
                                <template v-else-if="row.start > nowtime">
                                    <p class="font-error">未开始</p>
                                </template>
                            </template>
                        
                        <p class="font-error" v-if="row.issh == 1">审核中</p>
                        <P v-if="row.sever > 0">服务费 {{row.sever*100/100}}%</P>
                        
                    </template>
                    <template slot-scope="{ row }" slot="thumb">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.thumb" />
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'adminaddgoods?id='+row.id"  >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deletegood')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                            <Poptip
                                v-if="row.status == 0"
                                confirm
                                title="确定将此商品下架吗？"
                                @on-ok="dealthis(row.id,'down')"
                                placement="left">
                                <a>下架</a>
                            </Poptip>
                            <Poptip
                                v-if="row.status == 1"
                                confirm
                                title="确定将此商品上架吗？"
                                @on-ok="dealthis(row.id,'up')"
                                placement="left">
                                <a>上架</a>
                            </Poptip>
                            <a @click="updategoods(row.id)" v-if="row.pttype == 1" >更新</a>
                        </p>
                        
                        <a v-if="mysettings.account && (mysettings.account.type == 4 || mysettings.account.type == 7)" href="javascript:;" :data-copy="'/zofui_sales/pages/good/good?id='+row.id" @click="bindtap($event,'copy')" >复制路径</a>
                        <a v-else href="javascript:;" :data-copy="row.appurl" @click="bindtap($event,'copy')"  >复制路径</a>
                        
                        <Dropdown trigger="hover" transfer>
                            <a href="javascript:void(0)">
                                二维码
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list" class="w200" style="padding:10px;height:auto;text-align:center;">
                                <img class="actimg" :src="row.urlimg" width="150px" height="150px">
                            </DropdownMenu>
                        </Dropdown>

                        <div>
                            <a @click="link" :data-url="'adminpostergoods?gid='+row.id"  >单独设计海报</a>
                            <a v-if="row.fxtype == 1" @click="link" :data-url="'fxgx?gid='+row.id"  >查看{{settings.fxbname}}关系</a>
                            <a v-if="row.isposter == 1" @click="link" :data-url="'adminposter?gid='+row.id"  >查看海报</a>
                        </div>
                        <div>
                            <Poptip
                                confirm
                                title="清空不会产生其他影响，确定清空海报图片吗？"
                                @on-ok="editmoney(row.id,'delposter')"
                                placement="left">
                                <a>清空海报图片</a>
                            </Poptip>
                            <Poptip
                                confirm
                                title="删除后单独设计的海报数据失效，确定删除吗？"
                                @on-ok="editmoney(row.id,'deldesign')"
                                placement="left">
                                <a>删除海报设计</a>
                            </Poptip>
                        </div>

                        <Dropdown  placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                相互关联编号<font v-if="row.bindid">{{row.bindid}}</font>
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="row.bindid" placeholder="" />
                                    <p class="frm_tip">填数字，相同编号的商品会关联在一起展示在详情内</p>
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'setbindid',row.bindid)">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    

                        <div v-if="shop.auth && shop.auth.cancode == 0 && row.pttype == 0">
                            <Dropdown  placement="left" trigger="click">
                                <a href="javascript:void(0)">
                                    {{settings.hxbname}}码模式（{{row.codetype*1 == 0 ? '默认': '剩'+row.codenum+'个码'}}）
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <p class="font-error" >提示：当使用自有核销码后，请导入{{settings.hxbname}}码，<br/>否则没有{{settings.hxbname}}码后不能下单</p>

                                        <div class="mb10">
                                            <Button type="primary" size="small" @click="editmoney(row.id,'usecode',1)">设为使用自有的</Button>
                                        </div>
                                        <div class="mb10">
                                            <Button type="primary" size="small" @click="link" :data-url="'adminincode?gid='+row.id">查看/导入{{settings.hxbname}}码</Button>
                                        </div>
                                        <div class="mb10">
                                            <Button type="primary" size="small" @click="editmoney(row.id,'usecode',0)">设为使用系统默认的</Button>
                                        </div>
                                        
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                <Button @click="handleSelectAll">{{isall ? '取消' : '全选'}}</Button>
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteallgood">删除商品</DropdownItem>
                        <!-- <DropdownItem name="upall">上架商品</DropdownItem> -->
                        <DropdownItem name="downallgood">下架商品</DropdownItem>
                        <DropdownItem v-if="page.pdata.type == 99" name="updatepft">更新数据</DropdownItem>

                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total*1" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

        <Modal v-model="isshowpft" title="票付通" >
            <div class="pd10">
                <Button  type="primary" class="ml10" @click="getpft(1)" >同步票付通商品到本地</Button>
            </div>
            <div class="pd10">
                <Button  type="primary" class="ml10" @click="getpft(2)" >删除所有票付通商品</Button>
            </div>
            <div class="pd10">
                <Button  type="primary" class="ml10" @click="getpft(3)" >更新所有票付通商品</Button>
            </div>
        </Modal>

    </div>
</template>

<script type="text/javascript">
	export default {
	  	components: {
            
	  	},
        props : ['settings','fromtype'],
	  	data : function(){
	  		return {
                loading : false,
                tableloading : true,
	  			params : {},
	  			list : [],
	  			allsort : [],
                mysettings : this.set ? this.set : this.settings,
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:"title"},
                    {title:'图片',key:"thumb",slot: 'thumb',},
                    {title:'价格',key:'price',slot: 'price',},
                    {title:'数量',key:'num',slot: 'num',},
                    {title:'类型',key:'type',slot: 'type'},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                status : [{label:'全部',value:0},{label:'待审核',value:1},{label:'已审核',value:2},],
                isjifen : [{label:'全部',value:0},{label:'参与抵扣',value:1},{label:'未参与',value:2},],
                orderby : [{label:'按最新排序',value:0},{label:'按序号排序',value:1},],
                type : [
                    {label:'普通商品',value:100},
                    {label:'限抢活动',value:1},
                    {label:'拼团商品',value:2},
                    {label:'砍价商品',value:3},
                    {label:'报名活动',value:4},
                    {label:'抽奖活动',value:5},
                    {label:'秒杀活动',value:6},
                    {label:'特权商品',value:8},
                    {label:'礼包商品',value:9},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'good',
                        op : 'all',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        sortid : '',
                        sorttwo : '',
                        status : '',
                        type : '',
                        title : '',
                        gid : '',
                        shopname : '',
                        isjifen:0,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                allsort : [],
                alltwosort : [],
                selected : [],
                money : '',
                shop : {},
                isshowpft : false,
                isall : false,
	  		}
	  	},
        created:function(){
            if( this.fromtype ){
                this.page.pdata.type = this.fromtype;
            }
            this.initData();
            var title = this.settings.goodbname ? this.settings.goodbname : '';
            document.title = title+'管理';
        },
	  	methods: {
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                    gid : id,
                }
                self.$util.http('good','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            setpft(){
                this.isshowpft = !this.isshowpft;
            },
            editmoney(id,type,fee){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                    gid : id,
                    fee : this.money,
                }
                if( type == 'redindedit' ){
                    postdata.sub = this.money;
                }
                
                if( type == 'esever' ){
                    postdata.sever = fee;
                }
                if( type == 'ejifen' ){
                    postdata.fee = fee;
                }

                if( type == 'shopsy' ){
                    postdata.sy = fee;
                }
                if( type == 'usecode' ){
                    postdata.type = fee;
                    postdata.gid = id;
                }
                if( type == 'ptfxper' ){
                    postdata.gid = id;
                    postdata.ptfxper = fee.ptfxper;
                    postdata.uptfxper = fee.uptfxper;
                    postdata.ptfxperp = fee.ptfxperp;
                    postdata.uptfxperp = fee.uptfxperp;
                    postdata.ptfxperpp = fee.ptfxperpp;
                    postdata.uptfxperpp = fee.uptfxperpp;
                }
               if( type == 'setbindid' ){
                    postdata.code = fee;
                    postdata.gid = id;
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        if( type != 'delposter' && type != 'deldesign' ) {
                            self.onLoad();
                            self.money = 0;
                        }
                        
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            dealselect(e){
                var self = this;

                if( this.selected.length <= 0 ){
                    self.$Message.error('还没选择操作的数据');return false;
                }

                var postdata = {
                    p:'admin',
                    op : e,
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('good','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            updategoods(e){
                this.selected = [e];
                this.dealselect('updatepft');
            },
            addtest(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'addtestgoods',
                    fromajax : 1,
                }

                self.$Modal.confirm({
                    title: '提示',
                    content: '确定添加测试商品吗？',
                    onOk: () => {
                        self.$util.http('ajax','GET',postdata,function(res){
                            if( res.status == 200 ){
                                self.$Message.success(res.res);
                                self.onLoad();
                            }else{
                                self.$Message.error(res.res);
                            }
                        },true);
                    },
                });
            },
            selectTable(e,a){
                var arr = [];
                for (var i = 0; i < e.length; i++) {
                    arr.push(e[i].id);
                }
                this.selected = arr;
            },
            getpft(type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'getpft',
                    fromajax : 1,
                    type : type,
                }

                self.$Modal.confirm({
                    title: '提示',
                    content: '确定操作吗？',
                    onOk: () => {
                        self.$util.http('ajax','GET',postdata,function(res){
                            if( res.status == 200 ){
                                self.$Message.success(res.res);
                                self.onLoad();
                            }else{
                                self.$Message.error(res.res);
                            }
                        },true);
                    },
                });
            },
            changetype(e){
                var list = e.split('_');
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'changegtype',
                    fromajax : 1,
                    type : list[0],
                    id : list[1],
                }

                self.$Modal.confirm({
                    title: '提示',
                    content: '拼团商品和砍价商品不能转为其他类型商品，修改后请立即调整商品相应的参数。确定修改吗？',
                    onOk: () => {
                        self.$util.http('ajax','GET',postdata,function(res){
                            if( res.status == 200 ){
                                self.$Message.success(res.res);
                                self.onLoad();
                            }else{
                                self.$Message.error(res.res);
                            }
                        },true);
                    },
                });
            },
            search(){
                this.page.pdata.page = 1;
                this.onLoad();
            },
            shaixuan(e,type){
                this.page.pdata[`${type}`] = e;
                this.page.pdata.page = 1;
                this.onLoad();
            },
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            remove(e){
                var self = this;
                var postdata = {
                    op : 'list',
                    fromajax : 1,
                }
                self.$util.http('goods','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.$Message.error(res.res);
                        for (var i = 0; i < self.list.length; i++) {
                            if(self.list[i].id == e){

                                self.list.splice(i,1);
                                self.list = self.list;

                            }
                        }
                        
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                if( params.id > 0 ){
                    self.page.pdata.gid = params.id;
                }
                if( params.shopid > 0 ){
                    self.page.pdata.shopid = params.shopid;
                }
                if( params.gid > 0 ){
                    self.page.pdata.gid = params.gid;
                }
                if( params.type > 0 ){
                    self.page.pdata.type = params.type;
                }

                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.tableloading = false;
                        self.list = res.obj.list;
                        self.allsort = res.obj.topbar.sorta;
                        self.alltwosort = res.obj.topbar.sortb;
                        self.total = res.obj.total*1;
                        self.shop = res.obj.shop;
                    }

                    if( self.settings.ispft == 11 ){
                        self.type.push({label:'票付通商品',value:99},);
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
                        self.total = res.obj.total;
                        self.isall = false;
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>