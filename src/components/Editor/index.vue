<!--使用el-upload对二次封装ueditor-->
<template>
  <div
    class="editor"
    v-loading="quillUpdateImg"
    :style="
      SYS.setup.edit_type === '1'
        ? 'width:' + config.initialFrameWidth + 'px'
        : ''
    "
  >
    <!-- 图片上传组件辅助-->
    <el-upload
      class="j-upload"
      style="position: absolute; visibility: hidden"
      :data="uploadData"
      :action="serverUrl"
      :on-change="onChange"
      :show-file-list="false"
      :headers="headers"
      :on-success="upload_Success"
      :on-error="upload_Error"
      :before-upload="beforeUpload"
    >
    </el-upload>
    <div ref="editor" v-if="SYS.setup.edit_type === '1'"></div>
    <mavon-editor
      ref="mavonEditor"
      v-model="content"
      :ishljs="true"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
      style="height: 550px"
      @change="markdownChange"
      :toolbars="toolbars"
      v-if="SYS.setup.edit_type === '2'"
    >
      <!-- 添加图片 -->
      <template slot="left-toolbar-before">
        <button
          type="button"
          @click="changeImage"
          class="op-icon fa fa-mavon-picture-o"
          aria-hidden="true"
          title="图片"
        ></button>
      </template>
      <!-- 图片列表 -->
      <template slot="left-toolbar-before">
        <button
          type="button"
          @click="changeImagesList"
          class="op-icon icon-multiple"
          aria-hidden="true"
          title="图片列表"
        >
          <svg-icon icon-class="multiple" style="font-size: 11.5px"></svg-icon>
        </button>
      </template>
    </mavon-editor>
    <el-dialog
      title="图片管理"
      :visible.sync="dialogVisible"
      width="36.7%"
      top="5vh"
    >
      <div class="dialog-upload-list">
        <div class="nodata" v-if="!goodsThumbList.length">暂时图片无数据</div>
        <ul class="el-upload-list el-upload-list--picture">
          <li
            v-for="(item, index) in goodsThumbList"
            class="el-upload-list__item is-success"
            :key="index"
          >
            <img
              :src="item.file"
              :alt="`${item.name}`"
              @click="setEditorImage(item)"
              class="el-upload-list__item-thumbnail"
            />
            <label class="el-upload-list__item-status-label"
              ><i class="el-icon-upload-success el-icon-check"></i></label
            ><i class="el-icon-close" @click="handleRemove(item, index)"></i>
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
import Request from "@/api/request";
import { getToken } from "@/utils/auth"; // 验权
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      editor: null,
      quillUpdateImg: false,
      serverUrl: "/api/admin/system/fileUpload",
      id: "ueditorId",
      isFocus: false,
      dialogVisible: false,
      dialogVisibleCode: false,
      insertcodeValue: "",
      uploadData: {},
      headers: {
        authorization: getToken(),
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
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
    ...mapGetters(["SYS"]),
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
        this.editor && this.editor.setContent(val);
        // this.replaceHtmlCode()
      }
    },
  },
  destroyed() {
    setTimeout(() => {
      this.editor && this.editor.destroy();
    }, 300);
  },
  mounted() {
    var _this = this;
    // 编辑器切换
    if (this.SYS.setup.edit_type === "1") {
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
    }
  },
  methods: {
    onChange(file, fileList) {
      if (this.config.mid) {
        this.uploadData.mid = this.config.mid;
      }
    },
    changeImage() {
      document.querySelector(".j-upload .el-upload").click();
    },
    changeImagesList() {
      this.dialogVisible = true;
    },
    // markdown语法
    markdownChange(value, html) {
      this.$emit("markdownChange", html);
    },
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
    handleRemove(dataFile, index) {
      const options = {
        name: dataFile.name,
        mid: dataFile.mid,
      };
      Request.post({
        url: "/api/admin/system/fileDelete",
        params: options,
      }).then((res) => {
        if (res.data) {
          this.$message.success("删除成功");
          this.goodsThumbList.splice(index, 1);
        }
      });
    },
    // 图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    setEditorImage(_data) {
      if (this.SYS.setup.edit_type === "1") {
        this.editor.focus();
        this.editor.setContent(
          `<img src="${_data.file}" style="max-width:100%;height:auto;"/>`,
          true
        );
      } else {
        var $vm = this.$refs.mavonEditor;
        $vm.textAreaFocus();
        $vm.insertText($vm.getTextareaDom(), {
          prefix: "![" + _data.name + "](" + _data.file + ")\n",
          subfix: "",
          str: "",
        });
      }
      this.uploadData.mid = _data.mid;
    },
    imgAdd(pos, file) {
      console.log(pos, file);
    },
    imgDel(pos, file) {
      console.log(pos, file);
    },
    upload_Success(res, file) {
      const _data = {
        mid: res.data.mid,
        file: res.data.fileUrl,
        name: res.data.fileName,
      };
      if (_data !== null) {
        this.setEditorImage(_data);
        this.goodsThumbList.push({
          mid: _data.mid,
          file: _data.file,
          name: _data.name,
        });
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
  .nodata {
    line-height: 100px;
    text-align: center;
    font-size: 14px;
    color: #333;
  }
  .el-upload-list {
    margin-left: -8px;
  }
  .el-upload-list__item {
    width: 102px;
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
.icon-multiple {
  vertical-align: middle;
}
</style>
