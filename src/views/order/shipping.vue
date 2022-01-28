<template>
  <div class="orderShipping">
    <el-dialog
      title="物流信息"
      :visible.sync="dialogVisible"
      width="360px"
      top="20vh"
    >
      <div class="Shipping">
        <el-form
          ref="dialogForm"
          :model="shipping_info"
          :rules="colorFormRules"
          label-width="80px"
        >
          <el-form-item label="快递名称" prop="shipping_name">
            <el-input
              type="input"
              placeholder="输入快递名称"
              v-model="shipping_info.shipping_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="快递单号" prop="shipping_code">
            <el-input
              type="input"
              placeholder="输入快递单号"
              v-model="shipping_info.shipping_code"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="handleSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Service from "@/api/service";
export default {
  name: "orderShipping",
  data() {
    return {
      listLoading: false,
      servicePath: "/api/order/orderlist",
      shipping_info: {
        shipping_name: "",
        shipping_code: "",
      },
      colorFormRules: {
        shipping_name: [
          { required: true, message: "物流名称不能为空", trigger: "blur" },
        ],
        shipping_code: [
          { required: true, message: "物流单号不能为空", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    isShipping: {
      type: Boolean,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["shipping"]),
    dialogVisible: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
    moduleService(servicePath) {
      return new Service(this.servicePath);
    },
  },
  created() {
    this.shipping_info.shipping_name = this.shipping.shipping_name;
    this.shipping_info.shipping_code = this.shipping.shipping_code;
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.listLoading = true;
      const options = {
        _id: this.shipping._id,
        status: 40,
        shipping_name: this.shipping_info.shipping_name,
        shipping_code: this.shipping_info.shipping_code,
        consign_time: new Date(),
      };
      this.moduleService.update(options).then((res) => {
        this.dialogVisible = false;
        this.listLoading = false;
        this.$message.success(this.isShipping ? "更新成功" : "发货成功");
        this.$store.dispatch("setShipping", options); // 设置物流信息
        if (!this.isShipping) {
          this.$parent.getList(this.$parent.params.page);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.orderShipping .Shipping {
  margin: -20px 0;
  padding-bottom: 10px;
}
.dialog-footer {
  margin-top: 10px;
}
</style>
