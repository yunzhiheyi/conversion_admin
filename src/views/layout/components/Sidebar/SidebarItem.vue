<template>
  <div>
    <el-submenu :index="menu.path">
      <template slot="title">
        <label class="menu-icon">
          <svg-icon v-if="menu.icon" :icon-class="menu.icon"></svg-icon>
        </label>
        <span class="menu-title">{{ menu.name }}</span>
      </template>
      <template v-for="(child, key) in menu.children">
        <template v-if="child.isShow === '1'">
          <el-menu-item
            :index="
              (child.routerUrl ? child.routerUrl : child.path) +
              (child.routerParameter ? '?' + child.routerParameter : '')
            "
            :key="key"
          >
            <label class="sub-menu-icon">
              <svg-icon v-if="child.icon" :icon-class="child.icon"></svg-icon>
            </label>
            <span class="menu-title">{{ child.name }}</span>
          </el-menu-item>
          <!-- <sidebar-item
            :menu="child"
            :key="key"
            v-if="child.children && child.children.length >= 1"
          ></sidebar-item> -->
        </template>
      </template>
    </el-submenu>
  </div>
</template>
<script>
export default {
  name: "SidebarItem",
  props: {
    menu: Object,
  },
};
</script>
<style lang="less">
.menu-icon {
  font-size: 15px;
  vertical-align: 1px;
  margin-right: 10px;
}
.sub-menu-icon {
  font-size: 8px;
  vertical-align: 1px;
  margin-right: 7px;
}
</style>
