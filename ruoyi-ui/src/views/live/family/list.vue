<template>
  <div v-loading="loading" class="app-container">
    <el-form ref="queryForm" :model="apiListReqData.queryParams" :inline="true" label-width="68px">
      <el-form-item label="家族编号" prop="id">
        <el-input
          v-model="apiListReqData.queryParams.id"
          placeholder="请输入家族编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家族名称" prop="title">
        <el-input
          v-model="apiListReqData.queryParams.title"
          placeholder="请输入家族名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="apiListReqData.queryParams.status"
          placeholder="家族状态"
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
      <el-form-item label="开通日期" prop="created">
        <el-date-picker
          v-model="apiListReqData.queryParams.created"
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
      :data="apiListResData.rowsList"
      :default-sort="apiListReqData.sortParams"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" min-width="55" align="center" />
      <el-table-column label="家族编号" min-width="100" align="center" prop="id" sortable="custom" />
      <el-table-column
        label="家族名称"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="族长账号"
        align="center"
        prop="head_funame"
        :show-overflow-tooltip="true"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="收益分成"
        align="center"
        prop="income_share_percent"
        sortable="custom"
        min-width="100"
      />
      <el-table-column
        label="累计收益"
        align="center"
        prop="income_total"
        sortable="custom"
        min-width="100"
      />
      <el-table-column label="开通时间" align="center" prop="created" min-width="150" sortable="custom">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.created)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="家族长活跃时间"
        align="center"
        prop="head_session_actived"
        min-width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.head_session_actived)}}</span>
        </template>
      </el-table-column>
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
      v-show="apiListResData.total>0"
      :total="apiListResData.total"
      :page.sync="apiListReqData.pageParams.pageNum"
      :limit.sync="apiListReqData.pageParams.pageSize"
      @pagination="getList"
    ></pagination>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      v-loading="loading"
      :title="elDialog.title"
      :visible.sync="elDialog.open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="elDialog_form"
        :model="elDialog.form"
        :rules="elDialog.rules"
        label-width="80px"
      >
        <el-form-item label="家族名称" prop="title">
          <el-input v-model="elDialog.form.title" />
        </el-form-item>
        <el-form-item label="族长账号" prop="head_funame">
          <el-input v-model="elDialog.form.head_funame" />
        </el-form-item>
        <el-form-item label="族长密码" prop="password">
          <el-input v-model="elDialog.form.password" />
        </el-form-item>
        <el-form-item label="提成比例" prop="income_share_percent">
          <el-input v-model="elDialog.form.income_share_percent" />
        </el-form-item>
        <el-form-item label="家族状态" prop="status">
          <el-radio-group v-model="elDialog.form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="elDialog.form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="elDialog_submit">确 定</el-button>
        <el-button @click="elDialog_cancel">取 消</el-button>
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
      apiListResData: {
        // 用户表格数据
        rowsList: [],
        // 总条数
        total: 0
      },
      elDialog: {
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        method: "",
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          title: [
            { required: true, message: "家族名称不能为空", trigger: "blur" }
          ]
        }
      },
      // 状态数据用户
      statusOptions: [],
      apiListReqData: {
        // 查询参数
        queryParams: {},
        // 排序参数
        sortParams: { prop: "user_id", order: "descending" },
        // 分页参数
        pageParams: {
          pageNum: 1,
          pageSize: 15
        }
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
      this.api("live/family:list", this.apiListReqData).then(data => {
        this.apiListResData = data;
      });
    },
    // 用户状态用户翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row[column.property]);
    },
    // 取消按钮
    elDialog_cancel() {
      this.elDialog.open = false;
      this.elDialog_reset();
    },
    // 表单重置
    elDialog_reset() {
      this.elDialog.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
      };
      this.resetForm("elDialog_form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.apiListReqData.pageParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.elDialog_reset();
      this.elDialog.open = true;
      this.elDialog.title = "添加用户";
      this.elDialog.method = "create";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.elDialog_reset();
      const id = row.id;
      this.api("live/family:get", { id }).then(response => {
        this.elDialog.form = response.data;
        this.elDialog.open = true;
        this.elDialog.title = "修改用户信息";
        this.elDialog.method = "update";
      });
    },
    /** 提交按钮 */
    elDialog_submit: function() {
      this.$refs["elDialog_form"].validate(valid => {
        if (!valid) {
          return;
        }
        const reqData = {};
        reqData.form = this.elDialog.form;
        this.api(`live/family:${this.elDialog.method}`, reqData).then(
          resData => {
            this.elDialog.open = false;
            this.getList();
          }
        );
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
          return this.api("live/family:delete", { dictIds });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    sortChange(data) {
      this.apiListReqData.sortParams.order = data.order;
      this.apiListReqData.sortParams.prop = data.prop;
      this.apiListReqData.pageParams.pageNum = 1;
      this.getList();
    }
  }
};
</script>
