<template>
  <div class="tab-container">
    <el-tabs v-model="activedTabName" style="margin-top:15px;" type="border-card">
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <keep-alive>
          <tab-pane v-if="activedTabName==item.key" :type="item.key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from "./components/TabPane";
export default {
  name: "Tab",
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [],
      activedTabName: "",
      createdTimes: 0
    };
  },
  watch: {
    activedTabName(val) {
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
        this.activedTabName = this.tabMapOptions[0].key;
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
