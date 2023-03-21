import {server} from './request';

// 根据模板id查询问题列表
export const questionList = (moduleId) => {
  moduleId = 'm10001';//todo 要删
  return server.get(`/question/queryByModule/${moduleId}`)
};
// 保存问题
export const saveQuestion = (data) => {
  return server.post("/question", data)
};
// 保存问题
export const saveSkip = (data) => {
  return server.post("/skip/saveBatch", data)
};
// 更新问题
export const updateQuestion = (id, data) => {
  return server.put(`/question/${id}`, data)
};
// 删除问题
export const deleteQuestion = (id) => {
  return server.delete(`/question/${id}`)
};
//查找 模块-问题的(id,no)树形结构
export const querySimplifiedTree = (templateId) => {
  templateId = 't10001';//todo 要删
  return server.get(`/psyquestioner/module/querySimplifiedTree/${templateId}`)
};
//查找 模块-问题的(id,no)树形结构
export const querySimplifiedTreeForSkip = (templateId) => {
  templateId = 't10001';//todo 要删
  return server.get(`/psyquestioner/module/querySimplifiedTreeForSkip/${templateId}`)
};
