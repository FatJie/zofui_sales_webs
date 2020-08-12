import iview from 'iview';
import router from '../../router';
import CryptoJS from "crypto-js";

export default{
    install(Vue){

        Vue.prototype.$util = { //全局方法
            const : {
                module : 'zofui_sales',
                version : '1.0.1',
                key : '132131321',
                secret : 'dwqdnqifwfq2',
                scrollinit : false,
                uniacid : 0,
            },
            getUrlParam : function(name) { //获取url中的参数
                var reg = new RegExp('(^|&?)' + name + '=([^&]*)(&|$)', 'i');
                var r = window.location.href.substr(1).match(reg);
                if (r != null) {
                    return decodeURI(r[2]);
                }
                return undefined;
            },
            getQuery : function (url) {
                var theRequest = {};
                if (url.indexOf("?") != -1) {
                    var str = url.split('?')[1];
                    var strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        if (strs[i].split("=")[0] && unescape(strs[i].split("=")[1])) {
                            theRequest[ strs[i].split("=")[0] ] = unescape(strs[i].split("=")[1])
                        }
                    }
                }
                return theRequest;
            },
            Host(){
                return location.href.indexOf('http://127.0.0.1:8080') >= 0 || location.href.indexOf('http://192.168') >= 0 ? '192.168.0.103' : window.location.host;
            },
            Getp(){
                var url = location.href.indexOf('http://127.0.0.1:8080') >= 0 || location.href.indexOf('http://192.168') >= 0 ? 'http://127.0.0.2/app/index.php?i=4&c=entry&do=index&op=self&m='+this.const.module : location.href;
                return this.getQuery(url);
            },
            apiUrl : function(options){
                var host = this.Host();
                var param = this.Getp();
                var url = window.location.protocol+ '//' + host + '/web/index.php?a=entry&m='+this.const.module+'&c=site';
                for (var t in options) {
                    if(options[t]) url += '&'+t+'='+options[t];
                }
                return url;
            },
            Murl : function(doo,op){
                var host = this.Host();
                var param = this.Getp();
                return window.location.protocol+ '//' + host + '/web/index.php?c=site&m='+this.const.module+'&a=entry&do='+doo+'&op='+op;
            },
            apiUrl_admin(options){
                var url = this.Aurl(options.doo ? options.doo : '');
                for (var t in options) {
                    if(options[t]) url += '&'+t+'='+options[t];
                }
                return url;
            },
            Aurl(doo,op){
                var host = this.Host();
                var param = this.Getp();
                var url = window.location.protocol+ '//' + host + '/app/index.php?i='+param.i+'&m='+this.const.module+'&c=entry&p=admin&do='+doo;
                if( op ) url += '&op='+op;
                return url;
            },
            apiUrl_area(options){
                var url = this.Aurl_area(options.doo ? options.doo : '');
                for (var t in options) {
                    if(options[t]) url += '&'+t+'='+options[t];
                }
                return url;
            },
            Aurl_area(doo,op){
                var host = this.Host();
                var param = this.Getp();
                var url = window.location.protocol+ '//' + host + '/app/index.php?i='+param.i+'&m='+this.const.module+'&c=entry&p=area&do='+doo;
                if( op ) url += '&op='+op;
                return url;
            },
            enBase64(str){
                var src = CryptoJS.enc.Utf8.parse(str);
                return CryptoJS.enc.Base64.stringify(src);
            },
            deBase64(str){
                var base64string = CryptoJS.enc.Base64.parse(str);
                return CryptoJS.enc.Utf8.stringify(base64string);
            },
            http : function(doo,method,data,success,loading,fail,parth){
                var self = this;
                if( data.p == 'admin' ){
                    var url = this.apiUrl_admin({do:doo});
                }else if( data.p == 'area' ){
                    var url = this.apiUrl_area({do:doo});
                }else{
                    var url = this.apiUrl({do:doo});
                }
                
                var token = self.cookie.get('token');
                if (!data.token && token) {
                    data.token = token;
                }

                var param = this.getQuery(url);
                if( data && method.toLowerCase() == 'get' ){
                    for (var t in data) {
                        param[t] = data[t];
                    }
                }
                
                param.timestamp = data.timestamp = new Date().getTime();
                param.md5key = this.const.key+this.const.secret;

                var sortarr = [];
                for (var t in param) {
                    sortarr.push({name:t,key:param[t]});
                }
                var sortarra = this.ksort(sortarr);
                
                
                var strddd = '';
                for (var i = 0; i < sortarra.length; i++) {
                    strddd += '&'+sortarra[i].name+'='+sortarra[i].key;
                }
                strddd = strddd.substring(1);
                var sign = CryptoJS.MD5(strddd,this.const.key,this.const.secret).toString();
                url += '&sign='+sign;
                if( parth ){
                    url += parth;
                }
                
                if( method.toLowerCase() == 'post' ){
                    Vue.http.post(url,data,{
                        withCredentials : true,
                        emulateJSON : true,
                        before:function(){
                        
                            if( loading ){
                                iview.Spin.show();
                            }

                    }}).then(function(res){

                        if( data.p == 'admin' && res.body && res.body.status == 210 ){
                            iview.Message.error({
                                content: '请登录',
                                duration: 0.1,
                                onClose: function(){
                                    //router.push({name:'adminlogin'});
                                }
                            });
                            return false;
                        }

                        self.httpcom(res,loading,success);

                    },function(res){
                        if(loading) {
                            iview.Spin.hide();
                        }
                        if(fail) fail(res.body);
                    });
                }else{
                    Vue.http.get(url,{
                        params:data,
                        withCredentials : true,
                        before:function(){
                        
                            if( loading ){
                                iview.Spin.show();
                            }

                    }}).then(function(res){
                        if( data.p == 'admin' && res.body && res.body.status == 210 ){
                            
                            iview.Message.error({
                                content: '请登录',
                                duration: 0.1,
                                onClose: function(){
                                    router.push({name:'adminlogin'});
                                }
                            });
                            return false;
                        }
                       
                        self.httpcom(res,loading,success);

                    },function(res){
                        if(loading) {
                            iview.Spin.hide();
                        }
                        if(fail) fail(res.body);
                    });
                }
            },
            httpcom(res,loading,success){
                if(loading) {
                    iview.Spin.hide();
                }
                if( res.body && res.body.redirect && res.body.type == 'warning' && res.body.redirect.indexOf('index.php?c=user&a=login') >= 0  ){
                    
                    iview.Message.error({
                        content : '请登录',
                        duration : 0.01,
                        onClose : function(){
                            router.push({name:'login'});
                        }
                    });
                }
                
                if(success) success(res.body);
            },
            pageList : function(that,data,succall,loading,fail,dataname){
                if( data.geting ) return false;
                var dataname = dataname ? dataname : 'page';

                that[dataname].geting = true;
                this.http( data.pdata.doo ? data.pdata.doo : 'pagelist','GET',data.pdata,function(res){
                    if(res.data && res.data.list && res.data.list.length > 0){
                        data.pdata.page ++;
                    }else{
                    }
                    that[dataname].doing = false;
                    that[dataname].geting = false;
                    if( succall ) succall(res);
                },loading,function(res){
                    if( fail ) fail(res);
                });
            },
            ksort : function(arr){
                function compare(pro) { 
                    return function (obj1, obj2) { 
                        var val1 = obj1[pro]; 
                        var val2 = obj2[pro]; 
                        if (val1 < val2 ) { //正序
                            return -1; 
                        } else if (val1 > val2 ) { 
                            return 1;
                        } else {
                            return 0;
                        } 
                    } 
                }
                return arr.sort(compare('name'));
            },
            random : function(min,max){
                return min + Math.round(Math.random()*max);
            },
            isWeiXin : function(){
                var ua = window.navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                    return true;
                }else{
                    return false;
                }
            },
            verify : function(type,parama,paramb){
                if(type == 'number'){
                    if(parama == 'int'){ // 正整数
                        var R = /^[1-9]*[1-9][0-9]*$/;
                    }else if(parama == 'intAndLetter'){ //数字和字母
                        var R = /^[A-Za-z0-9]*$/;
                    }else if(parama == 'money'){ //金额,最多2个小数
                        var R = /^\d+\.?\d{0,2}$/;
                    }
                    return R.test(paramb);
                }else if(type == 'mobile'){ //手机
                    var R = /^1[3|4|5|6|7|8|9]\d{9}$/;
                    return R.test(parama);
                }else if(type == 'cn'){ //中文
                    var R = /^[\u2E80-\u9FFF]+$/;
                    return R.test(parama);
                }
            },
            loadMap(){
                if( this.isinitmap ) {
                    return new Promise(function (resolve, reject) {
                        resolve(qq)
                    })
                }
                this.isinitmap = true;
                return new Promise(function (resolve, reject) {
                    window.mapinit = function () {
                      resolve(qq)
                    }
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = "https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js?callback=init";
                    script.onerror = reject;

                    if (script.addEventListener) {
                      script.addEventListener('load', function () {
                        mapinit();
                      }, false);
                    } else if (script.attachEvent) {
                      script.attachEvent('onreadystatechange', function () {
                        var target = window.event.srcElement;
                        if (target.readyState == 'loaded') {
                          mapinit();
                        }
                      });
                    }
                    document.head.appendChild(script);
                })
            },
            getLocation(fn,tkey,wx){
                var self = this;

                var cache = self.getCache('loc');
                var now = new Date().getTime();
                if( !cache || cache == '' || loc.end < now ){
                    var key = tkey ? tkey : 'GWRBZ-7YVCG-N4BQ7-IX3P7-AYKSO-H6FCY';
                    var dev = self.dev();
                    if (dev == 'wx') {
                        wx.ready(function(){
                            wx.getLocation({
                                type: 'gcj02', //可传入'gcj02'
                                success: function (res) {
                                    var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                    var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                    self.getAddress(lat,lng,function(add){
                                        var position = {
                                            lat : lat,
                                            lng : lng,
                                            province : '',
                                            city : '',
                                            address : add.result.formatted_addresses.recommend,
                                        };
                                        position.end = new Date().getTime() + 300*1000;
                                        self.setCache('loc',position);
                                        fn(position);
                                    },tkey);
                                },
                                fail : function(res){
                                    Toast('获取位置失败'+JSON.stringify(res));
                                }
                            });
                        })
                    }else if(dev == 'app'){
                        api.getLocation(function(ret, err) {
                            if (ret && ret.status) {
                                
                                var lat = ret.latitude; // 纬度，浮点数，范围为90 ~ -90
                                var lng = ret.longitude; // 经度，浮点数，范围为180 ~ -180。
                                self.getAddress(lat,lng,function(add){
                                    var position = {
                                        lat : lat,
                                        lng : lng,
                                        province : '',
                                        city : '',
                                        address : add.result.formatted_addresses.recommend,
                                    };
                                    position.end = new Date().getTime() + 300*1000;
                                    self.setCache('loc',position);
                                    fn(position);
                                },tkey);
                                
                            } else {
                                Toast(JSON.stringify(err));
                            }
                        });
                                     
                    }else{
                        self.loadMap().then(qq => {
                            var geolocation = new qq.maps.Geolocation(key, "myapp");
                            geolocation.getLocation(function(position){
                                position.address = position.city+position.addr;
                                position.end = new Date().getTime() + 300*1000;
                                self.setCache('loc',position);
                                fn(position);
                                
                            },function(){
                                Toast('获取位置失败');
                            });
                        });
                    }
                }else{
                    fn(cache);
                }
            },
            getAddress(lat,lng,fn,tkey){
                var key = tkey ? tkey : 'GWRBZ-7YVCG-N4BQ7-IX3P7-AYKSO-H6FCY';
                var url = 'https://apis.map.qq.com/ws/geocoder/v1/?location='+lat+','+lng+'&get_poi=1&output=jsonp&_=1563328078922&key='+key;
                Vue.http.jsonp(url,{
                    jsonp:'cb'
                }).then(function(res){
                    if(fn) fn(res.body);
                });
            },
            setCache(name,value){
                value = JSON.stringify({value : value});
                var cache = sessionStorage.setItem(name,value);
            },
            getCache(name){
                var v = sessionStorage.getItem(name);
                if( v ){
                    try{
                        var res = JSON.parse(v);
                        return res.value;
                    }catch(err){
                        return false;
                    }
                }
                return false;
            },
            bindtap(e,type,that){
                if( type == 'copy' ){
                    //console.log('33',e)
                    that.$copyText(e.currentTarget.dataset.copy).then(function (e) {
                        that.$Message.success('已复制');
                    }, function (e) {
                        that.$Message.error('复制失败');
                    })
                }else if(type == 'callphone' || type == 'tel'){
                    window.location.href = 'tel://' + e.currentTarget.dataset.tel;
                }else if(type == 'weburl'){
                    window.location.href = e.currentTarget.dataset.weburl;
                }else if(type == 'url'){
                    that.$router.push(e.currentTarget.dataset.url);
                }else if(type == 'img'){
                    var img = e.currentTarget.dataset.img.split(/,/);
                    ImagePreview({
                        images : img,
                        startPosition : e.currentTarget.dataset.index*1
                    });
                }else if( type == 'loc' ){
                    var add = e.currentTarget.dataset.add;
                    var lat = e.currentTarget.dataset.lat;
                    var lng = e.currentTarget.dataset.lng;
                    location.href = 'https://apis.map.qq.com/tools/routeplan/eword='+add+'&epointx='+lng+'&epointy='+lat+'?referer=myapp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77';
                }
            },
            cookie : {
                prefix : '',
                // 保存 Cookie
                set : function(name, value, seconds) {
                    var expires = new Date();
                    var value = encodeURI(value);
                    expires.setTime(expires.getTime() + (1000 * seconds));
                    document.cookie = this.name(name) + "=" + escape(value) + "; expires=" + expires.toGMTString() + "; path=/";
                },
                // 获取 Cookie
                get : function(name) {
                    let cookie_name = this.name(name) + "=";
                    let cookie_length = document.cookie.length;
                    let cookie_begin = 0;
                    let value_begin;
                    while (cookie_begin < cookie_length)
                    {
                        value_begin = cookie_begin + cookie_name.length;
                        if (document.cookie.substring(cookie_begin, value_begin) == cookie_name)
                        {
                            var value_end = document.cookie.indexOf ( ";", value_begin);
                            if (value_end == -1)
                            {
                                value_end = cookie_length;
                            }
                            // console.log(value_end)
                            return decodeURI(unescape(document.cookie.substring(value_begin, value_end)));
                        }
                        cookie_begin = document.cookie.indexOf ( " ", cookie_begin) + 1;
                        if (cookie_begin == 0)
                        {
                            break;
                        }
                    }
                    // console.log(99999999999)
                    return null;
                },
                // 清除 Cookie
                del : function(name) {
                    var expireNow = new Date();
                    document.cookie = this.name(name) + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT" + "; path=/";
                },
                name : function(name) {
                    return this.prefix + name;
                }

            },
            share(wx,sharedata){
                var data = {
                    title: sharedata.title,
                    desc: sharedata.desc,
                    link: sharedata.link,
                    imgUrl:sharedata.img,
                    trigger: function (res) {
                        //self.$toast('发起分享');
                    },
                    success: function (res) {
                        //self.$toast('分享成功');
                    },
                    cancel: function (res) {},
                };
                wx.ready(function (){
                    wx.onMenuShareAppMessage(data);
                    //分享QQ
                    wx.onMenuShareQQ(data);
                    //分享QQ空间
                    wx.onMenuShareQZone(data);  
                    //朋友圈
                    wx.onMenuShareTimeline(data);
                })
            },
            upimg(file,fn){
                
                var url = location.href.indexOf('http://127.0.0.1:8080') >= 0 || location.href.indexOf('http://192.168') >= 0 ? 'http://192.168.103/app/index.php?i=1&c=entry&do=index&op=self&m='+this.const.module : location.href;
                var host = location.href.indexOf('http://127.0.0.1:8080') >= 0 || location.href.indexOf('http://192.168') >= 0 ? '192.168.0.102' : window.location.host;
                var param = this.getQuery(url);
                url = window.location.protocol+ '//' + host + '/app/index.php?i='+param.i+'&c=utility&a=file&do=upload&type=image';
                let params = new FormData(); //创建form对象
                params.append("file", file);
                Vue.http.post(url,params,{before:function(){
                    Toast.loading({
                        mask: false,
                        duration : 0,
                        forbidClick : true,
                        message: ''
                    });
                }}).then(function(res){
                    Toast.clear();
                    if( fn ) fn(res.body);
                },function(res){
                    Toast.clear();
                    console.log(res)
                })

            },
            formDate(date,type){
                var year = date.getFullYear(); 
                var month = date.getMonth() + 1; 
                var day = date.getDate(); 
                var hour = date.getHours(); 
                var minute = date.getMinutes(); 
                var second = date.getSeconds();
                if( type == 'date' ){
                    return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);  
                }
                if( type == 'time' ){
                    return this.formatTen(hour)+':'+this.formatTen(minute)+':'+this.formatTen(second);  
                }
                return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + ' '+this.formatTen(hour)+':'+this.formatTen(minute)+':'+this.formatTen(second);                  
            },
            formatTen(num) { 
                return num > 9 ? (num + "") : ("0" + num); 
            },
            themcolor(flag){
                if( flag == 'theme-custom01' ) return '#fb2d37';
                if( flag == 'theme-custom02' ) return '#ff2726';
                if( flag == 'theme-custom03' ) return '#fcc600';
                if( flag == 'theme-custom04' ) return '#ff547b';
                if( flag == 'theme-custom05' ) return '#09bb07';
                if( flag == 'theme-custom06' ) return '#65c4aa';
                if( flag == 'theme-custom07' ) return '#388cee';
                if( flag == 'theme-custom08' ) return '#f8e9dd';
                if( flag == 'theme-custom09' ) return '#6cbe72';
                return '#fb2d37';
            },
            dev(){
                if( typeof api == 'object' ){
                    return 'app';
                }
                if( this.isWeiXin() ){
                    return 'wx';
                }
                return 'wap';
            }
        }

    }
}