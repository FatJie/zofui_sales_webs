<template>
	
	<div>
      3e213213131
    </div>

</template>

<script type="text/javascript">
    
	export default {
        name : 'index',
	  	components: {

	  	},
	  	data : function(){
	  		return {
                inited : false,
	  			params : {},
	  			list : [],
	  			pagedata : [],
	  			datalist : [],
                locname : '',
                showloc : false,
                isonbottom : false,
	  			page : {
	  				pdata : {
	  					doo : 'index',
	  					op : 'list',
	  					page : 1,
	  					style : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : true,
	  			},
                isrefresh : false,
                disrefresh : false,
                lat : 0,
                lng : 0,
                timer : null,
                buyed : [],
                isshowhot : false,
                trade : [],
                isshowtrade : false,
                acttrade : {},
                isshowcity : false,
                citylist : [],
                scitylist : [],
                actcity : {},
                dev : '',
	  		}
	  	},
        created:function(){
            var self = this;

        },
	  	activated:function(e){
            if( self.sharedata ){
                self.$util.share(wx,self.sharedata);
            }

            if( this.inited && this.$route.meta.keepAlive ){
                return false;
            }
            this.initData();
			
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
            scrolltop(e){
                if( e <= 0 && this.disrefresh ){
                    this.disrefresh = false;
                }
                if( e > 0 && !this.disrefresh ){
                    this.disrefresh = true;
                }
            },
            onRefresh(){

                this.initData();
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            isshowtradefn(){
                this.isshowtrade = false;
            },
            changetrade(e){
                var self = this;
                var postdata = {
                    op : 'settrade',
                    tradeid : e.currentTarget.dataset.id,
                }
                self.$util.http('user','GET',postdata,function(res){    

                    for (var i = 0; i < self.trade.length; i++) {
                        if( self.trade[i].id == postdata.tradeid ){
                            self.isshowtrade = false;
                            self.acttrade = self.trade[i];
                            self.locname = self.trade[i].name;

                            self.initData();
                            return false;
                        }
                    }
                },true)
            },
            uptime(){
                var self = this;
                if( self.timer ) return false;

                self.timer = setInterval(function(){
                    var date = new Date();
                    var time = date.getTime();
                    for (var i = 0; i < self.pagedata.length; i++) {
                        var item = self.pagedata[i];
                        if( item.viewtemp == 'goods' && item.params && (item.params.style == 4  || item.params.style == 0 ) && item.params.data ){
                            for (var j = 0; j < item.params.data.length; j++) {
                                if( item.params.data[j].end ){
                                    var endTime = item.params.data[j].end + '000';
                                    var lag = (endTime*1 - time);

                                    if( item.params.data[j].type == 1 && lag > 24*3600000 ) {
                                        self.$set(item.params.data[j],'uptime',false);
                                    }else{
                                        if(lag > 0){
                                            var second = Math.floor(lag/1000%60);     
                                            var minite = Math.floor(lag/1000/60%60);
                                            var hour = Math.floor(lag/1000/60/60%24);
                                            var day = Math.floor(lag/1000/60/60/24);
                                            self.$set(item.params.data[j],'uptime',{day:day,hour:hour,minite:minite,second:second});  
                                        }else{
                                            var second = '0';
                                            var minite = '0';
                                            var hour = '0';
                                            var day = '0';
                                            self.$set(item.params.data[j],'uptime',false);
                                        }
                                    }
                                }
                            }
                        }else if(item.name == 'kill'){

                            if( item.params.sitetime ){
                                var endTime = item.params.sitetime + '000';
                                var lag = (endTime*1 - time);
                                if(lag > 0){
                                    var second = Math.floor(lag/1000%60);     
                                    var minite = Math.floor(lag/1000/60%60);
                                    var hour = Math.floor(lag/1000/60/60);
                                }else{
                                    var second = '0';
                                    var minite = '0';
                                    var hour = '0';
                                }
                                self.$set(item.params,'uptime',{hour:hour,minite:minite,second:second});
                            }
                        }

                    }
                },1000);
            },
            locCity(){
                var self = this;

                if( self.params.loctype == 0 || !self.params.loctype ){
                    self.showloc = true;
                    function setloc(event){
                        var loc = event.data;
                        if (loc && loc.module == 'locationPicker') {
                            var position = {
                                lat : loc.latlng.lat,
                                lng : loc.latlng.lng,
                                address : loc.poiname,
                            };
                            self.$util.setCache('loc',position);
                            self.initData();
                            self.showloc = false;
                        }
                    }
                    window.removeEventListener('message',setloc,false);
                    window.addEventListener('message',setloc, false);
                }else if(self.params.loctype == 1){
                    self.isshowtrade = true;
                }else if(self.params.loctype == 2){
                    self.isshowcity = true;
                }
            },
            searchcity(e){
                var self = this;
                var thisarr = [];
                if( e.target.value ) {
                    
                    for (var i = 0; i < self.citylist.length; i++) {
                        if( self.citylist[i].name.indexOf(e.target.value) >= 0 ){
                            thisarr.push(self.citylist[i]);
                        }
                    }
                }
                self.scitylist = thisarr;
            },
            falsecity(){
                self.scitylist = [];
            },
            changecity(e){
                var self = this;
                var postdata = {
                    op : 'setcity',
                    cityid : e.currentTarget.dataset.id,
                }
                self.$util.http('user','GET',postdata,function(res){
                    for (var i = 0; i < self.citylist.length; i++) {
                        if( self.citylist[i].pid == postdata.cityid ){
                            self.isshowcity = false;
                            self.actcity = self.citylist[i];
                            self.locname = self.citylist[i].name;

                            self.initData();
                            return false;
                        }
                    }
                },true)
            },
            isshowcityfn(){
                this.isshowcity = false;
            },
            closeloc(){
                this.showloc = false;
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;

                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.lat = loc.lat;
                if( loc.lng ) self.lng = loc.lng;
                if( loc.address ){
                    self.locname = loc.address ? loc.address : '';
                }
                
                var postdata = {
                    op : 'info',
                    pid : params.pid ? params.pid : 0,
                    zfid : params.zfid ? params.zfid : 0,
                    lat : self.lat,
                    lng : self.lng,
                }
                self.isshowhot = false;
                self.$util.http('index','GET',postdata,function(res){
                    self.inited = 1;
                    if( res && !res.errno ){
                        
                        self.list = res.data.list;
                        self.pagedata = res.data.page;
                        self.params = res.data.params;
                        self.sharedata = res.data.sharedata;
                        self.buyed = res.data.buyed;
                        self.isshowhot = true;
                        
                        self.trade = res.data.trade ? res.data.trade : [];
                        self.acttrade = res.data.acttrade ? res.data.acttrade : {};

                        self.citylist = res.data.citylist ? res.data.citylist : [];
                        self.actcity = res.data.actcity ? res.data.actcity : {};

                        if( self.acttrade.name ){
                            self.locname = self.acttrade.name;
                        }
                        if( self.actcity.name ){
                            self.locname = self.actcity.name;
                        }

                        self.$util.share(wx,self.sharedata);
                        
                        window.document.title = self.params.title;

                        self.$route.meta.title = self.params.title;
                        self.$emit('loadmessage',{title:self.params.title});

                        for (var i = 0; i < res.data.page.length; i++) {
                            var thisd = res.data.page[i];
                            if( thisd.name == 'downget' ){
                                self.isonbottom = true;;
                            }
                        }
                        self.uptime();
                        self.inited = 2;
                        if( !loc ){
                            self.$util.getLocation(function(){
                                self.initData();
                            },self.params.tenkey,wx)
                        }
                    }else{
                        self.$toast(res.message);
                    }
                    
                    self.isrefresh = false;
                });
            },
	  		onLoad() {
	  			var self = this;
                if( !self.isonbottom ){
                    self.page.doing = false;
                    return false;
                } 
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            });
	  		},
	  	}
  	}
