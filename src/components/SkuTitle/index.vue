<template>
  <div class="name">
    <div class="input" v-if="isClick">
      <el-input
        v-model="numberValue"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
    </div>
    <div class="info" @click="handleInputValue">
      <span class="border"
        ><span v-if="isPrice">￥</span
        ><span>{{ itemValue || numberValue }}</span></span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SkuInput",
  data() {
    return {
      isClick: false,
    };
  },
  props: {
    value: {
      type: String,
    },
    isPrice: {
      type: Boolean,
    },
    itemValue: {
      type: String,
    },
    index: {
      type: Object,
    },
    idArr: {
      type: String,
    },
  },
  created() {
    this.$emit("skuInputready", this.idArr);
  },
  destroyed() {
    this.tagValue = "0";
  },
  computed: {
    numberValue: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    handleInputValue() {
      this.isClick = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      this.isClick = false;
      if (!this.isPrice && /^[0-9]?$/.test(this.numberValue)) {
        this.$message.warning("库存只能输入为正整数");
        this.numberValue = "0";
        return;
      } else {
        if (!/^[0-9]*(?:.[0-9]{0,2})?$/.test(this.numberValue)) {
          this.$message.warning("只能输入数字和小数,小数保留2位");
          this.numberValue =
            this.numberValue.indexOf(".") !== -1
              ? this.numberValue.match(/^\d+(?:\.\d{0,2})?/)[0]
              : this.numberValue;
          return;
        }
      }
      this.$emit("skuInput", {
        key: this.index.pindex,
        index: this.index.value,
        value: this.numberValue,
        name: this.index.name,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.name {
  position: relative;
}
.info {
  padding: 5px 0;
}
.border {
  border: 1px solid #fff;
  padding: 2px 10px;
  cursor: pointer;
}
.border:hover {
  border: 1px dashed #666;
}
.input {
  position: absolute;
  top: 5px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 10px;
  .el-input {
    text-align: center;
  }
}
</style>
