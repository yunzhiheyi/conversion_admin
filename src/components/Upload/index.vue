<template>
  <el-upload
    class="avatar-uploader"
    :data="fileData"
    :style="{ width: `${width}px`, height: `${height}px` }"
    :action="uploadUrl"
    :show-file-list="false"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <slot></slot>
  </el-upload>
</template>
<script>
export default {
  name: "Upload",
  props: {
    value: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: 78,
    },
    fileData: {
      type: Object,
    },
    height: {
      type: Number,
      default: 78,
    },
  },
  computed: {
    imgUrl: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
  },
  data() {
    return {
      uploadUrl: "/api/system/upload",
    };
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      this.imgUrl = response.data.file;
      this.$emit("upload-success", {
        mid: response.data.mid,
        fileUrl: response.data.file,
      }); // 将图片地址和图片ID返回
      this.$message.success("上传成功");
    },
    uploadError(val) {
      this.$message.error("上传失败,重复资源");
    },
  },
};
</script>
<style lang="less">
.avatar-uploader {
  //margin-bottom: 18px;
}

.avatar-uploader .el-upload {
  width: 100%;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}
</style>
