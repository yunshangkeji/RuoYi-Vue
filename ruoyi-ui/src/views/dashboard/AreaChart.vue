<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/map/js/china");
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      chinachart: null,
      chartOption: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      // 初始化echarts实例
      this.chinachart = echarts.init(this.$el);
      // 进行相关配置
      this.chartOption = {
        tooltip: {
          // 鼠标移到图里面的浮动提示框
          // formatter详细配置： https://echarts.baidu.com/option.html#tooltip.formatter
          formatter(params, ticket, callback) {
            // params.data 就是series配置项中的data数据遍历
            const htmlStr = `
          <div style='font-size:18px;'>${params.name}</div>
          <p style='text-align:left;'>
	          累计注册量：${params.data.value}<br/>
          </p>
        `;
            return htmlStr;
          }
          // backgroundColor:"#ff7f50",//提示标签背景颜色
          // textStyle:{color:"#fff"} //提示标签字体颜色
        },
        // visualMap的详细配置解析：https://echarts.baidu.com/option.html#visualMap
        visualMap: {
          // 左下角的颜色区域
          type: "piecewise", // 定义为分段型 visualMap
          min: 0,
          max: 10000,
          itemWidth: 40,
          bottom: 60,
          left: 20,
          pieces: [
            // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
            { gte: 5000, lte: 10000, label: "超过5000", color: "orangered" },
            { gte: 1000, lte: 4999, label: "超过1000", color: "#ff9800" },
            { gte: 500, lte: 999, label: "超过500", color: "#ffeb3b" },
            { gte: 100, lte: 499, label: "超过100", color: "#6ad86e" },
            { gte: 1, lte: 99, label: "少于100", color: "#9adcfa" },
            { value: 0, label: "无数据", color: "#999" } // [0]
          ]
        },
        // geo配置详解： https://echarts.baidu.com/option.html#geo
        geo: {
          // 地理坐标系组件用于地图的绘制
          map: "china", // 表示中国地图
          // roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1.2, // 当前视角的缩放比例（地图的放大比例）
          label: {
            show: true
          },
          itemStyle: {
            // 地图区域的多边形 图形样式。
            borderColor: "rgba(0, 0, 0, 0.2)",
            emphasis: {
              // 高亮状态下的多边形和标签样式
              shadowBlur: 20,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },
        series: [
          {
            name: "", // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            type: "map",
            geoIndex: 0,
            label: {
              show: true
            },
            // 这是需要配置地图上的某个地区的数据，根据后台的返回的数据进行拼接（下面是我定义的假数据）
            data: [
              {
                name: "北京",
                value: 599
              },
              {
                name: "上海",
                value: 142
              },
              {
                name: "黑龙江",
                value: 44
              },
              {
                name: "新疆",
                value: 999
              },
              {
                name: "深圳",
                value: 92
              },
              {
                name: "湖北",
                value: 810
              },
              {
                name: "四川",
                value: 453
              }
            ]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示地图数据
      this.chinachart.setOption(this.chartOption);
    }
  }
};
</script>
