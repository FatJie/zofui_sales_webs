<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Tabs value="jifenadd" @on-click="changetab">
            <TabPane label="商品列表" name="jifenlist" ></TabPane>
            <TabPane label="添加商品" name="jifenadd" ></TabPane>
            <TabPane label="商品分类" name="jifensort" ></TabPane>
            <TabPane label="等待发奖" name="jifenwait" ></TabPane>
            <TabPane label="已经发奖" name="jifensended" ></TabPane>
            <TabPane label="已经完成" name="jifencomed" ></TabPane>
            <TabPane label="等待支付" name="jifenwaitpay" ></TabPane>
            <TabPane label="积分卡密" name="jifencode" ></TabPane>
        </Tabs>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    商品名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.name" type="textarea" :rows="4" placeholder="" class="w400"  />
                    <p class="frm_tip"></p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    所属分类
                </Col>
                <Col span="18" class="frm_content">
                    <Select filterable v-model="goods.sortid" class="w400">
                        <Option v-for="item in allsort" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    封面图片
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.thumb" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('thumb')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">建议设置成正方形图片，尺寸200X200(像素)</p>
                    <img v-if="goods.showthumb" :src="goods.showthumb" style="width:80px;height:80px;">
                </Col>
            </Row>
            
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    剩余库存
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.stock" placeholder="" class="w400"  />
                    <p class="frm_tip">若设置了规格，以规格内的库存为有效值</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    商品价值
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.price" placeholder="" class="w400"  />
                    <p class="frm_tip">仅做展示作用</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    支付运费
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.express" placeholder="" class="w400"  />
                    <p class="frm_tip">实际支付金额是价格加上此运费</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    兑换需要{{settings.jfbname}}
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.need" placeholder="" class="w400"  />
                    <p class="frm_tip">填入数字，前端会显示此数据加真实浏览</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    需额外支付金额
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="goods.fee" placeholder="" class="w400"  />
                    <p class="frm_tip">需要额外支付的金额，若设置了规格，以规格内的价格为有效值</p>
                </Col>
            </Row>
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
                            <Dropdown trigger="click"  class="pd10">
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
                            <Icon type="md-trash" @click="delrule(index)" style="position: absolute;right: 0;top: 0;font-size: 20px;cursor:pointer;" />
                        </Card>

                        <Dropdown trigger="click"  class="pd10">
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
                        
                        <Table border :columns="columns1" :data="table">
                            <template slot-scope="{ row,index }" slot="price">
                                <Input v-model="row.nowprice" placeholder="" @on-change="inputrule($event,'nowprice',index)"  />
                            </template>
                            <template slot-scope="{ row,index }" slot="jifen">
                                <Input v-model="row.jifen" placeholder=""  @on-change="inputrule($event,'jifen',index)" />
                            </template>
                            <template slot-scope="{ row,index }" slot="stock">
                                <Input v-model="row.stock" placeholder=""  @on-change="inputrule($event,'stock',index)" />
                            </template>
                        </Table>
                        
                    </Card>

                </Col>
            </Row>


            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    接收消息客服
                </Col>
                <Col span="21" class="frm_content">
                    <CheckboxGroup v-model="goods.adminlist">

                        <Row class="frm_group" v-for="item in alladmin">
                            <Col span="6" class="frm_title">
                                {{item.user.nickname}}
                            </Col>
                            <Col span="18" class="frm_content">
                                <Checkbox :label="item.id">接收消息</Checkbox>
                            </Col>
                        </Row>
                        
                    </CheckboxGroup>

                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    状态
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="goods.status*1">
                        <Radio :label="0" >正常</Radio>
                        <Radio :label="1" >下架</Radio>
                    </RadioGroup>
                </Col>
            </Row>

            <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    详情描述
                </Col>
                <Col span="18" class="frm_content">
                    <editor :editorhtml="goods.content" fnname="shopedit" @shopedit="shopedit" ></editor>
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Button type="primary" @click="save">保存</Button>
                </Col>
            </Row>
        </div>

    <upload ref="uploadref" @uploadmethod="uploadmethod"></upload>    
    </div>
