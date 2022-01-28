/*
 *
 *过滤器
 */

import dayjs from "dayjs";
import accounting from "accounting";

export default {
  phoneFilter: function (val) {
    return val.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  },
  strTonum: function (val) {
    return parseInt(val);
  },
  toFixed: function (val) {
    return accounting.toFixed(val, 2);
  },
  formatSeconds(value, isList = false) {
    let result = parseInt(value);
    if (!result) {
      return "0分0秒";
    }
    let h = Math.floor(result / 3600);
    let m = Math.floor((result / 60) % 60);
    let s = Math.floor(result % 60);

    let res = "";
    if (h) res += `${h}${isList && !m && !s ? "小" : ""}时`;
    if (m) res += `${m}分${isList && !s ? "钟" : ""}`;
    res += s ? `${s}秒` : "";
    return res;
  },
  formatDate: function (value, formatString) {
    formatString = formatString || "YYYY-MM-DD HH:mm:ss";
    return dayjs(value).format(formatString);
  },
  toDecimalByCutoffWithoutOmit: function (value = 0, digits = 2) {
    let res = value;
    if (Number(value)) {
      let n;
      if (Number(value) > 0) {
        n = Math.floor(Number(value) * Math.pow(10, digits));
      } else {
        n = Math.ceil(Number(value) * Math.pow(10, digits));
      }
      res = (n / Math.pow(10, digits)).toFixed(digits);
    } else if (Number(value) === 0) {
      res = (0).toFixed(digits);
    }
    return parseFloat(res);
  },
};
