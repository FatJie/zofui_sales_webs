<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
<audio id="bgMusic">
    <source src="" type="audio/mp3">
</audio>
        <Row style="margin-bottom:10px;">
            <Col span="24">
                <Button type="primary" @click="loadmusic">导入背景音乐</Button>
                <Button type="primary" @click="addsort">添加背景音乐</Button>
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
                        <p class="font-error" v-if="row.status == 1">已下架</p>
                    </template>
                    <template slot-scope="{ row,index }" slot="thumb">
                        <a href="javascript:;" :data-url="row.showurl" class="play_music" status="0" @click="play(row.showurl,index)" >播放</a>
                        <a href="javascript:;" :data-url="row.showurl" class="play_music" status="0" @click="stop" v-if="plaing && playindex == index">停止</a>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a href="javascript:;" @click="edit(row)" >编辑</a>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'deletemusic')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
                        </p>
                        <p>
                            <a href="javascript:;" v-if="row.status == 0" @click="dealthis(row.id,'downmusic')" >下架</a>
                            <a href="javascript:;" v-if="row.status == 1" @click="dealthis(row.id,'upmusic')" >上架</a>
                        </p>
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
                        <DropdownItem name="deleteallmusic">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                
            </Col>
        </Row>

    <Modal title="添加音乐" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
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
                名称
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.name" placeholder="" clearable  />
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                分类
            </Col>
            <Col span="18" class="frm_content">
                <RadioGroup v-model="sort.type">
                    <Radio label="0" value="0">企业宣传</Radio>
                    <Radio label="1" value="1">开业</Radio>
                    <Radio label="2" value="2">喜庆</Radio>
                </RadioGroup>
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
                音乐文件
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.url" placeholder=""   >
                    <Upload slot="append" :action="uploadurl" accept="" :on-success="uploadend" :show-upload-list="false">
                        <Button size="small" icon="ios-cloud-upload-outline">选择媒体文件</Button>
                    </Upload>
                </Input>
            </Col>
            
        </Row>
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
                    {title:'音乐',key:"thumb",slot: 'thumb',},
                    {title:'序号',key:'number'},
                    {title:'状态',key:'status',slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        doo : 'goods',
                        op : 'music',
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
                aurl : '',
                plaing : false,
                playindex : -1,
	  		}
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=audio&global=&dest_dir=';
        },
	  	activated:function(e){},
	  	methods: {
            confirm(){
                var self = this;
                var postdata = {
                    op : 'addmusic',
                    fromajax : 1,
                    fid : self.sort.id ? self.sort.id : 0,
                    name : self.sort.name,
                    status : self.sort.status,
                    type : self.sort.type,
                    number : self.sort.number,
                    url : self.sort.url,
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
            uploadend(e){
                if( e.attachment ){
                    this.$set(this.sort,'url',e.attachment);
                }else{
                    this.$Message.error(e.message);
                }
            },
            loadmusic(id,did,name){
                var self = this;
                var postdata = {
                    op : 'loadmusic',
                    fromajax : 1,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
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