// 模板与模块api
import {server} from "./request";


// 模板列表
export const templateList = () => { return server.get("/psyquestioner/template" ) };
// 编辑模板
export const templateEdit = (params,id) => {
  // console.log('参数',params)
  // console.log('id',id)
  return server.put( `/psyquestioner/template/${id}`, params) };
// 添加模板
export const templateSave = (params) => { return server.post( "/psyquestioner/template", params) };
// 删除模板
export const templateDelete = (id) => { return server.delete(`/psyquestioner/template/${id}`) };


// 根据模板ID获取获取模块列表
export const moduleListById = (params) => {
  // console.log(params)
  return server.get('/psyquestioner/module' ,{"params":params} ) };
// 编辑模块
export const moduleEdit = (params,id) => { return server.put( `/psyquestioner/module/${id}`, params) };
// 添加模块
export const moduleSave = (params) => { return server.post( "/psyquestioner/module", params) };
// 删除模块
export const moduleDelete = (id) => { return server.delete(`/psyquestioner/module/${id}`) };
