import Service from "@/api/service";
export default {
  data() {
    return {
      servicePath: "/api/admin/system",
    };
  },
  computed: {
    moduleService(servicePath) {
      return new Service(this.servicePath);
    },
  },
  methods: {
    tabOptions(setup, parent) {
      console.log(setup.upload_type);
      this.$set(parent ? this.$parent : this, "tab_options", [
        {
          value: "1",
          label: "系统配置",
          isShow: "true",
        },
        {
          value: "2",
          label: "七牛云配置",
          isShow: setup.upload_type === "2",
        },
        {
          value: "3",
          label: "公众号配置",
          isShow: setup.wechat_type === "1",
        },
        {
          value: "4",
          label: "微信支付配置",
          isShow: setup.wechat_pay_type === "1",
        },
        {
          value: "5",
          label: "支付宝配置",
          isShow: setup.alipay_type === "1",
        },
      ]);
    },
    submitInfo(formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.whiteUser =
            this.form.whiteUser && this.form.whiteUser.split(",");
          this.moduleService["add"](form).then((res) => {
            this.$message.success("操作成功");
            this.$store.dispatch("setSysInfo", this.form);
            this.tabOptions(form.setup, "parent");
          });
        } else {
          return false;
        }
      });
    },
  },
};
