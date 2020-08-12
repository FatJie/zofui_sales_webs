<template>
	<div>
        <Spin size="large" fix v-if="loading"></Spin>

        <div v-if="!loading">
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    商家名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.name" placeholder="" class="w400"  />
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    分店名称
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.branch_shop" placeholder="" class="w400"  />
                </Col>
            </Row>

             
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    经营描述
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.desc" type="textarea" :rows="4" class="w400"  placeholder="输入经营描述" />
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    备注内容
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.mark" type="textarea" :rows="4" class="w400"  placeholder="输入备注内容" />
                </Col>
            </Row> 
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    分享标题
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.share_title" type="textarea" :rows="4" class="w400"  placeholder="" />
                    <p class="frm_tip">建议添加{nick}</p>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    分享内容
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.share_content" type="textarea" :rows="4" class="w400"  placeholder="" />
                </Col>
            </Row>

            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    店铺让利比例
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.benefit" placeholder="" class="w400"  />%
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    推荐序号
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.number" placeholder="越大越靠前" class="w400"  />
                    <p class="frm_tip">在好店列表排序的序号，越大越靠前</p>
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    商家头像
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.headimg" placeholder=""  class="w400" >
                        <Button slot="append" size="small" @click="uploadimg('headimg')" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Input>
                    <p class="frm_tip">建议尺寸：300X300</p>
                    <img v-if="shop.showheadimg" :src="shop.showheadimg" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group " type="flex" align="middle" >
                <Col span="3" class="frm_title">
                    商家封面
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.cover" placeholder=""  class="w400" >
                        
                        <Button slot="append" size="small" @click="uploadimg('cover')" icon="ios-cloud-upload-outline">选择图片</Button>
                        
                    </Input>
                    <p class="frm_tip">尺寸300X180像素</p>
                    <img v-if="shop.showcover" :src="shop.showcover" class="showupimg">
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    到期时间
                </Col>
                <Col span="18" class="frm_content">
                    <DatePicker type="date" @on-change="setend" :value="shop.end" placeholder="选择到期时间" class="w200"></DatePicker>
                </Col>
            </Row>
            <!--<Row class="frm_group" v-if="!shop.id">-->
             <Row class="frm_group" >
                <Col span="3" class="frm_title">
                    登录账户
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.account" placeholder="" class="w400"  />
                </Col>
            </Row>
           <!-- <Row class="frm_group" v-if="!shop.id"> -->
           <Row class="frm_group" v-if="!shop.id">
                <Col span="3" class="frm_title">
                    登录密码
                </Col>
                <Col span="18" class="frm_content" >
                    <Input v-model="shop.password" placeholder="" class="w400"  />
                </Col>
            </Row>
           <!-- <Row class="frm_group">
                <Col span="3" class="frm_title">
                    门店电话
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.tel" placeholder="" class="w400"  />
                </Col>
                </Row> -->
             <Row class="frm_group">
                <Col span="3" class="frm_title">
                    店铺电话
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.tels" placeholder="" class="w400"  />
                </Col>
            </Row>
            
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    发布商品
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="shop.iscpub">
                        <Radio label="0" >可发布</Radio>
                        <Radio label="1">不可发布</Radio>
                    </RadioGroup>
                </Col>
            </Row>

            
            
            
        
          


           <!-- <Row class="frm_group">
                <Col span="3" class="frm_title">
                    可发布商品
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.maxpub" placeholder="" class="w400"  />
                    <p class="frm_tip">填0不限制</p>
                </Col>
            </Row>  -->
          
         
           
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    所属分类
                </Col>
                <Col span="18" class="frm_content">
                    <Select filterable v-model="shop.sortid" class="w200">
                        <Option v-for="item in allsort" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select> 
                     <!--<Cascader class="w400" filterable @on-change="setsort" :data="allsort" clearable  :value="shop.sortid"></Cascader>-->
                </Col>
                
            </Row>
             <Row class="frm_group">
                <Col span="3" class="frm_title">
                    店铺详细地址
                </Col>
                <Col span="18" class="frm_content">
                    <Input v-model="shop.wrtaddress" placeholder="" class="w400"  />
                </Col>
            </Row>
         
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    门店地址
                </Col>
                <Col span="18" class="frm_content">
                    <Card>
                        <p>{{shop.province}}{{shop.city}}{{shop.country}}</p>
                        <Input v-model="shop.street" placeholder="这里填街道地址，不用填省、市、区" class="w400"  />
                        <p class="frm_tip">在下列地图中找到门店位置。然后点击门店的中心点</p>
                        <div class="pd10" style="position:relative;">
                            <div id="map" style="width:700px;height:500px;"></div>
                            <Input v-model="searchdw" @on-search="searchdwfn" placeholder="输入位置名称" class="w200" search style="position:absolute;top:20px;left:20px;" />
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    状态
                </Col>
                <Col span="18" class="frm_content">
                    <RadioGroup v-model="shop.status">
                        <Radio label="0">正常</Radio>
                        <Radio label="1">禁用</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    权限开关
                </Col>
                <Col span="18" class="frm_content">
                    <Row type="flex">
                        
                     
                        
                        <Checkbox  v-model="shop.auth.ispin" label="1" true-value="1" false-value="0">打开拼团</Checkbox>
                    
                        <Checkbox  v-model="shop.auth.iscut" label="1" true-value="1" false-value="0">打开砍价</Checkbox>
                    
                        <Checkbox v-model="shop.auth.ischou" label="1" true-value="1" false-value="0">打开抽奖</Checkbox>
                    
                        <Checkbox v-model="shop.auth.isms" label="1" true-value="1" false-value="0">打开秒杀</Checkbox>
                    
                        <Checkbox v-model="shop.auth.isxq" label="1" true-value="1" false-value="0">打开限抢</Checkbox>
                    
                        <Checkbox v-model="shop.auth.isbm" label="1" true-value="1" false-value="0">打开报名</Checkbox>

                        <Checkbox v-model="shop.auth.istequan" label="1" true-value="1" false-value="0">打开特权</Checkbox>

                        <Checkbox v-model="shop.auth.islibao" label="1" true-value="1" false-value="0">打开礼包</Checkbox>
                    </Row>
                </Col>
            </Row>
        
            <Row class="frm_group">
                <Col span="3" class="frm_title">
                    详情描述
                </Col>
                <Col span="18" class="frm_content">
                    <editor class="w750" :editorhtml="shop.content" fnname="shopedit" @shopedit="shopedit" ></editor>
                </Col>
            </Row>
            <input type= 'hidden' value='1' name='ssss'>

            <Row class="frm_group">
                <Col span="3" class="frm_title"> &nbsp;</Col>
                <Col span="18">
                    <Affix :offset-bottom="20" style="z-index: 1000;position: relative;">
                        <Button type="primary" @click="save">保存</Button>
                    </Affix>
                </Col>
            </Row>
        </div>
        <upload ref="uploadref" @uploadmethod="uploadmethod"></upload>
    </div>