</template>

<script type="text/javascript">
    import editor from '../../components/editor'
    import upload from '../../components/upload';
	export default {
	  	components: {
            editor,upload
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
	  			list : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                goods : {title:'',img:[],showimg:[],know:[]},
                uploadurl : '',
                isshowgoods : false,
                allcard : [],
                alladmin : [],
                showgoodstype : 0,
                goodsarr : [],
                limittime : 0,
                rulename : '',
                proname : '',
                rulearray : [],
                adminlist : [],
                table : [],
                allsort : [],
                columns1 : [{
                    title: '规格组合',
                    key: 'name',
                },
                {
                    title: '商品价格',
                    key: 'nowprice',
                    slot : 'price',

                },
                {
                    title: '需要积分',
                    key: 'jifen',
                    slot : 'jifen',
                },
                {
                    title: '商品库存',
                    key: 'stock',
                    slot : 'stock',
                }],

	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	methods: {
            changetab(e){
                this.$router.push(e);
            },
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if( this.uptarget == 'thumb' ){
                    this.$set(this.goods,'thumb',e.attachment);
                    this.$set(this.goods,'showthumb',e.url);
                }
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
                //this.$set(this.table[index],`${type}`,);
                this.table[index][`${type}`] = e.target.value;
            },
            shopedit(e){
                this.$set(this.goods,'content',e);
            },
            delrule(e){
                this.rulearray.splice(e,1);
                this.settable();
            },
            del(e){
                this.goodsarr.splice(e,1);
                this.settable();
            },
            delimg(e){
                this.goods.img.splice(e,1);
                this.goods.showimg.splice(e,1);
            },
            addthis(){
                this.isshowgoods = !this.isshowgoods;
            },
            searchdate(e){
                //console.log(e)
                this.start = e[0];
                this.end = e[1];
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
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
                                    doubleArrays[0][i].jifen = this.table[j].jifen;
                                    doubleArrays[0][i].stock = this.table[j].stock;
                                }
                            }
                        }
                    }
                    return doubleArrays[0];
                }
            },
            save(e){
                var self = this;
                var postdata = {
                    op : 'create',
                    fromajax : 1,
                    name : this.goods.name,
                    thumb : this.goods.thumb,
                    price : this.goods.price,
                    need : this.goods.need,

                    status : this.goods.status,
                    stock : this.goods.stock,
                    fee : this.goods.fee,
                    sortid : this.goods.sortid,
                    isrule : this.goods.isrule,
                    express : this.goods.express,
                    adminlist : this.goods.adminlist,
                    rule : JSON.stringify(this.rulearray),
                    rulemap : JSON.stringify(this.table),

                    content : this.goods.content,
                    id : this.goods.id > 0 ? this.goods.id : 0,
                }
                self.$util.http('jifen','post',postdata,function(res){
                    if( res.type == 'success' ){
                        self.$Message.success('已保存');
                    }else{
                        self.$Message.error(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var postdata = {
                    op : 'edit',
                    fromajax : 1,
                    id : id,
                }

                self.$util.http('jifen','GET',postdata,function(res){
                    if( res.status == 200 ){
                        
                        if( res.obj.info && res.obj.info.id ){
                            self.goods = res.obj.info;
                            

                            self.rulearray = res.obj.info.rulearray && res.obj.info.rulearray.rule ? res.obj.info.rulearray.rule : [];
                            self.table = res.obj.info.rulearray && res.obj.info.rulearray.rulemap ? res.obj.info.rulearray.rulemap : [];
                        }
                        
                        self.allsort = res.obj.allsort;
                        self.alladmin = res.obj.alladmin;
                        self.loading = false;

                    }else{
                        self.$Message.error(res.res);
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

.demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>