<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select @on-change="shaixuan($event,'sortid')" placeholder="筛选分类" style="width:150px">
                    <Option v-for="item in allsort" :value="item.value" :label="item.name" :key="item.value" >{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选子分类" @on-change="shaixuan($event,'sorttwo')" style="width:150px">
                    <Option v-for="item in alltwosort" :value="item.value" :label="item.name" :key="item.value">{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" style="width:150px">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选类型" @on-change="shaixuan($event,'type')" style="width:150px">
                    <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <Select  placeholder="筛选属性" @on-change="shaixuan($event,'types')" style="width:150px">
                    <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
               
                <Input icon="ios-search" v-model="page.pdata.title" @on-enter="search" @on-click="search" placeholder="输入商品名称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="输入商品ID" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.shopname" @on-enter="search" @on-click="search" placeholder="输入商户名称" style="width: 150px" />
                <Input icon="ios-search" v-model="page.pdata.shopid" @on-enter="search" @on-click="search" placeholder="输入商户ID" style="width: 150px" />
                
                <Button class="mt10" type="primary" @click="shaixuan(1,'unset')" v-if="page.pdata.unset == 2 || !page.pdata.unset">回收站</Button>
                <Button class="mt10"  @click="shaixuan(2,'unset')" v-if="page.pdata.unset == 1">返回</Button>

                <Button class="mt10" type="primary" @click="pubgoods" >发布商品</Button>

                <Upload :action="uploadurla" :on-success="uploadend" name="inputfile" :show-upload-list="false" style="display:inline-block;">
                    <Button icon="ios-cloud-upload-outline">导入核销码</Button>
                </Upload>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable" :loading="tableloading">
                    <template slot-scope="{ row }" slot="shop">
                        {{row.shop.name}}（ID：{{row.shop.id}}，【分类：{{row.sortname}}】）
                    </template>
                    <template slot-scope="{ row }" slot="price">

                            <template v-if="row.type == 0 || row.type == 7|| row.type == 8|| row.type == 9">
                                <p class="font-note">原价：{{row.oldprice}}</p>
                                <p class="font-note">会员价：{{row.price}}</p>

                                <p class="font-note">结算价：{{row.userprice}}</p>

                                
                            </template>

                            <template v-if="row.type == 1">
                                <p class="font-note">原价：{{row.oldprice}}</p>
                                <p class="font-note">会员抢购价：{{row.price}}</p>
                                <p class="font-note">结算价：{{row.userprice}}</p>
                            </template>

                            <template v-if="row.type == 2">
                                <p class="font-note">成团人数：{{row.groupmem}}</p>
                                <p class="font-note">拼团时间：{{row.grouptime}}小时</p>
                                <p class="font-note">拼团价格：{{row.groupprice}}</p>
                                <p class="font-note">结算价格：{{row.userprice}}</p>
                            </template>

                            <template v-if="row.type == 3">
                                <p class="font-note">砍价区间：{{row.cutmin}}-{{row.cutmax}}</p>
                                <p class="font-note">底价：{{row.cutbot}}</p>
                                <p class="font-note">会员底格：{{row.cutuserbot}}</p>
                            </template>

                            <template v-if="row.type == 4">
                                <p class="font-note">价格：{{row.oldprice}}</p>
                                <p class="font-note">名额：{{row.stock}}</p>
                            </template>
                            

                            <template v-if="row.type == 5">
                                <p class="font-note">{{row.chouprice}}</p>
                            </template>


                            <template v-if="row.type == 6">
                                <p class="font-note">秒杀价：{{row.oldprice}}</p>
                                <p class="font-note">会员秒杀价：{{row.rice}}</p>
                            </template>

                            

                       <!--  <p class="font-note" v-if="row.userpricejb > 0">金币价：{{row.userpricejb}}</p>
                        
                        <p class="font-note" v-if="row.groupuserpricejb > 0">拼团金币价：{{row.groupuserpricejb}}</p>
                        
                        <p class="font-note" v-if="row.shopsy > 0">商户收益：{{row.shopsy}}</p>
                        <p class="font-note" v-if="row.shopsy <= 0">商户收益：0</p>  -->
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
                        <p class="font" v-if="row.type == 8">特权商品
                            <font v-if="row.receive == 1">(vip)</font>
                             <font v-if="row.receive == 2">(服务商)</font>
                              <font v-if="row.receive == 3">(代理商)</font>
                        </p>
                         <p class="font" v-if="row.type == 9">礼包商品</p>
                        <p class="font-error" v-if="row.pttype == 1">票付通商品</p>
                        <div>
                            <Dropdown trigger="click" placement="left" stop-propagation>
                                <Button  size="small">标签</Button>
                                <DropdownMenu slot="list">
                                    <div class="pd10">
                                        <Select placement="bottom" v-model="row.thistag" multiple class="w300">
                                            <Option v-for="item in alltag" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </div>
                                    <div class="pd10 tr">
                                        <Button size="small" type="primary" @click="editmoney(row.id,'settag',row.thistag)">提交</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </template>
                    <template slot-scope="{ row }" slot="num">
                        
                            <p class="font-note" v-if="row.type == 5">名额：{{row.stock}}</p>
                            <template v-else>
                                <p class="font-note">库存：{{row.stock}}</p>
                                <div class="font-note">
                                	销量：{{row.saled}}
                                	<!-- <a href="javascript:;" @click="editmoney(row.id,'resetgoodstock')">更新</a> -->
                                </div>
                                <p class="font-note" v-if="row.type==9">会员时长：{{row.cardend}}</p>
                                <p class="font-note" v-if="row.givejf > 0">{{mysettings.jfbname}}：{{row.givejf*100/100}}</p>
                            </template>
                            
                            <p class="font-error" v-if="row.shopstatus == 1">商户到期下架</p>
                            <p class="font-error" v-if="row.status == 1">已下架</p>
                        
                            <template v-if="row.type == 0 || row.type == 6 || row.type == 7 || row.type == 8|| row.type == 9">
                                
                            </template>
                            <template v-else>
                                <template v-if="row.end < nowtime">

                                    <template v-if="row.type == 5">
                                        <p class="font-error" v-if="row.isopenlott == 1">已开奖</p>
                                        <p class="font-error" v-else>已结束</p>
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
                        <p class="font-error" v-if="row.unset == 1">已删除</p>
                        <P v-if="row.sever > 0">服务费 {{row.sever*100/100}}%</P>
                        
                    </template>
                    <template slot-scope="{ row }" slot="thumb">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.thumb" />
                    </template>
                    <template slot-scope="{ row }" slot="profits">
                        <p class="font-note">{{row.profits}}%</p>
                    </template>


                    <!-- 属性操作 -->
                    <template slot-scope="{ row, index }" slot="types"  >
                        <template v-if="page.pdata.unset != 1">
                            <div class="a_border"  @click="edittype('jingxuan',row.id,row.isjingxuan)">
                                <font v-if="row.isjingxuan == 1" style = " color:red">精品上架</font>
                                <font v-if="row.isjingxuan == 0"  >精品下架</font>
                            </div>
                            <div class="a_border" @click="edittype('is_show',row.id,row.is_show)"> 
                                <font v-if="row.is_show == 1" style = " color:red">首页显示</font>
                                <font v-if="row.is_show == 0"  >首页隐藏</font>
                            </div>

                            <div class="a_border"  @click="edittype('is_tuijian',row.id,row.is_tuijian)"> 
                                <font v-if="row.is_tuijian == 1" style = " color:red">列表推荐</font>
                                <font v-if="row.is_tuijian == 0"  >列表隐藏</font>
                            </div>

                            <div class="a_border"  @click="edittype('is_zhiding',row.id,row.is_zhiding)"> 
                                <font v-if="row.is_zhiding == 1" style = " color:red">置顶</font>
                                <font v-if="row.is_zhiding == 0"  >不置顶</font>
                            </div>

                            <div class="a_border"  v-if="row.type==8"   @click="edittype('huiyuan_tuijian',row.id,row.huiyuan_tuijian )"> 
                                <font v-if="row.huiyuan_tuijian == 1" style = " color:red">会员推荐</font>
                                <font v-if="row.huiyuan_tuijian == 0"  >会员隐藏</font>
                            </div>

                            <div class="a_border"  v-if="row.type==8 || row.type==0 || row.type==1"   @click="edittype('is_tuoke',row.id,row.is_tuoke )"> 
                                <font v-if="row.is_tuoke == 1" style = " color:red">拓客展示1</font>
                                <font v-if="row.is_tuoke == 0"  >拓客隐藏1</font>
                            </div>

                            <div class="a_border"  v-if="row.type==8 || row.type==0 || row.type==1"   @click="edittype('is_tuokes',row.id,row.is_tuokes )"> 
                                <font v-if="row.is_tuokes == 1" style = " color:red">拓客展示2</font>
                                <font v-if="row.is_tuokes == 0"  >拓客隐藏2</font>
                            </div>

                        </template>

                    </template>
                    <!-- 属性操作 -->


                    <template slot-scope="{ row, index }" slot="action">
                        <p  v-if="row.unset == 1">
                            <Poptip
                                confirm
                                title="确定恢复此条数据吗？"
                                @on-ok="dealthis(row.id,'resetgood')"
                                placement="left">
                                <a class="font-error">恢复商品</a>
                            </Poptip>
                        </p>
                        <template v-if="page.pdata.unset != 1">
                        <p>
                            
                            <a v-if="row.type != 7" @click="link" :data-url="'shoplist?id='+row.shopid"  >查看商户</a>

                            <!-- <a @click="links" :data-url="'adminaddgoods?id='+row.id"  >查看商品</a> -->

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
                                @on-ok="dealthis(row.id,'downgood')"
                                placement="left">
                                <a>下架</a>
                            </Poptip>

                            <Poptip
                                v-if="row.status == 1"
                                confirm
                                title="确定将此商品上架吗？"
                                @on-ok="dealthis(row.id,'upgood')"
                                placement="left">
                                <a>上架</a>
                            </Poptip>
                            <Dropdown  placement="left" trigger="click">
                                <a href="javascript:void(0)">
                                    修改让利比例
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="rangli" placeholder="输入要修改的让利比例" />%
                                        <p class="frm_tip">直接输入数字</p>
                                    </div>
    
                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'rangli')">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
    
                            <Dropdown  placement="left" trigger="click" v-if="row.type==8">
                                <a href="javascript:void(0)">
                                    修改会员价
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="jiesuan" placeholder="输入要修改的会员价" />
                                    </div>
    
                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'jiesuan')">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown  placement="left" trigger="click" v-if="row.type==9">
                                <a href="javascript:void(0)">
                                    修改会员时长
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="memberday" placeholder="输入天数" />
                                    </div>
    
                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="changeday(row.id)">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>

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

                        <div v-if="row.issh == 1">
                            <Poptip
                                confirm
                                title="确定审核通过吗？"
                                @on-ok="dealthis(row.id,'pass')"
                                placement="left">
                                <a>审核通过</a>
                            </Poptip>

                            <Dropdown  placement="left" trigger="click">
                                <a href="javascript:void(0)">
                                    提醒修改
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <div style="padding:10px">
                                        <Input v-model="money" placeholder="输入提醒内容" />
                                        <p class="frm_tip"></p>
                                    </div>

                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="editmoney(row.id,'redindedit')">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>

                        </div>

                        

                        </template>
                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6" v-if="page.pdata.unset != 1">
                <Button @click="handleSelectAll">{{isall ? '取消' : '全选'}}</Button>
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="delall">删除商品</DropdownItem>
                        <DropdownItem name="passall" v-if="op != 'pak'">通过审核</DropdownItem>
                        <DropdownItem name="upall">上架商品</DropdownItem>
                        <DropdownItem name="downall">下架商品</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total*1" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>
    </div>
