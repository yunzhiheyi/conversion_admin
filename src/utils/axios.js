import axios from "axios";
import { Message } from "element-ui";
import store from "@/store/";
import router from "@/router/";
import { serialize } from "@/utils/index";
import { getToken } from "@/utils/auth"; // 验权
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    const meta = config.meta || {};
    const isToken = meta.isToken === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    }
    config.headers["Accept-Language"] = "zh_CN";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  (response) => {
    const status = response.data.code || 200;
    const message = response.data.msg || response.data.message || "未知错误";
    //如果在白名单里则自行catch逻辑处理
    var resData = response.data;
    //如果是401则跳转到登录页面
    if (status === 4001) {
      Message({
        message: message,
        type: "error",
      });
      router.push({ path: "/login" });
      // store.dispatch("LogOut").then(() => router.push({ path: "/login" }));
      return resData;
    }
    // 如果请求为非200否者默认统一处理
    if (status !== 200 && status !== 201) {
      Message({
        message: message,
        type: "error",
      });
    }
    return resData;
  },
  (error) => {
    console.log(new Error(error));
    Message({
      message: error.response.data.message,
      type: "error",
      duration: 3 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
