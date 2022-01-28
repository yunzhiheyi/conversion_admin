<!--使用el-upload对二次封装ueditor-->
<template>
  <div
    class="editor"
    v-loading="quillUpdateImg"
    :style="`width:${config.initialFrameWidth}px`"
  >
    <!-- 图片上传组件辅助-->
    <el-upload
      class="j-upload"
      style="position: absolute; visibility: hidden"
      :data="uploadData"
      :action="serverUrl"
      :show-file-list="false"
      :on-success="upload_Success"
      :on-error="upload_Error"
      :before-upload="beforeUpload"
    >
    </el-upload>
    <div ref="editor"></div>
    <el-dialog
      title="图片管理"
      :visible.sync="dialogVisible"
      width="36.7%"
      top="5vh"
    >
      <div class="dialog-upload-list">
        <p class="red">
          此处图片管理仅限于删除数据库、七牛云图，不对图片的插入进行操作
        </p>
        <ul class="el-upload-list el-upload-list--picture">
          <li
            v-for="(item, index) in goodsThumbList"
            class="el-upload-list__item is-success"
            :key="index"
          >
            <img
              :src="item.url"
              :alt="`${item.name}`"
              class="el-upload-list__item-thumbnail"
            />
            <label class="el-upload-list__item-status-label"
              ><i class="el-icon-upload-success el-icon-check"></i></label
            ><i class="el-icon-close" @click="handleRemove(item)"></i>
          </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog
      title="代码插入"
      :visible.sync="dialogVisibleCode"
      width="500px"
      top="5vh"
    >
      <el-input
        type="textarea"
        :rows="10"
        v-model="insertcodeValue"
        style="margin-top: -30px; margin-bottom: 10px"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitCode"
          >插入</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Service from "@/api/service";
export default {
  data() {
    return {
      editor: null,
      quillUpdateImg: false,
      serverUrl: "/api/system/upload",
      id: "ueditorId",
      isFocus: false,
      dialogVisible: false,
      dialogVisibleCode: false,
      insertcodeValue: "",
      uploadData: {},
    };
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    config: {
      type: Object,
      default: {},
    },
    goodsThumbList: {
      type: Array,
    },
  },
  computed: {
    content: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
    moduleService() {
      return new Service("/product/goods");
    },
  },
  created() {
    const _this = this;
    window.UM.registerUI("images", function (name) {
      var $btn = window.$.eduibutton({
        icon: name,
        click: function () {
          document.querySelector(".j-upload .el-upload").click();
        },
        title: "添加图片",
      });
      return $btn;
    });
    window.UM.registerUI("imagesList", function (name) {
      var $btn = window.$.eduibutton({
        icon: name,
        click: function () {
          _this.dialogVisible = true;
        },
        title: "图片列表",
      });
      return $btn;
    });
    // 插入代码
    window.UM.registerUI("insertcode", function (name) {
      var $btn = window.$.eduibutton({
        icon: name,
        click: function () {
          _this.dialogVisibleCode = true;
          _this.insertcodeValue = "";
        },
        title: "添加代码",
      });
      return $btn;
    });
    // 首次上传一定要传mid
    if (this.config.mid) {
      this.uploadData.mid = this.config.mid;
    }
    // console.log(this.value)
  },
  watch: {
    value: function (val) {
      if (val !== null) {
        this.editor.setContent(val);
        // this.replaceHtmlCode()
      }
    },
  },
  destroyed() {
    this.editor.destroy();
  },
  mounted() {
    var _this = this;
    _this.$refs.editor.id = _this.id;
    _this.editor = window.UM.getEditor(_this.id, _this.config);
    _this.$nextTick(function () {
      _this.editor.ready(
        function () {
          const bodyJson = {
            content: "",
            plainTxt: "",
          };
          this.editor.addListener("contentChange", function () {
            bodyJson.content = _this.editor.getContent();
            bodyJson.plainTxt = _this.editor.getPlainTxt();
          });
          this.editor.addListener("blur", function () {
            _this.content = bodyJson.content;
          });
        }.bind(this)
      );
    });
  },
  methods: {
    submitCode() {
      if (!this.insertcodeValue) {
        this.$message.warning("插入代码不能为空");
      } else {
        this.editor.setContent(
          `<pre class="insertcode">${this.insertcodeValue}</pre>`,
          true
        );
        this.dialogVisibleCode = false;
      }
    },
    handleRemove(file) {
      const options = {
        files: {
          name: file.name,
          url: file.url,
        },
        _id: this.config.mid,
      };
      this.goodsThumbList.splice(options.files, 1);
      this.moduleService.thumbnailDelete(options).then((res) => {
        this.$message.success("删除成功");
      });
    },
    // 图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    upload_Success(res, file) {
      const _data = res.data;
      // 如果上传成功
      if (_data !== null) {
        this.editor.focus();
        this.editor.setContent(
          `<img src="${_data.file}" style="max-width:100%;height:auto;"/>`,
          true
        );
        this.uploadData.mid = _data.mid;
        this.goodsThumbList.push(_data.files[0]);
        this.$emit("ready", _data.mid);
      } else {
        this.$message.error("图片上传失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 富文本图片上传失败
    upload_Error() {
      this.quillUpdateImg = false;
      this.$message.error("图片上传失败");
    },
  },
};
</script>
<style lang="less">
.edui-toolbar .edui-btn-toolbar {
  height: 32px;
}

.dialog-upload-list {
  overflow: hidden;
  margin-top: -40px;
  padding-bottom: 40px;
  p.red {
    color: red;
  }
  .el-upload-list {
    margin-left: -8px;
  }
  .el-upload-list__item {
    width: 100px;
    margin-left: 11px;
  }
  .el-upload-list--picture .el-upload-list__item-thumbnail {
    width: 80px;
    height: 80px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-upload-list--picture .el-upload-list__item {
    padding: 10px;
    margin-top: 15px;
    text-align: center;
    height: auto;
    min-height: 80px;
    border-radius: 4px;
    display: flex;
    justify-content: flex-start;
    &:hover {
      border: 1px solid #e5e4e6;
    }
  }
  .el-upload-list--picture .el-upload-list__item-thumbnail {
    margin: 0;
  }
  .el-upload-list--picture .el-upload-list__item-status-label {
    z-index: 2;
  }
  .el-upload-list__item .el-icon-close {
    z-index: 3;
  }
}

.edui-editor-body .edui-body-container p {
  margin: 0;
}
</style>
