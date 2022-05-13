<template>
  <div class="_system">
    <el-form ref="submitInfo"
      :model="form"
      label-width="110px"
      :label-position="`top`"
      v-if="form.setup">
      <el-form-item label="系统名称"
        prop="name">
        <el-input v-model="form.setup.name"
          style="width: 400px; float: left; margin-right: 20px"></el-input>
        <div class="tis">填写系统名称</div>
      </el-form-item>
      <el-form-item label="系统描述"
        prop="routerDescribe">
        <el-input type="textarea"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.setup.describe"></el-input>
        <div class="tis">填写系统名称描述</div>
      </el-form-item>
      <el-form-item label="服务器地址"
        prop="name">
        <el-input v-model="form.setup.serverUrl"
          style="width: 400px; float: left; margin-right: 20px"></el-input>
        <div class="tis">填写服务器地址</div>
      </el-form-item>
      <el-form-item label="文件上传方式"
        prop="upload_type">
        <el-radio-group v-model="form.setup.upload_type"
          size="mini">
          <el-radio border
            v-for="item in upload_type_all"
            :key="item.value"
            :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="tis">默认为本地上传、可选七牛云上传</div>
      </el-form-item>
      <el-form-item label="编辑器样式"
        prop="edit_type">
        <el-radio-group v-model="form.setup.edit_type"
          size="mini">
          <el-radio border
            v-for="item in edit_type_all"
            :key="item.value"
            :disabled="item.disabled"
            :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="tis">默认Ueditor、可选Makdown</div>
      </el-form-item>
      <el-form-item label="开启公众号"
        prop="wechat_type">
        <el-radio-group v-model="form.setup.wechat_type"
          size="mini">
          <el-radio border
            v-for="item in colse_type_all"
            :key="item.value"
            :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="tis">是否开启公众号配置</div>
      </el-form-item>
      <el-form-item label="开启微信支付"
        prop="wechat_pay_type">
        <el-radio-group v-model="form.setup.wechat_pay_type"
          size="mini">
          <el-radio border
            v-for="item in colse_type_all"
            :key="item.value"
            :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="tis">是否开启微信支付,填写配置</div>
      </el-form-item>
      <el-form-item label="开启支付宝支付"
        prop="alipay_type">
        <el-radio-group v-model="form.setup.alipay_type"
          size="mini">
          <el-radio border
            v-for="item in colse_type_all"
            :key="item.value"
            :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="tis">开启支付宝支付,填写配置</div>
      </el-form-item>
      <el-form-item label="IOS审核开关"
        prop="alipay_type">
        <el-radio-group v-model="form.isIosAudit"
          size="mini">
          <el-radio border
            v-for="item in IosAudit"
            :key="item.value"
            :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="tis">开启IOS审核开关填写配置</div>
      </el-form-item>
      <el-form-item label="白名单"
        prop="copyright">
        <el-input type="textarea"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.whiteUser"></el-input>
        <div class="tis">手机号验证白名单</div>
      </el-form-item>

      <el-form-item label="微信号"
        prop="kefu">
        <el-input type="input"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.setup.kefuwx"></el-input>
        <div class="tis">填写微信号</div>
      </el-form-item>
      <el-form-item label="电 话"
        prop="kefu">
        <el-input type="input"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.setup.tel"></el-input>
        <div class="tis">填写电话</div>
      </el-form-item>
      <el-form-item label="邮 箱"
        prop="tel">
        <el-input type="input"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.setup.email"></el-input>
        <div class="tis">填写邮箱</div>
      </el-form-item>
      <el-form-item label="版权信息"
        prop="copyright">
        <el-input type="textarea"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.setup.copyright"></el-input>
        <div class="tis">版权信息</div>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary"
        style="margin-top: 10px"
        @click="submitInfo('submitInfo', form)">确 定</el-button>
    </div>
  </div>
</template>
<script>
import _mixins from "./mixins";
export default {
  name: "setup",
  mixins: [_mixins],
  data() {
    return {
      upload_type_all: [
        {
          value: "1",
          label: "本地",
        },
        {
          value: "2",
          label: "七牛云",
        },
      ],
      edit_type_all: [
        {
          value: "1",
          label: "Ueditor",
        },
        {
          value: "2",
          label: "Makdown",
        },
      ],
      whiteUser: "",
      colse_type_all: [
        {
          value: "0",
          label: "关闭",
        },
        {
          value: "1",
          label: "开启",
        },
      ],
      IosAudit: [
        {
          value: "0",
          label: "关闭",
        },
        {
          value: "1",
          label: "开启",
        },
      ],
    };
  },
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