</template>

<script type="text/javascript">
	export default {
	  	components: {
            
	  	},
        props : ['settings','op','set'],
	  	data : function(){
	  		return {
                memberday:'',
                uploadurla:'',
                loading : false,
                tableloading : true,
                isall : false,
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
                    {title:'商户',key:'shopid',slot: 'shop',width:150},
                    {title:'图片',key:"thumb",slot: 'thumb',width:80},
                    {title:'价格',key:'price',slot: 'price',},
                    {title:'让利比例(%)',key:'profits',slot: 'profits',},
                    {title:'数量',key:'num',slot: 'num',},
                    {title:'类型',key:'type',slot: 'type',width:130},
                    {title:'属性操作',key:'44',slot: 'types',width:150},
                    {title:'操作',key:'33',slot: 'action',width:180},
                ],
                status : [{label:'全部',value:0},{label:'待审核',value:1},{label:'已审核',value:2},],
                isjifen : [{label:'全部',value:0},{label:'参与抵扣',value:1},{label:'未参与',value:2},],
                type : [
                    {label:'普通商品',value:0},
                    {label:'限抢活动',value:1},
                    {label:'拼团商品',value:2},
                    {label:'砍价商品',value:3},
                    {label:'报名活动',value:4},
                    {label:'抽奖活动',value:5},
                    {label:'秒杀活动',value:6},
                    {label:'套餐商品',value:7},
                    {label:'特权商品',value:8},
                    {label:'礼包商品',value:9},
                ],
                types : [
                    {label:'精品上架',value:1},
                    {label:'首页显示',value:2},
                    {label:'列表推荐',value:3},
                    {label:'置顶',value:4},
                    {label:'拓客显示',value:5},
                    {label:'会员推荐',value:6},
                   
                ],
                
                page : {
                    pdata : {
                        doo : 'goods',
                        op : this.op ? this.op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        sortid : '',
                        sorttwo : '',
                        status : '',
                        type : '',
                        types : '',
                        title : '',
                        gid : '',
                        shopname : '',
                        shopid : '',
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
                alltag : [],
                rangli:'',
                jiesuan:''
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.Murl('verifycode','import') + '&fromajax=1';
            this.uploadurla = site;
        },
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            uploadend(e){
                if( e.status == 200 ){
                    this.$Message.success(e.res);
                    this.initData();
                }else{
                    this.$Message.error(e.res);
                }
            },
            handleSelectAll(e){
                this.isall = !this.isall;
                this.$refs.selection.selectAll(this.isall);
            },
            changeday(id){
                var self = this;
                var postdata = {
                    op:'changeday',
                    fromajax : 1,
                    id : id,
                    memberday:self.memberday
                }
                self.$util.http('goods','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                    gid : id,
                }
                self.$util.http('goods','GET',postdata,function(res){
                console.log(res);
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            edittype(type,id,status){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                    gid : id,
                    status : status,
                }
                
                 self.$util.http('goods','GET',postdata,function(res){
                     if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            editmoney(id,type,fee){
                var self = this;
                var postdata = {
                    op : type,
                    fromajax : 1,
                    id : id,
                    gid : id,
                    fee : this.money,
                    rangli:this.rangli,
                    jiesuan:this.jiesuan
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
                if( type == 'setfxmt' ){
                    postdata.type = fee;
                    postdata.gid = id;
                }
                if( type == 'settag' ){
                    postdata.tagarr = fee;
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
                if( type == 'ptjifendk' ){
                    postdata.isjfdkpt = fee.isjfdkpt;
                    postdata.gid = id;
                }

                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.money = 0;
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
                    op : e,
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('goods','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            selectTable(e,a){
                var arr = [];
                for (var i = 0; i < e.length; i++) {
                    arr.push(e[i].id);
                }
                this.selected = arr;
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

            links(e){
            console.log(11111)
            console.log(e.currentTarget.dataset.url)
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
            pubgoods(){
                var self = this;
                self.$Modal.confirm({
                    title : '发布商品',
                    content : '商户后台才可以发布商品，便于将发布的商户归属到相应的商户。</br>在商户-商户列表内右侧操作栏内的“管理后台”可直接进入到相应的商户后台管理他的商品和订单等数据。',
                    okText : '进入商户管理中心',
                    cancelText : '关闭',
                    onOk : function(){
                        self.$router.push('/shoplist');
                    }
                });
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
                if( params.tag > 0 ){
                    self.page.pdata.tag = params.tag;
                }

                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.tableloading = false;
                        self.list = res.obj.list;
                        self.allsort = res.obj.topbar.sorta;
                        self.alltwosort = res.obj.topbar.sortb;
                        self.alltag = res.obj.alltag ? res.obj.alltag : [];
                        self.total = res.obj.total*1;
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
	                }
                    self.loading = false;
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>
   
    .a_border{
        display:inline-block;
        
        height:16px;
        line-height:16px;
        text-align:center;
        border:1px solid #c5c8ce;
        border-radius:2px;
        margin-right:5px
    }
    
</style>