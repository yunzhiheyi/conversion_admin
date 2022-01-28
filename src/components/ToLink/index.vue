<template>
  <span @click="goLink" class="goLink">
    <slot />
  </span>
</template>

<script>
import store from "@/store";
export default {
  name: "ToLink",
  props: {
    val: {
      type: String,
    },
  },
  methods: {
    goLink() {
      const isPower = this.has(this.val);
      if (!isPower) {
        this.$message({ message: "没有权限操作此功能", type: "warning" });
      } else {
        this.$emit("to");
      }
    },
    has(value) {
      let isExist = false;
      const buttonpermsStr = store.getters.userInfo.power;
      if (buttonpermsStr === undefined || buttonpermsStr === null) {
        return false;
      }
      for (let i = 0; i < buttonpermsStr.length; i++) {
        // 适别路由+菜单btn的形式去判断
        if (buttonpermsStr[i] === value) {
          isExist = true;
          break;
        }
      }
      return isExist;
    },
  },
};
</script>

<style scoped>
.goLink {
  margin-right: 10px;
}
</style>
