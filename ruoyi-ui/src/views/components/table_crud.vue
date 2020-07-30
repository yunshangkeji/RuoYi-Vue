<template>
  <div v-loading="loading" class="app-container">
    <el-form
      ref="queryForm"
      :model="apiListReqData.queryParams"
      :inline="true"
      label-width="68px"
      @submit.native.prevent="handleQuery"
    >
      <el-form-item
        v-for="(item,paramName) in apiListResData.query"
        :key="paramName"
        :label="item.title"
        :prop="paramName"
      >
        <el-input
          v-model="apiListReqData.queryParams[paramName]"
          :placeholder="'请输入'+item.title"
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
      :data="apiListResData.rows"
      :default-sort="apiListResData.sortParams"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" min-width="55" align="center" />
      <el-table-column
        v-for="(column_info,column_name) in apiListResData.column"
        :key="column_name"
        :label="column_info.label"
        :min-width="column_info.width"
        align="center"
        :prop="column_info.prop"
        :sortable="column_info.buttons?false:'custom'"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div
            v-if="column_info.type==='color'"
            :style="{'width':60+'px','height':25+'px','background-color': '#'+scope.row[column_info.prop]}"
          ></div>
          <img
            v-else-if="column_info.type==='img'"
            height="25"
            style="vertical-align: middle;"
            :src="scope.row[column_info.prop]"
          />
          <span v-else-if="column_info.buttons">
            <el-button
              v-for="(button_info,button_name) in column_info.buttons"
              :key="button_name"
              size="mini"
              type="text"
              :icon="'el-icon-'+button_name"
              @click="handleTableOperate(button_name,scope.row)"
            >{{button_info.title}}</el-button>
          </span>
          <span v-else>{{scope.row[column_info.prop]}}</span>
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
      :visible.sync="elDialog.visible"
      width="500px"
      append-to-body
    >
      <el-form ref="elDialog_form" :model="elDialog.formValue" label-width="80px">
        <el-form-item
          v-for="(formItem,itemName) in apiListResData.formItem"
          :key="itemName"
          :label="formItem.label"
          :prop="itemName"
        >
          <el-color-picker v-if="formItem.type==='color'" v-model="elDialog.formValue[itemName]"></el-color-picker>
          <span v-if="formItem.type==='upload'">
            <img
              v-if="elDialog.formValue[itemName]"
              height="25"
              :src="elDialog.formValue[itemName]"
            />
            <el-upload
              :ref="itemName"
              :action="elUpload.action"
              :data="elUpload.data"
              :before-upload="elUpload_onbefore"
              :on-success="(res,file)=>{return elUpload_onsuccess(res,file,itemName)}"
              :file-list="elUpload.fileList"
              :limit="1"
            >
              <el-button type="primary">点击上传{{formItem.label}}</el-button>
            </el-upload>
          </span>
          <el-input v-else v-model="elDialog.formValue[itemName]" />
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
      elDialog: {
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        visible: false,
        method: "",
        // 表单参数
        formValue: { levelid: "" },
        // 表单校验
        rules: {
          title: [
            { required: true, message: "成员名称不能为空", trigger: "blur" }
          ]
        }
      },
      apiListReqData: {
        // 查询参数
        queryParams: {},
        // 排序参数
        sortParams: {},
        // 分页参数
        pageParams: {
          pageNum: 1,
          pageSize: 15
        }
      },
      apiListResData: {
        // 总条数
        total: 0,
        // 表格数据
        rows: [],
        query: []
      },
      api_path: ""
    };
  },
  computed: {
    loading() {
      // 如处于加载中，应显示遮罩层
      return this.$store.getters.apiLoading;
    }
  },
  created() {
    const route_path = this.$route.path.split("/");
    this.api_path = `${route_path[1]}/${route_path[2]}_${route_path[3]}`;
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.api(`${this.api_path}:list`, this.apiListReqData).then(
        apiListResData => {
          this.apiListResData = apiListResData;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.elDialog.visible = false;
      this.elDialog_reset();
    },
    // 表单重置
    elDialog_reset() {
      this.elDialog.formValue = {
        thumb: "",
        bg: ""
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
      // 排序参数
      this.$refs["table1"].clearSort();
      if (typeof this.sortParams !== "object") {
        this.apiListReqData.sortParams = {};
      }
      this.apiListReqData.sortParams.prop = "";
      this.apiListReqData.sortParams.order = "";
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.elDialog_reset();
      this.elDialog.visible = true;
      this.elDialog.title = `添加${this.apiListResData.title}`;
      this.elDialog.method = "create";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 表格按钮操作 */
    handleTableOperate(name, row) {
      const that = this;
      const oper_id = row.levelid;
      switch (name) {
        case "edit":
          this.elDialog_reset();
          this.api(`${that.api_path}:get`, { oper_id }).then(apiFormResData => {
            this.elDialog.formValue = apiFormResData.formValue;
            this.elDialog.visible = true;
            this.elDialog.title = `修改${this.apiListResData.title}信息[${oper_id}]`;
            this.elDialog.method = "update";
          });
          break;
        case "delete":
          this.$confirm(
            `是否确认删除${this.apiListResData.title}为[${oper_id}]的数据项?`,
            "警告",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(function() {
              return that.api(`${that.api_path}:delete`, { oper_id });
            })
            .then(() => {
              that.getList();
            });
          break;
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      const that = this;
      this.$refs["elDialog_form"].validate(valid => {
        if (!valid) {
          return;
        }
        const reqData = {};
        reqData.formValue = that.elDialog.formValue;
        this.api(`${that.api_path}:${that.elDialog.method}`, reqData).then(
          response => {
            this.elDialog.visible = false;
            this.getList();
          }
        );
      });
    },
    sortChange(data) {
      this.apiListReqData.sortParams.order = data.order;
      this.apiListReqData.sortParams.prop = data.prop;
      this.apiListReqData.pageParams.pageNum = 1;
      this.getList();
    },
    elUpload_onbefore(file) {
      const that = this;
      return new Promise((resolve, reject) => {
        const reqData = {};
        reqData.uploadFile = {};
        reqData.uploadFile.name = file.name;
        this.api(`${that.api_path}:upload`, reqData).then(data => {
          this.elUpload.action = data.upload_form.url;
          this.elUpload.data = data.upload_form.formdata;
          resolve(file);
        });
      });
    },
    elUpload_onsuccess(res, data, field) {
      console.log("elUpload_onsuccess", res, data, field);
      this.msgSuccess(res.msg);
      this.elDialog.formValue[field] = res.imageUrl;
      this.elUpload.fileList = [];
    }
  }
};
</script>
