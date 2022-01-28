<template>
  <div class="app-wrapper" :class="{ hideSidebar: !sidebar.opened }">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class="_navbar">
        <navbar></navbar>
        <tags-view></tags-view>
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar";
import AppMain from "./components/AppMain.vue";
import tagsView from "./components/tagView.vue";
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    tagsView,
    Breadcrumb,
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
  },
};
</script>
<style  lang="less" scoped>
@import "src/styles/mixin.less";
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

._navbar {
  position: fixed;
  right: 0;
  top: 0;
  left: 180px;
  z-index: 99;
  transition: left 0.3s;
  .logo {
    position: absolute;
    left: 0;
  }
}
</style>
