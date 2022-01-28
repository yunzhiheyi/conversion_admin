<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>
<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
import { mapGetters } from "vuex";
export default {
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    chartdata: {
      type: Object,
    },
    typeLine: {
      type: String,
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    ...mapGetters(["orderData"]),
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.initChart();
      }, 500);
    });
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHanlder);
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName("_sidebar")[0];
    sidebarElm.addEventListener("transitionend", this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHanlder);
    }

    const sidebarElm = document.getElementsByClassName("_sidebar")[0];
    sidebarElm.removeEventListener("transitionend", this.__resizeHanlder);

    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    chartdata: {
      deep: true,
      handler(val) {
        this.initChart(val);
      },
    },
  },
  methods: {
    setOptions(options) {
      this.chart.setOption({
        xAxis: {
          data: options.time,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: this.typeLine === "order" ? "总金额" : "新增会员数",
            itemStyle: {
              normal: {
                color: "#3888fa",
                lineStyle: {
                  color: "#3888fa",
                  width: 2,
                },
              },
            },
            smooth: true,
            type: "line",
            data: options.total,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
        ],
      });
    },
    initChart(val) {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(val || this.chartData || this.orderData);
    },
  },
};
</script>
