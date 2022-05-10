import request from "@/utils/axios";
export default {
  post(options) {
    var data = {
      url: options.url,
      method: "post",
      baseURL: options.baseURL || process.env.VUE_APP_SERVER_API, // 如果接口基地址是不一样，就取传过来的
      data: options.params,
    };
    return request(data);
  },
  put(options) {
    var data = {
      url: options.url,
      method: "put",
      baseURL: options.baseURL || process.env.VUE_APP_SERVER_API, // 如果接口基地址是不一样，就取传过来的
      data: options.params,
    };
    return request(data);
  },
  get(options) {
    var data = {
      url: options.url,
      method: "get",
      baseURL: options.baseURL || process.env.VUE_APP_SERVER_API, // 如果接口基地址是不一样，就取传过来的
      params: options.params,
    };
    return request(data);
  },
  delete(options) {
    var data = {
      url: options.url,
      method: "delete",
      baseURL: options.baseURL || process.env.VUE_APP_SERVER_API, // 如果接口基地址是不一样，就取传过来的
      data: options.params,
    };
    return request(data);
  },
};
