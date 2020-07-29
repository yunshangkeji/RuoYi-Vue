<template>
  <div v-loading="loading" class="tab-container">
    <el-tabs v-model="activedTabName" tab-position="top" style="margin-top:15px;" type="">
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <keep-alive>
          <tab-pane v-if="activedTabName===item.key" :type="item.key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from "./option/TabPane";
export default {
  name: "Tab",
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [],
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
.tab-container {
  margin-left: 12px;
  margin-right: 12px;
}
</style>