</script>

<style type="text/css" scoped>
#content{
    background: #fff;
}
.diy-type1 .diy-list .btm_tit,.diy-type5 .diy-list .btm_tit,.diy-type6 .diy-list .btm_tit,.new-list .btm_tit {
    font-size: 13px;
    line-height: 18px;
}

.diy-type2 .diy-list .btm_tit,.diy-type3 .diy-list .btm_tit {
    font-size: 14px;
    line-height: 19px;
    height:36px;
    overflow:hidden;
}

.diy-type4 .diy-list .btm_tit,.worth-list .btm_tit {
    font-size: 15px;
    line-height: 20px;
}

.diy-banner {
    overflow: hidden;
    margin-bottom: 18px;
    border-radius: 7px;
}

.diy-list {
    overflow: hidden;
    /*margin-bottom: -18px;*/
}

.diy-list .item {
    margin-bottom: 18px;
}

.diy-list .item .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px;
}

.diy-list .item .btm-b {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: end;
    align-items: flex-end;
}

.diy-list .item .btm-info {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.diy-list .top_pic {
    border-radius: inherit;
}



.diy-type0 .btm_tit{
    line-height: 22.5px;
    padding-bottom: 10px;
    font-size: 15px;
}

.diy-list .btm_tit .tag,.bargin-wrap .btm_tit .tag {
    display: inline-block;
    vertical-align: top;
    padding: 0 7.5px;
    margin-right: 10px;
    font-size: 10px;
    text-align: center;
    line-height: inherit;
    color: #fff;
    border-radius: 1px;
}

.diy-list .btm_addr {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 12px;
    color: #787878;
}
.diy-list .btm_addr .name {
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.diy-list .btm_addr .quan {
    display: none;
}

.diy-list .btm_saled {
    margin-left: 10px;
    font-size: 12px;
    color: #b4b4b4;
}

.btm_fx {
    margin-left: 5px;
    font-size: 10px;
    color: #ffffff;
    padding: 2.5px;
    border-radius: 2.5px;
}

.diy-list .btm_button {
    margin-left: 10px;
    color: #fff;
    background-color: #aeaeae;
}

.diy-type1 {
    margin-bottom: 10px;
}

.diy-type1 .diy-list {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    flex-wrap: wrap;
}

.diy-type1 .diy-list .item {
    width: 167.5px;
}

.diy-type1 .diy-list .item:nth-last-child(1):after,.diy-type1 .diy-list .item:nth-last-child(2):after {
    visibility: hidden;
}
.diy-type0 .diy-list .item .btm {
    padding: 10px 0 10px;
}
.diy-type1 .diy-list .item .btm {
    padding: 10px 0 10px;
}

.diy-type1 .diy-list .item .btm-info {
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.diy-type1 .diy-list .btm_tit {
    height: 36px;
    overflow: hidden;
}

.diy-type1 .diy-list .btm_addr {
    display: none;
}

.diy-type1 .diy-list .btm_price .old {
    display: block;
}

.diy-type1 .diy-list .btm_button {
    display: none;
}

.diy-type2 .diy-list .item,.diy-type3 .diy-list .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.diy-type2 .diy-list .item:after,.diy-type3 .diy-list .item:after {
    visibility: hidden;
}

.diy-type2 .diy-list .item .top,.diy-type3 .diy-list .item .top {
    width: 110px;
    margin-right: 12px;
}

.diy-type2 .diy-list .item .btm,.diy-type3 .diy-list .item .btm {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    height: 110px;
}

.diy-type2 .diy-list .item .btm-info,.diy-type3 .diy-list .item .btm-info {
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.diy-type2 .diy-list .btm_button,.diy-type3 .diy-list .btm_button {
    display: none;
}

.diy-type3 {
    overflow: hidden;
    border-radius: 7px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
}

.diy-type3 .diy-banner {
    margin-bottom: 15px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.diy-type3 .diy-list {
    padding: 0 15px;
    margin-bottom: 0;
    margin-top: 18px;
}

.diy-type3 .diy-list .item:not(:last-child) {
    padding-bottom: 15px;
}

.diy-type3 .diy-list .item:not(:last-child):after {
    visibility: visible;
}

.diy-type3 .diy-list .btm_saled {
    display: none;
}

.diy-type3 .diy-list .btm_button {
    display: block;
}

.diy-type4 {
    margin-bottom: -20px;
}

.diy-type4 .diy-list .item:after {
    visibility: hidden;
}

.diy-type4 .diy-list .item .btm {
    padding: 15px 0 10px;
}

.diy-type4 .diy-list .item .btm-info {
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.diy-type4 .diy-list .top_pic {
    padding-top: 56.25%;
}

.diy-type4 .diy-list .list-status {
    display: none;
}

.diy-type4 .diy-list .btm_price .dollar {
    font-size: 20px;
}

.diy-type4 .diy-list .btm_price .price {
    font-size: 21px;
}

.diy-type4 .diy-list .btm_addr .quan {
    display: inline;
}

.diy-type4 .diy-list .i-button {
    font-size: 13px;
}

.diy-type5,.diy-type6 {
    margin-bottom: -20px;
}

.diy-type5 .diy-list,.diy-type6 .diy-list {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    flex-wrap: wrap;
}

.diy-type5 .diy-list .item,.diy-type6 .diy-list .item {
    width: 160px;
}

.diy-type5 .diy-list .item .btm,.diy-type6 .diy-list .item .btm {
    padding: 10px 0 17px;
}

.diy-type5 .diy-list .item .btm-info,.diy-type6 .diy-list .item .btm-info {
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.diy-type5 .diy-list .item:nth-last-child(1):after,.diy-type5 .diy-list .item:nth-last-child(2):after,.diy-type6 .diy-list .item:nth-last-child(1):after,.diy-type6 .diy-list .item:nth-last-child(2):after {
    visibility: hidden;
}

.diy-type5 .diy-list .top_pic,.diy-type6 .diy-list .top_pic {
    padding-top: 56.25%;
}

.diy-type5 .diy-list .btm_tit,.diy-type6 .diy-list .btm_tit {
    height: 36px;
}

.diy-type5 .diy-list .btm_addr,.diy-type6 .diy-list .btm_addr {
    display: none;
}

.diy-type5 .diy-list .btm_button,.diy-type6 .diy-list .btm_button {
    display: none;
}

.diy-type5 .diy-list .btm_price .old {
    display: none;
}

.diy-type6 .diy-list .btm_saled {
    display: none;
}

.worth-swiper {
    position: relative;
    margin: 0 -20px;
}

.worth-swiper .swiper-pagination {
    margin-bottom: 20px;
}

.worth-list {
    overflow: hidden;
    margin-bottom: -18px;
}

.worth-list .item {
    padding: 0 20px;
    margin-bottom: 18px;
}

.worth-list .item .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px;
}

.worth-list .item .btm {
    padding-top: 15px;
}

.worth-list .item .btm-b {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: end;
    align-items: flex-end;
}

.worth-list .item .btm-info {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.worth-list .item:after {
    visibility: hidden;
}

.worth-list .top_pic {
    padding-top: 56.25%;
    border-radius: inherit;
}

.worth-list .btm_tit {
    height: 40px;
    margin-bottom: 10px;
    font-weight: 400;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #2a2a2a;
}

.worth-list .btm_tit .tag {
    display: inline-block;
    vertical-align: top;
    padding: 0 7.5px;
    margin-right: 10px;
    font-size: 10px;
    text-align: center;
    line-height: inherit;
    color: #fff;
    border-radius: 1px;
}

.worth-list .btm_addr {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 12px;
    color: #787878;
}

.worth-list .btm_addr .name {
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.worth-list .btm_addr .quan {
    display: inline;
}

.worth-list .btm_price .dollar {
    font-size: 20px;
}

.worth-list .btm_price .price {
    font-size: 21px;
}

.worth-list .btm_saled {
    margin-left: 10px;
    font-size: 12px;
    color: #b4b4b4;
}

.worth-list .i-button {
    font-size: 13px;
}

.worth-list .btm_button {
    margin-left: 10px;
    color: #fff;
    background-color: #aeaeae;
}

.new-list-wrap {
    position: relative;
    margin: 0 -20px;
}

.new-list {
    display: inline-block;
    padding: 0 20px;
    margin-left: -15px;
    white-space: nowrap;
}

.new-list .item {
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
    width: 129px;
    margin-left: 15px;
    white-space: normal;
}

.new-list .item .top {
    position: relative;
    overflow: hidden;
    border-radius: 2px;
}

.new-list .item .btm {
    padding: 10px 0 5px;
}

.new-list .btm_tit {
    height: 36px;
    margin-bottom: 15px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.ad-list {
    width: 100%;
}

.ad-list .item {
    overflow: hidden;
    width: 100%;
    margin-top: 20px;
    border-radius: 7px;
}

.bargin-swiper1 .rt_tit {
    font-size: 13px;
    line-height: 18px;
}

.bargin-wrap {
    position: relative;
    margin: -5px -20px;
}

.bargin-wrap .swiper-pagination {
    margin-bottom: 15px;
}

.bargin-swiper1 {
    width: 100%;
    height: 160px;
    box-sizing: border-box;
}

.bargin-swiper1 swiper-item {
    padding: 5px 20px;
    box-sizing: border-box;
}

.bargin-swiper1 .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
}

.bargin-swiper1 .item .lt {
    overflow: hidden;
    position: relative;
    width: 200px;
    border-radius: 2px 0 0 2px;
}

.bargin-swiper1 .item .rt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 12px 10px 12px 15px;
}

.bargin-swiper1 .rt_tit {
    position: relative;
    padding-top: 15px;
    font-weight: 400;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color: #2d2d2d;
}

.bargin-swiper1 .rt_tit:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 2px;
    background-color: #0f0f0f;
}

.bargin-swiper1 .rt_price {
    -webkit-box-orient: vertical;
    -webkit-box-direction: reverse;
    flex-direction: column-reverse;
    -webkit-box-align: start;
    align-items: flex-start;
}

.bargin-swiper1 .rt_price .old {
    margin-left: 0;
}

.bargin-swiper2 {
    width: 100%;
    height: 320px;
    box-sizing: border-box;
}

.bargin-swiper2 swiper-item {
    padding: 5px 0;
    box-sizing: border-box;
}

.bargin-swiper2 .item {
    border-color: #d2d2d2;
    border-radius: 4px;
}

.bargin-swiper2 .item .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px 2px 0 0;
}

.bargin-swiper2 .item .btm {
    padding: 10px;
}

.bargin-swiper2 .item .btm-b {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.bargin-swiper2 .top_pic {
    border-radius: inherit;
}

.bargin-swiper2 .top_countdown {
    position: absolute;
    top: 0;
    right: 8px;
    height: 35px;
    padding: 7.5px;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    color: #fff;
    background-color: #fc9127;
    border-radius: 0 0 3.5px 3.5px;
    box-sizing: border-box;
}

.bargin-swiper2 .top_countdown font {
    display: inline-block;
    vertical-align: top;
    width: 20px;
    height: 20px;
    color: #2a2a2a;
    background-color: #fff;
    border-radius: 3.5px;
}

.bargin-swiper2 .btm_tit {
    overflow: hidden;
    margin-bottom: 5px;
    font-size: 15px;
    line-height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #2a2a2a;
}

.bargin-swiper2 .btm_count {
    display: inline-block;
    vertical-align: top;
    height: 18px;
    padding: 0 5px;
    margin-left: 10px;
    font-size: 12px;
    line-height: 18px;
    color: #fc9127;
    border-color: #fc9127;
    border-radius: 7px;
}

.quick-list {
    position: relative;
    margin: -5px -20px;
}

.quick-list .list {
    display: inline-block;
    padding: 0 20px;
    margin-left: -14px;
    white-space: nowrap;
    overflow-x: auto;
    width: 320px;
    -webkit-overflow-scrolling: touch;
    padding-right: 60px;
}

.quick-list .item {
    display: inline-block;
    vertical-align: top;
    width: 120px;
    margin: 5px 0 5px 14px;
    font-size: 12px;
    white-space: normal;
}

.quick-list .inner {
    overflow: hidden;
    display: block;
    border-radius: 2px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
    background-color: #fff;
}

.quick-list .inner .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px 2px 0 0;
}

.quick-list .inner .btm {
    padding: 7.5px 5px;
}

.quick-list .top_pic {
    border-radius: 2px 2px 0 0;
}

.quick-list .top_tit {
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 5px;
    font-size: 13px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
    background-color: rgba(0,0,0,0.4);
}

.quick-list .btm_price {
    -webkit-box-pack: center;
    justify-content: center;
    white-space: nowrap;
}

.i-title {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: end;
    align-items: flex-end;
    padding: 20px 0;
    font-size: 12px;
    text-align: left;
    line-height: 1;
    color: #2a2a2a;
}

.i-title .tit {
    height: 1.2em;
    margin: -.1em 0;
    font-size: 20px;
    line-height: 1.2em;
    font-weight: 500;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.i-title .center {
    -webkit-box-flex: 1;
    flex: 1 0 0;
    padding-left: 10px;
    border-color: #2a2a2a;
    margin-left: 10px;
}

.i-title .center .ct_more {
    padding: 10px 0;
    margin: -10px 0;
}

.i-title .more {
    flex-shrink: 0;
    padding: 10px 0;
    margin-left: 10px;
    margin-bottom: -10px;
    color: #aaa;
}

.i-title.__bargin {
    padding-right: 35px;
}

.i-section {
    padding: 0 20px;
    border-color: #eee;
}

.i-section:after {
    left: 20px;
    right: 20px;
    width: auto;
}

.i-section:last-child:after {
    visibility: hidden;
}

.i-nav {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    margin: 0px 15px;
}

.i-nav .item {
    -webkit-box-flex: 1;
    flex: 1;
    min-width: 20%;
    font-size: 12px;
    text-align: center;
    line-height: 1.2;
    color: #191919;
}

.i-nav .item .icon {
    width: 30px;
    height: 30px;
    margin-bottom: 5px;
}

.i-swiper {
    position: relative;
}

.i-swiper .swiper-dots {
    position: absolute;
    left: 50%;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    bottom: 5px;
    transform: translateX(-50%);
}

.i-swiper .swiper-dots .item {
    width: 9px;
    height: 1px;
    margin: 0 5px;
    border-radius: 0;
    background-color: #fff;
}

.i-swiper .swiper-dots .active {
    width: 9px;
    height: 9px;
    border: 1px solid #fff;
    border-radius: 50%;
    background-color: transparent;
}
.i-search {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 10px 15px;
    font-size: 13px;
    line-height: 30px;
    color: #969696;
    align-items: center;
}


.i-search .search {
    -webkit-box-flex: 1;
    flex: 1;
    padding: 0 10px;
    margin-right: 15px;
    background-color: #ededed;
    border-radius: 15px;
}

.i-search .iconfonta {
    display: inline-block;
    margin-right: 5px;
    width: 16.5px;
    height: 16.5px;
    vertical-align: text-top;
}

.i-button {
    height: 28px;
    min-width: 70px;
    padding: 0 7.5px;
    font-size: 14px;
    text-align: center;
    line-height: 28px;
    border-radius: 5px;
    box-sizing: border-box;
}

.i-tabs-wrap {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.i-tabs {
    position: relative;
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    border-radius: 3.5px;
}

.i-tabs:after {
    border-radius: 7px;
}

.i-tabs .item {
    position: relative;
    z-index: 1;
    padding: 0 10px;
    font-size: 12px;
    line-height: 30px;
    border-radius: 0;
    background-color: transparent;
}

.i-tabs .item:before {
    left: -1px;
}

.quick-countdown {
    white-space: nowrap;
    line-height: 14px;
}

.quick-countdown font {
    display: inline-block;
    vertical-align: top;
    width: 14px;
    height: 14px;
    font-size: 10px;
    text-align: center;
    color: #fff;
    background-color: #2a2a2a;
}

.act-list-wrap {
    overflow: hidden;
    margin-bottom: -20px;
}

.app_images_itemin img{
  display: block;
}
.item_cell_box{
  display:-webkit-box;
  display:-webkit-flex;
  display:flex;
  flex-wrap:wrap;
}
.item_cell_flex{
  -webkit-box-flex:1;
  flex:1;
  min-width:1%;
}
.temp_title_mfont{
  font-weight: 400;
  padding-left: 10px;
}
.temp_title_rfont{
  font-size: 13px;
}
.page_fix{
  position: fixed;
  overflow: hidden;
  z-index: 3;
}
.goods_box{
  padding: 15px;
}

/**/
.lottery-list .item {
    margin-bottom: 15px;
    border-color: #eee;
    background-color: #fff;
    border-radius: 4px;
}

.lottery-list .item:last-child {
    margin-bottom: 0;
}

.lottery-list .item .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px 2px 0 0;
}

.lottery-list .item .btm {
    padding: 10px 10px;
}

.lottery-list .item .btm-b {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.lottery-list .top_pic {
    border-radius: inherit;
}

.lottery-list .top_shop {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 10px;
    font-size: 12px;
    line-height: 26px;
    color: #fff;
    background-color: rgba(0,0,0,0.6);
    border-radius: 8px 0 0 0;
}

.lottery-list .btm_tit {
    overflow: hidden;
    margin-bottom: 5px;
    font-size: 15px;
    line-height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #2a2a2a;
}

.lottery-list .btm_price {
    margin-bottom: 10px;
}

.lottery-list .btm_price .dollar {
    margin-left: 5px;
    font-size: 20px;
}

.lottery-list .btm_price .price {
    font-size: 21px;
}

.lottery-list .btm_count {
    display: inline-block;
    vertical-align: top;
    height: 18px;
    padding: 0 5px;
    margin-left: 10px;
    font-size: 12px;
    line-height: 18px;
    color: #fc9127;
    border-color: #fc9127;
    border-radius: 7px;
}

.lottery-list .btm_num {
    font-size: 12px;
    color: #b4b4b4;
}

.lottstatus{
    background-color: #ddd;
    padding: 7.5px 20px;
    color: #666;
    border-radius: 20px;
}

.page_image_title{
  text-align: center;
}

.index_loc{
    position: fixed;
    left: 10px;
    top: 2.5px;
    white-space: nowrap;
    overflow: hidden;
    z-index: 2;
    background : rgba(0,0,0,0.5);
    border-radius: 25px;
    color: #fff;
    align-content: center;
    padding: 5px 10px;
}
.index_locimg,.index_locimg img{
    width: 20px;
    height: 20px;
    line-height: 0;
}
.index_locname{
    padding-left: 5px;
    font-size: 13px;
    line-height: 20px;
    white-space:nowrap;
    overflow:hidden;
    min-width: 40px;
    max-width: 90px;
}
.index_locimgs{
    align-items: center;
    margin-right: 5px;
    border: 1px solid #eee;
    border-radius: 25px;
    padding: 2.5px 5px;
}
.index_locimgs .index_locname{
    max-width: 60px;
}
.index_locimgs .index_locimg,.index_locimgs .index_locimg img{
  width: 20px;
  height: 20px;
}
.pagelist_box{
    padding: 15px;
}

.kill_group{
    font-size: 15px;
}
.kill_l{
    font-weight: bold;
    font-size: 16px;
}
.kill_r{
  font-size: 12.5px;
  color: #999;
}
.kill_r font{
    display: inline-block;
    background: #000;
    color: #fff;
    text-align: center;
    padding: 2px 5px;
    border-radius:2.5px;
    min-width: 20px;
}
.kill_goodslist{
  margin-top: 15px;
}

.top_countdownbb{
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fff;
    padding: 4px 10px;
    border-radius: 3px;
    font-size: 15px;
}

/**/
.top-swiper {
    position: fixed;
    top: 90px;
    left: 15px;
    z-index: 5;
    width: 190px;
    height: 28px;
    padding: 0 3px;
    font-size: 11px;
    color: #fff;
    opacity: 0;
}
.top-swiper swiper,.slideorder{
    background-color: rgba(0,0,0,0.6);
    box-sizing: border-box;
    border-radius: 14px;
}

.top-swiper:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
.top-swiper swiper{
  height: 28px;
}
.top-swiper swiper-item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.top-swiper .avatar {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border-radius: 50%;
}
.slideorder .avatar {
    padding-top: 1px;
}

.top-swiper .txt {
    -webkit-box-flex: 1;
    flex: 1;
    height: 23px;
    padding-right: 10px;
    line-height: 2.25;
    overflow: hidden;
    display: box;
    display: -webkit-box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin-left: -8px;
}
.fade-in {
    opacity: 1;
    transition: opacity 0.5s;
}
.gongyibox{
    padding: 15px;
    font-size: 13px;
}
.gongyibox_t {
    font-weight: bold;
}
.gongyibox_m{
    font-size: 16px;
}

/**/
.gwtc_box{
    margin: 15px;
    border-radius: 2.5px;
    box-shadow: 0.5px 0.5px 9px rgba(0,0,0,0.2);
    padding: 5px;
    font-size: 13px;
}
.gwtc_headimg{
    border-radius: 50%;
    width: 25px;
    height: 25px;
}
.gwtc_headimg img{
    width: 25px;
    height: 25px;
}
.gwtc_item{
    text-align: center;
    width: 33.3%;
}
.gwtc_num{
    font-weight: bold;
    font-size: 20px;
    padding: 5px;
}
.gwtc_num font{
    font-size: 12px;
}
.gwtc_name{
    color: #999;
    padding: 5px;
    padding-top: 0;
}
.gwtc_head {
    padding: 5px;
}
.gwtc_ttlein{
    background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5) , rgba(0, 0, 0, 1));
    display: inline-block;
    color: #fff;
    padding: 0 7.5px;
    border-radius: 2.5px 0 0 0;
    position: relative;
    height: 22px;
    line-height: 22px;
}
.gwtc_swiper{
    left: 0;
    top: 0;
    position: relative;
    width: 100%;
    background-color: #fff;
    color: #666;
    border-top: 0.5px solid #f3f4f9;
    padding-top: 2.5px;
    z-index: 1;
}
.gwtc_swiperitem{
    align-items: center;
}
.gwtc_ttlein::after{
    content: "";
    width:0;
    height:0;
    border-left:10px solid transparent;
    border-right:10px solid transparent;
    border-top:22px solid #000;
    position: absolute;
    top: 0;
    right: -10px;
}
/**/
.indexdata_box{
    border:0.5px solid #eee;
    margin: 10px;
}
.indexdata_in{
    overflow: hidden;
    padding: 10px 5px;
}
.indexdata_l img{
    width: 30px;
    height: 30px;
    display: block;
    border-radius: 50%;

}
.indexdata_item{
    align-items: center;
    width: 33.3%;
    padding:10px 0;
}
.indexdata_r{
    padding-left: 5px;
    font-size: 13px;
}
.indexdata_num{
    font-size: 17.5px;
    font-weight: bold;
}
.indexdata_name{
    color: #666;
    font-size: 14px;
}
.locbox{
    width: 100%;
    height: 100%;
}
.closeloc{
    position: fixed;
    bottom: 15px;
    right: 5px;
    color: #666;
}
/**/
.group-price {
    display:block;
    font-size:13px;
    line-height:13px;
    color:#FF2436;
}
.group-price .cdj {
    font-size: 12px;
}

.group-price .rmb {
    padding-right: 4px;
    font-weight: 700;
}
.group-price .price-deci {
    font-weight: 700;
    margin-right: 0;
}
.group-price .price-ori {
    color: #999;
    padding-left: 6px;
    text-decoration: line-through;
}
._progress {
    position: relative;
    width: 94px;
    height: 14px;
    background: rgba(255,119,111,0.3);
    border: 0.5px solid rgba(255,119,111,0.5);
    border-radius: 50px;
    margin-top: 10.5px;
    overflow: hidden;
}

._progress .text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: 10px;
    color: #fff;
    z-index: 1000;
}

._progress .progress-inner {
    position: absolute;
    left: 0;
    right: 0;
    height: 14px;
    background-image: linear-gradient(50deg,#FE597C 0%,#FF776F 100%);
    border-radius: 50px;
}
.tuan-group-btn {
    position: absolute;
    right: 12px;
    bottom: 0;
    right: 0;
    text-align: -webkit-right;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: end;
    justify-content: flex-end;
}
.tuan-group-btn .group-btn {
    background-color: transparent;
    line-height: 0;
}
.tuan-group-btn .btn-selling {
    background-image: linear-gradient(50deg,#FE597C 0%,#FF776F 100%);
    vertical-align: middle;
}
.tuan-group-btn .button {
    display: inline-block;
    width: 44px;
    height: 24px;
    padding: 0 8px;
    margin-top: 8px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    border-radius: 50px;
    line-height: 24px;
    white-space: nowrap;
}

/**/
.customnav_search{
    margin: 0 10px;
    background-color: rgba(255,255,255,0.6);
    height: 32.5px;
    line-height: 32.5px;
    border-radius: 32.5px;
    color: #999999;
    font-size: 12px;
    width: 175px;
    font-weight: 100;
    align-items: center;
}
.customnav_search .iconfonta{
    width: 15px!important;
    height: 15px!important;
    padding-right: 2.5px;
    vertical-align: middle;
    margin-top: 0!important;
}
.customnav_pname{
    font-size: 15px;
    color: #333;
    font-weight: 500;
    width: 60px;
    overflow: hidden;
    white-space: nowrap;
}
.customnav_pname .customnav_locname {
    text-overflow: initial!important;
}
.customnav_stylea{
    background-color: rgba(0,0,0,0);
}

.quick-listbig{
    width: 190px!important;
}
.quick-listbig .btm_tit{
    height: 36px;
    overflow: hidden;
    font-size: 13px;
    line-height: 18px;
    padding: 0 5px;
    margin: 5px 0;
}
.quick-listbig .btm_button{
    border-radius: 25px;
}
.title_in{
    display: inline-block;
    position: relative;
    z-index: 1;
}
.title_intext{
    position: relative;
    z-index: 1;
}
.title_inbg{
    position: absolute;
    width: 105%;
    height: 7px;
    border-radius: 17.5px;
    background-color: #fff;
    bottom: 3.5px;
    z-index: 0;
}

.trade-box{
    width: 94vw;
    height: 100vh;
    position:relative;
    padding:3vw;
    padding-top:42px;
}
.trade-item{
    padding: 5px 10px;
    border-radius: 50px;
    background: #eee;
    display: inline-block;
    margin: 0 10px 10px 0;
    font-size: 14px;
}
.trade-tit{
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    padding-bottom: 5px;
}

.pcity-close{
    position: absolute;
    top: 20px;
    left: 25px;
}
.i-search .citysearch{
    color:#666;
    background-color:#f3f4f7;
    border-radius:2px;
    padding:3px 10px;
    margin-right:0;
    align-items:center;
}
.i-search .citysearch input{
    width: 100%;
    background: transparent;
    border:0;
    border-radius: 0;
}

</style>