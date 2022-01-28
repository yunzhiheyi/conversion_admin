<template>
  <el-row class="panel-group" :gutter="15">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class='card-panel'>
        <div class="card-panel-description">
          <div class="card-panel-text">成交额（元）</div>
          <div class="card-panel-state">
            <span class="card-panel-color">总成交额:</span>
            <count-to class="card-panel-num" :startVal="0" :decimals="2" :endVal="totalAmount.total | toDecimalByCutoffWithoutOmit" :duration="2600"></count-to>
          </div>
          <div class="card-panel-state">
            <span class="card-panel-color">今日:</span>
            <count-to class="card-panel-num" :startVal="0" :decimals="2" :endVal="totalAmount.day |toDecimalByCutoffWithoutOmit" :duration="2600"></count-to>
          </div>
          <div class="card-panel-state">
            <span class="card-panel-color">昨日:</span>
            <count-to class="card-panel-num" :startVal="0" :decimals="2" :endVal="totalAmount.yesterday | toDecimalByCutoffWithoutOmit" :duration="2600"></count-to>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <div class="card-panel-text">订单数 (笔)</div>
          <div class="card-panel-state">
            <span class="card-panel-color">未付款:</span>
            <span @click="handleLink(10)">
              <count-to class="card-panel-num"  :startVal="0" :endVal="total.w|| 0" :duration="3000"></count-to>
            </span>
          </div>
          <div class="card-panel-state">
            <span class="card-panel-color">已付款:</span>
            <span @click="handleLink(20)">
              <count-to class="card-panel-num"  :startVal="0" :endVal="total.s|| 0" :duration="3000"></count-to>
            </span>
          </div>
          <div class="card-panel-state">
            <span class="card-panel-color">未发货:</span>
            <span @click="handleLink(30)">
              <count-to class="card-panel-num" :startVal="0" :endVal="total.y|| 0" :duration="3000"></count-to>
            </span>
          </div>
          <div class="card-panel-state">
            <span class="card-panel-color">已发货:</span>
            <span @click="handleLink(40)">
              <count-to class="card-panel-num" :startVal="0" :endVal="total.f || 0" :duration="3000"></count-to>
            </span>
          </div>
        </div>
      </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <div class="card-panel-text">
            <span>用户数</span>
          </div>
          <div class="card-panel-state">
            <span class="card-panel-color">总用户数:</span>
            <count-to class="card-panel-num" :startVal="0" :endVal="user.count|| 0" :duration="3000"></count-to>
          </div>
          <div class="card-panel-state">
            <span class="card-panel-color">今日新增:</span>
            <count-to class="card-panel-num" :startVal="0" :endVal="user.add|| 0" :duration="3000"></count-to>
          </div>
        </div>
      </div>
    </el-col>
    <!-- <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <div class="card-panel-text">浏览量</div>
          <div class="card-panel-state">
            <div class="card-panel-state">
              <span class="card-panel-color">总数:</span>
              <count-to class="card-panel-num" :startVal="0" :endVal="3000" :duration="3200"></count-to>
            </div>
            <span class="card-panel-color">今日:</span>
            <count-to class="card-panel-num" :startVal="0" :endVal="200" :duration="3200"></count-to>
          </div>
          <div class="card-panel-state">
            <span class="card-panel-color">昨日:</span>
            <count-to class="card-panel-num" :startVal="0" :endVal="20" :duration="3200"></count-to>
          </div>
        </div>
      </div>
    </el-col> -->
  </el-row>
</template>
<script>
import CountTo from "vue-count-to";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  components: {
    CountTo,
  },
  computed: {
    ...mapGetters(["total", "user", "totalAmount"]),
  },
  created() {
    if (
      Object.keys(this.total).length === 0 ||
      Object.keys(this.user).length === 0
    ) {
      this.$store.dispatch("dashboardTotal");
    }
  },
  methods: {
    handleLink(val) {
      this.$router.push({
        path: "/order/list",
        query: { time: +new Date(), status: val },
      });
    },
  },
};
</script>
<style  lang="less" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 15px;
  }
  .card-panel {
    height: 108px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    .card-panel-description {
      margin: 26px;
      .card-panel-state {
        display: inline-block;
        margin-right: 20px;
        .card-panel-color {
          // color:red;
        }
        .card-panel-num {
          position: relative;
          top: 2px;
          margin-left: 5px;
          &:hover {
            color: red;
            cursor: pointer;
          }
        }
      }
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 18px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 24px;
      }
    }
  }
}
</style>
