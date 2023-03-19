import { server } from './request';

/**
 * 问题页面相关接口
 **/
// 根据模板id查询问题列表
export const questionList = (params) => { return req("GET", "/api/Goods/list", params) };
// 保存问题
export const questionSave = (params) => { return req("POST", "/api/Goods/save", params) };
// 更新问题
export const questionUpdate = (params) => { return axios.delete("/api/Goods/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 删除问题
export const questionDelete = (params) => { return req("post", "/api/Goods/list", params) };
