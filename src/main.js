// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueResource from 'vue-resource'
Vue.use(VueResource)


import './assets/css/common.css';

import Common from './assets/js/Common.js'
Vue.use(Common)

// 复制插件
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard)

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
    NProgress.start() // 显示进度条
    next()
})

router.afterEach(() => {
    NProgress.done() // 完成进度条
})

function setRem () {
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let htmlDom = document.getElementsByTagName('html')[0];
    //htmlDom.style.fontSize = htmlWidth/22.86 + 'px';
    //htmlWidth = htmlWidth > 640 ? 640 : htmlWidth;
    let htmlFontSize = htmlWidth * 37.5 / 750;
    htmlDom.style.fontSize = htmlFontSize + 'px';
}
setRem();
window.onresize = function () {
    setRem()
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
