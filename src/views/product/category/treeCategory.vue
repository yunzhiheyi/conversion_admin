<template>
  <div class="ul">
    <template v-for="(item, key) in treedata">
      <div class="li" :key="key" v-if="item.parentId === pid">
        <el-row class="row">
          <el-col :span="1">
            <span class="text">{{ key + 1 }}</span>
          </el-col>
          <el-col :span="12">
            <div
              class="text"
              :class="{ active: !item.isChildren }"
              :style="{
                'padding-left':
                  item.level != 1 ? item.level * 25 + 'px' : '14px',
              }"
            >
              <span
                :class="{
                  left: item.parentId != -1,
                  _active: !item.isChildren && item.parentId != -1,
                }"
              >
                <span
                  @click="toggle(item)"
                  v-if="item.isChildren"
                  class="menuPlus"
                  :class="{
                    'el-icon-plus': item.isChildren && !item.isActive,
                    'el-icon-minus': item.isChildren && item.isActive,
                  }"
                ></span>
                {{ item.name }}</span
              >
            </div></el-col
          >
          <el-col :span="3"
            ><span class="text">{{ item.sort }}</span></el-col
          >
          <el-col :span="5"
            ><span class="text">{{ item._id }}</span></el-col
          >
          <el-col :span="3" class="edit">
            <node-content :node="item"></node-content>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <tree-category
            v-show="item.isActive"
            :pid="item._id"
            :node="item"
            :render-content="renderContent"
            :treedata="treedata"
          ></tree-category>
        </el-collapse-transition>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "TreeCategory",
  componentName: "TreeCategory",
  data() {
    return {
      level: 1,
      open: true,
      from: {},
    };
  },
  props: {
    treedata: {
      type: Array,
      default: function () {
        return [];
      },
    },
    pid: {
      type: String,
      default: "-1",
    },
    props: {},
    node: {
      default() {
        return {};
      },
    },
    renderContent: Function,
  },
  mounted() {
    this.level++;
  },
  components: {
    NodeContent: {
      props: {
        node: {
          required: true,
        },
      },
      render(h) {
        const parent = this.$parent.$parent.$parent;
        const node = this.node;
        return parent.renderContent.call(parent._renderProxy, h, { node });
      },
    },
  },
  methods: {
    toggle: function (item) {
      item.isActive = !item.isActive;
    },
  },
};
</script>
<style lang='scss'>
.edit .text {
  color: #20a0ff;
  padding-left: 10px !important;
  cursor: pointer;
}
.menuPlus {
  border: 1px solid #90939d;
  margin-right: 4px;
  cursor: pointer;
}
.text {
  .left {
    position: relative;
    &:after,
    &:before {
      content: "";
      display: block;
      position: absolute;
      background-color: #dcd8d8;
    }
    &:after {
      width: 12px;
      height: 1px;
      top: 50%;
      left: -18px;
    }
    &:before {
      width: 1px;
      height: 16px;
      top: 0px;
      left: -18px;
    }
  }
}
</style>

