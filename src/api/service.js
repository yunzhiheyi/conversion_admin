/**
 * 基础增删查改api类
 */

import Instance from "./request";
import tools from "@/utils/tools";
class service {
  constructor(path) {
    this.path = path;
  }
  add(params) {
    return Instance.post({
      url: `${this.path}/add`,
      params,
    });
  }
  update(params) {
    return Instance.post({
      url: `${this.path}/update`,
      params,
    });
  }
  delete(id) {
    return Instance.get({
      url: `${this.path}/delete`,
      params: id,
    });
  }
  batchdelete(arr) {
    return Instance.post({
      url: `${this.path}/batchdelete`,
      params: arr,
    });
  }
  list(params) {
    return Instance.get({
      url: `${this.path}/list`,
      params,
    });
  }
  query(id) {
    return Instance.get({
      url: `${this.path}/query`,
      params: id,
    });
  }
  dashboardQuery(id) {
    return Instance.get({
      url: `${this.path}`,
    });
  }
  thumbnailDelete(params) {
    return Instance.post({
      url: `${this.path}/thumbnail/delete`,
      data: params,
    });
  }
  uploadFile(form) {
    return Instance.post(this.path, form, {
      url: `${this.path}/thumbnail/delete`,
      timeout: 12e5,
      transformRequest: [
        (data, headers) => {
          return tools.objectToFormData(form, "", "files");
        },
      ],
    });
  }
}
export default service;
