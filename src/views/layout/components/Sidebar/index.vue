<template>
  <div class="_sidebar">
    <div class="logo" @click="handleIndex">
      <img src="/images/logo.png" width="30" /><span class="_logo_zi"
        ><span>Y</span><span>U</span><span>N</span><span>Z</span><span>H</span
        ><span>I</span></span
      >
    </div>
    <scroll-bar>
      <!-- {{ sideBarMenu }} -->
      <el-menu
        class="sidebar-menu"
        @select="handleLink"
        background-color="#23313d"
        text-color="#fff"
        active-text-color="#fff"
        unique-opened
        :collapse="isCollapse"
        :default-active="currentPageName"
      >
        <template v-for="(menu, key) in sideBarMenu">
          <template v-if="menu.isShow == '1'">
            <div
              :class="{
                _sidebar_none: menu.children && menu.children.length < 1,
              }"
              :key="key"
              v-if="!menu.children"
            >
              <el-menu-item :index="menuIndex(menu)">
                <label class="menu-icon">
                  <svg-icon v-if="menu.icon" :icon-class="menu.icon"></svg-icon>
                </label>
                <span slot="title">{{ menu.name }}</span>
              </el-menu-item>
            </div>
            <!-- {{ menu.children }} -->
            <sidebar-item
              :menu="menu"
              :key="key"
              v-if="menu.children && menu.children.length >= 1"
            ></sidebar-item>
          </template>
        </template>
      </el-menu>
    </scroll-bar>
  </div>
</template>
<script>
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

import { mapGetters, mapActions } from "vuex";

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(["sideBarMenu", "sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
    currentPageName() {
      const $path = this.$route.path.split("/");
      const _path = $path.length > 3 ? $path[1] : ""; // 检测父级有几级
      return _path ? "/" + _path : this.$route.path;
    },
  },
  methods: {
    ...mapActions(["toggleSideBar"]),
    handleLink(name, indexPath) {
      console.log(name, indexPath);
      this.$router.push({
        path: name,
        query: { time: +new Date() }, // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
      });
    },
    menuIndex(menu) {
      return (
        (menu.routerUrl ? menu.routerUrl : menu.path) +
        (menu.routerParameter ? "?" + menu.routerParameter : "")
      );
    },
    handleIndex() {
      this.$router.push({
        path: "/",
      });
    },
  },
};
</script>
<style  lang="less" scoped>
._sidebar {
  .logo {
    height: 48px;
    background-color: #304156;
    color: #fff;
    text-align: center;
    text-shadow: 1px 6px 9px #232325;
    line-height: 48px;
    cursor: pointer;
    img {
      vertical-align: -3px;
    }
    span {
      margin: 2px;
    }
    ._logo_zi {
      margin-left: 10px;
    }
  }
}
</style>
