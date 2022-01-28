<template>
  <div class="checkbox-group">
    <slot />
  </div>
</template>

<script>
export default {
  name: "CheckboxGroup",
  data() {
    return {
      inputCheckbox: null,
    };
  },
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    checked: Boolean,
  },
  watch: {
    value(value) {
      // this.dispatch('ElFormItem', 'el.form.change', [value]);
    },
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
  methods: {
    handleChange(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped>
</style>
