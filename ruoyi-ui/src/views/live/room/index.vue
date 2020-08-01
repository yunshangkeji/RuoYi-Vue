<template>
  <div class="mixin-components-container">
    <el-row>
      <el-col
        v-for="(item, index) in apiResData.list"
        :key="index"
        :span="3"
        :offset="0"
        style="padding: 5px;"
      >
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header" style="text-align: center;">{{item.nickname}}</div>
          <video
            :id="item.id"
            class="video-js vjs-big-play-centered vjs-fluid"
            controls
            preload="auto"
            width="100%"
            height="100%"
            autoplay
            muted
          >
            <source type="application/x-mpegURL" :src="item.pull_url" />
          </video>
          <div style="text-align:center;padding:5px;">
            <el-button type="primary" :disabled="loading">关闭</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import Chimee from "chimee";
// import ChimeeKernelFlv from "chimee-kernel-flv";
// import ChimeeKernelHls from "chimee-kernel-hls";
import Videojs from "video.js";
import "video.js/dist/video-js.css";

export default {
  data() {
    return {
      apiResData: {
        list: []
      },
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
  mounted() {
    this.api("live/room:monitor").then(apiResData => {
      this.apiResData = apiResData;
      this.$nextTick(() => {
        this.initVideo();
      });
    });

    // init the default selected tab
    const tab = this.$route.query.tab;
    if (tab) {
      this.activedTabName = tab;
    }
    this.apiTabs();
  },
  methods: {
    initVideo() {
      // 此处初始化的调用，我放在了获取数据之后的方法内，而不是放在钩子函数mounted
      // 页面dom元素渲染完毕，执行回调里面的方法
      const len = this.apiResData.list.length;
      for (var i = 0; i < len; i++) {
        const row = this.apiResData.list[i];
        Videojs(document.getElementById(row.id), {
          // 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          controls: true,
          // 自动播放属性,muted:静音播放
          autoplay: true,
          // 建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          preload: "auto",
          // 设置视频播放器的显示宽度（以像素为单位）
          // width: "800px",
          // 设置视频播放器的显示高度（以像素为单位）
          // height: "400px",
          controlBar: {
            playToggle: true
          }
        });
      }
    },
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
