<template>
  <el-row class="panel-group" :gutter="15">
    <el-col class="card-panel-col">
      <div class="card-panel">
        <div style="padding: 15px">
          <el-radio-group v-model="setline" @change="handleSetLineChartData">
            <el-radio-button border :key="`1`" :label="`order`"
              >7日订单数</el-radio-button
            >
            <el-radio-button border :key="`2`" :label="`user`"
              >7日用户数</el-radio-button
            >
          </el-radio-group>
          <line-chart :chartdata="chartData" :type-line="setline"></line-chart>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import LineChart from "./LineChart";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      setline: "order",
      chartData: null,
    };
  },
  components: {
    LineChart,
  },
  computed: {
    ...mapGetters(["userData"]),
  },
  methods: {
    handleSetLineChartData(type) {
      if (type === "order") {
        this.chartData = this.orderData;
      } else if (type === "user") {
        this.chartData = this.userData;
      }
    },
  },
};
</script>
<style  lang="less" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 15px;
  }
  .X-card-panel {
    height: 60px;
    background-color: #fff;
  }
  .card-panel {
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 35px;
    }
    .card-panel-description {
      float: left;
      margin: 26px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 24px;
      }
    }
  }
}
</style>
