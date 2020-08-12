<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Button type="primary" @click="addsort">添加分类</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="shop">
                        {{row.shop.name}}
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">正常</p>
                        <p class="font" v-if="row.status == 1">已下架</p>
                    </template>
                    <template slot-scope="{ row }" slot="thumb">
                        <Avatar icon="ios-person" size="large" shape="square" :src="row.showimg" />
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a href="javascript:;" @click="edit(row)" >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deletesort')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                        </p>
                        
                        <a v-if="settings.account && (settings.account.type == 4 || settings.account.type == 7)" href="javascript:;" :data-copy="'/zofui_sales/sort/index?status='+row.id" @click="bindtap($event,'copy')" >复制路径</a>
                        <a v-else href="javascript:;" :data-copy="row.appurl" @click="bindtap($event,'copy')"  >复制路径</a>
                        <p>
                            <Dropdown placement="left" :visible="visible && actitem == index" trigger="custom" >
                                <a href="javascript:void(0)" @click="handleOpen(index)">
                                    添加子分类
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <p style="padding:10px">
                                        <Input v-model="sorttwo" placeholder="输入分类名称" />
                                    </p>
                                    <p style="padding:10px">
                                        <Input v-model="sorttwoimg" placeholder="分类图标" >
                                            <Button slot="append" size="small" @click="uploadimg('imgd')" icon="ios-cloud-upload-outline"></Button>
                                        </Input>
                                    </p>
                                    <div style="text-align: right;margin:10px;">
                                        <Button type="primary" size="small" @click="addsorttwo(row.id)">提交</Button>
                                        <Button type="default" size="small" @click="cancel">取消</Button>
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </p>
                    </template>
                    <template slot-scope="{ row, index }" slot="down">

                        <Dropdown v-for="(inn,key) in row.down" :key="key" placement="left" :visible="visibledown && actitem == index && actitemdown == key" trigger="custom" >
                            <Button size="small" style="margin:0 5px 5px 0;"  shape="circle" @click="showdown(index,key)">{{inn.name}}</Button>
                            <DropdownMenu slot="list">
                                <div style="padding:10px">
                                    <Input v-model="inn.name" placeholder="输入分类名称" />
                                </div>
                                <div style="padding:10px">
                                    <Input v-model="inn.img" placeholder="分类图标" >
                                        <Button slot="append" size="small" @click="uploadimg('imgdd')" icon="ios-cloud-upload-outline"></Button>
                                    </Input>
                                    <div style="margin-top:5px;">
                                        <Avatar shape="square" icon="ios-person" :src="inn.showimg" size="large" />
                                    </div>
                                </div>
                                <div style="text-align: right;margin:10px;">
                                    <Button size="small" type="primary" @click="addsorttwo(row.id,inn.id,inn.name,inn.img)">保存</Button>
                                    <Button size="small" @click="dealthis(inn.id,'deletesort')" type="error">删除</Button>
                                    <Button size="small" @click="canceldown" type="default">取消</Button>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                        
                    </template>
                </Table>
                
            </Col>
        </Row>
        <Row style="margin-top:10px;">
            <Col span="6">
                <Dropdown trigger="click" placement="top" @on-click="dealselect">
                    <Button type="primary">
                        选择批量操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="deleteallsort">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                
            </Col>
        </Row>

    <Modal title="添加分类" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                排序序号
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.number" placeholder="" clearable  />
                <P class="frm_tip">填数字，数字越大越靠前</P>
            </Col>
            
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                分类名称
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.name" placeholder="" clearable  />
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                状态
            </Col>
            <Col span="18" class="frm_content">
                <RadioGroup v-model="sort.status">
                    <Radio label="0" value="0">上架</Radio>
                    <Radio label="1" value="1">下架</Radio>
                </RadioGroup>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                图标
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.img" placeholder=""   >
                    <Button slot="append" size="small" @click="uploadimg('img')" icon="ios-cloud-upload-outline">选择图片</Button>
                </Input>
                <p class="frm_tip">建议尺寸：100X100</p>
            </Col>
            
        </Row>
    </Modal>
    <upload ref="uploadref" @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import upload from '../../components/upload';
	export default {
	  	components: {
            upload
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  			params : {},
                uploadurl : '',
	  			list : [],
	  			allsort : [],
                total : 0,
                nowtime : Date.parse(new Date())/1000,
                columns : [
                    {type: 'selection',width:50},
                    {title:'ID',key:'id',width:100},
                    {title:'名称',key:"name"},
                    {title:'图片',key:"thumb",slot: 'thumb',},
                    {title:'序号',key:'number'},
                    {title:'子分类',key:'down',slot: 'down',},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'goods',
                        op : 'sort',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                showadd : false,
                selected : [],
                sort: {},
                sorttwo : '',
                actitem : 0,
                actitemdown : 0,
                visible : false,
                sorttwoimg : '',
                visibledown : false,
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
        },
	  	activated:function(e){},
	  	methods: {
            showdown(e,i){
                this.actitem = e;
                this.actitemdown = i;
                this.visibledown = true;
            },
            canceldown(){
                this.visibledown = false;
            },
            cancel(){
                this.visible = false;
            },
            handleOpen(e){
                this.visible = true;
                this.actitem = e;
            },
            confirm(){
                var self = this;
                var postdata = {
                    op : 'addgoodsort',
                    fromajax : 1,
                    fid : self.sort.id ? self.sort.id : 0,
                    name : self.sort.name,
                    status : self.sort.status,
                    number : self.sort.number,
                    img : self.sort.img,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.showadd = false;
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            uploadimg(type){
                this.uptarget = type;
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                if( this.uptarget == 'img' ){
                    this.$set(this.sort,'img',e.attachment);
                }else if( this.uptarget == 'imgd' ){
                    this.sorttwoimg = e.attachment;
                }else if( this.uptarget == 'imgdd' ){
                    this.$set(this.list[this.actitem]['down'][this.actitemdown],'img',e.attachment);
                    this.$set(this.list[this.actitem]['down'][this.actitemdown],'showimg',e.url);
                }
            },
            addsorttwo(id,did,name,img){
                var self = this;
                var postdata = {
                    op : 'addzfl',
                    fromajax : 1,
                    id : id,
                    did : did ? did : 0,
                    name : name ? name : self.sorttwo,
                    img : img ? img : self.sorttwoimg,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.sorttwo = '';
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
            edit(e){
                this.sort = e;
                this.showadd = true;
            },
            addsort(){
                this.sort = {};
                this.showadd = true;
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
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.list = res.obj.list;
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


</style>