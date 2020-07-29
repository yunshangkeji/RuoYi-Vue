<template>
  <div v-loading="loading" class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="用户名称" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select
          v-model="queryParams.state"
          placeholder="用户状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="注册日期">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="typeList"
      :default-sort="sortParams"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" min-width="55" align="center" />
      <el-table-column label="用户编号" min-width="100" align="center" prop="user_id" sortable="custom" />
      <el-table-column
        label="登录账号"
        align="center"
        prop="account"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="用户昵称"
        align="center"
        prop="nickname"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="state"
        :formatter="statusFormat"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="余额"
        align="center"
        prop="money"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="消费"
        align="center"
        prop="real_dml_money"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="设备类型"
        align="center"
        prop="operating_system"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="100"
      />
      <el-table-column label="注册时间" align="center" prop="add_time" min-width="150" sortable="custom">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.add_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="当前登录时间"
        align="center"
        prop="login_time"
        min-width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.login_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="注册IP"
        align="center"
        prop="reg_ip"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="150"
      />
      <el-table-column
        label="当前登录IP"
        align="center"
        prop="login_ip"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="150"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="110">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:dict:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="登录账号" prop="account">
          <el-input v-model="form.account" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据用户
      statusOptions: [],
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
      sortParams: { prop: "user_id", order: "descending" },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "用户类型不能为空", trigger: "blur" }
        ]
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
    this.getList();
    this.getDicts("live_user_state").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询用户类型列表 */
    getList() {
      const pageParams = this.pageParams;
      const queryParams = this.addDateRange(this.queryParams, this.dateRange);
      const sortParams = this.sortParams;
      const data = { pageParams, queryParams, sortParams };
      this.api("live/user:list", data).then(response => {
        this.typeList = response.rows;
        this.total = response.total;
      });
    },
    // 用户状态用户翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row[column.property]);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
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
      const user_id = row.user_id;
      this.api("live/user:get", { user_id }).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const reqData = {};
          reqData.form = this.form;
          if (this.form.user_id !== undefined) {
            this.api("live/user:update", reqData).then(response => {
              this.open = false;
              this.getList();
            });
          } else {
            this.api("live/user:create", reqData).then(response => {
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + dictIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return this.api("live/user:delete", { dictIds });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    sortChange(data) {
      this.sortParams.order = data.order;
      this.sortParams.prop = data.prop;
      this.pageParams.pageNum = 1;
      this.getList();
    }
  }
};
</script>
