<template>
  <el-form v-loading="loading">
    <el-form-item v-for="(oRow, sName) in settings" :key="sName" :label="oRow.title" :prop="sName">
      <el-input v-model="oRow.value" :placeholder="'请输入【'+oRow.title+'】'" />
    </el-form-item>
    <el-button type="primary" @click="apiUpdate">保存设置</el-button>
  </el-form>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      settings: {},
      apiQuery: {
        activedTabName: this.type
      }
    };
  },
  computed: {
    loading() {
      // 如处于加载中，应显示遮罩层
      return this.$store.getters.apiLoading;
    }
  },
  created() {
    this.apiGet();
  },
  methods: {
    apiGet() {
      this.$emit("create"); // for test
      this.api("live/option:get", this.apiQuery).then(res => {
        this.settings = res.settings;
      });
    },
    /* 保存设置按钮 */
    apiUpdate: function() {
      const settings = [];
      for (var sName in this.settings) {
        const mSetting = {};
        const aPath = sName.split("/");
        mSetting.optionName = aPath[0];
        mSetting.settingName = aPath[1];
        mSetting.value = this.settings[sName].value;
        settings.push(mSetting);
      }
      this.api("live/option:update", { settings }).then(response => {
        this.apiGet();
      });
    }
  }
};
</script>
