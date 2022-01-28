<template>
  <div class="Notification" :class="notification ? 'open' : ''">
    <div class="title">
      <span class="ft">通知</span
      ><i @click="closeBox" class="el-dialog__close el-icon el-icon-close"></i>
    </div>
    <div class="type">
      <div style="float: left">
        <el-button
          @click="$handleAll"
          v-if="isShow"
          style="float: left"
          type="text"
          >全选</el-button
        >
        <el-button
          style="float: left"
          v-if="isShow"
          @click="TagRead"
          type="text"
          >标记已读</el-button
        >
        <!-- <el-button style="float:left;" type="text" >删除</el-button> -->
      </div>
      <el-radio-group
        style="float: right"
        v-model="search_type"
        @change="search_type_value"
      >
        <!-- <el-radio-button border :key="`0`" :label="`0`">全部</el-radio-button> -->
        <el-radio-button border :key="`1`" :label="`2`">未读</el-radio-button>
        <el-radio-button border :key="`2`" :label="`1`">已读</el-radio-button>
      </el-radio-group>
    </div>
    <div class="NotificationList" v-loading.body="listLoading">
      <div class="nodata" v-if="dataList.length === 0">暂时没有消息</div>
      <ul>
        <li
          v-for="(item, key) in dataList"
          :key="key"
          :class="item.seeType == 1 && 'yd'"
        >
          <!--{{checkedAll}}-->
          <el-checkbox
            class="checkbox"
            v-if="item.seeType == 2"
            v-model="item.checked"
            @change="handleCurrent(item, key)"
          ></el-checkbox>
          <div class="info">
            <template v-if="item.type == 1">
              <span class="mr">{{ item.user_name }}</span
              >提醒你订单<span class="mr">{{ item.order_id }}</span
              >发货 <br /><span class="time">{{
                (item.updataAt ? item.updataAt : item.createdAt) | formatDate
              }}</span>
            </template>
            <template v-if="item.type == 2">
              <span class="mr">你有新的订单</span
              ><span class="mr">{{ item.order_id }}</span
              >,请即使处理 <br /><span class="time">{{
                (item.updataAt ? item.updataAt : item.createdAt) | formatDate
              }}</span>
            </template>
          </div>
        </li>
      </ul>
    </div>
    <div class="pages" v-if="total > 0">
      <div class="right">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :page-size="limit"
          :current-page.sync="page"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixinsTable from "@/utils/mixins.table";
export default {
  mixins: [mixinsTable],
  data() {
    return {
      checkAll: false,
      checkedAll: false,
      checkedCities: [],
      servicePath: "/api/system/notification",
      setline: "order",
      isIndeterminate: false,
      chartData: null,
      isShow: true,
      search_type: 2,
    };
  },
  computed: {
    ...mapGetters(["notification", "msgData"]),
  },
  watch: {
    msgData: function (data, oldVal) {
      if (data.isMsg) {
        this.getList();
        this.$store.dispatch("setMsg", {
          isMsg: false,
          type: data.type,
        });
      }
    },
  },
  created() {
    var _this = this;
    this.$store.dispatch("toggleNotification", "close");
    this.params.seeType = this.search_type;
    this.getList();
  },
  methods: {
    search_type_value(val) {
      if (val !== "0") {
        this.params.seeType = val;
      } else {
        this.params = {};
      }
      if (val === "1") {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
      this.getList();
    },
    TagRead() {
      this.listLoading = true;
      this.moduleService["update"]({
        ids: this.multipleSelection,
        // type: 2,
        // seeType: 1,
      }).then((res) => {
        this.listLoading = false;
        this.callbark = true;
        this.getList();
      });
    },
    closeBox() {
      this.$store.dispatch("toggleNotification");
    },
    endCallbark() {
      if (!this.dataList.length) {
        this.$store.dispatch("getNotification", false);
        this.callbark = false;
      }
    },
    $handleAll() {
      // if (this.multipleSelection.length ==0) {
      //   this.$message.warning("选择一个以上记录");
      //   return;
      // }
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        this.multipleSelection = this.dataList.map((item) => {
          return item._id;
        });
        this.dataList.map((item) => {
          item.checked = true;
        });
      } else {
        this.multipleSelection = [];
        this.dataList.map((item) => {
          item.checked = false;
        });
      }
    },
    handleCurrent(val, index) {
      this.checkAll = false;
      if (val.checked) {
        this.multipleSelection.splice(index, 0, val._id);
      } else {
        this.multipleSelection.splice(index, 1);
      }
    },
    handleCurrentChange(val) {
      console.log(val);
    },
  },
};
</script>
<style  lang="less" scoped>
.Notification.open {
  right: 0;
}

.Notification {
  position: fixed;
  top: 50px;
  right: -380px;
  bottom: 0;
  width: 380px;
  z-index: 999;
  border-left: 1px solid #eee;
  background-color: #fff;
  transition: right 0.3s;
  .time {
    font-size: 12px;
  }
  .type {
    text-align: center;
    padding: 10px 15px;
    overflow: hidden;
    border-bottom: 1px solid #eee;
  }
  .title {
    padding: 0 15px;
    border-top: 1px solid #eee;
    font-size: 16px;
    line-height: 45px;
    background-color: #f5f3f3;
    color: #333;
    .el-dialog__close {
      float: right;
      margin-top: 15px;
      cursor: pointer;
    }
  }
}

.NotificationList {
  overflow-y: auto;
  height: calc(100% - 150px);
  .nodata {
    text-align: center;
    font-size: 14px;
    line-height: 200px;
  }
  li.yd {
    color: #abacbb;
  }
  li {
    padding: 15px;
    font-size: 14px;
    line-height: 20px;
    color: #333;
    border-bottom: 1px solid #eee;
    .checkbox {
      float: left;
    }
    .info {
      overflow: hidden;
      padding-left: 10px;
    }
    .mr {
      margin: 0 1px;
    }
  }
}

.pages {
  border-top: 1px solid #eee;
  margin-top: 0;
  padding: 10px 15px;
}
</style>
