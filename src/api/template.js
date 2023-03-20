// 模板与模块api
import {server} from "./request";


// 根据模板获取模板列表
export const templateListById = () => { return server.get("/psyquestioner/template" ) };
// 编辑模板
export const templateEdit = (params,id) => { return server.put( `/psyquestioner/template/${id}`, params) };
// 添加模板
export const templateSave = (params) => { return server.post( "/psyquestioner/template", params) };
// 删除模板
export const templateDelete = (id) => { return server.delete(`/psyquestioner/template/${id}`) };


// 获取模块列表
export const moduleList = () => { return server.get("/psyquestioner/subject" ) };
// 编辑模块
export const moduleEdit = (params,id) => { return server.put( `/psyquestioner/subject/${id}`, params) };
// 添加模块
export const moduleSave = (params) => { return server.post( "/psyquestioner/subject", params) };
// 删除模块
export const moduleDelete = (id) => { return server.delete(`/psyquestioner/subject/${id}`) };
