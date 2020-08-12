<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>
        <Button class="mb10" type="primary" @click="addsort">添加分店</Button>
        <Row class="mt10">
            <Col span="24">
                <Table ref="selection" :columns="columns" :data="list" @on-select="selectTable" @on-select-cancel="selectTable" @on-select-all="selectTable">
                    <template slot-scope="{ row }" slot="use">
                        {{row.user ? row.user.nickname : ''}}
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <p class="font" v-if="row.status == 0">展示</p>
                        <p class="font-error" v-if="row.status == 1">隐藏</p>
                    </template>
                    <template slot-scope="{ row }" slot="add">
                        {{row.days}}天
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <p>
                            <a href="javascript:;" @click="edit(row)">编辑</a>
                            <Poptip
                                confirm
                                title="确定删除此条数据吗？"
                                @on-ok="dealthis(row.id,'delete')"
                                placement="left">
                                <a>删除</a>
                            </Poptip>
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
                        <DropdownItem name="deleteall">删除数据</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col span="18">
                <Page :total="total" show-sizer placement="top" @on-change="changePage" @on-page-size-change="changePagenum" />
            </Col>
        </Row>

    <Modal title="添加商圈" v-model="showadd" :styles="{top: '20px'}" @on-ok="confirm" :loading="true">
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                名称
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.name" placeholder="" clearable  />
                <P class="frm_tip"></P>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                排序序号
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.number" placeholder="" clearable  />
                <P class="frm_tip"></P>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                电话
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.tel" placeholder="" clearable  />
                <P class="frm_tip"></P>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                地址
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="sort.address" placeholder="" clearable  />
                <P class="frm_tip"></P>
            </Col>
        </Row>
        <Row class="frm_group " type="flex" align="middle" >
            <Col span="3" class="frm_title">
                是否展示
            </Col>
            <Col span="18" class="frm_content">
                <RadioGroup v-model="sort.status">
                    <Radio label="0" >展示</Radio>
                    <Radio label="1">不展示</Radio>
                </RadioGroup>
                <P class="frm_tip"></P>
            </Col>
        </Row>
        <Row class="frm_group " >
            <Col span="3" class="frm_title">
                地理位置
            </Col>
            <Col span="18" class="frm_content" style="position:relative;">
                <div id="map" style="width:400px;height: 300px"></div>
                <Input v-model="searchdw" @on-search="searchdwfn" placeholder="输入位置名称" class="w200" search style="position:absolute;top:10px;left:10px;" />
            </Col>
        </Row>
    </Modal>

    </div>
</template>

<script type="text/javascript">
    import { TMap } from '../../assets/js/Map';
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
                    {type: 'selection',width:100},
                    {title:'ID',key:'id'},
                    {title:'名称',key:"name"},
                    {title:'电话',key:"tel"},
                    {title:'地址',key:"address",},
                    {title:'状态',key:"status",slot: 'status',},
                    {title:'操作',key:'33',slot: 'action',},
                ],
                page : {
                    pdata : {
                        p:'admin',
                        doo : 'fendian',
                        op : 'list',
                        page : 1,
                        fromajax : 1,
                        pnum : 10,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                },
                sort: {},
                showadd : false,
                selected : [],
                map : false,
                mark : false,
                searchdw : '',
	  		}
	  	},
        mounted(){
            var self = this;
            TMap('GWRBZ-7YVCG-N4BQ7-IX3P7-AYKSO-H6FCY').then(qq => {
                self.map = new qq.maps.Map(document.getElementById("map"), {  
                    // 地图的中心地理坐标。  
                    center: new qq.maps.LatLng(39.90, 116.40),  
                    zoom: 8,
                    disableDefaultUI: true
                });

            var clickgeocoder = new qq.maps.Geocoder({
                complete : function(result){
                    self.setText(result.detail.addressComponents,result.detail.location);
                }
            });

            // 点击
            if(self.mark) self.mark.setMap(null);
            qq.maps.event.addListener(self.map, 'click', function(e) {

                if( self.mark ) self.mark.setMap(null);
                var pointer = new qq.maps.LatLng(e.latLng.lat,e.latLng.lng);
                self.mark = new qq.maps.Marker({
                    position: pointer,
                    map: self.map,
                    animation: qq.maps.MarkerAnimation.BOUNCE
                });

                clickgeocoder.getAddress(pointer);
            });


            });
        },

        created:function(){
            this.initData();
        },
	  	activated:function(e){},
	  	methods: {
            setText(obj,point){
                
                this.$set(this.sort,'lat',point.lat);
                this.$set(this.sort,'lng',point.lng);

            },
            searchdwfn(e){
                var self = this;
                let searchService = new qq.maps.SearchService({
                    complete : function(results){
                        var pois = results.detail.pois;
                        if( pois && pois.length > 0 ) {
                            var pointer = new qq.maps.LatLng(pois[0].latLng.lat,pois[0].latLng.lng);
                            self.map.setCenter(pointer);
                            self.map.zoomTo(15);
                        }else{
                            self.$Message.error('没有找到');
                        }
                    }
                });

                let searchgeocoder = new qq.maps.Geocoder({
                    complete : function(result){
                        //console.log( result );
                        self.map.setCenter(result.detail.location);
                        searchService.setLocation( result.detail.addressComponents.city );
                        
                        searchService.search(self.searchdw);
                    }
                });

                var p = self.map.getCenter();
                var latLng = new qq.maps.LatLng(p.lat, p.lng);
                searchgeocoder.getAddress(latLng);

            },
            confirm(){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : 'addfendian',
                    fromajax : 1,
                    fid : self.sort.id ? self.sort.id : 0,
                    name : self.sort.name,
                    number : self.sort.number,
                    tel : self.sort.tel,
                    address : self.sort.address,
                    status : self.sort.status,
                    lat : self.sort.lat,
                    lng : self.sort.lng,
                }
                self.$util.http('ajax','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                        self.showadd = false;
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            changePage(e){
                this.page.pdata.page = e;
                this.onLoad();
            },
            changePagenum(e){
                this.page.pdata.pnum = e;
                this.onLoad();
            },
            dealthis(id,type){
                var self = this;
                var postdata = {
                    p:'admin',
                    op : type,
                    fromajax : 1,
                    id : id,
                }
                self.$util.http('fendian','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
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
                    p:'admin',
                    op : e,
                    fromajax : 1,
                    checkall : self.selected,
                }
                self.$util.http('fendian','GET',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success(res.res);
                        self.onLoad();
                    }else{
                        self.$Message.error(res.res);
                    }
                },true);
            },
            edit(e){
                var self= this;
                this.sort = e;

                if(self.mark) self.mark.setMap(null);
                var pointer = new qq.maps.LatLng(self.sort.lat/1000000,self.sort.lng/1000000);
                self.map.setCenter(pointer);
                self.mark = new qq.maps.Marker({
                    position: pointer,
                    map: self.map,
                    animation: qq.maps.MarkerAnimation.BOUNCE
                });
                self.map.zoomTo(15);

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
            initData(){
                var self = this;
                var params = this.$route.query;
                
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        
                        self.loading = false;
                        self.shop = res.obj.shop;
                        self.list = res.obj.list;
                        self.total = res.obj.total;
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


</style>