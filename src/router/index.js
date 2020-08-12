import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)


export default new Router({
	//mode: 'history',
 	routes: [
        {
            path : '/',
            name: 'settingindex',
            component: resolve => require(['@/pages/setting/index'], resolve),
            meta : {
                keepAlive: true,
                title: '参数设置',
            }
        },
        {
            path : '/settingindex',
            name: 'settingindex',
            component: resolve => require(['@/pages/setting/index'], resolve),
            meta : {
                keepAlive: true,
                title: '参数设置',
            }
        },
        {
            path : '/settingadmin',
            name: 'settingadmin',
            component: resolve => require(['@/pages/setting/admin'], resolve),
            meta : {
                keepAlive: true,
                title: '管理员',
            }
        },
        {
            path : '/settingset',
            name: 'settingset',
            component: resolve => require(['@/pages/setting/set'], resolve),
            meta : {
                keepAlive: true,
                title: '设置',
            }
        },
        {
            path : '/settingexplain',
            name: 'settingexplain',
            component: resolve => require(['@/pages/setting/explain'], resolve),
            meta : {
                keepAlive: true,
                title: '使用说明',
            }
        },
        {
            path : '/settingupdate',
            name: 'settingupdate',
            component: resolve => require(['@/pages/setting/update'], resolve),
            meta : {
                keepAlive: true,
                title: '更新数据',
            }
        },
        {
            path : '/pushinfo',
            name: 'pushinfo',
            component: resolve => require(['@/pages/setting/pushinfo'], resolve),
            meta : {
                keepAlive: true,
                title: '微信推送',
            }
        },
        {
            path : '/shoppush',
            name: 'shoppush',
            component: resolve => require(['@/pages/setting/shoppush'], resolve),
            meta : {
                keepAlive: true,
                title: '商户推送',
            }
        },
        {
            path : '/carepush',
            name: 'carepush',
            component: resolve => require(['@/pages/setting/carepush'], resolve),
            meta : {
                keepAlive: true,
                title: '已关注推送',
            }
        },
        {
            path : '/settingkefu',
            name: 'settingkefu',
            component: resolve => require(['@/pages/setting/kefu'], resolve),
            meta : {
                keepAlive: true,
                title: '客服中心',
            }
        },
        {
            path : '/settingcode',
            name: 'settingcode',
            component: resolve => require(['@/pages/setting/code'], resolve),
            meta : {
                keepAlive: true,
                title: '运营秘钥',
            }
        },
        {
            path : '/operationlog',
            name: 'operationlog',
            component: resolve => require(['@/pages/setting/operationlog'], resolve),
            meta : {
                keepAlive: true,
                title: '操作日志',
            }
        },
        {
            path : '/settingurl',
            name: 'settingurl',
            component: resolve => require(['@/pages/setting/url'], resolve),
            meta : {
                keepAlive: true,
                title: '',
            }
        },
        {
            path : '/goodslist',
            name: 'goodslist',
            component: resolve => require(['@/pages/goods/list'], resolve),
            meta : {
                keepAlive: true,
                title: '商品列表',
            }
        },
        {
            path : '/goodssort',
            name: 'goodssort',
            component: resolve => require(['@/pages/goods/sort'], resolve),
            meta : {
                keepAlive: true,
                title: '商品分类',
            }
        },
        {
            path : '/goodstag',
            name: 'goodstag',
            component: resolve => require(['@/pages/goods/tag'], resolve),
            meta : {
                keepAlive: true,
                title: '商品标签',
            }
        },
        {
            path : '/goodsmusic',
            name: 'goodsmusic',
            component: resolve => require(['@/pages/goods/music'], resolve),
            meta : {
                keepAlive: true,
                title: '背景音乐库',
            }
        },
        {
            path : '/userlist',
            name: 'userlist',
            component: resolve => require(['@/pages/user/list'], resolve),
            meta : {
                keepAlive: true,
                title: '用户列表',
            }
        },
        {
            path : '/recomlist',
            name: 'recomlist',
            component: resolve => require(['@/pages/user/recomlist'], resolve),
            meta : {
                keepAlive: true,
                title: '地推列表',
            }
        },
        {
            path : '/userdown',
            name: 'userdown',
            component: resolve => require(['@/pages/user/down'], resolve),
            meta : {
                keepAlive: true,
                title: '下级',
            }
        },
        {
            path : '/addhelp',
            name: 'addhelp',
            component: resolve => require(['@/pages/user/addhelp'], resolve),
            meta : {
                keepAlive: true,
                title: '添加帮助',
            }
        },
        {
            path : '/userhelplist',
            name: 'userhelplist',
            component: resolve => require(['@/pages/user/helplist'], resolve),
            meta : {
                keepAlive: true,
                title: '帮助列表',
            }
        },
        {
            path : '/userfxjoin',
            name: 'userfxjoin',
            component: resolve => require(['@/pages/user/fxjoin'], resolve),
            meta : {
                keepAlive: true,
                title: '分销说明',
            }
        },
        {
            path : '/usercode',
            name: 'usercode',
            component: resolve => require(['@/pages/user/code'], resolve),
            meta : {
                keepAlive: true,
                title: '会员卡密',
            }
        },
        {
            path : '/agentuser',
            name: 'agentuser',
            component: resolve => require(['@/pages/user/agentuser'], resolve),
            meta : {
                keepAlive: true,
                title: '代理账号',
            }
        },
        {
            path : '/userabout',
            name: 'userabout',
            component: resolve => require(['@/pages/user/about'], resolve),
            meta : {
                keepAlive: true,
                title: '关于我们',
            }
        },
        {
            path : '/usermoneylog',
            name: 'usermoneylog',
            component: resolve => require(['@/pages/user/moneylog'], resolve),
            meta : {
                keepAlive: true,
                title: '余额记录',
            }
        },
        {
            path : '/ucardapply',
            name: 'ucardapply',
            component: resolve => require(['@/pages/user/ucardapply'], resolve),
            meta : {
                title: '申请会员',
            }
        },
        {
            path : '/login',
            name: 'login',
            component: resolve => require(['@/pages/user/login'], resolve),
            meta : {
                title: '登录',
            }
        },
        {
            path : '/applist',
            name: 'applist',
            component: resolve => require(['@/pages/user/applist'], resolve),
            meta : {
                title: '平台管理',
            }
        },
        {
            path : '/userjifenlog',
            name: 'userjifenlog',
            component: resolve => require(['@/pages/user/jifenlog'], resolve),
            meta : {
                title: '积分记录',
            }
        },
        {
            path : '/shoplist',
            name: 'shoplist',
            component: resolve => require(['@/pages/shop/list'], resolve),
            meta : {
                keepAlive: true,
                title: '商户管理',
            }
        },
        // {
        //     path : '/adminaddgoods',
        //     name: 'goosdetail',
        //     component: resolve => require(['@/pages/goods/detail'], resolve),
        //     meta : {
        //         keepAlive: true,
        //         title: '商品详情',
        //     }
        // },
        {
            path : '/shopadd',
            name: 'shopadd',
            component: resolve => require(['@/pages/shop/add'], resolve),
            meta : {
                keepAlive: true,
                title: '添加商户',
            }
        },
        {
            path : '/addauthen',
            name: 'addauthen',
            component: resolve => require(['@/pages/shop/addauthen'], resolve),
            meta : {
                keepAlive: true,
                title: '认证审核',
            }
        },
        {
            path : '/shopmoneylog',
            name: 'shopmoneylog',
            component: resolve => require(['@/pages/shop/moneylog'], resolve),
            meta : {
                keepAlive: true,
                title: '商户余额记录',
            }
        },
        
        {
            path : '/shopverify',
            name: 'shopverify',
            component: resolve => require(['@/pages/shop/verify'], resolve),
            meta : {
                keepAlive: true,
                title: '审核申请入驻',
            }
        },
        {
            path : '/authentication',
            name: 'authentication',
            component: resolve => require(['@/pages/shop/authentication'], resolve),
            meta : {
                keepAlive: true,
                title: '店铺认证审核',
            }
        },
        {
            path : '/shopsort',
            name: 'shopsort',
            component: resolve => require(['@/pages/shop/sort'], resolve),
            meta : {
                keepAlive: true,
                title: '店铺分类',
            }
        },
        {
            path : '/shoptrade',
            name: 'shoptrade',
            component: resolve => require(['@/pages/shop/trade'], resolve),
            meta : {
                keepAlive: true,
                title: '商圈',
            }
        },
        {
            path : '/shopcity',
            name: 'shopcity',
            component: resolve => require(['@/pages/shop/city'], resolve),
            meta : {
                keepAlive: true,
                title: '城市',
            }
        },
        {
            path : '/shophelpme',
            name: 'shophelpme',
            component: resolve => require(['@/pages/shop/helpme'], resolve),
            meta : {
                keepAlive: true,
                title: '商户帮助管理',
            }
        },
        {
            path : '/shopjifenlog',
            name: 'shopjifenlog',
            component: resolve => require(['@/pages/shop/jifenlog'], resolve),
            meta : {
                keepAlive: true,
                title: '商户积分',
            }
        },
        {
            path : '/agentlist',
            name: 'agentlist',
            component: resolve => require(['@/pages/agent/list'], resolve),
            meta : {
                keepAlive: true,
                title: '代理管理',
            }
        },
        {
            path : '/agentverify',
            name: 'agentverify',
            component: resolve => require(['@/pages/agent/verify'], resolve),
            meta : {
                keepAlive: true,
                title: '审核代理',
            }
        },
        {
            path : '/agentctlist',
            name: 'agentctlist',
            component: resolve => require(['@/pages/agent/ctlist'], resolve),
            meta : {
                keepAlive: true,
                title: '区域代理管理',
            }
        },
        {
            path : '/agentctverify',
            name: 'agentctverify',
            component: resolve => require(['@/pages/agent/ctverify'], resolve),
            meta : {
                keepAlive: true,
                title: '审核区域代理',
            }
        },
        {
            path : '/agentexplain',
            name: 'agentexplain',
            component: resolve => require(['@/pages/agent/explain'], resolve),
            meta : {
                keepAlive: true,
                title: '代理说明',
            }
        },
        {
            path : '/orderlist',
            name: 'orderlist',
            component: resolve => require(['@/pages/order/list'], resolve),
            meta : {
                keepAlive: true,
                title: '订单管理',
            }
        },
        {
            path : '/orderchou',
            name: 'orderchou',
            component: resolve => require(['@/pages/order/chou'], resolve),
            meta : {
                keepAlive: true,
                title: '抽奖订单',
            }
        },
        {
            path : '/ordercard',
            name: 'ordercard',
            component: resolve => require(['@/pages/order/card'], resolve),
            meta : {
                keepAlive: true,
                title: '会员卡订单',
            }
        },
        {
            path : '/orderuprize',
            name: 'orderuprize',
            component: resolve => require(['@/pages/order/uprize'], resolve),
            meta : {
                keepAlive: true,
                title: '抽奖订单',
            }
        },
        {
            path : '/orderjoin',
            name: 'orderjoin',
            component: resolve => require(['@/pages/order/join'], resolve),
            meta : {
                keepAlive: true,
                title: '入驻订单',
            }
        },
        {
            path : '/ordercomment',
            name: 'ordercomment',
            component: resolve => require(['@/pages/order/comment'], resolve),
            meta : {
                keepAlive: true,
                title: '订单评价',
            }
        },
        {
            path : '/ordergoodcomm',
            name: 'ordergoodcomm',
            component: resolve => require(['@/pages/order/goodcomm'], resolve),
            meta : {
                keepAlive: true,
                title: '好评管理',
            }
        },
        {
            path : '/orderaddtime',
            name: 'orderaddtime',
            component: resolve => require(['@/pages/order/addtime'], resolve),
            meta : {
                keepAlive: true,
                title: '续期订单',
            }
        },
        {
            path : '/orderaddm',
            name: 'orderaddm',
            component: resolve => require(['@/pages/order/addm'], resolve),
            meta : {
                keepAlive: true,
                title: '充值订单',
            }
        },
        {
            path : '/ordershoppay',
            name: 'ordershoppay',
            component: resolve => require(['@/pages/order/shoppay'], resolve),
            meta : {
                keepAlive: true,
                title: '商户收款订单',
            }
        },
        {
            path : '/orderinfo',
            name: 'orderinfo',
            component: resolve => require(['@/pages/order/orderinfo'], resolve),
            meta : {
                keepAlive: true,
                title: '订单详情',
            }
        },
        {
            path : '/ordereditcomment',
            name: 'ordereditcomment',
            component: resolve => require(['@/pages/order/editcomment'], resolve),
            meta : {
                keepAlive: true,
                title: '编辑订单评价',
            }
        },
        {
            path : '/ordershopjifen',
            name: 'ordershopjifen',
            component: resolve => require(['@/pages/order/shopjifen'], resolve),
            meta : {
                keepAlive: true,
                title: '商户充值积分订单',
            }
        },
        {
            path : '/otherorder',
            name: 'otherorder',
            component: resolve => require(['@/pages/order/otherorder'], resolve),
            meta : {
                keepAlive: true,
                title: '其他订单',
            }
        },
        {
            path : '/actcut',
            name: 'actcut',
            component: resolve => require(['@/pages/act/cut'], resolve),
            meta : {
                keepAlive: true,
                title: '砍价活动',
            }
        },
        {
            path : '/actgroup',
            name: 'actgroup',
            component: resolve => require(['@/pages/act/group'], resolve),
            meta : {
                keepAlive: true,
                title: '拼团活动',
            }
        },
        {
            path : '/actchou',
            name: 'actchou',
            component: resolve => require(['@/pages/act/chou'], resolve),
            meta : {
                keepAlive: true,
                title: '抽奖活动',
            }
        },
        {
            path : '/actsign',
            name: 'actsign',
            component: resolve => require(['@/pages/act/sign'], resolve),
            meta : {
                keepAlive: true,
                title: '签到活动',
            }
        },
        {
            path : '/actjizi',
            name: 'actjizi',
            component: resolve => require(['@/pages/act/jizi'], resolve),
            meta : {
                keepAlive: true,
                title: '集字活动',
            }
        },

        {
            path : '/moneywaitpay',
            name: 'moneywaitpay',
            component: resolve => require(['@/pages/money/waitpay'], resolve),
            meta : {
                keepAlive: true,
                title: '待处理提现',
            }
        },
        {
            path : '/moneyalipay',
            name: 'moneyalipay',
            component: resolve => require(['@/pages/money/alipay'], resolve),
            meta : {
                keepAlive: true,
                title: '支付宝提现',
            }
        },
        {
            path : '/moneybank',
            name: 'moneybank',
            component: resolve => require(['@/pages/money/bank'], resolve),
            meta : {
                keepAlive: true,
                title: '银行卡提现',
            }
        },
        {
            path : '/moneypayed',
            name: 'moneypayed',
            component: resolve => require(['@/pages/money/payed'], resolve),
            meta : {
                keepAlive: true,
                title: '已支付提现',
            }
        },
        {
            path : '/moneyback',
            name: 'moneyback',
            component: resolve => require(['@/pages/money/back'], resolve),
            meta : {
                keepAlive: true,
                title: '已退回提现',
            }
        },
        {
            path : '/moneyrefuse',
            name: 'moneyrefuse',
            component: resolve => require(['@/pages/money/refuse'], resolve),
            meta : {
                keepAlive: true,
                title: '已拒绝提现',
            }
        },

        {
            path : '/fxlog',
            name: 'fxlog',
            component: resolve => require(['@/pages/fx/log'], resolve),
            meta : {
                keepAlive: true,
                title: '分销记录',
            }
        },
        {
            path : '/fxquest',
            name: 'fxquest',
            component: resolve => require(['@/pages/fx/quest'], resolve),
            meta : {
                keepAlive: true,
                title: '分销问答',
            }
        },
        {
            path : '/fxfxjoin',
            name: 'fxfxjoin',
            component: resolve => require(['@/pages/fx/fxjoin'], resolve),
            meta : {
                keepAlive: true,
                title: '审核申请分销',
            }
        },

        {
            path : '/copylist',
            name: 'copylist',
            component: resolve => require(['@/pages/copy/list'], resolve),
            meta : {
                keepAlive: true,
                title: '版权管理',
            }
        },
        {
            path : '/copyadd',
            name: 'copyadd',
            component: resolve => require(['@/pages/copy/add'], resolve),
            meta : {
                keepAlive: true,
                title: '版权管理',
            }
        },
        {
            path : '/activity',
            name: 'activity',
            component: resolve => require(['@/pages/activity/index'], resolve),
            meta : {
                keepAlive: true,
                title: '营销活动',
            }
        },
        {
            path : '/redbaglist',
            name: 'redbaglist',
            component: resolve => require(['@/pages/activity/redbaglist'], resolve),
            meta : {
                keepAlive: true,
                title: '红包管理',
            }
        },
        {
            path : '/redbagadd',
            name: 'redbagadd',
            component: resolve => require(['@/pages/activity/redbagadd'], resolve),
            meta : {
                keepAlive: true,
                title: '添加红包',
            }
        },
        {
            path : '/redbaglog',
            name: 'redbaglog',
            component: resolve => require(['@/pages/activity/redbaglog'], resolve),
            meta : {
                keepAlive: true,
                title: '领取红包记录',
            }
        },
        {
            path : '/prizelist',
            name: 'prizelist',
            component: resolve => require(['@/pages/activity/prizelist'], resolve),
            meta : {
                keepAlive: true,
                title: '奖品管理',
            }
        },
        {
            path : '/prizeadd',
            name: 'prizeadd',
            component: resolve => require(['@/pages/activity/prizeadd'], resolve),
            meta : {
                keepAlive: true,
                title: '添加奖品',
            }
        },
        {
            path : '/prizelog',
            name: 'prizelog',
            component: resolve => require(['@/pages/activity/prizelog'], resolve),
            meta : {
                keepAlive: true,
                title: '中奖记录',
            }
        },

        {
            path : '/zhuanpanlist',
            name: 'zhuanpanlist',
            component: resolve => require(['@/pages/activity/zhuanpanlist'], resolve),
            meta : {
                keepAlive: true,
                title: '每日抽奖奖品',
            }
        },
        {
            path : '/zhuanpanadd',
            name: 'zhuanpanadd',
            component: resolve => require(['@/pages/activity/zhuanpanadd'], resolve),
            meta : {
                keepAlive: true,
                title: '添加每日抽奖奖品',
            }
        },
        {
            path : '/zhuanpanlog',
            name: 'zhuanpanlog',
            component: resolve => require(['@/pages/activity/zhuanpanlog'], resolve),
            meta : {
                keepAlive: true,
                title: '每日抽奖记录',
            }
        },
        {
            path : '/zhuanpanset',
            name: 'zhuanpanset',
            component: resolve => require(['@/pages/activity/zhuanpanset'], resolve),
            meta : {
                keepAlive: true,
                title: '设置每日抽奖',
            }
        },
        {
            path : '/signlist',
            name: 'signlist',
            component: resolve => require(['@/pages/activity/signlist'], resolve),
            meta : {
                keepAlive: true,
                title: '到店签到礼包',
            }
        },
        {
            path : '/signadd',
            name: 'signadd',
            component: resolve => require(['@/pages/activity/signadd'], resolve),
            meta : {
                keepAlive: true,
                title: '添加签到礼包',
            }
        },
        {
            path : '/gwfclog',
            name: 'gwfclog',
            component: resolve => require(['@/pages/activity/gwfclog'], resolve),
            meta : {
                keepAlive: true,
                title: '购物提成记录',
            }
        },
        {
            path : '/givecardadd',
            name: 'givecardadd',
            component: resolve => require(['@/pages/activity/givecardadd'], resolve),
            meta : {
                keepAlive: true,
                title: '添加会员卡礼包',
            }
        },
        {
            path : '/givecardlist',
            name: 'givecardlist',
            component: resolve => require(['@/pages/activity/givecardlist'], resolve),
            meta : {
                keepAlive: true,
                title: '会员卡礼包管理',
            }
        },
        {
            path : '/ucardlist',
            name: 'ucardlist',
            component: resolve => require(['@/pages/activity/ucardlist'], resolve),
            meta : {
                keepAlive: true,
                title: '购会员卡赠优惠券',
            }
        },
        {
            path : '/ucardadd',
            name: 'ucardadd',
            component: resolve => require(['@/pages/activity/ucardadd'], resolve),
            meta : {
                keepAlive: true,
                title: '添加购会员卡赠优惠券',
            }
        },
        {
            path : '/pakadd',
            name: 'pakadd',
            component: resolve => require(['@/pages/activity/pakadd'], resolve),
            meta : {
                keepAlive: true,
                title: '添加套餐商品',
            }
        },
        {
            path : '/paklist',
            name: 'paklist',
            component: resolve => require(['@/pages/activity/paklist'], resolve),
            meta : {
                keepAlive: true,
                title: '套餐商品管理',
            }
        },
  	    {
            path : '/yhcode',
            name: 'yhcode',
            component: resolve => require(['@/pages/activity/yhcode'], resolve),
            meta : {
                keepAlive: true,
                title: '优惠码管理',
            }
        },
        {
            path : '/cardadd',
            name: 'cardadd',
            component: resolve => require(['@/pages/activity/cardadd'], resolve),
            meta : {
                title: '添加优惠券',
            }
        },
        {
            path : '/cardlist',
            name: 'cardlist',
            component: resolve => require(['@/pages/activity/cardlist'], resolve),
            meta : {
                title: '优惠券管理',
            }
        },
        {
            path : '/cardlog',
            name: 'cardlog',
            component: resolve => require(['@/pages/activity/cardlog'], resolve),
            meta : {
                title: '领取优惠券记录',
            }
        },
        {
            path : '/cardredbaglog',
            name: 'cardredbaglog',
            component: resolve => require(['@/pages/activity/cardredbaglog'], resolve),
            meta : {
                title: '领取红包记录',
            }
        },
        {
            path : '/articleadd',
            name: 'articleadd',
            component: resolve => require(['@/pages/activity/articleadd'], resolve),
            meta : {
                title: '添加文章',
            }
        },
        {
            path : '/articlelist',
            name: 'articlelist',
            component: resolve => require(['@/pages/activity/articlelist'], resolve),
            meta : {
                title: '文章管理',
            }
        },
        {
            path : '/articlesort',
            name: 'articlesort',
            component: resolve => require(['@/pages/activity/articlesort'], resolve),
            meta : {title: '文章分类',}
        },
        {
            path : '/bmadd',
            name: 'bmadd',
            component: resolve => require(['@/pages/activity/bmadd'], resolve),
            meta : {title: '报名设置',}
        },
        {
            path : '/bmpaylog',
            name: 'bmpaylog',
            component: resolve => require(['@/pages/activity/bmpaylog'], resolve),
            meta : {title: '支付记录',}
        },
        {
            path : '/bmlog',
            name: 'bmlog',
            component: resolve => require(['@/pages/activity/bmlog'], resolve),
            meta : {title: '报名记录',}
        },
        {
            path : '/pagegoods0',
            name: 'pagegoods0',
            component: resolve => require(['@/pages/page/pagegoods0'], resolve),
            meta : {title: '普通商品海报',}
        },
        {
            path : '/pagegoods1',
            name: 'pagegoods1',
            component: resolve => require(['@/pages/page/pagegoods1'], resolve),
            meta : {title: '限抢商品海报',}
        },
        {
            path : '/pagegoods2',
            name: 'pagegoods2',
            component: resolve => require(['@/pages/page/pagegoods2'], resolve),
            meta : {title: '拼团商品海报',}
        },
        {
            path : '/pagegoods3',
            name: 'pagegoods3',
            component: resolve => require(['@/pages/page/pagegoods3'], resolve),
            meta : {title: '砍价商品海报',}
        },
        {
            path : '/pagegoods4',
            name: 'pagegoods4',
            component: resolve => require(['@/pages/page/pagegoods4'], resolve),
            meta : {title: '报名商品海报',}
        },
        {
            path : '/pagegoods5',
            name: 'pagegoods5',
            component: resolve => require(['@/pages/page/pagegoods5'], resolve),
            meta : {title: '抽奖活动海报',}
        },
        {
            path : '/pagegoods6',
            name: 'pagegoods6',
            component: resolve => require(['@/pages/page/pagegoods6'], resolve),
            meta : {title: '秒杀商品海报',}
        },
        {
            path : '/pagefx',
            name: 'pagefx',
            component: resolve => require(['@/pages/page/pagefx'], resolve),
            meta : {title: '分销海报',}
        },
        {
            path : '/pagedl',
            name: 'pagedl',
            component: resolve => require(['@/pages/page/pagedl'], resolve),
            meta : {title: '代理海报',}
        },
        {
            path : '/pageshop',
            name: 'pageshop',
            component: resolve => require(['@/pages/page/pageshop'], resolve),
            meta : {title: '店铺海报',}
        },
        {
            path : '/pagejizi',
            name: 'pagejizi',
            component: resolve => require(['@/pages/page/pagejizi'], resolve),
            meta : {title: '集字海报',}
        },
        {
            path : '/pagecard',
            name: 'pagecard',
            component: resolve => require(['@/pages/page/pagecard'], resolve),
            meta : {title: '卡券海报',}
        },
        {
            path : '/pageindex',
            name: 'pageindex',
            component: resolve => require(['@/pages/page/pageindex'], resolve),
            meta : {title: '设计首页',}
        },
        {
            path : '/pageuser',
            name: 'pageuser',
            component: resolve => require(['@/pages/page/pageuser'], resolve),
            meta : {title: '设计个人中心',}
        },
        {
            path : '/pagelist',
            name: 'pagelist',
            component: resolve => require(['@/pages/page/pagelist'], resolve),
            meta : {title: '专题页面管理',}
        },
        {
            path : '/pagevip',
            name: 'pagevip',
            component: resolve => require(['@/pages/page/pagevip'], resolve),
            meta : {title: 'vip海报',}
        },
        {
            path : '/pageservice',
            name: 'pageservice',
            component: resolve => require(['@/pages/page/pageservice'], resolve),
            meta : {title: '服务商海报',}
        },
        {
            path : '/pagetuoke',
            name: 'pagetuoke',
            component: resolve => require(['@/pages/page/pagetuoke'], resolve),
            meta : {title: '联合拓客',}
        },
        {
            path : '/pagetuokes',
            name: 'pagetuokes',
            component: resolve => require(['@/pages/page/pagetuokes'], resolve),
            meta : {title: '联合拓客',}
        },
        {
            path : '/pageinvitation',
            name: 'pageinvitation',
            component: resolve => require(['@/pages/page/pageinvitation'], resolve),
            meta : {title: '邀请好友海报',}
        },
        {
            path : '/datauser',
            name: 'datauser',
            component: resolve => require(['@/pages/data/datauser'], resolve),
            meta : {title: '用户数据',}
        },
        {
            path : '/dataorder',
            name: 'dataorder',
            component: resolve => require(['@/pages/data/dataorder'], resolve),
            meta : {title: '订单数据',}
        },
        {
            path : '/userdata',
            name: 'userdata',
            component: resolve => require(['@/pages/order/userdata'], resolve),
            meta : {title: '会员余额日志',}
        },
        {
            path : '/weixindata',
            name: 'weixindata',
            component: resolve => require(['@/pages/order/weixindata'], resolve),
            meta : {title: '微信支付日志',}
        },
        {
            path : '/zhifudata',
            name: 'zhifudata',
            component: resolve => require(['@/pages/order/zhifudata'], resolve),
            meta : {title: '支付日志',}
        },
        {
            path : '/shanghudata',
            name: 'shanghudata',
            component: resolve => require(['@/pages/order/shanghudata'], resolve),
            meta : {title: '商户日志',}
        },
        {
            path : '/fenrundata',
            name: 'fenrundata',
            component: resolve => require(['@/pages/order/fenrundata'], resolve),
            meta : {title: '分润日志',}
        },
        {
            path : '/fenhongdata',
            name: 'fenhongdata',
            component: resolve => require(['@/pages/order/fenhongdata'], resolve),
            meta : {title: '分红日志',}
        },
        {
            path : '/freezedata',
            name: 'freezedata',
            component: resolve => require(['@/pages/order/freezedata'], resolve),
            meta : {title: '冻结记录',}
        },
        {
            path : '/jifenlist',
            name: 'jifenlist',
            component: resolve => require(['@/pages/jifen/list'], resolve),
            meta : {title: '积分商城商品管理',}
        },
        {
            path : '/jifenadd',
            name: 'jifenadd',
            component: resolve => require(['@/pages/jifen/add'], resolve),
            meta : {title: '添加积分商城商品',}
        },
        {
            path : '/jifensort',
            name: 'jifensort',
            component: resolve => require(['@/pages/jifen/sort'], resolve),
            meta : {title: '积分商城分类',}
        },
        {
            path : '/jifensended',
            name: 'jifensended',
            component: resolve => require(['@/pages/jifen/sended'], resolve),
            meta : {title: '已发奖',}
        },
        {
            path : '/jifenwait',
            name: 'jifenwait',
            component: resolve => require(['@/pages/jifen/wait'], resolve),
            meta : {title: '等待发奖',}
        },
        {
            path : '/jifenwaitpay',
            name: 'jifenwaitpay',
            component: resolve => require(['@/pages/jifen/waitpay'], resolve),
            meta : {title: '待支付',}
        },
        {
            path : '/jifencomed',
            name: 'jifencomed',
            component: resolve => require(['@/pages/jifen/comed'], resolve),
            meta : {title: '已完成',}
        },
        {
            path : '/jifencode',
            name: 'jifencode',
            component: resolve => require(['@/pages/jifen/code'], resolve),
            meta : {title: '积分卡密',}
        },
        {
            path : '/rolelist',
            name: 'rolelist',
            component: resolve => require(['@/pages/copy/rolelist'], resolve),
            meta : {title: '权限管理',}
        },

        {
            path : '/adminindex',
            name: 'adminindex',
            component: resolve => require(['@/pages/admin/index'], resolve),
            meta : {title: '数据预览',}
        },
        {
            path : '/adminlogin',
            name: 'adminlogin',
            component: resolve => require(['@/pages/admin/login'], resolve),
            meta : {title: '登录',}
        },
       
        {
            path : '/adminsetting',
            name: 'adminsetting',
            component: resolve => require(['@/pages/admin/set'], resolve),
            meta : {title: '运营设置',}
        },
        {
            path : '/adminpass',
            name: 'adminpass',
            component: resolve => require(['@/pages/admin/password'], resolve),
            meta : {title: '设置密码',}
        },
        {
            path : '/adminshopqr',
            name: 'adminshopqr',
            component: resolve => require(['@/pages/admin/shopqr'], resolve),
            meta : {title: '入口二维码',}
        },
        {
            path : '/adminhxqr',
            name: 'adminhxqr',
            component: resolve => require(['@/pages/admin/hxqr'], resolve),
            meta : {title: '核销二维码',}
        },
        {
            path : '/adminkefu',
            name: 'adminkefu',
            component: resolve => require(['@/pages/admin/kefu'], resolve),
            meta : {title: '客服二维码',}
        },
        {
            path : '/adminpayqr',
            name: 'adminpayqr',
            component: resolve => require(['@/pages/admin/payqr'], resolve),
            meta : {title: '收款二维码',}
        },
        {
            path : '/adminadmin',
            name: 'adminadmin',
            component: resolve => require(['@/pages/admin/admin'], resolve),
            meta : {title: '管理员',}
        },
        {
            path : '/adminorder',
            name: 'adminorder',
            component: resolve => require(['@/pages/admin/order'], resolve),
            meta : {title: '订单管理',}
        },
        {
            path : '/memberlist',
            name: 'memberlist',
            component: resolve => require(['@/pages/admin/memberlist'], resolve),
            meta : {title: '用户管理',}
        },
        {
            path : '/adminorderinfo',
            name: 'adminorderinfo',
            component: resolve => require(['@/pages/admin/orderinfo'], resolve),
            meta : {title: '订单详情',}
        },
        {
            path : '/adminhxlog',
            name: 'adminhxlog',
            component: resolve => require(['@/pages/admin/hxlog'], resolve),
            meta : {title: '核销记录',}
        },
        {
            path : '/adminpayorder',
            name: 'adminpayorder',
            component: resolve => require(['@/pages/admin/payorder'], resolve),
            meta : {title: '收款订单',}
        },
        {
            path : '/adminchouorder',
            name: 'adminchouorder',
            component: resolve => require(['@/pages/admin/chouorder'], resolve),
            meta : {title: '抽奖订单',}
        },
        {
            path : '/admincomment',
            name: 'admincomment',
            component: resolve => require(['@/pages/admin/comment'], resolve),
            meta : {title: '评价',}
        },
        {
            path : '/adminactgroup',
            name: 'adminactgroup',
            component: resolve => require(['@/pages/admin/actgroup'], resolve),
            meta : {title: '拼团活动',}
        },
        {
            path : '/adminactcut',
            name: 'adminactcut',
            component: resolve => require(['@/pages/admin/actcut'], resolve),
            meta : {title: '砍价活动',}
        },
        {
            path : '/adminactchou',
            name: 'adminactchou',
            component: resolve => require(['@/pages/admin/actchou'], resolve),
            meta : {title: '抽奖活动',}
        },
        {
            path : '/admingoods',
            name: 'admingoods',
            component: resolve => require(['@/pages/admin/goods'], resolve),
            meta : {title: '产品管理',}
        },
        {
            path : '/adminaddgoods',
            name: 'adminaddgoods',
            component: resolve => require(['@/pages/admin/addgoods'], resolve),
            meta : {title: '添加产品',}
        },
        {
            path : '/admingoods0',
            name: 'admingoods0',
            component: resolve => require(['@/pages/admin/goods0'], resolve),
            meta : {title: '普通产品',}
        },
        {
            path : '/admingoods1',
            name: 'admingoods1',
            component: resolve => require(['@/pages/admin/goods1'], resolve),
            meta : {title: '限抢活动',}
        },
        {
            path : '/admingoods2',
            name: 'admingoods2',
            component: resolve => require(['@/pages/admin/goods2'], resolve),
            meta : {title: '拼团活动',}
        },
        {
            path : '/admingoods3',
            name: 'admingoods3',
            component: resolve => require(['@/pages/admin/goods3'], resolve),
            meta : {title: '砍价活动',}
        },
        {
            path : '/admingoods4',
            name: 'admingoods4',
            component: resolve => require(['@/pages/admin/goods4'], resolve),
            meta : {title: '报名活动',}
        },
        {
            path : '/admingoods5',
            name: 'admingoods5',
            component: resolve => require(['@/pages/admin/goods5'], resolve),
            meta : {title: '抽奖活动',}
        },
        {
            path : '/admingoods6',
            name: 'admingoods6',
            component: resolve => require(['@/pages/admin/goods6'], resolve),
            meta : {title: '秒杀活动',}
        },
        {
            path : '/admingoods8',
            name: 'admingoods8',
            component: resolve => require(['@/pages/admin/goods8'], resolve),
            meta : {title: '特权商品',}
        },
        {
            path : '/admincard',
            name: 'admincard',
            component: resolve => require(['@/pages/admin/card'], resolve),
            meta : {title: '优惠券管理',}
        },
        {
            path : '/admincardadd',
            name: 'admincardadd',
            component: resolve => require(['@/pages/admin/cardadd'], resolve),
            meta : {title: '添加优惠券',}
        },
        {
            path : '/admincardlog',
            name: 'admincardlog',
            component: resolve => require(['@/pages/admin/cardlog'], resolve),
            meta : {title: '领取优惠券记录',}
        },
        {
            path : '/admincardredbaglog',
            name: 'admincardredbaglog',
            component: resolve => require(['@/pages/admin/cardredbaglog'], resolve),
            meta : {title: '发红包记录',}
        },
        {
            path : '/adminsign',
            name: 'adminsign',
            component: resolve => require(['@/pages/admin/sign'], resolve),
            meta : {title: '到店签到',}
        },
        {
            path : '/adminsignadd',
            name: 'adminsignadd',
            component: resolve => require(['@/pages/admin/signadd'], resolve),
            meta : {title: '添加签到活动',}
        },
        {
            path : '/adminsignjoinlog',
            name: 'adminsignjoinlog',
            component: resolve => require(['@/pages/admin/signjoinlog'], resolve),
            meta : {title: '参与签到活动记录',}
        },
        {
            path : '/adminsignsignlog',
            name: 'adminsignsignlog',
            component: resolve => require(['@/pages/admin/signsignlog'], resolve),
            meta : {title: '签到记录',}
        },
        {
            path : '/adminmoneylog',
            name: 'adminmoneylog',
            component: resolve => require(['@/pages/admin/moneylog'], resolve),
            meta : {title: '余额记录',}
        },
        {
            path : '/adminmoneydraw',
            name: 'adminmoneydraw',
            component: resolve => require(['@/pages/admin/moneydraw'], resolve),
            meta : {title: '提现',}
        },
        {
            path : '/adminjifenlog',
            name: 'adminjifenlog',
            component: resolve => require(['@/pages/admin/jifenlog'], resolve),
            meta : {title: '积分记录',}
        },
        {
            path : '/actmoneylog',
            name: 'actmoneylog',
            component: resolve => require(['@/pages/admin/actmoneylog'], resolve),
            meta : {title: '积分记录',}
        },
        {
            path : '/adminprint',
            name: 'adminprint',
            component: resolve => require(['@/pages/admin/print'], resolve),
            meta : {title: '打印机',}
        },
        {
            path : '/adminfendian',
            name: 'adminfendian',
            component: resolve => require(['@/pages/admin/fendian'], resolve),
            meta : {title: '分店',}
        },
        {
            path : '/adminjizi',
            name: 'adminjizi',
            component: resolve => require(['@/pages/admin/jizi'], resolve),
            meta : {title: '集字活动',}
        },
        {
            path : '/adminjiziadd',
            name: 'adminjiziadd',
            component: resolve => require(['@/pages/admin/jiziadd'], resolve),
            meta : {title: '添加集字活动',}
        },
        {
            path : '/adminjizijoinlog',
            name: 'adminjizijoinlog',
            component: resolve => require(['@/pages/admin/jizijoinlog'], resolve),
            meta : {title: '参与记录',}
        },
        {
            path : '/adminjizihelplog',
            name: 'adminjizihelplog',
            component: resolve => require(['@/pages/admin/jizihelplog'], resolve),
            meta : {title: '帮助记录',}
        },
        {
            path : '/adminpostergoods',
            name: 'adminpostergoods',
            component: resolve => require(['@/pages/admin/postergoods'], resolve),
            meta : {title: '设计海报',}
        },
        {
            path : '/adminincode',
            name: 'adminincode',
            component: resolve => require(['@/pages/admin/incode'], resolve),
            meta : {title: '核销码管理',}
        },
        {
            path : '/backpage',
            name: 'backpage',
            component: resolve => require(['@/pages/admin/backpage'], resolve),
            meta : {title: '文章分类',}
        },
        {
            path : '/fxgx',
            name: 'fxgx',
            component: resolve => require(['@/pages/admin/fxgx'], resolve),
            meta : {title: '分销关系',}
        },
        {
            path : '/adminuser',
            name: 'adminuser',
            component: resolve => require(['@/pages/admin/user'], resolve),
            meta : {title: '用户',}
        },
        {
            path : '/adminuserfx',
            name: 'adminuserfx',
            component: resolve => require(['@/pages/admin/userfx'], resolve),
            meta : {title: '分销员',}
        },
        {
            path : '/adminuserdown',
            name: 'adminuserdown',
            component: resolve => require(['@/pages/admin/userdown'], resolve),
            meta : {title: '分销员',}
        },
        {
            path : '/adminposter',
            name: 'adminposter',
            component: resolve => require(['@/pages/admin/poster'], resolve),
            meta : {title: '海报',}
        },
        {
            path : '/questlist',
            name: 'questlist',
            component: resolve => require(['@/pages/activity/questlist'], resolve),
            meta : {title: '问答管理',}
        },
        {
            path : '/questadd',
            name: 'questadd',
            component: resolve => require(['@/pages/activity/questadd'], resolve),
            meta : {title: '添加问答',}
        },
        {
            path : '/questanswer',
            name: 'questanswer',
            component: resolve => require(['@/pages/activity/questanswer'], resolve),
            meta : {title: '回答记录',}
        },
        {
            path : '/questsort',
            name: 'questsort',
            component: resolve => require(['@/pages/activity/questsort'], resolve),
            meta : {title: '问答分类',}
        },
        // 区域运营商
        {
            path : '/arealogin',
            name: 'arealogin',
            component: resolve => require(['@/pages/area/login'], resolve),
            meta : {title: '登录',}
        },
        {
            path : '/areaindex',
            name: 'areaindex',
            component: resolve => require(['@/pages/area/index'], resolve),
            meta : {title: '管理人员',}
        },
        {
            path : '/orderdata',
            name: 'orderdata',
            component: resolve => require(['@/pages/area/orderdata'], resolve),
            meta : {title: '订单数据',}
        },
        {
            path : '/shoplist',
            name: 'shoplist',
            component: resolve => require(['@/pages/area/shoplist'], resolve),
            meta : {title: '商户列表',}
        },
        {
            path : '/checkshop',
            name: 'checkshop',
            component: resolve => require(['@/pages/area/checkshop'], resolve),
            meta : {title: '审核申请',}
        },
        {
            path : '/agentlist',
            name: 'agentlist',
            component: resolve => require(['@/pages/area/agentlist'], resolve),
            meta : {title: '代理列表',}
        },
        {
            path : '/agentcheck',
            name: 'agentcheck',
            component: resolve => require(['@/pages/area/agentcheck'], resolve),
            meta : {title: '审核代理',}
        },
        {
            path : '/goodsorder',
            name: 'goodsorder',
            component: resolve => require(['@/pages/area/goodsorder'], resolve),
            meta : {title: '商品订单',}
        },
        {
            path : '/rightlist',
            name: 'rightlist',
            component: resolve => require(['@/pages/area/rightlist'], resolve),
            meta : {title: '权限列表',}
        },
    ]
})
