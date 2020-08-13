<template>
  <div class="dashboard-editor-container">
    <panel-group v-if="apiResData&&apiResData.cards_user" :chart-data="apiResData.cards_user" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <panel-group v-if="apiResData&&apiResData.cards_zhubo" :chart-data="apiResData.cards_zhubo" />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <area-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import PieChart from "./dashboard/PieChart";
import AreaChart from "./dashboard/AreaChart";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
};

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    AreaChart,
  },
  data() {
    return {
      apiResData: {
        cards_user: [],
        cards_zhubo: [],
      },
      lineChartData: lineChartData.newVisitis,
    };
  },
  created() {
    this.api("/index").then((apiResData) => {
      this.apiResData = apiResData;
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
