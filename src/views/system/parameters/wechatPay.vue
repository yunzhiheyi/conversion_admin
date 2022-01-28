<template>
  <div class="_system">
    <el-form
      :model="form"
      ref="submitInfo"
      label-width="110px"
      :label-position="`top`"
      v-if="form.wechatPay"
    >
      <el-form-item label="商户号ID" prop="mch_id">
        <el-input
          v-model="form.wechatPay.mch_id"
          style="width: 400px; float: left; margin-right: 20px"
        ></el-input>
        <div class="tis">填写商户号ID,去商户后台查看</div>
      </el-form-item>
      <el-form-item label="商户KEY" prop="key">
        <el-input
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.wechatPay.key"
        ></el-input>
        <div class="tis">填写商户KEY,去商户后台生成</div>
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
  name: "WechatPay",
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
