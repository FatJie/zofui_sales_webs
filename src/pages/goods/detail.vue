<template>
	<div>
    <Spin size="large" fix v-if="loading"></Spin>

    <div v-if="gtype*1 < 0">
        <Button shape="circle" @click="addgtype(0)">普通{{settings.goodbname}}</Button>
        <Button v-if="!settings.isquick && ( !shop.auth || shop.auth.isxq == 1)" shape="circle" @click="addgtype(1)">限抢{{settings.goodbname}}</Button>
        <Button v-if="!settings.isgroup && (!shop.auth || shop.auth.ispin == 1)" shape="circle" @click="addgtype(2)">拼团{{settings.goodbname}}</Button>
        <Button v-if="!settings.iscut && (!shop.auth || shop.auth.iscut == 1)" shape="circle" @click="addgtype(3)">砍价{{settings.goodbname}}</Button>
        <Button v-if="!settings.isbm && (!shop.auth || shop.auth.isbm == 1)" shape="circle" @click="addgtype(4)">报名{{settings.goodbname}}</Button>
        <Button v-if="!settings.ischou && (!shop.auth || shop.auth.ischou == 1)" shape="circle" @click="addgtype(5)">抽奖活动</Button>
        <Button v-if="!settings.isms && (!shop.auth || shop.auth.isms == 1)" shape="circle" @click="addgtype(6)">秒杀{{settings.goodbname}}</Button>
         <Button  v-if="!settings.istequan && (!shop.auth || shop.auth.istequan == 1)" shape="circle" @click="addgtype(8)">特权{{settings.goodbname}}</Button>
    </div>

    <template v-else>
        <Tabs value="basic" @on-click="changetab">
            <TabPane label="基本参数" name="basic" ></TabPane>
           <!-- <TabPane label="资金参数" name="money" ></TabPane> -->
            <TabPane label="选填参数" name="many" ></TabPane>
            <TabPane label="表单数据" name="form" ></TabPane>
            <TabPane label="规格预约" name="rule" v-if="gtype != 3 && gtype != 5"></TabPane>
            <TabPane label="商品详情" name="info" ></TabPane>
            <Button @click="gtype = -1" v-if="goods.id <= 0 || !goods.id" size="small" slot="extra">切换{{settings.goodbname}}类型</Button>
        </Tabs>

        <div v-show="tabtype == 'basic'">
            <Row class="frm_group" v-if="goods.id*1 <= 0 || !goods.id">
                <Col span="3" class="frm_title">
                    导入{{settings.goodbname}}数据
                </Col>
                <Col span="18" class="frm_content">
                    <Button size="small" @click="showload">选择{{settings.goodbname}}</Button>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    标题文字
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.title" type="textarea" :rows="4" class="w400"  placeholder="输入标题" />
                </Col>
            </Row>

           

            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    封面图片(正方形)
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.thumb" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('thumb')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">建议尺寸：400X400</p>
                    <img v-if="goods.showthumb" :src="goods.showthumb" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    封面图片(长方形)
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.thumbh" placeholder=""  class="w400" >
                        
                        <Button slot="append" size="small" @click="uploadimg('thumbh')" icon="ios-cloud-upload-outline">选择图片</Button>
                        
                    </Input>
                    <p class="frm_tip">建议尺寸568X340</p>
                    <img v-if="goods.showthumbh" :src="goods.showthumbh" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" v-if="!settings.fontsty || settings.fontsty == 0">
                <Col span="3" class="frm_title">
                    轮播图片
                </Col>
                <Col span="18" class="frm_content">
                    
                    <Button  size="small" @click="uploadimg('img')" icon="ios-cloud-upload-outline">选择图片</Button>
                    <Row type="flex" class="mt10">
                        
                        <div class="demo-upload-list" v-for="(item,index) in goods.showimg" :key="index">
                            <img :src="goods.showimg[index]">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-trash-outline" @click.native="delimga(index)"></Icon>
                            </div>
                        </div>
                        
                    </Row>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    所属分类
                </Col>
                <Col span="18" class="frm_content">
                    <Select filterable v-model="goods.sortid"  class="w200">
                        <Option v-for="item in allsort" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select> 
                    <!--<Cascader class="w400" filterable @on-change="setsort" :data="allsort" clearable  :value="[goods.sortid,goods.sorttwo]"></Cascader>-->
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    选择标签
                </Col>
                <Col span="18" class="frm_content">
                    <Select v-model="thistag" multiple class="w400">
                        <Option v-for="item in alltag" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
            </Row>
            <Row class="frm_group" v-if=" gtype != 8">
                <Col span="3" class="frm_title">
                    可使用红包
                </Col>
                <Col span="18" class="frm_content">
                    <Select filterable v-model="goods.redid" class="w400">
                        <Option v-for="item in redbag" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <p class="frm_tip">抽奖类不可使用</p>
                </Col>
            </Row>

                <Row class="frm_group" v-if=" gtype== 8">
                <Col span="3" class="frm_title">
                    限领等级
                </Col>
                <Col span="18" class="frm_content" >
                    <Select filterable v-model="goods.receive" class="w400">
                        <Option v-for="item in classes" :value="item.id" :key="item.id" >{{item.name}}</Option>
                    </Select>
                   
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    原价
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.oldprice" placeholder="" class="w400"  />
                    <P class="frm_tip">填入数字，这个只做展示作用。不填或填0则不显示</P>
                </Col>
            </Row>

              <template v-if="gtype == 0">
                <Row class="frm_group">
                    <Col span="3" class="frm_title">
                        {{settings.goodbname}}参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods.stock" placeholder="" class="w100" />件，
                            现价<Input v-model="goods.price" placeholder="" class="w100" />元，
                            <template >
                            平台结算价<Input v-model="goods.userprice" placeholder="" class="w100" />元。
                            </template>
                            
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>

            <template v-if="gtype == 1">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        抢购活动时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        抢购参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods.quickstock" placeholder="" class="w100" />件，
                            每人限抢<Input v-model="goods.quicklimit" placeholder="" class="w100" />件，
                            会员抢购价<Input v-model="goods.quickprice" placeholder="" class="w100" />元,
                            <template >
                            平台结算价<Input v-model="goods.quickuserprice" placeholder="" class="w100" />元。
                            </template>
                            
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>
            <template v-if="gtype == 2">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        拼团活动时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        拼团参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods.groupstock" placeholder="" class="w100" />件，
                            会员单买价<Input v-model="goods.gprice" placeholder="" class="w100" />元
                            <template v-if="settings.isucard == 0">
                            ，平台单买结算价<Input v-model="goods.guserprice" placeholder="" class="w100" />元。
                            </template>
                            
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        团参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <Card class="mb10">
                            <div class="mb20">
                                满足<Input v-model="goods.groupmem" placeholder="" class="w70" />人成团
                                ，限在<Input v-model="goods.grouplimit" placeholder="" class="w70" />小时完成
                                ，会员拼团价<Input v-model="goods.groupprice" placeholder="" class="w70" />元
                                <template v-if="settings.isucard == 0">
                                ，会员拼团结算价<Input v-model="goods.groupuserprice" placeholder="" class="w70" />元。
                                </template>
                                
                            </div>
                            <div v-for="(item,index) in groupparams" class="mb20">
                                满足<Input v-model="item.groupm" placeholder="" class="w70" />人成团
                                ，限在<Input v-model="item.groupl" placeholder="" class="w70" />小时完成
                                ，拼团价<Input v-model="item.groupp" placeholder="" class="w70" />元
                                <template v-if="settings.isucard == 0">
                                ，会员拼团价<Input v-model="item.groupup" placeholder="" class="w70" />元
                                </template>
                                <template v-if="settings.isucard == 0 && settings.ismpr == 1 && settings.isum == 1">
                                ，会员拼团余额价<Input v-model="item.groupupjb" placeholder="" class="w70" />元
                                </template>
                                <Button size="small" @click="delgroup(index)">删除</Button>
                            </div>

                            <Button type="primary" size="small" @click="addgroup">添加阶梯团参数</Button>
                        </Card>
                        
                        <p class="frm_tip"></p>
                    </Col>
                </Row>

                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        自动成团
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.isautogroup">
                            <Radio label="0" >开启</Radio>
                            <Radio label="1">关闭</Radio>
                        </RadioGroup>
                        <p class="frm_tip">关闭后拼团失败的订单将退款处理</p>
                    </Col>
                </Row>
                <!-- <Row class="frm_group" v-if="settings.gerfree > 0">
                    <Col span="3" class="frm_title">
                        团长免单
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.isleadfree">
                            <Radio label="0" >关闭</Radio>
                            <Radio label="1">开启</Radio>
                        </RadioGroup>
                        <p class="frm_tip">开启后拼团成功的订单将给团长返款，自动成团的无法免单</p>
                    </Col>
                </Row> -->
            </template>
            <template v-if="gtype == 3">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        活动时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        底价购买
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.botbuy">
                            <Radio label="0" >开启</Radio>
                            <Radio label="1">关闭</Radio>
                        </RadioGroup>
                        <p class="frm_tip">不到底价也可以购买</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        限制时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="goods.cutdtime" placeholder="" class="w400" />
                        <p class="frm_tip">单位/小时，例填5，必须在5小时内砍价完成，否则视为失败。若不填则默认可参与到活动结束</p>
                    </Col>
                </Row>
                
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        砍价参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods.cutstock" placeholder="" class="w100" />件，
                            起始价<Input v-model="goods.cutprice" placeholder="" class="w100" />元，
                            会员底价
                            <Input v-model="goods.cutbot" placeholder="" class="w100" />元,
                            <template v-if="settings.isucard == 0">
                            平台结算价<Input v-model="goods.cutuserbot" placeholder="" class="w100" />元。
                            </template>
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        每次砍掉价格
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            <Input v-model="goods.cutmin" placeholder="" class="w100" />
                            -<Input v-model="goods.cutmax" placeholder="" class="w100" />
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>

            <template v-if="gtype == 4">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        活动时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        报名参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            报名剩余名额<Input v-model="goods.actstock" placeholder="" class="w100" />，
                            会员需支付<Input v-model="goods.actprice" placeholder="" class="w100" />元，
                            <template v-if="settings.isucard == 0">
                            平台结算<Input v-model="goods.actuserprice" placeholder="" class="w100" />元。
                            </template>
                           
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>
            <template v-if="gtype == 5">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        开始-开奖时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        抽奖活动参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            参与活动需支付<Input v-model="goods.chouprice" placeholder="" class="w100" />，
                            中奖名额<Input v-model="goods.choustock" placeholder="" class="w100" />，
                            <template>
                            最多可获得<Input v-model="goods.chousmaxs" placeholder="" class="w100" />次邀请幸运码。
                            </template>
                            
                        </div>
                        <p class="frm_tip">需支付填0是不需要支付。最多可获得邀请幸运码填数字，是指分享给好友，好友打开后他可获得的幸运码数量。填0是不可分享获得</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        邀请获得幸运码方式
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.chouitype">
                            <Radio label="0" >被邀请人进入页面即获得</Radio>
                            <Radio label="1">被邀请人参与活动才获得</Radio>
                        </RadioGroup>
                        <p class="frm_tip">是指邀请好友参与活动获得额外的邀请码的方式</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        奖品提示
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10" v-for="(item,index) in goods.lottparams">
                            第 <Input v-model="item.lotstart" placeholder="" class="w100"  />位-
                            第<Input v-model="item.lotend" placeholder="" class="w100"  />位中奖者，奖品等级名称
                            <Input v-model="item.lotpname" placeholder="" class="w100"  />
                            获奖提示文字
                            <Input v-model="item.lotptip" placeholder="" class="w200"  />
                            <a href="javascript:;" @click="delchoutips(index)">删除</a>
                        </div>
                        <a href="javascript:;" @click="addchoutips">添加一项</a>

                        <p class="frm_tip">奖品名称和获奖提示文字将在订单详情里提示</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        到时间开奖
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.opentime">
                            <Radio label="0" >开启</Radio>
                            <Radio label="1">关闭</Radio>
                        </RadioGroup>
                        <p class="frm_tip">关闭后到时间不开奖</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        达到人数开奖
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="goods.opennum" placeholder="" class="w400" />
                        <p class="frm_tip">填0关闭达到人数开奖功能</p>
                    </Col>
                </Row>
            </template>

            <template v-if="gtype == 6">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        秒杀时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <Select v-model="goods.mstime" style="width:400px">
                            <Option v-for="(item,index) in killtime" :value="item.start+''" :key="index">每天{{ item.start }}时</Option>
                        </Select>
                        <p class="frm_tip">每天选择的这个时间开始可秒杀抢购</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        上架日期限制
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.msdatetype">
                            <Radio :label="0" >每天上架</Radio>
                            <Radio :label="1">指定日期上架</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row class="frm_group" v-if="goods.msdatetype == 1">
                    <Col span="3" class="frm_title">
                        上架日期
                    </Col>
                    <Col span="18" class="frm_content">
                        <div>
                            <Button @click="delmsdate(index)" shape="circle" class="mr10 mb10" style="margin-bottom:10px;" v-for="(item,index) in msdateaa" >{{item}}</Button>
                        </div>
                        <div>
                            <DatePicker
                                :open="openmstime"
                                type="date"
                                clearable
                                @on-change="selectmstime">
                                <Button @click="openthemstime" size="small">添加日期</Button>
                            </DatePicker>
                        </div>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        秒杀活动参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            每次库存<Input v-model="goods.msstock" placeholder="" class="w100" />，
                            会员秒杀价<Input v-model="goods.msprice" placeholder="" class="w100" />元，
                            <template v-if="settings.isucard == 0">
                            ，平台结算价<Input v-model="goods.msuserprice" placeholder="" class="w100" />元。
                            </template>
                            
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>

            <template v-if="gtype == 8">
                
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        商品参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods. stock" placeholder="" class="w100" />
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>

            <Row class="frm_group" v-if="settings.editss == 0">
                <Col span="3" class="frm_title">
                    虚拟销量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.falsesaled" placeholder="" class="w400"  />
                    <P class="frm_tip">填入数字，前端会显示此数据加真实销量</P>
                </Col>
            </Row>
            <Row class="frm_group" v-if="settings.editsa == 1">
                <Col span="3" class="frm_title">
                    虚拟分享
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.falseshare" placeholder="" class="w400"  />
                    <P class="frm_tip">填入数字，前端会显示此数据加真实分享</P>
                </Col>
            </Row>
            <Row class="frm_group" v-if="settings.editsa == 1">
                <Col span="3" class="frm_title">
                    虚拟浏览
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.falsescan" placeholder="" class="w400"  />
                    <P class="frm_tip">填入数字，前端会显示此数据加真实浏览</P>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    排序序号
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.number" placeholder="" class="w400"  />
                    <P class="frm_tip">填入数字，越大越靠前，仅在{{settings.shopbname}}主页有效</P>
                </Col>
            </Row>
            
            <Row class="frm_group" v-if="!goods.sfailot">
                <Col span="3" class="frm_title">
                    订单有效期
                </Col>
                <Col span="18" class="frm_content">
                    <Card>

                        <RadioGroup  class="frm_group" v-model="goods.orderact">
                            <Radio label="0" >使用默认的</Radio>
                            <Radio label="1">单独设置</Radio>
                        </RadioGroup>
                        <template v-if="goods.orderact == 1">
                            <Row class="frm_group" >
                                <Col span="4" class="frm_title">
                                    订单时间类型
                                </Col>
                                <Col span="18" class="frm_content">
                                    <RadioGroup v-model="goods.actotype">
                                        <Radio label="0" >根据下单时间变动</Radio>
                                        <Radio label="1">固定的使用时间</Radio>
                                    </RadioGroup>
                                </Col>
                            </Row>
                            <Row class="frm_group" v-if="goods.actotype == 0">
                                <Col span="4" class="frm_title">
                                    有效期时间
                                </Col>
                                <Col span="18" class="frm_content">
                                    下单后<Input v-model="goods.orderstart" placeholder="" class="w100" />小时后才可使用，下单后<Input v-model="goods.ofailt" placeholder="" class="w100" />小时订单失效。

                                    <P class="frm_tip">单位/小时。填入数字，若填0则参数失效。失效时间应该大于使用时间，否则订单还未到使用时间就会失效</P>
                                </Col>
                            </Row>

                            <Row class="frm_group" v-if="goods.actotype == 1">
                                <Col span="4" class="frm_title">
                                    有效期时间
                                </Col>
                                <Col span="18" class="frm_content">
                                    <DatePicker confirm :value="[actotimestart,actotimesend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="searchdate"  ></DatePicker>
                                </Col>
                            </Row>
                        </template>
                    </Card>
                </Col>
            </Row>


         

            <Row class="frm_group" v-if ="goods.permax || gtype != 8" >
                <Col span="3" class="frm_title">
                    每次限购数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.permax" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，填0不限制</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="gtype != 8">
                <Col span="3" class="frm_title">
                    限购次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.buytimes" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，填0不限制</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="gtype == 8">
                <Col span="3" class="frm_title">
                    每日限购数量
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.buy_times_day" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，填0不限制</p>
                </Col>
            </Row>

            <Row class="frm_group" v-if="!settings.kghxtimes">
                <Col span="3" class="frm_title">
                    {{settings.hxbname}}次数
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.hxtimes" placeholder="" class="w400"  />
                    <p class="frm_tip">每次下单给予能{{settings.hxbname}}的次数。填入数字，不填或填0仅限一次</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    购买数量和{{settings.hxbname}}次数
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.hxtype">
                        <Radio label="0" >沿用系统的</Radio>
                        <Radio label="1">{{settings.hxbname}}次数固定</Radio>
                        <Radio label="2">{{settings.hxbname}}次数随购买数量增加</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    点击购买弹出确认提示
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.popknow">
                        <Radio label="0" >不弹出</Radio>
                        <Radio label="1" >弹出</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" v-if="goods.popknow == 1">
                <Col span="3" class="frm_title">
                    提示内容
                </Col>
                <Col span="18" class="frm_content">

                    
                    <div v-if="goods.tips" class="mb10" v-for="(item,index) in goods.tips">
                        <Input v-model="goods.tips[index]" placeholder="" class="w400"  />
                        <a href="javascript:;" @click="deltips(index)">删除</a>
                    </div>
                    <a href="javascript:;" @click="addtips">添加一项</a>
                    <P class="frm_tip">提交下单的时候弹出需确认的提示内容</P>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    活动须知
                </Col>
                <Col span="18" class="frm_content">

                    
                    <div v-if="goods.know" class="mb10" v-for="(item,index) in goods.know">
                        <Input v-model="goods.know[index]" placeholder="" class="w400"  />
                        <a href="javascript:;" @click="delknow(index)">删除</a>
                    </div>
                    
                    
                    <a href="javascript:;" @click="addknow">添加一项</a>
                    <P class="frm_tip">展示在商品页面内的活动须知。建议在每条须知前加上数字序号</P>
                </Col>
            </Row>
            <!-- 购买须知 -->
             <Row class="frm_group">
                <Col span="3" class="frm_title">
                    购买须知
                </Col>
                <Col span="18" class="frm_content">
                    
                    <editor class="w750" :editorhtml="goods.contents" fnname="contents" @contents="contents" type="admin" :shopid="shop.id" :uniacid="shop.uniacid" ></editor>
                </Col>
            </Row>
            <Row class="frm_group" v-if="settings.isgquest == 1">
                <Col span="3" class="frm_title">
                    详情是否显示问答
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.isquest">
                        <Radio label="0" >显示</Radio>
                        <Radio label="1" >不允许提问不显示</Radio>
                    </RadioGroup>
                </Col>
            </Row>
        
        
            <Row class="frm_group" v-if="settings.isback == 1 && gtype != 5">
                <Col span="3" class="frm_title">
                    允许申请退款
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.tktype">
                        <Radio label="0" >默认</Radio>
                        <Radio label="1">允许</Radio>
                        <Radio label="2">不允许</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <div v-if="settings.fontsty == 0">
                <Row class="frm_group" v-if="gtype != 5">
                    <Col span="3" class="frm_title">
                        包装费用
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="goods.pakfee" type="text" class="w400"  placeholder="" />
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        配送到家
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.isexpress">
                            <Radio label="0" >关闭</Radio>
                            <Radio label="1">开启</Radio>
                        </RadioGroup>
                        <p class="frm_tip" v-if="gtype == 5">配送到家和到店使用请开启一个，若都开启则只使用配送到家</p>
                    </Col>
                </Row>
            </div>
            <Row class="frm_group" v-if="gtype != 5 && goods.isexpress == 1">
                <Col span="3" class="frm_title">
                    显示核销码
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.isshowqr">
                        <Radio label="0" >显示</Radio>
                        <Radio label="1">不显示</Radio>
                    </RadioGroup>
                    <p class="frm_tip" >若选择不显示，前端不显示核销码，适用于快递发货的情况</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="gtype != 5 && goods.isexpress == 1">
                <Col span="3" class="frm_title">
                    配送费用
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.expfee" type="text" class="w400"  placeholder="" />
                    <p class="frm_tip">填入数字，每单需要支付的配送费，不设置会沿用账户设置里的金额，设置负数则不收取配送费</p>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    {{settings.fontsty== 0 ? '到店领取' : '现场报名'}}
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.istoshop">
                        <Radio label="0" >开启</Radio>
                        <Radio label="1">关闭</Radio>
                    </RadioGroup>
                </Col>
            </Row>

            <Row class="frm_group" v-if="shop.auth && shop.auth.isfx != 1 && settings.fxlevel != 3 && (!settings.fxmtype || settings.fxmtype == 0)">
                <Col span="3" class="frm_title">
                    独立{{settings.fxbname}}关系
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.fxtype">
                        <Radio label="0" >关闭</Radio>
                        <Radio label="1">开启</Radio>
                    </RadioGroup>
                    <p class="note">开启后此{{settings.goodbname}}使用新的独立的{{settings.fxbname}}关系发放{{settings.fxbname}}佣金（分享给好友，好友进入绑定到下级，好友下单上级有提成）</p>
                </Col>
            </Row>
            
            <Row class="frm_group" v-if="shop.auth && shop.auth.isfx != 1 && settings.fxlevel != 3 && (!settings.fxmtype || settings.fxmtype == 0)">
                <Col span="3" class="frm_title">
                    {{settings.fxbname}}参数
                </Col>
                <Col span="18" class="frm_content">
                    <div class="mb10">
                        一级<Input v-model="goods.fxmoney" placeholder="" class="w100" />{{goods.mper == 1 ? '元' : '%'}}
                        <template v-if="settings.isucard == 0">
                            ，会员一级<Input v-model="goods.userfxmoney" placeholder="" class="w100" />{{goods.mper == 1 ? '元' : '%'}}
                        </template>
                        
                    </div>
                    <div class="mb10" v-if="settings.fxlevel >= 1">
                        二级<Input v-model="goods.fxmoneya" placeholder="" class="w100" />{{goods.mper == 1 ? '元' : '%'}}
                        <template v-if="settings.isucard == 0">
                        ，会员二级<Input v-model="goods.userfxmoneya" placeholder="" class="w100" />{{goods.mper == 1 ? '元' : '%'}}
                        </template>
                    </div>
                    <div class="mb10" v-if="settings.fxlevel >= 2">
                        三级<Input v-model="goods.fxmoneyb" placeholder="" class="w100" />{{goods.mper == 1 ? '元' : '%'}}
                        <template v-if="settings.isucard == 0">
                        ，会员三级<Input v-model="goods.userfxmoneyb" placeholder="" class="w100" />{{goods.mper == 1 ? '元' : '%'}}
                        </template>
                    </div>
                    <div class="frm_tip" v-if="shop.isdzpaym == 0 && shop.isdzpay == 1 && settings.isdzpay == 1">
                        账户活动余额充足才可以发分销佣金。当前账户活动资金余额：{{shop.actmoney}}，
                        <Dropdown trigger="click" placement="top-start" >
                            <a href="javascript:void(0)" >
                                充值<Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="text-align:center;width:200px;">
                                    <img style="width:100%;" :src="payactqr">
                                </div>
                            </DropdownMenu>
                        </Dropdown> 
                    </div>
                </Col>
            </Row>

            <!-- <template v-if="gtype == 0">
                <Row class="frm_group">
                    <Col span="3" class="frm_title">
                        {{settings.goodbname}}参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods.stock" placeholder="" class="w100" />件，
                            现价<Input v-model="goods.price" placeholder="" class="w100" />元，
                            <template v-if="settings.isucard == 0">
                            平台结算价<Input v-model="goods.userprice" placeholder="" class="w100" />元。
                            </template>
                            
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>

            <template v-if="gtype == 1">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        抢购活动时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        抢购参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods.quickstock" placeholder="" class="w100" />件，
                            每人限抢<Input v-model="goods.quicklimit" placeholder="" class="w100" />件，抢购价
                            <Input v-model="goods.quickprice" placeholder="" class="w100" />元,
                            <template v-if="settings.isucard == 0">
                            会员抢购价<Input v-model="goods.quickuserprice" placeholder="" class="w100" />元。
                            </template>
                            <template v-if="settings.isucard == 0 && settings.ismpr == 1 && settings.isum == 1">
                            会员余额价<Input v-model="goods.quickuserpricejb" placeholder="" class="w100" />元。
                            </template>
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>
            <template v-if="gtype == 2">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        拼团活动时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        拼团参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods.groupstock" placeholder="" class="w100" />件，
                            单买价<Input v-model="goods.gprice" placeholder="" class="w100" />元
                            <template v-if="settings.isucard == 0">
                            ，会员单买价<Input v-model="goods.guserprice" placeholder="" class="w100" />元。
                            </template>
                            <template v-if="settings.isucard == 0 && settings.ismpr == 1 && settings.isum == 1">
                            ，会员单买余额价<Input v-model="goods.guserpricejb" placeholder="" class="w100" />元。
                            </template>
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        团参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <Card class="mb10">
                            <div class="mb20">
                                满足<Input v-model="goods.groupmem" placeholder="" class="w70" />人成团
                                ，限在<Input v-model="goods.grouplimit" placeholder="" class="w70" />小时完成
                                ，拼团价<Input v-model="goods.groupprice" placeholder="" class="w70" />元
                                <template v-if="settings.isucard == 0">
                                ，会员拼团价<Input v-model="goods.groupuserprice" placeholder="" class="w70" />元。
                                </template>
                                <template v-if="settings.isucard == 0 && settings.ismpr == 1 && settings.isum == 1">
                                ，会员拼团余额价<Input v-model="goods.groupuserpricejb" placeholder="" class="w70" />元
                                </template>
                            </div>
                            <div v-for="(item,index) in groupparams" class="mb20">
                                满足<Input v-model="item.groupm" placeholder="" class="w70" />人成团
                                ，限在<Input v-model="item.groupl" placeholder="" class="w70" />小时完成
                                ，拼团价<Input v-model="item.groupp" placeholder="" class="w70" />元
                                <template v-if="settings.isucard == 0">
                                ，会员拼团价<Input v-model="item.groupup" placeholder="" class="w70" />元
                                </template>
                                <template v-if="settings.isucard == 0 && settings.ismpr == 1 && settings.isum == 1">
                                ，会员拼团余额价<Input v-model="item.groupupjb" placeholder="" class="w70" />元
                                </template>
                                <Button size="small" @click="delgroup(index)">删除</Button>
                            </div>

                            <Button type="primary" size="small" @click="addgroup">添加阶梯团参数</Button>
                        </Card>
                        
                        <p class="frm_tip"></p>
                    </Col>
                </Row>

                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        自动成团
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.isautogroup">
                            <Radio label="0" >开启</Radio>
                            <Radio label="1">关闭</Radio>
                        </RadioGroup>
                        <p class="frm_tip">关闭后拼团失败的订单将退款处理</p>
                    </Col>
                </Row>
                <Row class="frm_group" v-if="settings.gerfree > 0">
                    <Col span="3" class="frm_title">
                        团长免单
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.isleadfree">
                            <Radio label="0" >关闭</Radio>
                            <Radio label="1">开启</Radio>
                        </RadioGroup>
                        <p class="frm_tip">开启后拼团成功的订单将给团长返款，自动成团的无法免单</p>
                    </Col>
                </Row>
            </template>
            <template v-if="gtype == 3">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        活动时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        底价购买
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.botbuy">
                            <Radio label="0" >开启</Radio>
                            <Radio label="1">关闭</Radio>
                        </RadioGroup>
                        <p class="frm_tip">不到底价也可以购买</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        限制时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="goods.cutdtime" placeholder="" class="w400" />
                        <p class="frm_tip">单位/小时，例填5，必须在5小时内砍价完成，否则视为失败。若不填则默认可参与到活动结束</p>
                    </Col>
                </Row>
                
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        砍价参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            库存<Input v-model="goods.cutstock" placeholder="" class="w100" />件，
                            起始价<Input v-model="goods.cutprice" placeholder="" class="w100" />元，底价
                            <Input v-model="goods.cutbot" placeholder="" class="w100" />元,
                            <template v-if="settings.isucard == 0">
                            会员底价<Input v-model="goods.cutuserbot" placeholder="" class="w100" />元。
                            </template>
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        每次砍掉价格
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            <Input v-model="goods.cutmin" placeholder="" class="w100" />
                            -<Input v-model="goods.cutmax" placeholder="" class="w100" />
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>

            <template v-if="gtype == 4">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        活动时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        报名参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            报名剩余名额<Input v-model="goods.actstock" placeholder="" class="w100" />，
                            需支付金额<Input v-model="goods.actprice" placeholder="" class="w100" />元，
                            <template v-if="settings.isucard == 0">
                            会员需支付<Input v-model="goods.actuserprice" placeholder="" class="w100" />元。
                            </template>
                            <template v-if="settings.isucard == 0 && settings.ismpr == 1 && settings.isum == 1">
                            会员余额价<Input v-model="goods.actuserpricejb" placeholder="" class="w100" />元。
                            </template>
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>
            <template v-if="gtype == 5">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        开始-开奖时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <DatePicker confirm :value="[quickstart,quickend]" type="datetimerange" placement="bottom-end" placeholder="选择时间" class="w300" @on-change="quickdate"  ></DatePicker>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        抽奖活动参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            参与活动需支付<Input v-model="goods.chouprice" placeholder="" class="w100" />，
                            中奖名额<Input v-model="goods.choustock" placeholder="" class="w100" />，
                            <template>
                            最多可获得<Input v-model="goods.chousmaxs" placeholder="" class="w100" />次邀请幸运码。
                            </template>
                            
                        </div>
                        <p class="frm_tip">需支付填0是不需要支付。最多可获得邀请幸运码填数字，是指分享给好友，好友打开后他可获得的幸运码数量。填0是不可分享获得</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        邀请获得幸运码方式
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.chouitype">
                            <Radio label="0" >被邀请人进入页面即获得</Radio>
                            <Radio label="1">被邀请人参与活动才获得</Radio>
                        </RadioGroup>
                        <p class="frm_tip">是指邀请好友参与活动获得额外的邀请码的方式</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        奖品提示
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10" v-for="(item,index) in goods.lottparams">
                            第 <Input v-model="item.lotstart" placeholder="" class="w100"  />位-
                            第<Input v-model="item.lotend" placeholder="" class="w100"  />位中奖者，奖品等级名称
                            <Input v-model="item.lotpname" placeholder="" class="w100"  />
                            获奖提示文字
                            <Input v-model="item.lotptip" placeholder="" class="w200"  />
                            <a href="javascript:;" @click="delchoutips(index)">删除</a>
                        </div>
                        <a href="javascript:;" @click="addchoutips">添加一项</a>

                        <p class="frm_tip">奖品名称和获奖提示文字将在订单详情里提示</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        到时间开奖
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.opentime">
                            <Radio label="0" >开启</Radio>
                            <Radio label="1">关闭</Radio>
                        </RadioGroup>
                        <p class="frm_tip">关闭后到时间不开奖</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        达到人数开奖
                    </Col>
                    <Col span="18" class="frm_content">
                        <Input v-model="goods.opennum" placeholder="" class="w400" />
                        <p class="frm_tip">填0关闭达到人数开奖功能</p>
                    </Col>
                </Row>
            </template>

            <template v-if="gtype == 6">
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        秒杀时间
                    </Col>
                    <Col span="18" class="frm_content">
                        <Select v-model="goods.mstime" style="width:400px">
                            <Option v-for="(item,index) in killtime" :value="item.start+''" :key="index">每天{{ item.start }}时</Option>
                        </Select>
                        <p class="frm_tip">每天选择的这个时间开始可秒杀抢购</p>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        上架日期限制
                    </Col>
                    <Col span="18" class="frm_content">
                        <RadioGroup v-model="goods.msdatetype">
                            <Radio :label="0" >每天上架</Radio>
                            <Radio :label="1">指定日期上架</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row class="frm_group" v-if="goods.msdatetype == 1">
                    <Col span="3" class="frm_title">
                        上架日期
                    </Col>
                    <Col span="18" class="frm_content">
                        <div>
                            <Button @click="delmsdate(index)" shape="circle" class="mr10 mb10" style="margin-bottom:10px;" v-for="(item,index) in msdateaa" >{{item}}</Button>
                        </div>
                        <div>
                            <DatePicker
                                :open="openmstime"
                                type="date"
                                clearable
                                @on-change="selectmstime">
                                <Button @click="openthemstime" size="small">添加日期</Button>
                            </DatePicker>
                        </div>
                    </Col>
                </Row>
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        秒杀活动参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            每次库存<Input v-model="goods.msstock" placeholder="" class="w100" />，
                            ，秒杀价<Input v-model="goods.msprice" placeholder="" class="w100" />元，
                            <template v-if="settings.isucard == 0">
                            ，会员秒杀价<Input v-model="goods.msuserprice" placeholder="" class="w100" />元。
                            </template>
                            <template v-if="settings.isucard == 0 && settings.ismpr == 1 && settings.isum == 1">
                            会员余额价<Input v-model="goods.msuserpricejb" placeholder="" class="w100" />元。
                            </template>
                            
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template>

            <template v-if="gtype == 8">
                
                <Row class="frm_group" >
                    <Col span="3" class="frm_title">
                        特权商品参数
                    </Col>
                    <Col span="18" class="frm_content">
                        <div class="mb10">
                            每次库存<Input v-model="goods.msstock" placeholder="" class="w100" />
                        </div>
                        <p class="frm_tip"></p>
                    </Col>
                </Row>
            </template> -->
            <Row class="frm_group" v-if="goods.pttype == 1">
                <Col span="3" class="frm_title">
                    票付通参数
                </Col>
                <Col span="18" class="frm_content">
                    <div v-if="goods.rulearray" v-for="(item,index) in goods.rulearray.rulemap">
                        名称：{{item.name}}，进价：{{item.buy_price}}，零售价：{{item.retail_price}}，库存：{{item.storage < 0 ? '无限' : item.storage}}
                    </div>
                </Col>
            </Row>
        </div>
        <div v-show="tabtype == 'many'">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    分享标题
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.sharetitle" type="textarea" :rows="4" class="w400"  placeholder="输入文字" />
                    <p class="frm_tip">这个是用作分享的标题文字</p>
                </Col>
            </Row>

            <Row class="frm_group" v-if="settings.fontsty== 0">
                <Col span="3" class="frm_title">
                    文字描述
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.desc" type="textarea" :rows="4" class="w400"  placeholder="输入文字" />
                    <p class="frm_tip">转发到群后的文字描述内容（公众号分享才有效）</p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" >
                <Col span="3" class="frm_title">
                    详情图片
                </Col>
                <Col span="18" class="frm_content">
                    
                    <Button  size="small" @click="uploadimg('pic')" icon="ios-cloud-upload-outline">选择图片</Button>
                    <Row type="flex" class="mt10">

                        <div class="demo-upload-list" v-for="(item,index) in goods.showpic" :key="index">
                            <img :src="goods.showpic[index]">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-trash-outline" @click.native="delimg(index)"></Icon>
                            </div>
                        </div>
                    </Row>
                    <p class="frm_tip">可不添加</p>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    转发素材术语
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.sharedesc" type="textarea" :rows="4" class="w400"  placeholder="输入文字" />
                    <p class="frm_tip">详情点击分享进入素材后提示复制的内容</p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" >
                <Col span="3" class="frm_title">
                    转发素材图片
                </Col>
                <Col span="18" class="frm_content">
                    
                    <Button  size="small" @click="uploadimg('sharepic')" icon="ios-cloud-upload-outline">选择图片</Button>
                    <Row type="flex" class="mt10">
                        <div class="demo-upload-list" v-for="(item,index) in goods.showsharepic" :key="index">
                            <img :src="goods.showsharepic[index]">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-trash-outline" @click.native="delspic(index)"></Icon>
                            </div>
                        </div>
                    </Row>
                    <p class="frm_tip">详情点击分享进入素材后提示的图片，图片尺寸640X1008，图片右下角请预留210X210像素空白放二维码</p>
                </Col>
            </Row>

            <Row class="frm_group" v-if="settings.ismusic == 0">
                <Col span="3" class="frm_title">
                    背景音乐
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.musicname" type="text" class="w400"   placeholder="" >
                        <Button slot="append" size="small" @click="isshowmusic = true;" icon="ios-cloud-upload-outline">选择音乐</Button>
                    </Input>
                    <Button size="small" type="primary" class="mt10" @click="clearmusicss" icon="ios-trash-outline">清除音乐</Button>
                </Col>
            </Row>

            <Modal title="选择音乐" v-model="isshowmusic" :styles="{top: '20px'}" :loading="true">

                <Row class="frm_group " type="flex" align="middle" v-for="item,index in allmusic">
                    <Col span="18" class="frm_title">
                        {{item.name}}
                    </Col>
                    <Col span="6" class="frm_content">
                        <Button type="primary" size="small" @click="smusic(item)">选择</Button>
                        <Button type="error" v-if="plaing && playindex == index" size="small" @click="stop">停止</Button>
                        <Button type="info" v-else size="small" @click="play(item.showurl,index)">播放</Button>
                        
                    </Col>
                </Row>
            </Modal>
            <audio id="bgMusic">
                <source src="" type="audio/mp3">
            </audio>


            <Row class="frm_group" v-if="!goods.sfailot">
                <Col span="3" class="frm_title">
                    设置视频
                </Col>
                <Col span="18" class="frm_content">
                    <Card>

                        <RadioGroup  class="frm_group" v-model="goods.vtype">
                            <Radio label="0" >手动上传</Radio>
                            <Radio label="1">使用抖音视频</Radio>
                        </RadioGroup>

                        <Row class="frm_group">
                            <Col span="4" class="frm_title">
                                短视频
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="goods.shortv" type="text" class="w400"  placeholder="输入链接" >
                                    <Upload v-if="goods.vtype == '0' || goods.vtype == 0" slot="append" :action="uploadurl" :show-upload-list="false" accept="video/*" :on-success="uploadv">
                                        <Button  size="small" icon="ios-cloud-upload-outline">选择视频</Button>
                                    </Upload>
                                </Input>
                                <p class="frm_tip">请填入视频链接地址</p>
                            </Col>
                        </Row>
                        <Row class="frm_group " type="flex" align="middle" >
                            <Col span="4" class="frm_title">
                                视频封面
                            </Col>
                            <Col span="18" class="frm_content">
                                <Input v-model="goods.vposter" placeholder=""  class="w400" >
                                    <Button slot="append" size="small" @click="uploadimg('vposter')" icon="ios-cloud-upload-outline">选择图片</Button>
                                </Input>
                                <p class="frm_tip">建议尺寸：640X1100</p>
                                <img v-if="goods.showvposter" :src="goods.showvposter" class="showupimg">
                            </Col>
                        </Row>
                        <Row class="frm_group" >
                            <Col span="4" class="frm_title">
                                视频放轮播图上
                            </Col>
                            <Col span="18" class="frm_content">
                                <RadioGroup  class="frm_group" v-model="goods.sliderv">
                                    <Radio label="0" >不放视频</Radio>
                                    <Radio label="1" >放视频</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                        <Row class="frm_group" >
                            <Col span="4" class="frm_title">
                                视频显示在专页内
                            </Col>
                            <Col span="18" class="frm_content">
                                <RadioGroup  class="frm_group" v-model="goods.isv">
                                    <Radio label="0" >不显示</Radio>
                                    <Radio label="1" >显示</Radio>
                                </RadioGroup>
                                <p>若选择不显示，那么不会在视频列表页面内显示</p>
                            </Col>
                        </Row>
                        <Row class="frm_group" >
                            <Col span="4" class="frm_title">
                                优先进入视频页
                            </Col>
                            <Col span="18" class="frm_content">
                                <RadioGroup  class="frm_group" v-model="goods.vfirst">
                                    <Radio label="0" >不进入</Radio>
                                    <Radio label="1" >进入</Radio>
                                </RadioGroup>
                                <p>若选择优先进入视频页，在商品列表页面点击商品会先进入视频页</p>
                            </Col>
                        </Row>

                    </Card>
                </Col>
            </Row>

        </div>
        <div v-show="tabtype == 'form'">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    订单表单
                </Col>
                <Col span="18" class="frm_content">
                    <div class="mb20">
                        <Dropdown @on-click="addform">
                            <Button type="primary">
                                添加元素
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="text">文字</DropdownItem>
                                <DropdownItem name="num">数字</DropdownItem>
                                <DropdownItem name="single">选择一个</DropdownItem>
                                <DropdownItem name="multi">选择多个</DropdownItem>
                                <DropdownItem name="date">选择日期</DropdownItem>
                                <DropdownItem name="time">选择时间</DropdownItem>
                                <DropdownItem name="region">选择地区</DropdownItem>
                                <DropdownItem name="tel">电话号码</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Card v-for="(item,index) in form" class="mb10" style="position:relative;">
                            <Icon type="ios-trash" size="20" @click="delform(index)" style="position:absolute;right:0;top:0;cursor: pointer;" />

                            <Row class="" type="flex" align="middle">
                                <Col span="3" class="frm_title">
                                    {{item.type == 'text' ? '文字' : ''}}
                                    {{item.type == 'num' ? '数字' : ''}}
                                    {{item.type == 'single' ? '多选一个' : ''}}
                                    {{item.type == 'multi' ? '多选多个' : ''}}
                                    {{item.type == 'date' ? '选择日期' : ''}}
                                    {{item.type == 'time' ? '选择时间' : ''}}
                                    {{item.type == 'region' ? '选择地区' : ''}}
                                    {{item.type == 'tel' ? '电话号码' : ''}}
                                </Col>
                                <Col span="18" class="frm_content">
                                    名称<Input v-model="item.name" type="text" class="w200"  placeholder="输入名称" />，
                                    提示文字<Input v-model="item.pla" type="text" class="w200"  placeholder="输入提示内容" />

                                    <div class="mt10" v-if="item.type == 'single' || item.type == 'multi'" >
                                        <Row class="frm_group" >
                                            <Col span="4" class="frm_title">
                                                <Dropdown  placement="bottom" trigger="click">
                                                    <a href="javascript:void(0)">
                                                        添加选项<Icon type="ios-arrow-down"></Icon>
                                                    </a>
                                                    <DropdownMenu slot="list">
                                                        <div style="padding:10px">
                                                            <Input v-model="provalue" placeholder="选项内容" class="w200" />
                                                        </div>

                                                        <div style="text-align: right;margin:10px;">
                                                            <Button type="primary" size="small" @click="addformpro(index)">确定</Button>
                                                        </div>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>
                                            <Col span="18" class="frm_content">
                                                <Button size="small" v-for="(inn,idx) in item.sdata" @click="delsdata(index,idx)" class="mr10 mb10" style="margin-bottom:10px;">{{inn}}</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
        <div v-show="tabtype == 'rule'">
            
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    商品规格
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.isrule">
                        <Radio label="0" >关闭</Radio>
                        <Radio label="1">开启</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" v-if="shop.auth && shop.auth.isfx != 1 && settings.fxlevel != 3">
                <Col span="3" class="frm_title">
                    使用的分销参数
                </Col>
                <Col span="18" class="frm_content">
                   
                    <div class="frm_tip" v-if="shop.isdzpaym == 0 && shop.isdzpay == 1 && settings.isdzpay == 1">
                        账户活动余额充足才可以发分销佣金。当前账户活动资金余额：{{shop.actmoney}}，
                        <Dropdown trigger="click" placement="top-start" >
                            <a href="javascript:void(0)" >
                                充值<Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <div style="text-align:center;width:200px;">
                                    <img style="width:100%;" :src="payactqr">
                                </div>
                            </DropdownMenu>
                        </Dropdown> 
                    </div>
                </Col>
            </Row>
            <Row class="frm_group" v-if="goods.isrule == 1">
                <Col span="3" class="frm_title">
                    规格内容
                </Col>
                <Col span="18" class="frm_content">
                    <Card>
                        
                        <Card class="pd10 mb10" v-for="(item,index) in rulearray" style="position:relative;">
                            <Row class="frm_group "  >
                                <Col span="6" class="frm_title">
                                    {{item.pro.title}}
                                </Col>
                                <Col span="18" class="frm_title">

                                <Poptip
                                    v-for="(inn,idx) in item.data"
                                    confirm
                                    title="确定删除吗？"
                                    @on-ok="delpro(index,idx)"
                                    placement="left">
                                    <Button size="small" class="mr10 mb10" shape="circle" >{{inn.name}}</Button>
                                </Poptip>

                                    
                                </Col>
                            </Row>
                            <Dropdown trigger="click"  class="pd10" v-if="goods.pttype != 1">
                                <Button type="primary" size="small">
                                    添加属性
                                    <Icon type="ios-arrow-down"></Icon>
                                </Button>
                                <DropdownMenu slot="list" class="pd10">
                                    <Row class="frm_group "  type="flex" align="middle">
                                        <Col span="6" class="frm_title">
                                            名称
                                        </Col>
                                        <Col span="18" class="frm_title">
                                            <Input v-model="proname" placeholder="例：白色" class="w150"  />
                                        </Col>
                                    </Row>
                                    <div class="w200 pd10" style="text-align: right;">
                                        <Button size="small" type="warning" @click="addpro(index)">确定</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                            <Icon v-if="goods.pttype != 1" type="md-trash" @click="delrule(index)" style="position: absolute;right: 0;top: 0;font-size: 20px;cursor:pointer;" />
                        </Card>

                        <Dropdown trigger="click"  class="pd10" v-if="goods.pttype != 1">
                            <Button type="primary" size="small">
                                添加规格
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list" class="pd10">
                                <Row class="frm_group "  type="flex" align="middle">
                                    <Col span="6" class="frm_title">
                                        名称
                                    </Col>
                                    <Col span="18" class="frm_title">
                                        <Input v-model="rulename" placeholder="例：颜色" class="w150"  />
                                    </Col>
                                </Row>
                                <div class="w200 pd10" style="text-align: right;">
                                    <Button size="small" type="warning" @click="addrule">确定</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                        
                    </Card>

                    <Card class="mt10">
                        <Row class="mb10">
                            <Col span="3" class="pd5">
                                <Input v-model="setprice.nowprice" placeholder="会员价"   />
                            </Col>
                            <Col span="3" class="pd5">
                                <Input v-model="setprice.uprice" placeholder="结算现价" />
                            </Col>
                            <Col span="3" class="pd5" v-if="gtype == 2">
                                <Input v-model="setprice.groupprice" placeholder="拼团价格" />
                            </Col>
                            <Col span="3" class="pd5" v-if="gtype == 2">
                                <Input v-model="setprice.ugprice" placeholder="会员拼团价格" />
                            </Col>
                            <Col span="3" class="pd5" v-if="settings.ismpr*1 == 1">
                                <Input v-model="setprice.ujb" placeholder="会员余额价格" />
                            </Col>
                            <Col span="3" class="pd5" v-if="gtype == 2">
                                <Input v-model="setprice.gujb" placeholder="会员拼团余额价格" />
                            </Col>
                            <Col span="3" class="pd5" >
                                <Input v-model="setprice.stock" placeholder="库存" />
                            </Col>
                            
                            <Col span="3" class="pd5">
                                <Button @click="setpricefn">批量设置</Button>
                            </Col>
                        </Row>
                        <Table border :columns="columns" :data="table">
                            <template slot-scope="{ row,index }" slot="nowprice">
                                <Input v-model="row.nowprice" placeholder="" @on-change="inputrule($event,'nowprice',index)"  />
                            </template>
                            <template slot-scope="{ row,index }" slot="uprice">
                                <Input v-model="row.uprice" placeholder=""  @on-change="inputrule($event,'uprice',index)" />
                            </template>

                            <template slot-scope="{ row,index }" slot="groupprice">
                                <Input v-model="row.groupprice" placeholder=""  @on-change="inputrule($event,'groupprice',index)" />
                            </template>
                            <template slot-scope="{ row,index }" slot="ugprice">
                                <Input v-model="row.ugprice" placeholder=""  @on-change="inputrule($event,'ugprice',index)" />
                            </template>
                            <template slot-scope="{ row,index }" slot="ujb">
                                <Input v-model="row.ujb" placeholder=""  @on-change="inputrule($event,'ujb',index)" />
                            </template>
                            <template slot-scope="{ row,index }" slot="gujb">
                                <Input v-model="row.gujb" placeholder=""  @on-change="inputrule($event,'gujb',index)" />
                            </template>

                            <template slot-scope="{ row,index }" slot="stock">
                                <Input v-model="row.stock" placeholder=""  @on-change="inputrule($event,'stock',index)" />
                            </template>
                            <template slot-scope="{ row,index }" slot="fx">

                                <div class="mb10">
                                    一级&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Input size="small" v-model="row.fxmoney" @on-change="inputrule($event,'fxmoney',index)" placeholder="" class="w70" />{{goods.mper == 1 ? '元' : '%'}}<br/>
                                    <template v-if="settings.isucard == 0">
                                        会员一级<Input size="small" v-model="row.userfxmoney" @on-change="inputrule($event,'userfxmoney',index)" placeholder="" class="w70" />{{goods.mper == 1 ? '元' : '%'}}
                                    </template>
                                    
                                </div>
                                <div class="mb10" v-if="shop.auth && shop.auth.isfx != 1 && settings.fxlevel >= 1">
                                    二级&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Input size="small" v-model="row.fxmoneya" @on-change="inputrule($event,'fxmoneya',index)" placeholder="" class="w70" />{{goods.mper == 1 ? '元' : '%'}}<br/>
                                    <template v-if="settings.isucard == 0">
                                    会员二级<Input size="small" v-model="row.userfxmoneya" @on-change="inputrule($event,'userfxmoneya',index)" placeholder="" class="w70" />{{goods.mper == 1 ? '元' : '%'}}
                                    </template>
                                </div>
                                <div class="mb10" v-if="shop.auth && shop.auth.isfx != 1 && settings.fxlevel >= 2">
                                    三级&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Input size="small" v-model="row.fxmoneyb" @on-change="inputrule($event,'fxmoneyb',index)" placeholder="" class="w70" />{{goods.mper == 1 ? '元' : '%'}}<br/>
                                    <template v-if="settings.isucard == 0">
                                    会员三级<Input size="small" v-model="row.userfxmoneyb" @on-change="inputrule($event,'userfxmoneyb',index)" placeholder="" class="w70" />{{goods.mper == 1 ? '元' : '%'}}
                                    </template>
                                </div>

                            </template>
                        </Table>
                    </Card>
                </Col>
            </Row>
            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    日期预定
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.isdate">
                        <Radio label="0" >关闭</Radio>
                        <Radio label="1" >开启</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group" v-if="goods.isdate == 1">
                <Col span="3" class="frm_title">
                    每天时间点
                </Col>
                <Col span="18" class="frm_content">
                    <Card>
                        <div>
                            <draggable v-model="goods.datetimes"  >
                                <Button size="small" v-for="(item,index) in goods.datetimes" style="margin:10px 10px 0 0;" @click="deldatetimes(index)">{{item}}</Button>
                            </draggable>
                        </div>

                        <TimePicker :open="openaddtime" confirm format="HH:mm" @on-clear="openaddtime = false"  @on-change="changedatetime" @on-ok="adddatetime($event)" class="mt20">
                            <a href="javascript:void(0)" @click="openaddtime = true">
                                <Icon type="ios-clock-outline"></Icon>
                                添加时间
                            </a>
                        </TimePicker>

                    </Card>
                    <p class="frm_tip">若添加时间点，则要求选择一个时间点</p>
                </Col>
            </Row>
            <Row class="frm_group" v-if="goods.isdate == 1">
                <Col span="3" class="frm_title">
                    预定参数
                </Col>
                <Col span="18" class="frm_content">
                    最多预定<Input v-model="goods.dateday" placeholder="" class="w100" />天内
                    ，每个时间最多预约<Input v-model="goods.datestock" placeholder="" class="w100" />次。
                    <p class="frm_tip">当选择时间后，库存以时间点的为准。</p>
                </Col>
            </Row>
        </div>
        <div v-show="tabtype == 'info'">    
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    腾讯视频
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.video" type="text"  class="w400"  placeholder="输入腾讯视频链接" />
                    <p>
                        <a href="javascript:;" @click="checkv">检测链接是否可用</a>
                    </p>
                </Col>
            </Row>
            <!-- <Row class="frm_group" v-if="settings.isptfx == 1">
                <Col span="3" class="frm_title">
                    平台分销佣金比例
                </Col>
                <Col span="18" class="frm_content">
                    <div class="mb10">
                        一级<Input v-model="shop.auth.fxper" placeholder="" class="w100" />
                        会员一级<Input v-model="shop.auth.ufxper" placeholder="" class="w100" />
                    </div>
                    <div class="mb10" v-if="settings.fxlevel >= 1">
                        二级<Input v-model="shop.auth.fxperp" placeholder="" class="w100" />
                        会员二级<Input v-model="shop.auth.ufxperp" placeholder="" class="w100" />
                    </div>
                    <div class="mb10" v-if="settings.fxlevel >= 2">
                        三级<Input v-model="shop.auth.fxperpp" placeholder="" class="w100" />
                        会员三级<Input v-model="shop.auth.ufxperpp" placeholder="" class="w100" />
                    </div>
                    <p class="frm_tip">单位/%，按支付金额的百分比计算。设置0则按参数设置里的数值计算</p>
                </Col>
            </Row> -->
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    {{settings.goodbname}}详情
                </Col>
                <Col span="18" class="frm_content">
                    <div class="mb10">
                        <Input v-model="wxurl" type="text"  class="w400"  placeholder="采集微信文章，输入微信图文文章链接" search enter-button="采集" @on-search="getwx">
                        </Input>
                    </div>
                    <editor class="w750" :editorhtml="goods.content" fnname="shopedit" @shopedit="shopedit" type="admin" :shopid="shop.id" :uniacid="shop.uniacid" ></editor>
                </Col>
            </Row>
           

        </div>

        <Row class="frm_group">
            <Col span="3" class="frm_title"> &nbsp;</Col>
            <Col span="18">
                <Affix :offset-bottom="20" style="z-index: 1000;position: relative;">
                    <Button type="primary" @click="save">保存</Button>
                </Affix>
            </Col>
        </Row>
        </template>

        <Modal title="选择数据" v-model="showloadp" :styles="{top: '20px'}" :loading="true">

            <Row class="frm_group " type="flex"  >
                <Col span="24" class="frm_title" >
                    <Row v-for="item,index in tempgoods" class="mb5">
                        <Col span="2" class="frm_title">
                            {{item.id}}
                        </Col>
                        <Col span="4" class="frm_title">
                            <Avatar icon="ios-person" size="large" shape="square" :src="item.thumb" />
                        </Col>
                        <Col span="16" class="frm_title">
                            {{item.title}}
                        </Col>
                        <Col span="2" class="frm_content">
                            <Button type="primary" size="small" @click="sditem(item)">选择</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
        </Modal>

        <upload ref="uploadref" type="admin" :sid="shop.id" :uniacid="shop.uniacid" @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import editor from '../../components/editor';
    import upload from '../../components/upload';
    import draggable from 'vuedraggable'
	export default {
	  	components: {
            editor,upload,draggable
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                classes:[
                    {name:'VIP',id:1},
                    {name:'服务商',id:2},
                    {name:'代理商',id:3}
                ],
                receive:[],
                loading : true,
	  			params : {},
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                goods : {
                    title:'',
                    orderact: '0',
                    isuser: '0',
                    content:'',
                    contents:'',
                    hxtype: '0',
                    popknow: '0',
                    actotype: '0',
                    isexpress : '0',
                    istoshop : '0',
                    vtype : '0',
                    sliderv : '0',
                    isv : '0',
                    vfirst : '0',
                    tktype : '0',
                    datetimes : [],
                    receive:1,
                    showimg : [],
                    sortid:'',
                    buy_times_day:''
                },
                uploadurl : '',
                allsort : [],
                allcity : [],
                shoplist : [],
                map : false,
                mark : false,
                joinid : 0,
                uptarget : '',
                tabtype : 'basic',
                actotimestart : '',
                actotimesend : '',
                quickstart : '',
                quickend : '',
                shop : {auth:{isxq:1}},
                sortid : [],
                redbag : [],
                allmusic : [],
                isshowmusic : false,
                form : [],
                provalue : '',
                columns : [],
                columnstemp : [{
                    title: '规格组合',
                    key: 'name',
                    stype : '',
                },
                {
                    title: '会员价',
                    key: 'nowprice',
                    slot : 'nowprice',
                    stype : '',
                },
                {
                    title: '结算价',
                    key: 'uprice',
                    slot : 'uprice',
                    stype : 'u',
                },
                {
                    title: '拼团价',
                    key: 'groupprice',
                    slot : 'groupprice',
                    stype : '',
                },
                {
                    title: '会员拼团价',
                    key: 'ugprice',
                    slot : 'ugprice',
                    stype : 'u',
                },
                {
                    title: '会员余额价',
                    key: 'ujb',
                    slot : 'ujb',
                    stype : 'u',
                },
                {
                    title: '会员拼团余额价',
                    key: 'gujb',
                    slot : 'gujb',
                    stype : 'u',
                },
                {
                    title: '库存',
                    key: 'stock',
                    slot : 'stock',
                    stype : '',
                }],
                table : [],
                proname : '',
                rulearray : [],
                rulename : '',
                gtype : -1,
                allshop : [],
                fanxper : [],
                fanxday : [],
                wxurl : '',
                groupparams : [],
                openmstime : false,
                msdateaa : [],
                playindex: -1,
                plaing : false,
                showloadp : false,
                tempgoods : [],
                openaddtime : false,
                setprice : {},
                alltag : [],
                thistag : [],
              
	  		}
	  	},
        created:function(){
            var self = this;
            var params = this.$route.query;
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?i='+this.uniacid+'&c=utility&a=file&do=upload&upload_type=video';
            this.setcolumns();

            this.addgtype(0);
            this.tabtype = 'info';
            setTimeout(function(){
                self.gtype = -1;
                self.tabtype = 'basic';
            },500)
            
        },
        mounted(){
            var self = this;
            document.title = '添加'+ (this.settings.goodbname ? this.settings.goodbname : '商品');
        },
	  	methods: {
            showload(e){
                this.showloadp = true;
            },
            sditem(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'edit',
                    fromajax : 1,
                    loadid: e.id,
                };
                self.$util.http('good','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.goods = res.obj.info;
                        self.showloadp = false;
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            addgtype(e){
                this.gtype = e;
                this.setcolumns();
            },
            setcolumns(){
                var arr = [];
                for (var i = 0; i < this.columnstemp.length; i++) {
                    if( (this.columnstemp[i].key == 'groupprice' || this.columnstemp[i].key == 'ugprice') && this.gtype != 2 ){
                        continue;
                    }
                    if( this.columnstemp[i].stype == 'u' && this.settings.isucard*1 != 0 ){
                        continue;
                    }
                    if( this.columnstemp[i].stype == 'fx' && this.settings.fxlevel == 3 ){
                        continue;
                    }
                    if( (this.columnstemp[i].key == 'ujb' || this.columnstemp[i].key == 'gujb') && ( this.settings.isucard*1 != 0 || this.settings.isucard*1 != 0 || this.settings.isum*1 != 0 ) ){
                        continue;
                    }
                    arr.push(this.columnstemp[i]);
                }
                this.columns = arr;
            },
            changetab(e){
                if( e == 'change' ){
                    this.gtype = -1;
                }else{
                    this.tabtype = e;
                }
            },
            setpricefn(e){
                for (var i = 0; i < this.table.length; i++) {
                    this.table[i].nowprice = this.setprice.nowprice > 0 ? this.setprice.nowprice : 0;
                    this.table[i].uprice = this.setprice.uprice > 0 ? this.setprice.uprice : 0;
                    this.table[i].groupprice = this.setprice.groupprice > 0 ? this.setprice.groupprice : 0;
                    this.table[i].ugprice = this.setprice.ugprice > 0 ? this.setprice.ugprice : 0;
                    this.table[i].ujb = this.setprice.ujb > 0 ? this.setprice.ujb : 0;
                    this.table[i].gujb = this.setprice.gujb > 0 ? this.setprice.gujb : 0;
                    this.table[i].stock = this.setprice.stock > 0 ? this.setprice.stock : 0;

                    this.table[i].fxmoney = this.setprice.fxa > 0 ? this.setprice.fxa : 0;
                    this.table[i].userfxmoney = this.setprice.fxa > 0 ? this.setprice.fxa : 0;
                    this.table[i].fxmoneya = this.setprice.fxb > 0 ? this.setprice.fxb : 0;
                    this.table[i].userfxmoneya = this.setprice.fxb > 0 ? this.setprice.fxb : 0;
                    this.table[i].fxmoneyb = this.setprice.fxc > 0 ? this.setprice.fxc : 0;
                    this.table[i].userfxmoneyb = this.setprice.fxc > 0 ? this.setprice.fxc : 0;

                }
            },
            stop(){
                var audio = document.getElementById("bgMusic");
                audio.pause();
                this.plaing = false;
            },
            play(url,index){
                var audio = document.getElementById("bgMusic");
                this.playindex = index;
                audio.src = url;
                audio.play();
                this.plaing = true;
            },
            clearmusicss(){
                this.goods.musicname = '';
                this.goods.musicid = 0;
                this.isshowmusic = true;
                this.isshowmusic = false;
            },
            openthemstime(){
                this.openmstime = true;
            },
            selectmstime(e){
                this.msdateaa.push(e);
                this.openmstime = false;
            },
            delmsdate(e){
                this.msdateaa.splice(e,1);
            },
            searchdate(e){
                if( !this.goods.actotime ){
                    this.goods.actotime = {};
                }
                this.actotimestart = this.goods.actotime.start = e[0];
                this.actotimesend = this.goods.actotime.end = e[1];

            },
            quickdate(e){
                if( !this.goods.time ){
                    this.goods.time = {};
                }
                this.quickstart = this.goods.time.start = e[0];
                this.quickend = this.goods.time.end = e[1];
            },
            smusic(e){
                this.goods.musicname = e.name;
                this.goods.musicid = e.id;
                this.isshowmusic = false;
            },
            addknow(){
                if( !this.goods.know ){
                    this.$set(this.goods,'know',['']);
                }else{
                    this.goods.know.push('');
                }
            },
            delknow(e){
                this.goods.know.splice(e,1);
            },
            addtips(){
                if( !this.goods.tips ){
                    this.$set(this.goods,'tips',['']);
                }else{
                    this.goods.tips.push('');
                }
            },
            deltips(e){
                this.goods.tips.splice(e,1);
            },
            addfanx(){
                if( !this.fanxper ){
                    this.$set(this,'fanxper',['']);
                    this.$set(this,'fanxday',['']);
                }else{
                    this.fanxper.push('');
                    this.fanxday.push('');
                }
            },
            delfanx(e){
                this.fanxper.splice(e,1);
                this.fanxday.splice(e,1);
            },
            addchoutips(){
                if( !this.goods.lottparams ){
                    this.$set(this.goods,'lottparams',[]);
                }
                this.goods.lottparams.push({});
            },
            delchoutips(e){
                this.goods.lottparams.splice(e,1);
            },
            addformpro(e){
                if( !this.provalue ) return false;

                if( !this.form[e].sdata ){
                    this.$set(this.form[e],'sdata',[]);
                }
                this.form[e].sdata.push(this.provalue);
                this.provalue = '';
            },
            delsdata(i,d){
                this.form[i].sdata.splice(d,1);
            },
            setsort(e){
                if( e[0] ) this.goods.sortid = e[0];
                if( e[1] ) this.goods.sorttwo = e[1];
            },
            shopedit(e){
                this.$set(this.goods,'content',e);
            },
            contents(e){
                 this.goods.contents = e;
            },
            shopinfo(e){
                this.goods.shopinfo = e;
            },
            addthis(){
                this.goods.params.push({itemt:''});
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                var self = this;
                if( this.uptarget == 'thumb' ){
                    this.$set(this.goods,'thumb',e.attachment);
                    this.$set(this.goods,'showthumb',e.url);
                }else if(  this.uptarget == 'thumbh' ){
                    this.$set(this.goods,'thumbh',e.attachment);
                    this.$set(this.goods,'showthumbh',e.url);
                }else if(  this.uptarget == 'pic' ){
                    if( !this.goods.pic ){
                        this.goods.pic = [];
                        this.$set(this.goods,'showpic',[]);
                    }
                    this.goods.pic.push(e.attachment);
                    this.goods.showpic.push(e.url);
                    this.$set(this.goods,'showpic',this.goods.showpic);
                }else if(  this.uptarget == 'img' ){
                    if( !this.goods.img ){
                        this.goods.img = [];
                        this.$set(this.goods,'showimg',[]);
                    }
                    this.goods.img.push(e.attachment);
                    this.goods.showimg.push(e.url);
                    this.$set(this.goods,'showimg',this.goods.showimg);

                }else if(  this.uptarget == 'sharepic' ){
                    if( !this.goods.sharepic ){
                        this.goods.sharepic = [];
                        this.$set(this.goods,'showsharepic',[]);
                    }
                    if( this.goods.sharepic.length >= 9 ){
                        this.$Message.error('最多9张图片');
                        return false;
                    }
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
                            self.goods.sharepic.push(e.attachment);
                            self.goods.showsharepic.push(e.url);
                            self.$set(self.goods,'showsharepic',self.goods.showsharepic);
                        }
                    } 

                }else if(  this.uptarget == 'vposter' ){
                    this.$set(this.goods,'vposter',e.attachment);
                    this.$set(this.goods,'showvposter',e.url);

                }
            },
            delimg(e){
                this.goods.pic.splice(e,1);
                this.goods.showpic.splice(e,1);
            },
            delimga(e){
                this.goods.img.splice(e,1);
                this.goods.showimg.splice(e,1);
            },
            delspic(e){
                this.goods.sharepic.splice(e,1);
                this.goods.showsharepic.splice(e,1);
            },
            uploadv(e){
                if( e.attachment ){
                    this.goods.shortv = e.attachment;
                }else{
                    this.$Message.error(e.message);
                }
            },
            addform(e){
                var id = 'i' + new Date().getTime();
                this.form.push({
                    id : id,
                    type : e,
                });
            },
            delform(e){
                this.form.splice(e,1);
            },
            addrule(e){

                if( !this.rulename ){
                    this.$Message.error('请填写名称');
                    return false;
                }

                var id = new Date().getTime();
                var newpro = {pro:{id:id,title:this.rulename},data:[]};
                
                this.rulearray.push(newpro);
                this.rulename = '';
                this.$Message.success('已添加');
            },
            addpro(e){

                if( !this.proname ){
                    this.$Message.error('请填写名称');
                    return false;
                }

                var id = new Date().getTime();
                var newarr = {id:id,name:this.proname}
                
                this.rulearray[e].data.push(newarr);
                this.proname = '';
                this.$Message.success('已添加');
                this.settable();
            },
            delpro(index,idx){
                if(this.goods.pttype == 1) {
                    this.$Message.error('票付通商品不可删除');
                    return false;
                }

                this.rulearray[index].data.splice(idx,1);
                this.settable();
            },
            settable(){
                var ruledata = [];
                for(var i = 0 ; i < this.rulearray.length ; i++){
                    if(this.rulearray[i].data.length > 0) 
                        ruledata.push(this.rulearray[i].data);
                }
                this.table  = this.doExchange(ruledata);
            },
            inputrule(e,type,index){
                this.table[index][`${type}`] = e.target.value;
            },
            delrule(e){
                this.rulearray.splice(e,1);
                this.settable();
            },
            checkv(){
                var self = this;
                if( !self.goods.video ){
                    self.$Message.error('请填写链接');
                    return false;
                }
                var postdata = {
                    p:'admin',
                    op : 'testvideo',
                    fromajax : 1,
                    url: self.goods.video,
                };
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.info(res.res);
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            getwx(){
                var self = this;
                if( !self.wxurl ){
                    self.$Message.error('请填写链接');
                    return false;
                }
                var postdata = {
                    p:'admin',
                    op : 'cwxat',
                    fromajax : 1,
                    url: self.wxurl,
                };
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$set(self.goods,'content',res.obj.c);
                        self.wxurl = '';
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            addgroup(){
                if( !this.groupparams ){
                    this.groupparams = [];
                }
                this.groupparams.push({groupm:'',groupl:'',groupp:'',groupup:'',groupupjb:''});
            },
            delgroup(e){
                this.groupparams.splice(e,1);
            },
            changedatetime(e){
                this.datetimess = e;
            },
            adddatetime(){
                if( !this.goods.datetimes ) this.goods.datetimes = [];

                var isin = 0;
                for (var i = 0; i < this.goods.datetimes.length; i++) {
                    if( this.goods.datetimes[i] == this.datetimess ){
                        isin = 1;
                    }
                }
                if( isin == 1 ){
                    this.$Message.error('此时间已经存在');
                    return false;
                }
                this.goods.datetimes.push(this.datetimess);
                this.openaddtime = false;
            },
            deldatetimes(e){
                this.goods.datetimes.splice(e,1);
            },
            save(e){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'addgoods',
                    fromajax : 1,
                    isdefault : self.gtype == 0 ? 1 : 0,
                    isquick   : self.gtype == 1 ? 1 : 0,
                    isgroup   : self.gtype == 2 ? 1 : 0,
                    iscut     : self.gtype == 3 ? 1 : 0,
                    isact     : self.gtype == 4 ? 1 : 0,
                    ischou    : self.gtype == 5 ? 1 : 0,
                    isms      : self.gtype == 6 ? 1 : 0,
                    istequan  : self.gtype == 8 ? 1 : 0,
                    shoplista : self.allshop,
                    gid : self.goods.id > 0 ? self.goods.id : 0,
                    actotime : {start:self.actotimestart,end:self.actotimesend},
                    quicktime : {start:self.quickstart,end:self.quickend},
                    grouptime : {start:self.quickstart,end:self.quickend},
                    cuttime : {start:self.quickstart,end:self.quickend},
                    acttime : {start:self.quickstart,end:self.quickend},
                    choutime : {start:self.quickstart,end:self.quickend},
                    fanxpera : self.fanxper,
                    fanxdaya : self.fanxday,
                    formname : [],
                    formpla : [],
                    formtype : [],
                    formnum : [],
                    sitem : [],
                    rule : self.rulearray,
                    rulemap : self.table,
                    groupma : [],
                    groupla : [],
                    grouppa : [],
                    groupupa : [],
                    receive: self.goods.receive,
                    buy_times_day: self.goods.buy_times_day,
                    groupupjba : [],
                    lotstarta : [],
                    lotenda : [],
                    lotpnamea : [],
                    lotptipa : [],
                    killtime : [],
                    msdate : self.goods.msdatetype,
                    msdatea : [],
                    msdateaa : self.msdateaa,
                    thistag : self.thistag,
                    sharepic : self.goods.sharepic ? self.goods.sharepic : '',
                    sharedesc : self.goods.sharedesc ? self.goods.sharedesc : '',
                }

                for(var t in this.form){
                    postdata.formname.push( this.form[t].name );
                    postdata.formpla.push( this.form[t].pla );
                    postdata.formtype.push( this.form[t].type );
                    postdata.formnum.push( this.form[t].num ? this.form[t].num : '' );
                    postdata.sitem.push( this.form[t].sdata ? this.form[t].sdata : '' );
                }
                for(var t in this.groupparams){
                    postdata.groupma.push( this.groupparams[t].groupm );
                    postdata.groupla.push( this.groupparams[t].groupl );
                    postdata.grouppa.push( this.groupparams[t].groupp );
                    postdata.groupupa.push( this.groupparams[t].groupup ? this.groupparams[t].groupup : '' );
                    postdata.groupupjba.push( this.groupparams[t].groupupjb ? this.groupparams[t].groupupjb : '' );
                }
                for(var t in this.goods.lottparams){
                    postdata.lotstarta.push( this.goods.lottparams[t].lotstart );
                    postdata.lotenda.push( this.goods.lottparams[t].lotend );
                    postdata.lotpnamea.push( this.goods.lottparams[t].lotpname );
                    postdata.lotptipa.push( this.goods.lottparams[t].lotptip );
                }

                for(var t in this.goods){
                    if( !postdata[t] ) postdata[t] = this.goods[t];
                }

                self.$util.http('ajax','POST',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已保存');
                        if( self.goods.id > 0 ){
                            //self.$router.push('/admingoods');
                        }else{
                            self.$router.push('/admingoods');
                        }
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                if( params.type ){
                    setTimeout(function(){
                        self.gtype = params.type;
                    },600)
                }

                var postdata = {
                   
                    op : 'edit',
                    fromajax : 1,
                    id : id,
                }
                //self.loading = false;
                self.$util.http('goods','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        self.loading = false;
                        self.allsort = res.obj.allsort;
                        self.redbag = res.obj.redbag;
                        self.allmusic = res.obj.music;
                        self.tempgoods = res.obj.tempgoods;
                        self.shop = res.obj.shop;
                        self.payactqr = res.obj.payactqr;
                        if( !self.shop.auth ){
                            self.shop.auth = {};
                        }

                        self.shoplist = res.obj.shoplist;
                        self.killtime = res.obj.killtime;
                        self.alltag = res.obj.alltag;

                        if( res.obj.info ){
                            for(var t in res.obj.info){
                                self.$set(self.goods,t,res.obj.info[t]);
                            }
                            
                            setTimeout(function(){
                                self.gtype = res.obj.info.type;
                            },600)
                            
                            self.allshop = res.obj.info.shoplist ? res.obj.info.shoplist : [];
                            self.thistag = res.obj.info.thistag ? res.obj.info.thistag : [];

                            self.actotimestart = res.obj.info.actotime ? res.obj.info.actotime.start : '';
                            self.actotimesend = res.obj.info.actotime ? res.obj.info.actotime.end : '';

                            if( res.obj.info.fanxper ){
                                for (var i = 0; i < res.obj.info.fanxper.length; i++) {
                                    self.fanxper.push(res.obj.info.fanxper[i].per);
                                    self.fanxday.push(res.obj.info.fanxper[i].day);
                                }
                            }
                            if( res.obj.info.rulearray && res.obj.info.rulearray.rule ){
                                self.rulearray = res.obj.info.rulearray.rule;
                                self.table = res.obj.info.rulearray.rulemap;
                            }

                            self.goods.content = res.obj.info.content ? res.obj.info.content : '';
                            self.goods.contents = res.obj.info.contents ? res.obj.info.contents : '';
                            self.goods.shopinfo = res.obj.info.shopinfo ? res.obj.info.shopinfo : '';
                            self.goods.sortid = res.obj.info.sortid;
                            self.quickstart = res.obj.info.time ? res.obj.info.time.start : '';
                            self.quickend = res.obj.info.time ? res.obj.info.time.end : '';

                            self.msdateaa = res.obj.info.msdateaa ? res.obj.info.msdateaa : [];
                            
                            if( res.obj.info.type == 1 ){
                                self.goods.quickstock = self.goods.stock;
                                self.goods.quickprice = self.goods.price;
                                self.goods.quickuserprice = self.goods.userprice;
                                self.goods.quickuserpricejb = self.goods.userpricejb;
                            
                            }else if( res.obj.info.type == 2 ){
                                self.goods.groupstock = self.goods.stock;
                                self.goods.gprice = self.goods.price;
                                self.goods.guserprice = self.goods.userprice;
                                self.goods.guserpricejb = self.goods.userpricejb;
                                self.goods.grouplimit = self.goods.grouptime;
                                self.goods.isautogroup = self.goods.groupauto;
                            }else if( res.obj.info.type == 3 ){
                                self.goods.cutstock = self.goods.stock;
                                self.goods.cutprice = self.goods.price;
                            
                            }else if( res.obj.info.type == 4 ){
                                self.goods.actstock = self.goods.stock;
                                self.goods.actprice = self.goods.price;
                                self.goods.actuserprice = self.goods.userprice;
                                self.goods.actuserpricejb = self.goods.userpricejb;
                            }else if( res.obj.info.type == 5 ){
                                self.goods.choustock = self.goods.stock;
                            }else if( res.obj.info.type == 6 ){
                                self.goods.msstock = self.goods.stock;
                                self.goods.msprice = self.goods.price;
                                self.goods.msuserprice = self.goods.userprice;
                                self.goods.msuserpricejb = self.goods.userpricejb;
                            }else if( res.obj.info.type == 8 ){
                                self.goods.receive = self.goods.receive;
                                
                                
                                
                            }

                            self.groupparams = res.obj.info.groupparams ? res.obj.info.groupparams : [];
                            
                        }
                        if( res.obj.form ){
                            self.form = res.obj.form;
                        }

                        self.setcolumns();

                        

                    }else{
                        if( res.res ) self.$Message.error(res.res);
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
            doExchange(doubleArrays){
                var len = doubleArrays.length; //计算长度
                if (len >= 2) { //到维数组计算组合
                    var len1 = doubleArrays[0].length;
                    var len2 = doubleArrays[1].length;
                
                    var newlen = len1 * len2;
                    var temp = [];
                    var index = 0;
                    for (var i = 0; i < len1; i++) {
                        for (var j = 0; j < len2; j++) {
                            var id = doubleArrays[0][i].id + ":" + doubleArrays[1][j].id;
                            var name = doubleArrays[0][i].name + ":" + doubleArrays[1][j].name;
                            temp.push({id:id,name:name});
                            index++;
                        }
                    }
                    //组合已组合和剩余的数组
                    var newArray = new Array(len- 1);
                    newArray[0] = temp;
                    if (len > 2) {
                       var _count = 1;
                       for(var i=2;i<len;i++){
                           newArray[_count] = doubleArrays[i];
                           _count ++;
                       }
                    }
                    return this.doExchange(newArray);
                    
                }else if(len == 1){ //一维数组直接返回结果
                    if(typeof this.table != 'undefined'){
                        for(var i = 0 ; i < doubleArrays[0].length ; i ++){
                            for(var j = 0 ; j < this.table.length ; j ++){
                                if(doubleArrays[0][i].id == this.table[j].id){
                                    doubleArrays[0][i].nowprice = this.table[j].nowprice;
                                    //doubleArrays[0][i].jifen = this.table[j].jifen ? this.table[j].jifen : 0;
                                    doubleArrays[0][i].stock = this.table[j].stock;
                                }
                            }
                        }
                    }
                    return doubleArrays[0];
                }
            },

	  	}
  	}
</script>

<style type="text/css" scoped>
.pd5{
    padding: 5px;
}

</style>