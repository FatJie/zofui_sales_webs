<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Select @on-change="shaixuan($event,'sortid')" placeholder="筛选分类" class="mb5 w150" >
                    <Option v-for="(item,index) in allsort" :value="item.value" :label="item.name" :key="index" >{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选子分类" @on-change="shaixuan($event,'sorttwo')" class="mb5 w150">
                    <Option v-for="(item,index) in alltwosort" :value="item.value" :label="item.name" :key="index">{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选分店" @on-change="shaixuan($event,'shopid')" class="mb5 w150">
                    <Option  value="-1" label="本店" >本店</Option>
                    <Option v-for="(item,index) in allfendian" :value="item.id" :label="item.name" :key="index">{{ item.name }}</Option>
                </Select>
                <Select  placeholder="筛选配送方式" @on-change="shaixuan($event,'take')" class="mb5 w150">
                    <Option v-for="(item,index) in taketype" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选类型" @on-change="shaixuan($event,'type')" class="mb5 w150">
                    <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="筛选状态" @on-change="shaixuan($event,'status')" class="mb5 w150">
                    <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select  placeholder="排序方式" @on-change="shaixuan($event,'by')" class="mb5 w150">
                    <Option v-for="item in otype" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <DatePicker confirm type="daterange" placement="bottom-end" placeholder="筛选时间" class="w150" @on-ok="searchdate" @on-change="changedate" @on-clear="cleartime"></DatePicker>
                <Input icon="ios-search" v-model="page.pdata.orderid" @on-enter="search" @on-click="search" placeholder="平台订单编号" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.uorderid" @on-enter="search" @on-click="search" placeholder="微信订单编号" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.user" @on-enter="search" @on-click="search" placeholder="输入买家昵称" class="mb5 w150" />
                <Input icon="ios-search" v-model="page.pdata.gid" @on-enter="search" @on-click="search" placeholder="商品ID" class="mb5 w150" />
                <!-- <Input icon="ios-search" v-model="page.pdata.code" @on-enter="search" @on-click="search" placeholder="输入核销码" class="mb5 w150" /> -->
                <!-- <Input icon="ios-search" v-model="page.pdata.tel" @on-enter="search" @on-click="search" placeholder="输入手机号" class="mb5 w150" /> -->
                <Button type="primary" @click="down">导出订单</Button>
                <Button type="default" @click="sendall">批量发货</Button>
            </Col>
        </Row>
        
            <Card class=" mb10">
                <Row class="">
                    <Col span="6" class="tc">
                        <p>{{data.total}}</p>
                        <h3>订单数量</h3>
                    </Col>
                    <Col span="6" class="tc">
                        <p>{{data.totalfee}}</p>
                        <h3>订单总金额</h3>
                    </Col>
                    <Col span="6" class="tc">
                        <p>{{data.shopfee}}</p>
                        <h3>预计收入金额</h3>
                    </Col>
                    <Col span="6" class="tc">
                        <p>{{data.hxnum}}</p>
                        <h3>销售数量</h3>
                    </Col>
                </Row>
            </Card>
        
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable" :loading="tableloading" :disabled-hover="true">

                    <template slot-scope="{ row }" slot="data">
                        <Card style="margin:10px;" :bordered="false">
                            <Row class="mb10" style="border-bottom:1px solid #eee;">
                                <Col span="24" >
                                    <Avatar icon="ios-person" size="small" shape="square" :src="row.good.thumb" />
                                    {{row.good.title}}  
                                </Col>
                            </Row>
                            <Row class="mb10" v-if="row.shopinfo" style="border-bottom:1px solid #eee;">
                                <Col span="24" >
                                    门店：{{row.shopinfo.name}}，地址：{{row.shopinfo.address}}，电话：{{row.shopinfo.tel}}
                                </Col>
                            </Row>
                            <Row class="mb10">
                                <Col span="24" >
                                    <div class="">
                                        <Tag color="cyan">订单编号:{{row.orderid}}</Tag>
                                        <Tag v-if="row.uorderid" color="cyan">微信订单编号:{{row.uorderid}}</Tag>
                                        <Tag v-if="row.wxorderid" color="cyan">微信订单编号:{{row.wxorderid}}</Tag>
                                    </div>
                                </Col>
                            </Row>
                            <Row class="mb10">
                                <Col span="24" >
                                    <div class="mb10">
                                        <Tag v-if="row.showcreatetime" color="cyan">下单时间:{{row.showcreatetime}}</Tag>
                                        <Tag v-if="row.comtime > 0" color="cyan">完成时间:{{row.showcomtime}}</Tag>

                                        <template v-if="row.gtype != 7">
                                            <Tag color="cyan" v-if="row.taketype == 1">
                                                到店使用
                                            </Tag>
                                            <Tag color="orange" v-if="row.taketype == 2">
                                                配送到家
                                                <font v-if="row.istaked == 1">已接单</font>
                                            </Tag>
                                        </template>

                                        买家：{{row.user.nickname}}，电话：{{row.tel}}
                                    </div>
                                </Col>
                            </Row>
                            <Row class="mb10">
                                <Col span="24" >
                                    
                                    <p class="datain-item">订单金额：{{row.fee}}，</p>
                                    <p class="datain-item">收入金额：{{row.jiesuan}}，</p>
                                   <!-- <p class="datain-item">服务费用：{{row.sever}}，</p> -->
                                    <p class="datain-item">让利金额：{{row.rangli}}，</p>
                                    <!--<p class="datain-item" v-if="row.fanxianm > 0">返现金额：{{row.fanxianm}}，</p>-->
                                    
                                    <p class="datain-item" v-if="row.jifendis > 0">{{settings.jfbname}}抵扣：{{row.jifendis}}，</p>
                                    
                                    <p class="datain-item" v-if="row.jifen > 0">返现{{settings.jfbname}}：{{row.jifen}}，</p>
                                    
                                    <p class="datain-item" v-if="row.salerfee*1 +row.salerfeea*1 + row.salerfeeb*1 > 0">{{settings.fxbname}}支出：{{ (row.salerfee*1 +row.salerfeea*1 +row.salerfeeb*1).toFixed(2) }}，
                                    </p>
                                    
                                    <p class="datain-item" v-if="row.ptsalerfee*1 +row.ptsalerfeea*1 + row.ptsalerfeeb*1 > 0">
                                        平台{{settings.fxbname}}：{{ (row.ptsalerfee*1 +row.ptsalerfeea*1 +row.ptsalerfeeb*1).toFixed(2)}}，
                                    </p>

                                    <p class="datain-item">下单数量：{{row.num}}，</p>
                                    <p class="datain-item">
                                        支付方式：
                                        {{!row.paytype || row.paytype == 0 ? '微信' : ''}}
                                        {{row.paytype == 1 ? '余额' : ''}}
                                        {{row.paytype == 2 ? '到店支付' : ''}}，
                                    </p>

                                    <template v-if="row.agentfee > 0">
                                        <p class="datain-item" v-if="row.agent">{{settings.agentname}}：{{row.agent.nickname}}，</p>
                                        <p class="datain-item">分成：{{row.agentfee}}，</p>
                                    </template>
                                    
                                    <p class="datain-item" v-if="row.rule">规格：{{row.rule}}，</p>
                                    
                                    <p class="datain-item" v-if="row.pakfee > 0">打包费：{{row.pakfee}}，</p>
                                    
                                    <p class="datain-item" v-if="row.expfee > 0">配送费：{{row.expfee}}，</p>
                                    <p class="datain-item" v-if="row.yydate">预约：{{row.yydate+' '}} {{row.yytime}}，</p>

                                    <template v-if="row.gtype != 7">
                                        <p class="datain-item">已经使用：{{row.oldhxtimes - row.hxtimes - row.refundnum > 0 ? row.oldhxtimes - row.hxtimes - row.refundnum : 0}}次，</p>
                                        <p v-if="row.refundnum" class="datain-item">已经退掉：{{row.refundnum}}次，</p>
                                        <p class="datain-item">还可使用：{{row.hxtimes}}次，</p>
                                        <p class="datain-item" v-for="inn in row.hxcode">
                                            {{inn.code}}（{{inn.status == 1 ? '已使用' : '未使用'}}），
                                        </p>
                                    </template>

                                </Col>
                            </Row>
                            <Row class="mb10">
                                <Col span="24" >

                        <Tag color="default" v-if="row.fzstatus > 0" class="font-error">分账订单</Tag>
                        <Tag color="default" v-if="row.isdzpay == 1" class="font-error">独立收款订单</Tag>
                        <Tag color="default">
                            {{row.gtype == 0 ? '普通商品' : ''}}
                            {{row.gtype == 1 ? '限抢订单' : ''}}
                            {{row.gtype == 2 ? '拼团订单' : ''}}
                            {{row.gtype == 3 ? '砍价订单' : ''}}
                            {{row.gtype == 4 ? '报名订单' : ''}}
                            {{row.gtype == 7 ? '套餐订单' : ''}}
                            {{row.gtype == 8 ? '特权商品' : ''}}
                            {{row.gtype == 9 ? '礼包商品' : ''}}
                        </Tag>
                        
                        <Tag color="default" v-if="row.gtype == 7 && row.bindoid*1 > 0" class="font-error">母订单id：{{row.bindoid}}</Tag>
                        <Tag color="default" v-if="row.pttype == 1" class="font-error">票付通订单</Tag>
                        <Tag color="default" v-if="row.pftcode" class="font-info">票付通核销码:{{row.pftcode}}</Tag>
                        <Tag color="error" v-if="row.pfterr" class="font-error">错误:{{row.pfterr}}</Tag>

                        <Tag color="default" v-if="row.hxuser" >{{settings.hxbname}}：{{row.hxuser.nickname}}</Tag>
                        <Tag color="error" v-if="row.refunderr" class="font-error">退款：{{row.refunderr}}</Tag>
                        <Tag color="error" v-if="row.gfxstatus == 1" class="font-error">活动资金不足，不可发放分销、返现资金</Tag> 
                                </Col>
                            </Row>


                        </Card>
                    </template>
                    <template slot-scope="{ row, index }" slot="status">
                        <Tag color="default" class="font-error" v-if="row.unset == 1">已取消</Tag>  
                        <Tag :color="row.status == 5 ? 'error' : 'default'">
                            {{row.status == 0 ? '未支付' : ''}}
                            {{row.status == 1 ? '已支付' : ''}}
                            {{row.status == 2 ? '已发货' : ''}}
                            {{row.status == 3 ? '已完成待评价' : ''}}
                            {{row.status == 4 ? '已评价' : ''}}
                             {{row.status == 6 ? '待核销' : ''}}
                            <font v-if="row.status == 5" >已退款</font>
                        </Tag>
                        

                        <Tag color="error" v-if="row.isfail == 1" class="font-error">已超时失效</Tag> 

                        <Tag color="error" v-if="row.isback == 1 && (row.status == 1 || row.status == 2)" class="font-error">退款申请中</Tag>

                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a @click="link" :data-url="'adminorderinfo?id='+row.id" >详情</a>
                            <a v-if="row.pttype == 1 && row.pftstatus == 0 && (row.status == 1 || row.status == 2 || row.status == 3)" @click="dealthis(row.id,'resetpft')" >重新发票</a>
                        </p>

                        <Poptip
                            v-if="row.status == 0 && row.unset == 0"
                            confirm
                            title="确定提醒吗？"
                            @on-ok="dealthis(row.id,'remind')"
                            placement="left">
                            <a>提醒下单</a>
                        </Poptip>

                        <Dropdown v-if="row.hxtimes > 0  && row.fee > 0 && row.paytype != 2" placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                {{settings.hxbname}}订单
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="money" :placeholder="'输入'+settings.hxbname+'编码'" />
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'comorder')">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                        
                        <p v-if="row.status == 4">
                            <a @click="link" :data-url="'admincomment?orderid='+row.orderid" >查看评价</a>
                        </p>
                        <p >
                            <a @click="link" :data-url="'admingoods?id='+row.gid" >查看{{settings.goodbname}}</a>
                        </p>
                        <p v-if="row.gtype == 2 && row.groupid">
                            <a @click="link" :data-url="'adminactgroup?id='+row.groupid" >查看拼团</a>
                        </p>
                        <p v-if="row.gtype == 3">
                            <a @click="link" :data-url="'adminactcut?id='+row.cutid" >查看砍价</a>
                        </p>
                        <div v-if="row.isback == 1">
                            <Poptip
                                confirm
                                title="确定退款吗？"
                                @on-ok="dealthis(row.id,'refund')"
                                placement="left">
                                <a>退款</a>
                            </Poptip>
                            <Poptip
                                confirm
                                title="确定取消吗？"
                                @on-ok="dealthis(row.id,'cancelbackorderadmin')"
                                placement="left">
                                <a>取消退款</a>
                            </Poptip>
                        </div>

                        <Poptip
                            v-if="row.taketype == 2 && row.status == 1 && row.istaked == 0"
                            confirm
                            title="确定接单吗？"
                            @on-ok="dealthis(row.id,'takeorder')"
                            placement="left">
                            <a>接单</a>
                        </Poptip>

                        <Dropdown v-if="row.taketype == 2 && ( row.status == 1 || row.status == 2 )" placement="left" trigger="click">
                            <a href="javascript:void(0)">
                                填快递单号
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="padding:10px;">
                                    <Select v-model="row.exname"  >
                                        <Option :value="inn.name" v-for="inn in express">{{inn.name}}</Option>
                                    </Select>
                                </div>
                                <div style="padding:10px">
                                    <Input v-model="row.exname" placeholder="输入快递名称" />
                                </div>
                                <div style="padding:10px">
                                    <Input v-model="row.exnum" placeholder="输入快递编号" />
                                </div>

                                <div style="text-align: right;margin:10px;">
                                    <Button type="primary" size="small" @click="editmoney(row.id,'sendexpress',row.exname,row.exnum)">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>

                        <Poptip
                            v-if="row.gfxstatus == 1"
                            confirm
                            title="发放前请确保账户活动余额充足，在数据-数据预览内可查看。确定发放分销和返现资金吗？"
                            @on-ok="dealthis(row.id,'givefxmoney')"
                            placement="left">
                            <a>发放资金</a>
                        </Poptip>

                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

        <Modal title="批量发货" v-model="issendall" width="700" :styles="{top:'10px'}" footer-hide>
            <div class="pd10">
                <Alert>
                    提示：</br>
                    1.只有配送到家的订单才能导入订单批量发货。当导入订单后，已支付的订单状态都将转为已发货状态。</br>
                    2.导入的格式有严格要求，应按照模板要求的格式导入。
                </Alert>
            </div>
            <div class="pd10">
                <RadioGroup v-model="loadtype">
                    <Radio :label="0">手动导入</Radio>
                    <Radio :label="1">文件导入</Radio>
                </RadioGroup>
            </div>
            <div class="pd10" >
                <template v-if="loadtype == 0">
                    <div class="mb10 frm_tip">
                        提示：订单编号、快递名称、快递单号应一一对应。快递名称若是相同的，那么只需要填写一个即可。<a href="http://img11.360buyimg.com/ddimg/jfs/t1/89255/28/3034/32711/5ddbc2f4E522ad9fd/f8dc710ddbaf41f1.png" target="_blank">填写示例</a>
                    </div>
                    <Row class="mb10">
                        <Col span="7" >
                            <p>订单编号</p>
                            <Input v-model="exid" type="textarea" :rows="15" placeholder="输入订单编号，多个回车换行" />
                        </Col>
                        <Col span="7" offset="1">
                            <p>快递名称</p>
                            <Input v-model="exname" type="textarea" :rows="15" placeholder="输入快递名称,若都是一个快递只输入一个名称即可，多个回车换行" />
                        </Col>
                        <Col span="7" offset="1">
                            <p>快递单号</p>
                            <Input v-model="exnum" type="textarea" :rows="15" placeholder="输入快递单号，多个回车换行" />
                        </Col>
                    </Row>
                    <div class="tr">
                        <Button type="primary" @click="subimport">提交</Button>
                    </div>
                    
                </template>
                <template v-if="loadtype == 1">
                    <div class="mb10 frm_tip">
                        提示：当遇到无法上传成功时，将文件另存为excel 97-2003 工作簿(*xsl)格式。
                    </div>

                    <Button type="primary" @click="downtemp">下载模板</Button>
                    <Upload :before-upload="uploaderfn" :on-success="uploadersuccess" :action="uporder" :show-upload-list="false" :with-credentials="true" name="inputfile" style="display:inline-block;">
                        <Button type="primary" icon="ios-cloud-upload-outline">导入订单</Button>
                    </Upload>

                    <div class="tr">
                        <Button type="primary">提交</Button>
                    </div>

                </template>
            </div>
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
                tableloading : true,
	  			params : {},
	  			list : [],
	  			allsort : [],
                allfendian : [],
                total : 0,
                data : {},
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {title:'数据',key:"data",slot: 'data',},
                    {title:'状态',key:'status',slot: 'status',width:130},
                    {title:'操作',key:'33',slot: 'action',width:120},
                ],
                status : [{label:'全部',value:1},{label:'黑名单',value:2}],
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
                status : [
                    {label:'待支付',value:1},
                    {label:'已支付',value:2},
                    {label:'已发货',value:3},
                    {label:'待评价',value:4},
                    {label:'已退款',value:5},
                    {label:'已完成',value:6},
                    {label:'申请退款中',value:7},
                    {label:'待审核',value:8},
                ],
                otype : [
                    {label:'按最新排序',value:'id'},
                    {label:'按最近'+this.settings.hxbname+'排序',value:'hexiao'},
                    {label:'按完成排序',value:'com'},
                    {label:'按店铺排序',value:'shop'},
                    {label:'按金额排序',value:'fee'},
                    {label:'按数量排序',value:'num'},
                    {label:'按商品排序',value:'goods'},
                ],
                taketype : [{label:'到店领取',value:1},{label:'配送到家',value:2}],
                page : {
                    pdata : {
                        doo : 'order',
                        op : 'order',
                        p : 'admin',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                        nick : '',
                        userid : '',
                        shopid : '',
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                allsort : [],
                alltwosort : [],
                selected : [],
                money : '',
                exnum : '',
                data : {},
                express : [],
                issendall : false,
                loadtype : 0,
                exid : '',
                exname : '',
                exnum : '',
                uporder : '',
	  		}
	  	},
        created:function(){
            this.initData();
            this.uporder = this.$util.Aurl('ajax','uploadorder') + '&down=1';
        },
	  	activated:function(e){
            
            
	  	},
	  	methods: {
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p : 'admin',
                    op : type,
                    fromajax : 1,
                    oid : id,
                    id : id,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res ? res.res : '操作失败');
                    }
                },true);
            },
            editmoney(id,type,no,num){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                    value : this.money,
                }
                if( type == 'sendexpress' ){
                    postdata.exname = no;
                    postdata.exnum = num;
                }
                if( type == 'comorder' ){
                    postdata.code = this.money;
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
                    p:'admin',
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('user','GET',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success(res.message);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            subimport(){
                var self = this;

                if( this.exid == '' ){
                    self.$Message.error('订单编号还没设置');return false;
                }
                if( this.exname == '' ){
                    self.$Message.error('订单名称还没设置');return false;
                }
                if( this.exnum == '' ){
                    self.$Message.error('订单编号还没设置');return false;
                }

                var postdata = {
                    op : 'importorder',
                    p:'admin',
                    fromajax : 1,
                    exid : self.exid,
                    exname : self.exname,
                    exnum : self.exnum,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){

                        self.issendall = false;
                        self.exid = '';
                        self.exname = '';
                        self.exnum = '';

                        self.$Message.success(res.res);
                        self.onLoad();

                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            down(){
                let url = this.$util.Aurl('order','order') + '&down=1';
                for(var t in this.page.pdata){
                    if( t != 'fromajax' && t != 'page' && t != 'pnum' ){
                        url += '&'+t+'='+this.page.pdata[t]
                    }
                }
                if( this.page.pdata.time ){
                    url += '&time[start]='+this.page.pdata.time.start;
                    url += '&time[end]='+this.page.pdata.time.end;
                }
                location.href = url;
            },
            downtemp(){
                let url = this.$util.Aurl('order','downtemp') + '&down=1';
                location.href = url;
            },
            uploaderfn(e){
                if( confirm('确定导入发货处理吗？') ){
                    return true;
                }else{
                    return false;
                }
            },
            uploadersuccess(e){
                if( e.status == 200 ){
                    this.$Message.success(e.res);
                }else{
                    this.$Message.error(e.res);
                }
            },
            changedate(e){
                this.sdate = {start:e[0],end:e[1]};
            },
            searchdate(e){
                if( this.sdate ){
                    this.page.pdata.time = this.sdate;
                }
                this.page.pdata.page = 1;
                this.onLoad();
            },
            cleartime(){
                this.page.pdata.time = '';
                this.page.pdata.page = 1;
                this.onLoad();
            },
            sendall(){
                this.issendall = !this.issendall;
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
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                if( params.id > 0 ){
                    self.page.pdata.userid = params.id;
                }
                if( params.groupid > 0 ){
                    self.page.pdata.groupid = params.groupid;
                }
                if( params.orderid ){
                    self.page.pdata.orderid = params.orderid;
                }
                if( params.saler ){
                    self.page.pdata.saler = params.saler;
                }
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.tableloading = false;
                        self.list = res.obj.list;
                        self.allsort = res.obj.topbar.sortid;
                        self.alltwosort = res.obj.topbar.sorttwo;
                        self.total = res.obj.total;
                        self.data = res.obj.data;
                        self.express = res.obj.express;
                        self.allfendian = res.obj.allfendian;

                        
                        
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
.datain-item{
    padding-right: 10px;
    display: inline-block;
    font-size: 13px;
    color: #999;
}

</style>