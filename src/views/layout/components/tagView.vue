<template>
  <div class="tags-view-container">
    <scroll-pane class="tags-view-wrapper" ref="scrollPane">
      <!-- <pre>{{ Array.from(visitedViews) }}</pre> -->
      <router-link
        ref="tag"
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        v-for="(tag, index) in Array.from(visitedViews)"
        :to="`${tag.path}?time=${+new Date()}` + ObjectToStr(tag.query)"
        :key="index"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </scroll-pane>
    <ul
      class="contextmenu"
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="closeSelectedTag(selectedTag)">关闭标签页</li>
      <li @click="closeOthersTags">关闭其他标签页</li>
      <li @click="closeAllTags">关闭所有标签页</li>
    </ul>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ScrollPane from "@/components/ScrollPane";
export default {
  name: "tagsView",
  components: {
    ScrollPane,
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
    };
  },
  computed: {
    ...mapGetters(["visitedViews"]),
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        window.addEventListener("click", this.closeMenu);
      } else {
        window.removeEventListener("click", this.closeMenu);
      }
    },
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    ...mapActions([
      "addVisitedViews",
      "delVisitedViews",
      "delOthersViews",
      "delAllViews",
    ]),
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path && route.name === this.$route.name;
    },
    addViewTags() {
      var route = this.generateRoute();
      if (!route) {
        return false;
      }
      this.addVisitedViews(route);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      });
    },
    // 对象转地址参数
    ObjectToStr(value) {
      var _str = "";
      for (var item in value) {
        if (item !== "time") {
          _str += "&" + item + "=" + value[item];
        }
      }
      return _str;
    },
    closeSelectedTag(view) {
      this.delVisitedViews(view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            // 修复关闭后如有query参数加不上的问题
            this.$router.push({
              path: latestView.path,
              query: latestView.query,
            });
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path);
      this.delOthersViews(this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.delAllViews();
      this.$router.push("/");
    },
    openMenu(tag, e) {
      this.visible = true;
      this.selectedTag = tag;
      this.left = e.clientX - 220;
      this.top = e.clientY + 12;
    },
    closeMenu() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.tags-view-container {
  .tags-view-wrapper {
    background: #fff;
    height: 37px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 36px;
      line-height: 36px;
      color: #495060;
      background: #fff;
      padding: 0 8px 0 14px;
      font-size: 12px;
      border-right: 1px solid #f5f5f5;
      &:first-of-type {
        margin-left: 0px;
      }
      &.active {
        background-color: #278fe7;
        color: #fff;
        border-color: #278fe7;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
<style lang="less">
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 19px;
      vertical-align: 0px;
      border-radius: 50%;
      text-align: center;
      font-size: 18px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 50% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
