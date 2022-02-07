export default {
  layout: () => import("@/views/layout/Layout"), // 页面框架
  default: () => import("@/views/layout/default"), // 空路由
  login: () => import("@/views/login"), // 登录页面
  dashboard: () => import("@/views/dashboard"), // 控制台页面
  error: () => import("@/views/error"), // 错误页面
  "system/power": () => import("@/views/system/power"), // 权限页面
  "system/role": () => import("@/views/system/role"), // 角色页面
  "system/user": () => import("@/views/system/user"), // 用户管理
  "system/parameters": () => import("@/views/system/parameters"), // 系统参数
  "system/database": () => import("@/views/system/database"), // 数据备份
  "order/list": () => import("@/views/order/list"), // 订单列表
  user: () => import("@/views/user/list"), // 用户列表
  project: () => import("@/views/project"), // 专题列表
  "project/info/:name": () => import("@/views/project/info"), // 专题添加/编辑
};