</template>

<script type="text/javascript">
    import editor from '../../components/editor';
    import upload from '../../components/upload';
    import { TMap } from '../../assets/js/Map';
    import area from '../../assets/js/area.js';
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
               

                uploadurl : '', shop : {name:'',auth:{ispay:0},content:'',iscpub:1},
                allsort : {},
                allcity : [],
                alltrade : [],
                map : false,
                mark : false,
                joinid : 0,
                uptarget : '',
                searchdw : '',
	  		    pcc:[],
                area:area,
                cityid:'',
                areaid:''
            }
	  	},
        created:function(){
            this.initData();
            let site = this.$util.apiUrl() . split('index.php');
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
            console.log(this.area);
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
	  	methods: {
            setText(obj,point){
                
                this.$set(this.shop,'province',obj.province);
                this.$set(this.shop,'city',obj.city);
                this.$set(this.shop,'street',obj.street + obj.streetNumber);
                this.$set(this.shop,'country',obj.district);
                this.$set(this.shop,'lat',point.lat);
                this.$set(this.shop,'lng',point.lng);

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
            setsort(e){
                if( e[0] ) this.shop.sortid = e[0];
                if( e[1] ) this.shop.sorttwo = e[1];
            },
            setArea(){

            },
            setend(e){
                this.shop.end = e;
            },
            shopedit(e){
                this.$set(this.shop,'content',e);
            },
            addthis(){
                this.shop.params.push({itemt:''});
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
                if( this.uptarget == 'cover' ){
                    this.$set(this.shop,'cover',e.attachment);
                    this.$set(this.shop,'showcover',e.url);
                }else if(  this.uptarget == 'headimg' ){
                    this.$set(this.shop,'headimg',e.attachment);
                    this.$set(this.shop,'showheadimg',e.url);
                }
            },
            save(e){
                var self = this;
                console.log(self.shop.auth);
                var postdata = {
                    op : 'addshop',
                    fromajax : 1,
                    shop : this.shop,
                    shopid : this.shop.id > 0 ? this.shop.id : 0,
                    joinid : this.joinid,
                }
                self.$util.http('ajax','POST',postdata,function(res){
                    if( res.status == 200 ){
                        self.$Message.success('已保存');
                    }else{
                        if( res.res ) self.$Message.error(res.res);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var id = params.id ? params.id : 0;
                var joinid = params.joinid ? params.joinid : 0;
                self.joinid = joinid;
                var postdata = {
                    op : 'add',
                    fromajax : 1,
                    id : id,
                    joinid : joinid,
                }
                self.loading = false;
                self.$util.http('shop','POST',postdata,function(res){
                console.log(res)
                    if( res.status == 200 ){
                        
                        if( res.obj.info.account ){
                            self.shop = {
                                id : res.obj.info.id,
                                name : res.obj.info.name,
                                desc : res.obj.info.desc,
                                mark : res.obj.info.mark,
                                number : res.obj.info.number,
                                headimg : res.obj.info.headimg  ? res.obj.info.headimg : '',
                                showheadimg : res.obj.info.showheadimg  ? res.obj.info.showheadimg : '',
                                showcover : res.obj.info.showcover  ? res.obj.info.showcover : '',
                                cover : res.obj.info.cover  ? res.obj.info.cover : '',
                                end : res.obj.info.showend,
                                account : res.obj.info.account,
                                password : res.obj.info.password,
                                tel : res.obj.info.tel,
                                tels : res.obj.info.tels,
                                wrtaddress : res.obj.info.wrtaddress,
                                iscpub : res.obj.info.iscpub,
                                maxpub : res.obj.info.maxpub,
                                server : res.obj.info.server,
                                spcut : res.obj.info.spcut,
                          
                                cityid : res.obj.info.cityid,
                                spsever : res.obj.info.spsever,
                                sortid : res.obj.info.sortid,
                                sorttwo : res.obj.info.sorttwo,
                                tradeid : res.obj.info.tradeid,
                                areaid : res.obj.info.areaid,
                                province : res.obj.info.province  ? res.obj.info.province : '',
                                street : res.obj.info.street  ? res.obj.info.street : '',
                                status : res.obj.info.status,
                                spcuttype : res.obj.info.spcuttype,
                                isfz : 0,
                                fztype : res.obj.info.fztype,
                                fzpayid : res.obj.info.fzpayid,
                                fzname : res.obj.info.fzname,
                                isgood : res.obj.info.isgood,
                                isdzpay : res.obj.info.isdzpay,
                                isdzpays : res.obj.info.isdzpays,
                                isdzpaym : res.obj.info.isdzpaym,
                                mchid : res.obj.info.mchid,

                                citys : res.obj.info.citys ? res.obj.info.citys : '',
                                starttime:res.obj.info.starttime,
                                endtime:res.obj.info.endtime,
                                benefit:res.obj.info.benefit,
                                branch_shop:res.obj.info.branch_shop,


                                city : res.obj.info.city ? res.obj.info.city : '',
                                country : res.obj.info.country ? res.obj.info.country : '',
                                lat : res.obj.info.lat/1000000,
                                lng : res.obj.info.lng/1000000,
                                auth : res.obj.info.auth ? res.obj.info.auth : {},
                                content : res.obj.info.content,
                            };

                            var lat = self.shop.lat > 0 ? self.shop.lat : 39.90;
                            var lng = self.shop.lng > 0 ? self.shop.lng : 116.40;

                            setTimeout(function(){
                                if(self.mark) self.mark.setMap(null);
                                var pointer = new qq.maps.LatLng(self.shop.lat,self.shop.lng);
                                self.map.setCenter(pointer);
                                self.mark = new qq.maps.Marker({
                                    position: pointer,
                                    map: self.map,
                                    animation: qq.maps.MarkerAnimation.BOUNCE
                                });
                                self.map.zoomTo(15);
                            },1000)

                        }

                        self.loading = false;
                        self.allsort = res.obj.allsort;
                        console.log(self.allsort);
                        self.alltrade = res.obj.alltrade;
                        self.allcity = res.obj.allcity;

                        

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
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>