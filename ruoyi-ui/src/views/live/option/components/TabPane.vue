<template>
  <el-form label-width="100px" @submit.native.prevent="apiUpdate">
    <el-form-item v-for="(oRow, sName) in settings" :key="sName" :label="oRow.title" :prop="sName">
      <el-input
        v-if="oRow.type==='text'"
        v-model="oRow.value"
        :placeholder="'请输入【'+oRow.title+'】'"
        :disabled="loading"
      />
      <el-input
        v-if="oRow.type==='textarea'"
        v-model="oRow.value"
        type="textarea"
        :rows="oRow.rows"
        :disabled="loading"
      ></el-input>
      <el-radio-group v-else-if="oRow.type==='radio'" v-model="oRow.value" :disabled="loading">
        <el-radio v-for="(value,name) in oRow.option" :key="name" :label="name">{{value}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :disabled="loading" @click="apiUpdate">保存设置</el-button>
      <el-button icon="el-icon-refresh" :disabled="loading" @click="resetForm">重置</el-button>
    </el-form-item>
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
      apiReqQuery: {
        optionName: this.$route.name.toLowerCase(),
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
      this.api("live/option:get", this.apiReqQuery).then(res => {
        this.settings = res.settings;
      });
    },
    /* 保存设置按钮 */
    apiUpdate() {
      const settings = {};
      for (var sName in this.settings) {
        settings[sName] = this.settings[sName].value;
      }
      const reqData = {};
      reqData.settings = settings;
      reqData.optionName = this.$route.name.toLowerCase();
      this.api("live/option:update", reqData).then(response => {
        this.apiGet();
      });
    },
    /** 重置按钮操作 */
    resetForm() {
      this.apiGet();
    }
  }
};
</script>
