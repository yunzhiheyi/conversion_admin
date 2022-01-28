<template>
  <label class="checkbox-button" :class="{ 'is-checked': isChecked() }">
    <input
      type="checkbox"
      v-model="inputCheckbox"
      :name="name"
      style="display: none"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    />
    <div class="checkbox-button__inner">
      <slot>{{ label }}</slot>
    </div>
  </label>
</template>

<script>
export default {
  name: "CheckboxButton",
  data() {
    return {
      inputCheckbox: false,
    };
  },
  props: {
    value: Array,
    name: String,
    attrValue: {},
    label: {},
  },
  computed: {
    inpuValue: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
  },
  created() {
    // console.log(this.label)
  },
  methods: {
    isChecked() {
      var _checked =
        this.inpuValue &&
        this.inpuValue.findIndex((_item) => _item._id === this.label._id) !==
          -1;
      this.inputCheckbox = _checked;
      return _checked;
    },
    handleChange(ev) {
      if (ev.target.checked) {
        if (!this.isChecked()) {
          this.inpuValue.push(this.label);
        }
      } else {
        this.inpuValue.splice(
          this.inpuValue.findIndex((_item) => _item._id === this.label._id),
          1
        );
      }
      this.attrValue.isChecked = this.isChecked();
      this.$emit("change", this.attrValue);
    },
  },
};
</script>

<style lang="less" scoped>
.checkbox-button {
  display: inline-block;
  margin: 5px 10px 5px 0;
  .checkbox-button__inner {
    display: inline-block;
    color: #666;
    padding: 0 20px;
    min-width: 70px;
    text-align: center;
    border-radius: 3px;
    height: 34px;
    border: 1px solid #eee;
    font-size: 13px;
    cursor: pointer;
    &:hover {
      border: 1px solid #cbcbcb;
    }
  }
}
.checkbox-button.is-checked {
  .checkbox-button__inner {
    background-color: #409eff;
    border: 1px solid #409eff;
    height: 33px;
    line-height: 32px;
    color: #fff;
    &:hover {
      opacity: 0.8;
      // background-color: rgba(64, 158, 255, 0.5);
      // border: 1px solid rgba(64, 158, 255, 0.5);
    }
  }
}
</style>
