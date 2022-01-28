import request from "@/utils/axios";

export function fetchList(query) {
  return request({
    url: "/transaction/list",
    method: "get",
    params: query,
  });
}
