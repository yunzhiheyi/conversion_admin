<template>
  <div class="_system">
    <el-form
      ref="submitInfo"
      :model="form"
      label-width="110px"
      :label-position="`top`"
    >
      <el-form-item label="Access_key" prop="name">
        <el-input
          v-model="form.qiniu.access_key"
          style="width: 400px; float: left; margin-right: 20px"
        ></el-input>
        <div class="tis">填写七牛云的ACCESS_KEY</div>
      </el-form-item>
      <el-form-item label="Secret_key" prop="routerDescribe">
        <el-input
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.qiniu.secret_key"
        ></el-input>
        <div class="tis">填写七牛云的Secret_key</div>
      </el-form-item>
      <el-form-item label="Bucket" prop="routerDescribe">
        <el-input
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.qiniu.bucket"
        ></el-input>
        <div class="tis">填写七牛云的空间对象名</div>
      </el-form-item>
      <el-form-item label="BaseUrl" prop="routerDescribe">
        <el-input
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.qiniu.bucket_url"
        ></el-input>
        <div class="tis">填写七牛云的CDN图片地址</div>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button
        type="primary"
        style="margin-top: 10px"
        @click="submitInfo('submitInfo', form)"
        >确 定</el-button
      >
    </div>
  </div>
</template>
<script>
import _mixins from "./mixins";
export default {
  name: "qiniu",
  mixins: [_mixins],
  props: {
    value: {
      type: Object,
    },
  },
  computed: {
    form: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
