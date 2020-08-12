<template>
	<div>
        <card class="mb20">
            <Row class="mb20 pd10">
                <Col span="4">
                    名称: {{shop.name}}
                </Col>
                <Col span="4">
                    账户:{{shop.account}}
                </Col>
                <Col span="4">
                    账户余额:<span class="data-num">{{shop.money}}</span>元
                </Col>
                <Col span="4" v-if="shop.isdzpaym == 0 && shop.isdzpay == 1 && settings.isdzpay == 1">
                    活动余额:<span class="data-num">{{shop.actmoney}}</span>元
                    <Dropdown trigger="click" placement="bottom-start" >
                        <a href="javascript:void(0)" >
                            充值<Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <div style="text-align:center;width:200px;">
                                <img style="width:100%;" :src="payqr">
                            </div>
                        </DropdownMenu>
                    </Dropdown> 
                </Col>
                <Col span="4">
                    浏览:<span class="data-num">{{shop.times}}</span>次
                </Col>
                <Col span="4">
                    让利比例:<span class="data-num">{{ shop.benefit }}</span>%
                </Col>
                
            </Row>
        </card>


        <card class="mb20">
            <Row class="mb20">
                <Col span="12">
                    <DatePicker type="date" @on-change="changedate" placeholder="选择日期" style="width: 200px;margin-left:10px;"></DatePicker>
                </Col>
            </Row>
            <Row>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(124, 83, 255);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip>
                                <div class="data-name">销售订单</div>
                                <div >{{start ? start : '今日'}}： <span class="data-num">{{data.todayorder*100/100}}</span> 单</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(99, 143, 214);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip>
                                <div class="data-name">销售额</div>
                                <div >{{start ? start : '今日'}}： <span class="data-num">{{data.todayfee*100/100}}</span> 元</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(172, 136, 49);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">订单收入</div>
                                <div >{{start ? start : '今日'}}： <span class="data-num">{{data.todayshopfee*100/100}}</span> 元</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(125, 90, 146);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <div class="data-name">{{settings.goodbname}}</div>
                            <div ><span class="data-num">{{data.good*100/100}}</span> 件</div>
                        </div>
                    </Row>
                </Col>

                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(73, 37, 199);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">完成订单</div>
                                <div >{{start ? start : '今日'}}： <span class="data-num">{{data.todaycom*100/100}}</span> 单</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(166, 11, 63);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">完成订单总额</div>
                                <div >{{start ? start : '今日'}}： <span class="data-num">{{data.todaycomfee*100/100}}</span> 元</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(209, 18, 106);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">完成订单收入</div>
                                <div >{{start ? start : '今日'}}： <span class="data-num">{{data.todaycomshopfee*100/100}}</span> 元</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" >
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">累计完成订单收入</div>
                                <div ><span class="data-num">{{data.allfee*100/100}}</span> 元</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>

                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(142, 160, 104);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">累计完成订单量</div>
                                <div ><span class="data-num">{{data.allcom*100/100}}</span> 单</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(46, 167, 242);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">待完成订单量</div>
                                <div ><span class="data-num">{{data.allwail*100/100}}</span> 单</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(61, 116, 46);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">待完成订单总额</div>
                                <div ><span class="data-num">{{data.waitfee*100/100}}</span> 元</div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(96, 168, 178);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">已退款订单量/总额</div>
                                <div >
                                    <span class="data-num">{{data.refund}}</span> 单/
                                    <span class="data-num">{{data.allrefund}}</span> 元
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>

                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(4, 14, 129);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">已{{settings.hxbname}}数量</div>
                                <div >{{start ? start : '今日'}}： <span class="data-num">{{data.todayhxnum*100/100}}</span> </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(131, 166, 234);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">累计已{{settings.hxbname}}数量</div>
                                <div >
                                    <span class="data-num">{{data.hxed}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(29, 234, 169);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">待{{settings.hxbname}}数量</div>
                                <div >
                                    <span class="data-num">{{data.waithx}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(179, 165, 177);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">累计{{settings.hxbname}}数量</div>
                                <div >
                                    <span class="data-num">{{data.waithx*1 + data.hxed*1}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>

                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(4, 14, 129);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">已领特权订单总数</div>
                                <div ><span class="data-num">{{data.totaltequangeted*100/100}}</span> </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(131, 166, 234);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">已核销特权订单总数</div>
                                <div ><span class="data-num">{{data.totaltequanverified*100/100}}</span> </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(29, 234, 169);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">已领特权订单</div>
                                <div >{{start ? start : '今日'}}： 
                                    <span class="data-num">{{data.todaytequangeted}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(179, 165, 177);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">已核销特权订单</div>
                                <div >{{start ? start : '今日'}}： 
                                    <span class="data-num">{{data.todaytequanverified}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>

                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(4, 14, 129);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">在线买单总营业额</div>
                                <div ><span class="data-num">{{data.zaixiantotal*100/100}}</span> </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(131, 166, 234);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">在线买单总收入</div>
                                <div ><span class="data-num">{{data.zaixiansale*100/100}}</span> </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(29, 234, 169);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">在线买单数</div>
                                <div >{{start ? start : '今日'}}： 
                                    <span class="data-num">{{data.zaixianorder}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(179, 165, 177);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">在线买单金额</div>
                                <div >{{start ? start : '今日'}}： 
                                    <span class="data-num">{{data.zaixianfee}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>

                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(4, 14, 129);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">总营业额</div>
                                <div ><span class="data-num">{{data.totalfee*100/100}}</span> </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(131, 166, 234);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">总收入</div>
                                <div ><span class="data-num">{{data.salefee*100/100}}</span> </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(29, 234, 169);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">营业额</div>
                                <div >{{start ? start : '今日'}}： 
                                    <span class="data-num">{{data.todayfees}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
                <Col span="6" class="data-in">
                    <Row type="flex">
                        <div class="data-l" style="background: rgb(179, 165, 177);">
                            <Icon color="#ffffff" size="30" type="md-information" />
                        </div>
                        <div class="data-item">
                            <Tooltip max-width="400">
                                <div class="data-name">收入</div>
                                <div >{{start ? start : '今日'}}： 
                                    <span class="data-num">{{data.todayincome}}</span> 
                                </div>
                            </Tooltip>
                        </div>
                    </Row>
                </Col>
            </Row>
        </card>

        <!-- <Row >

            <Row class="mb20">
                <Col span="6">
                    <Card class="dataitem" >
                        <Tooltip content="今天所有已支付订单的数量">
                        <p>{{data.todayorder}}</p>
                        <p>{{start ? start : '今日'}}订单</p>
                        </Tooltip>
                    </Card>
                    
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip content="今天所有已支付的订单的金额总和">
                        <p>{{data.todayfee}}</p>
                        <p>{{start ? start : '今日'}}销售额</p>
                        </Tooltip>
                    </Card>
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400" content="今天所有已支付的订单的收益总和（未发放到账户余额的收益也在此中）">
                        <p>{{data.todayshopfee}}</p>
                        <p>{{start ? start : '今日'}}订单收入</p>
                        </Tooltip>
                    </Card>
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip >
                        <p>{{data.good}}</p>
                        <p>{{settings.shopbname}}{{settings.goodbname}}</p>
                        </Tooltip>
                    </Card>
                </Col>
            </Row>

            <Row class="mb20">
                <Col span="6">
                    <Card class="dataitem" >
                        <Tooltip max-width="400" content="今天所有操作完成的订单数量(包括客户验收完成，系统自动完成，管理员核销完成)">
                        <p>{{data.todaycom}}</p>
                        <p>{{start ? start : '今日'}}完成订单</p>
                        </Tooltip>
                    </Card>
                    
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400" content="今天所有操作完成的订单的金额(包括客户验收完成，系统自动完成，管理员核销完成)">
                        <p>{{data.todaycomfee}}</p>
                        <p>{{start ? start : '今日'}}完成订单总额</p>
                        </Tooltip>
                    </Card>
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400"  content="今天所有操作完成的订单并发放到账户余额的金额(包括客户验收完成，系统自动完成，管理员核销完成)">
                        <p>{{data.todaycomshopfee}}</p>
                        <p>{{start ? start : '今日'}}完成订单收入</p>
                        </Tooltip>
                    </Card>
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400" content="所有完成的订单并发放到账户余额的金额(包括客户验收完成，系统自动完成，管理员核销完成)">
                        <p>{{data.allfee}}</p>
                        <p>累计完成订单收入</p>
                        </Tooltip>
                    </Card>
                </Col>
            </Row>

            <Row class="mb20">
                <Col span="6">
                    <Card class="dataitem" >
                        <Tooltip max-width="400" content="所有完成的订单数量(包括客户验收完成，系统自动完成，管理员核销完成)">
                        <p>{{data.allcom}}</p>
                        <p>累计完成订单量</p>
                        </Tooltip>
                    </Card>
                    
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400" content="所有等待完成的订单数量(包括已支付未发货，已支付未核销，已发货未完成的订单)">
                        <p>{{data.allwail}}</p>
                        <p>待完成订单量</p>
                        </Tooltip>
                    </Card>
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400"  content="所有等待完成的订单金额(包括已支付未发货，已支付未核销，已发货未完成的订单)">
                        <p>{{data.waitfee}}</p>
                        <p>待完成订单总额</p>
                        </Tooltip>
                    </Card>
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400" content="所有已退款的订单">
                        <p>{{data.refund}}/{{data.allrefund}}</p>
                        <p>已退款订单量/总额</p>
                        </Tooltip>
                    </Card>
                </Col>
            </Row>

            <Row class="mb20">
                <Col span="6">
                    <Card class="dataitem" >
                        <Tooltip max-width="400" :content="'今天所有'+settings.hxbname+'了的数量（不是订单数量，是指发布'+settings.goodbname+'的时候设定的可'+settings.hxbname+'次数）,例某个订单可'+settings.hxbname+'10次，今天此订单'+settings.hxbname+'3次，那么此订单今日'+settings.hxbname+'3个数量'">
                        <p>{{data.todayhxnum}}</p>
                        <p>{{start ? start : '今日'}}已{{settings.hxbname}}数量</p>
                        </Tooltip>
                    </Card>
                    
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400" :content="'所有订单'+settings.hxbname+'了的数量（不是订单数量，是指发布'+settings.goodbname+'的时候设定的可'+settings.hxbname+'次数）,例某个订单可'+settings.hxbname+'10次，此订单已'+settings.hxbname+'4次，那么此订单'+settings.hxbname+'4个数量'">
                        <p>{{data.hxed}}</p>
                        <p>累计已{{settings.hxbname}}数量</p>
                        </Tooltip>
                    </Card>
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400"  :content="'所有未'+settings.hxbname+'订单的'+settings.hxbname+'数量（不是订单数量，是指发布'+settings.goodbname+'的时候设定的可'+settings.hxbname+'次数）,例某个订单可'+settings.hxbname+'10次，此订单已'+settings.hxbname+'7次，那么此订单待'+settings.hxbname+'数量是3'">
                        <p>{{data.waithx}}</p>
                        <p>待{{settings.hxbname}}数量</p>
                        </Tooltip>
                    </Card>
                </Col>
                <Col span="6">
                    <Card class="dataitem">
                        <Tooltip max-width="400" :content="'所有已支付订单的'+settings.hxbname+'数量（不是订单数量，是指发布'+settings.goodbname+'的时候设定的可'+settings.hxbname+'次数）,例某个订单可'+settings.hxbname+'10次，那么总计销售'+settings.hxbname+'数量计为10'">
                        <p>{{data.waithx*1 + data.hxed*1}}</p>
                        <p>已销售{{settings.hxbname}}数量</p>
                        </Tooltip>
                    </Card>
                </Col>
            </Row>
        </Row> -->

        <Row class="">
            <Col span="12">
                <DatePicker confirm @on-ok="daterange" @on-change="rangechange" type="daterange" placeholder="选择日期" style="width: 200px;margin-left:10px;"></DatePicker>
            </Col>
        </Row>

        <Row>
            <ve-line :data="chartData"></ve-line>
        </Row>
        

    </div>
</template>

<script type="text/javascript">
    import VeLine from 'v-charts/lib/line.common'
	export default {
	  	components: {
            VeLine
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                data : {},
                shop : {},
                chartData : {
                    columns: ['date', '日订单量', '日交易额', '日核销量'],
                    rows: []
                },
                start : false,
                rstart : '',
                rend : '',
                payqr : '',
	  		}
	  	},
        created:function(){
            this.initData();
        },
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            changedate(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    fromajax : 1,
                    start : e,
                }
                this.start = e;
                self.$util.http('index','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.data = res.obj.data;
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            rangechange(e){
                this.rstart = e[0];
                this.rend = e[1];
            },
            daterange(){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'sitedata',
                    fromajax : 1,
                    start:self.rstart,
                    end : self.rend,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.obj ){
                        var row = [];
                        for (var i = 0; i < res.obj.label.length; i++) {
                            row.push({
                                'date' : res.obj.label[i],
                            })
                        }

                        for (var i = 0; i < row.length; i++) {
                            row[i]['日订单量'] = res.obj.datasets['flow1'][i];
                            row[i]['日交易额'] = res.obj.datasets['flow2'][i];
                            row[i]['日核销量'] = res.obj.datasets['flow3'][i];
                        }
                        self.chartData.rows = row;
                    }
                });
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var postdata = {
                    p:'admin',
                    fromajax : 1,
                }

                self.$util.http('index','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.data = res.obj.data;
                        self.shop = res.obj.shop;
                        self.payqr = res.obj.payqr;
                    }else{
                        self.$Message.error(res.message);
                    }
                });

                var postdata = {
                    p:'admin',
                    op : 'sitedata',
                    fromajax : 1,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.obj ){
                        var row = [];
                        for (var i = 0; i < res.obj.label.length; i++) {
                            row.push({
                                'date' : res.obj.label[i],
                            })
                        }

                        for (var i = 0; i < row.length; i++) {
                            row[i]['日订单量'] = res.obj.datasets['flow1'][i];
                            row[i]['日交易额'] = res.obj.datasets['flow2'][i];
                            row[i]['日核销量'] = res.obj.datasets['flow3'][i];
                        }
                        self.chartData.rows = row;
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
.dataitem{
    margin:0 auto;
    text-align: center;
    width: 150px;
}

.data-l{
    background: rgb(0, 0, 0);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    font-size: 30px;
    margin-right: 10px;
}
.data-in{
    padding: 20px;
    border-bottom: 1px solid #eee;
}
.data-name{
    font-size: 15px;
    font-weight: bold;
}
.data-num{
    font-weight: bold;
    color: #2d8cf0;
    font-size: 18px;
}
.data-dayy{
    color: #999;
}

</style>