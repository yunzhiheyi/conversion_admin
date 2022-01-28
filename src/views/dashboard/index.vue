<template>
  <div class="dashboard-editor-container">
    <panel-group></panel-group>
    <el-row>
      <to-do></to-do>
    </el-row>
    <!-- <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
import PanelGroup from "./components/PanelGroup";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import ToDo from "./components/ToDo";

export default {
  name: "dashboard-admin",
  components: {
    PanelGroup,
    RaddarChart,
    PieChart,
    BarChart,
    ToDo,
  },
};
</script>
<style  lang="less" scoped>
.dashboard-editor-container {
  padding: 15px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
