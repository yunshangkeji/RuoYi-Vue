<template>
  <div class="mixin-components-container">
    <el-row>
      <el-col v-for="(item, index) in list" :key="index" :span="3" :offset="0" style="padding: 5px;">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span style="text-align:center">{{item}}</span>
          </div>
          <div>
            <video
              src="https://qq2054970171.oss-cn-hangzhou.aliyuncs.com/208.mp4"
              autoplay="autoplay"
              style="width:100%;height:100%"
              controls="controls"
              muted="muted"
            ></video>
          </div>
          <div style="text-align:center;padding:5px;">
            <el-button type="primary" :disabled="loading">关闭</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      activedTabName: ""
    };
  },
  computed: {
    loading() {
      // 如处于加载中，应显示遮罩层
      return this.$store.getters.apiLoading;
    }
  },
  watch: {
    activedTabName(val) {
      if (val === 0) {
        return;
      }
      this.$router.push(`${this.$route.path}?tab=${val}`);
    }
  },
  created() {
    for (var i = 1; i <= 16; i++) {
      this.list.push(`主播昵称${i}`);
    }

    // init the default selected tab
    const tab = this.$route.query.tab;
    if (tab) {
      this.activedTabName = tab;
    }
    this.apiTabs();
  },
  methods: {
    apiTabs() {
      const reqData = {};
      reqData.optionName = this.$route.name.toLowerCase();
      this.api("live/option:tabs", reqData).then(resData => {
        this.tabMapOptions = resData.tabMapOptions;
        if (parseFloat(this.activedTabName) === 0) {
          this.activedTabName = this.tabMapOptions[0].key;
        }
      });
    }
  }
};
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 10px;
  min-height: calc(100vh - 84px);
}
</style>
