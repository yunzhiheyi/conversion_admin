/*
 * @ author madman
 * @ use 用户相关API
 */
import Instance from "./request";
export default {
  login(params) {
    return Instance.post({
      url: "/api/admin/login",
      params,
    });
  },
  getInfo(uid) {
    return Instance.get({
      url: "/api/admin/info",
      params: { uid: uid || "1" },
    });
  },
  getCaptcha() {
    return Instance.get({
      url: "/api/admin/captcha",
    });
  },
  logout() {
    return Instance.get({
      url: "/api/admin/logout",
    });
  },
  // 后台数组查询
  dashboardQuery() {
    return Instance.get({
      url: "/api/admin/dashboard/query",
    });
  },
};
