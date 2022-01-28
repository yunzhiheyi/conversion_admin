<template>
  <div class="_system">
    <el-form
      ref="submitInfo"
      :model="form"
      label-width="110px"
      :label-position="`top`"
    >
      <el-form-item label="Appid" prop="name">
        <el-input
          v-model="form.wechat.appid"
          style="width: 400px; float: left; margin-right: 20px"
        ></el-input>
        <div class="tis">填写公众号APPID</div>
      </el-form-item>
      <el-form-item label="Appsecret" prop="routerDescribe">
        <el-input
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.wechat.appsecret"
        ></el-input>
        <div class="tis">填写公众号Appsecret</div>
      </el-form-item>
      <!-- <el-form-item label="Rediret_url" prop="routerDescribe">
        <el-input  style="width:400px; float: left;margin-right: 20px;" v-model="form.routerDescribe"></el-input>
        <div class="tis">填写回调地址</div>
      </el-form-item> -->
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
  name: "wechat",
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
