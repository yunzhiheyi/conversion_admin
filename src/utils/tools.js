/*
 *
 * 通用方法
 */
export default {
  // 序列化数制 &id=2&vaule=3方式显示
  serialize (form) {
    var parts = []
    for (var pair in form) {
      parts.push(pair + '=' + form[pair])
    }
    return parts.join('&')
  },
  // 将对名转成FormData，可转数组 this.objectToFormData(obj)
  objectToFormData (obj, form, namespace) {
    var _formData = form || new FormData()
    var formKey
    if (obj instanceof Array) {
      for (var a = 0; a < obj.length; a++) {
        if (typeof obj[a] === 'object' && !(obj[a] instanceof File)) {
          this.objectToFormData(obj[a], _formData, namespace + '[' + a + ']')
        } else {
          // 若是数组则在关键字后面加上[]
          _formData.append(namespace + '[' + a + ']', obj[a])
        }
      }
    } else {
      for (var property in obj) {
        if (obj.hasOwnProperty(property) && obj[property]) {
          if (namespace) {
            // 若是对象，则这样
            formKey = namespace + '.' + property
          } else {
            formKey = property
          }
          if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
            this.objectToFormData(obj[property], _formData, formKey)
          } else {
            _formData.append(formKey, obj[property])
          }
        }
      }
    }
    return _formData
  },
  /**
   * 判断是否为空
   */
  validatenull (val) {
    if (typeof val == 'boolean') {
      return false;
    }
    if (typeof val == 'number') {
      return false;
    }
    if (val instanceof Array) {
      if (val.length == 0) return true;
    } else if (val instanceof Object) {
      if (JSON.stringify(val) === '{}') return true;
    } else {
      if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
      return false;
    }
    return false;
  },
  // 数组去重
  getUnique(array){
	let obj = {}
     return array.filter((item, index) => {
    // 防止key重复
       let newItem = item + JSON.stringify(item)
       console.log(obj.hasOwnProperty(newItem) && item.length? false : obj[newItem] = true);
      return obj.hasOwnProperty(newItem) && !item.length? false : obj[newItem] = true
    })
  },
  // 解析包
  readAs(type, blob, cb) {
    var r = new FileReader();
    r.onloadend = function () {
      if (typeof cb === "function") {
        cb.call(r, r.result);
      }
    };
    try {
      r["readAs" + type](blob);
    } catch (e) {}
  },
  // 解析二进制包
  parseBlob(blob) {
    var stringVar = null;
    stringVar = new Promise((resolve, reject) => {
      //做一些异步操作
      this.readAs(
        "Text",
        blob.slice(0, blob.size, "text/plain;charset=UTF-8"),
        (result) => {
          resolve(result);
        }
      );
    });
    return stringVar;
  },
  // 二维数组查找
  arrFind(target, array,field) {
    const rowNum = array.length;
    if (!rowNum) {
        return false;
    }
    const colNum = array.length;
    if (!colNum) {
        return false;
    }

    let row = 0,
        col = colNum - 1;
    while (row < rowNum && col >= 0) {
      console.log(array[row][col][field], target);
        if (array[row][col][field] === target) {
            return true;
        } else if (array[row][col][field] > target) {
            --col;
        } else {
            ++row;
        }
    }

    return false;
  },
  tableHeight() {
    return document.body.clientHeight - 270;
  },
}
