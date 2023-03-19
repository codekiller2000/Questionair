import {server} from './request';

let token = sessionStorage.getItem("token");
// 根据模板id查询问题列表
export const questionList = () => {
  return server("GET", "/api/Goods/list")
};
// 保存问题
export const saveQuestion = (data) => {
  return server.post("/question/create", data)
};
// 更新问题
export const updateQuestion = (id, data) => {
  return server.put(`/question/${id}`, data)
};
// 删除问题
export const deleteQuestion = (id) => {
  return server.delete(`/question/${id}`)
};
