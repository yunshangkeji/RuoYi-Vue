<template>
  <div v-loading="loading" class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
      @submit.native.prevent="handleQuery"
    >
      <el-form-item label="等级" prop="levelid">
        <el-input
          v-model="queryParams.levelid"
          placeholder="请输入等级"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button
          v-hasPermi="['system:dict:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="table1"
      :data="typeList"
      :default-sort="sortParams"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="等级" width="100" align="center" prop="levelid" sortable="custom" />
      <el-table-column label="经验上限" width="100" align="center" prop="level_up" sortable="custom" />
      <el-table-column label="昵称色码" width="100" align="center" prop="colour" sortable="custom" />
      <el-table-column label="昵称颜色" width="100" align="center" prop="colour" sortable="custom">
        <template slot-scope="scope">
          <div :style="{'width':60+'px','height':25+'px','background-color': '#'+scope.row.colour}"></div>
        </template>
      </el-table-column>
      <el-table-column label="等级图标" width="100" align="center" prop="thumb" sortable="custom">
        <template slot-scope="scope">
          <img height="25" style="vertical-align: middle;" :src="scope.row.thumb" />
        </template>
      </el-table-column>
      <el-table-column label="等级背景" width="100" align="center" prop="bg" sortable="custom">
        <template slot-scope="scope">
          <img height="25" style="vertical-align: middle;" :src="scope.row.bg" />
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" prop="created" width="150" sortable="custom">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.created)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="110">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:dict:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['system:dict:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageParams.pageNum"
      :limit.sync="pageParams.pageSize"
      @pagination="getList"
    ></pagination>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-loading="loading" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="等级" prop="levelid">
          <el-input v-model="form.levelid" />
        </el-form-item>
        <el-form-item label="经验上限" prop="level_up">
          <el-input v-model="form.level_up" />
        </el-form-item>
        <el-form-item label="昵称颜色" prop="colour">
          <el-color-picker v-model="form.colour"></el-color-picker>
        </el-form-item>
        <el-form-item label="等级图标" prop="thumb">
          <img height="25" :src="form.thumb" />
          <el-upload
            :action="elUpload.action"
            :data="elUpload.data"
            :before-upload="elUpload_onbefore"
            :on-success="elUpload_onsuccess_1"
            :file-list="elUpload.fileList"
            :limit="1"
          >
            <el-button type="primary">点击上传等级图标</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="等级背景" prop="bg">
          <img height="25" :src="form.bg" />
          <el-upload
            :action="elUpload.action"
            :data="elUpload.data"
            :before-upload="elUpload_onbefore"
            :on-success="elUpload_onsuccess_2"
            :file-list="elUpload.fileList"
            :limit="1"
          >
            <el-button type="primary">点击上传等级背景</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      elUpload: {
        action: "",
        data: {},
        fileList: []
      },
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 分页参数
      pageParams: {
        pageNum: 1,
        pageSize: 15
      },
      // 查询参数
      queryParams: {},
      // 排序参数
      sortParams: { prop: "levelid", order: "ascending" },
      // 表单参数
      form: {},
      method: ""
    };
  },
  computed: {
    loading() {
      // 如处于加载中，应显示遮罩层
      return this.$store.getters.apiLoading;
    }
  },
  created() {
    this.resetQuery();
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      const pageParams = this.pageParams;
      const queryParams = this.addDateRange(this.queryParams, this.dateRange);
      const sortParams = this.sortParams;
      const data = { pageParams, queryParams, sortParams };
      this.api("live/experlevel:list", data).then(response => {
        this.typeList = response.rows;
        this.total = response.total;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        thumb: "",
        bg: ""
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // 排序参数
      // this.$refs['table1'].clearSort();
      if (typeof this.sortParams !== "object") {
        this.sortParams = {};
      }
      this.sortParams.prop = "levelid";
      this.sortParams.order = "ascending";
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加等级";
      this.method = "create";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const levelid = row.levelid;
      this.api("live/experlevel:get", { levelid }).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改等级信息";
        this.method = "update";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const reqData = {};
          reqData.form = this.form;
          this.api(`live/experlevel:${this.method}`, reqData).then(response => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const that = this;
      const levelid = row.levelid;
      this.$confirm(`是否确认删除等级为[${levelid}]的数据项?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return that.api("live/experlevel:delete", { levelid });
        })
        .then(() => {
          that.getList();
        });
    },
    sortChange(data) {
      this.sortParams.order = data.order;
      this.sortParams.prop = data.prop;
      this.pageParams.pageNum = 1;
      this.getList();
    },
    elUpload_onbefore(file) {
      return new Promise((resolve, reject) => {
        const reqData = {};
        reqData.file = {};
        reqData.file.name = file.name;
        this.api("live/experlevel:upload", reqData).then(data => {
          this.elUpload.action = data.upload_form.url;
          this.elUpload.data = data.upload_form.formdata;
          resolve(file);
        });
      });
    },
    elUpload_onsuccess_1(data) {
      console.log("elUpload_onsuccess_1", data);
      this.msgSuccess(data.msg);
      this.form.thumb = data.imageUrl;
      this.elUpload.fileList = [];
    },
    elUpload_onsuccess_2(data) {
      console.log("elUpload_onsuccess_2", data);
      this.msgSuccess(data.msg);
      this.form.bg = data.imageUrl;
      this.elUpload.fileList = [];
    }
  }
};
</script>
