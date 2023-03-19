import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);
// 登录验证
export default new Vuex.Store({
    state: {
        user: false,
        currentSubTemplateData:{},
        currentTemplateData:[],
        allTemplateData:[],

      // allTemplateData:[{
      //     id:
      //     title:
      //     templateData[{
      //       id:
      //       SubTitle:
      //       subTemplateData:{}
      //     }]
      // }]

    },
    mutations: {
        // 登录
        login(state, user) {
            state.user = user;
            localStorage.setItem("userInfo", user);
            sessionStorage.setItem("userInfo", user);

            // console.log(3333333333,sessionStorage.getItem("userInfo"))
        },
        // 退出
        logout(state, user) {
            state.user = "";
            // sessionStorage.setItem("userInfo", user);
            localStorage.setItem("userInfo", "");
        },


        // 对当前子模版进行操作
        removeCurrentSubTemplateData(state) {
          state.currentSubTemplateData={};
        },
        saveCurrentSubTemplateData(state, subTemplateData) {
          state.currentSubTemplateData=subTemplateData;
        },


        //  对当前模板进行操作
        removeCurrentTemplateData(state) {
          state.currentTemplateData=[];
        },
        removeCurrentTemplateDataById(state,id) {
          state.currentTemplateData.splice(id,1)
        },
        addCurrentTemplateData(state, subTemplateData) {
          state.currentTemplateData.push(subTemplateData)
        },


        // 对实际模板进行操作
        addAllTemplateData(state, allTemplateData) {
          state.allTemplateData.push(allTemplateData)
        },

        addTemplateData1(state, subTemplateData) {
          state.allTemplateData.templateData.push(subTemplateData)
        },
    }
})
