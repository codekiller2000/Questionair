import {server} from './request';

let token = sessionStorage.getItem("token");
// 根据模板id查询问题列表
export const questionList = () => {
  return server("GET", "/api/Goods/list")
};
// 保存问题
export const saveQuestion = (data) => {
  return server.post("/question/create", data, {
    header: {"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNjM2Njg5NzM1MTk5ODg3MzYyIiwiaWF0IjoxNjc5MDU0NjUyLCJleHAiOjE2Nzk2NTk0NTJ9.hxrgUWFqBJoFvjBd_jTOrqR1UPzD-JA3Rxz4xvGKXBHFMKS3bVDhR23-3goz-ZQwp2Obtjv635jGVtxYmjClXA"}
  })
};
// 更新问题
export const updateQuestion = (id, data) => {
  return server.put(`/question/${id}`, data, {
    header: {"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNjM2Njg5NzM1MTk5ODg3MzYyIiwiaWF0IjoxNjc5MDU0NjUyLCJleHAiOjE2Nzk2NTk0NTJ9.hxrgUWFqBJoFvjBd_jTOrqR1UPzD-JA3Rxz4xvGKXBHFMKS3bVDhR23-3goz-ZQwp2Obtjv635jGVtxYmjClXA"}
  })
};
// 删除问题
export const deleteQuestion = (id) => {
  return server.delete(`/question/${id}`, {
      header: {"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNjM2Njg5NzM1MTk5ODg3MzYyIiwiaWF0IjoxNjc5MDU0NjUyLCJleHAiOjE2Nzk2NTk0NTJ9.hxrgUWFqBJoFvjBd_jTOrqR1UPzD-JA3Rxz4xvGKXBHFMKS3bVDhR23-3goz-ZQwp2Obtjv635jGVtxYmjClXA"}
    }
  )
};
