<template>
  <div class="app-container">
    <div class="wpm">
      <div class="tab_options">
        <el-radio-group
          style="margin-bottom: 10px"
          v-model="tab_type"
          @change="change_type_value"
        >
          <template v-for="item in tab_options">
            <el-radio-button
              v-if="item.isShow"
              :key="item.value"
              border
              :label="item.value"
              >{{ item.label }}</el-radio-button
            >
          </template>
        </el-radio-group>
        <div class="tab_content">
          <setup v-model="form" v-if="tab_type == '1'"></setup>
          <qiniu v-model="form" v-if="tab_type == '2'"></qiniu>
          <wechat v-model="form" v-if="tab_type == '3'"></wechat>
          <wechat-pay v-model="form" v-if="tab_type == '4'"></wechat-pay>
          <alipay v-model="form" v-if="tab_type == '5'"></alipay>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import qiniu from "./qiniu";
import setup from "./setup";
import wechat from "./wechat";
import WechatPay from "./wechatPay";
import alipay from "./alipay";
import _mixins from "./mixins";
import { mapGetters } from "vuex";
export default {
  name: "parameters",
  mixins: [_mixins],
  data() {
    return {
      servicePath: "/api/admin/system/query",
      activeName2: "weixin",
      tab_options: [],
      tab_type: "1",
      form: {
        setup: {
          name: "",
          describe: "",
          kefuwx: "",
          upload_type: "",
          edit_type: "",
          wechat_pay: "",
          wechat_pay_type: "",
          alipay_type: "",
          serverUrl: "",
          tel: "",
          email: "",
          copyright: "",
        },
        qiniu: {
          access_key: "",
          secret_key: "",
          bucket: "",
          bucket_url: "",
        },
        wechatPay: {
          mch_id: "",
          key: "",
        },
        wechat: {
          appid: "",
          appsecret: "",
        },
        whiteUser: "",
        alipay: {
          mch_id: "",
          key: "",
        },
      },
    };
  },
  methods: {
    change_type_value(val) {
      this.tab_type = val;
    },
  },
  computed: {
    ...mapGetters(["SYS"]),
  },
  created() {
    var _data = this.SYS;
    this.$set(this.form, "setup", {
      name: _data.setup.name || "",
      describe: _data.setup.describe || "",
      kefuwx: _data.setup.kefuwx || "",
      serverUrl: _data.setup.serverUrl || "",
      tel: _data.setup.tel || "",
      upload_type: _data.setup.upload_type || "",
      edit_type: _data.setup.edit_type || "",
      wechat_type: _data.setup.wechat_type || "",
      wechat_pay_type: _data.setup.wechat_pay_type || "",
      alipay_type: _data.setup.alipay_type || "",
      email: _data.setup.email || "",
      copyright: _data.setup.copyright || "",
    });
    this.$set(
      this.form,
      "whiteUser",
      _data.whiteUser && _data.whiteUser.join(",")
    );
    this.$set(this.form, "qiniu", {
      access_key: _data.qiniu.access_key || "",
      secret_key: _data.qiniu.secret_key || "",
      bucket: _data.qiniu.bucket || "",
      bucket_url: _data.qiniu.bucket_url || "",
    });
    this.$set(this.form, "wechatPay", {
      mch_id: _data.wechatPay.mch_id || "",
      key: _data.wechatPay.key || "",
    });
    this.$set(this.form, "wechat", {
      appid: _data.wechat.appid || "",
      appsecret: _data.wechat.appsecret || "",
    });
    this.tabOptions(_data.setup);
  },
  components: {
    qiniu,
    wechat,
    setup,
    WechatPay,
    alipay,
  },
};
</script>
<style lang="less" scoped>
.tab_options {
  margin-top: 10px;
  padding: 10px;
}
</style>
