// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// 引入element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
// 引入路由
import router from './router';
// 引入状态管理
import store from './vuex/store';
// 引入icon
import './assets/icon/iconfont.css'
//

import VForm from 'vform-builds'  //引入VForm库
import 'vform-builds/dist/VFormDesigner.css'  //引入VForm样式
Vue.use(VForm)  //全局注册VForm(同时注册了v-form-designer和v-form-render组件)

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import axios from 'axios';
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

// 使用element UI
Vue.use(ElementUI);
// 过滤器
import * as custom from './utils/util'

Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, //使用store vuex状态管理
    components: { App },
    template: '<App/>',
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }

})
