<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <template v-for="(item, index) in levelList">
        <el-breadcrumb-item :key="item.path" v-if="item.meta.title">
          <span v-if="index == levelList.length - 1" class="no-redirect">{{
            item.meta.parames
              ? paramesTitle(item.meta.parames)
              : item.meta.title
          }}</span>
          <router-link
            v-else
            :to="
              item.redirect
                ? `${item.redirect}?t=${+new Date()}`
                : `${item.path}?time=${+new Date()}`
            "
          >
            {{ item.meta.title }}
          </router-link>
        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>
<script>
export default {
  created() {
    this.getBreadcrumb();
  },
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  methods: {
    paramesTitle(val) {
      var _parames = val && JSON.parse(val);
      const $path = this.$route.path.split("/");
      var _name = this.$route.params.name || $path[$path.length - 1];
      return _parames && _parames[_name];
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter((item) => item.name);
      if (this.$route.meta.level === "1") {
        matched.splice(matched.length - 1, 1);
      }
      this.levelList = matched;
    },
  },
};
</script>
<style lang="less" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px; // color: #97a8be;
  .no-redirect {
    color: #fff;
    cursor: text;
  }
}
</style>
