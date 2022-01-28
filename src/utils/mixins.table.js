/*
 * 增、删、改、列表共用方法
 */

import Service from "@/api/service";
export default {
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      dialogState: "create",
      total: 0,
      page: 1,
      limit: 15,
      isDisabled: false,
      multipleSelection: [],
      dataList: [],
      callbark: false,
      params: {}, // 列表参数
      option: [
        {
          _id: "-1",
          name: "根选项",
        },
      ],
      optionList: [],
    };
  },
  computed: {
    moduleService(servicePath) {
      return new Service(this.servicePath);
    },
  },
  methods: {
    getOptionList(options) {
      this.moduleService.list(options || {}).then((res) => {
        const _optionList = res.data.result.map((item) => {
          return {
            _id: item._id,
            name: item.name,
          };
        });
        this.optionList = this.option.concat(_optionList);
      });
    },
    handleUpdata(row) {
      this.dialogVisible = true;
      this.dialogState = "update";
      if (row.isLock) {
        this.isDisabled = true;
      }
      this.initForm(row);
      this.updateTree();
    },
    handleOpen() {
      this.dialogState = "create";
      this.dialogVisible = true;
      this.isDisabled = false;
      this.FormClear();
    },
    handleCancel() {
      this.dialogVisible = false;
      this.isDisabled = false;
      this.FormClear();
    },
    handleDelete(row) {
      this.$confirm("确认删除该记录吗？", "提示", { type: "warning" }).then(
        () => {
          this.moduleService
            .delete({ id: row.id ? row.id : row._id })
            .then((response) => {
              this.$message.success("删除成功");
              this.getList(this.params.page);
              this.getOptionList({ field: 1 });
              this.updateTree();
            });
        }
      );
    },
    // 提交方法
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true;
          const menuState = this.dialogState === "create" ? "add" : "update";
          this.submitData && this.submitData();
          this.moduleService[menuState](this.form).then((res) => {
            this.listLoading = false;
            this.dialogVisible = false;
            this.$message.success(
              this.dialogState === "create" ? "添加成功" : "更新成功"
            );
            this.getList(this.params.page);
            if (this.$route.path === "/system/role") {
              // this.$store.dispatch('updateUserPower') // 更新权限菜单
            }
            this.getOptionList({ field: 1 });
            this.updateTree();
          });
        } else {
          return false;
        }
      });
    },
    // 批量删除方法
    handleAll() {
      if (this.$refs.tree) {
        this.multipleSelection = this.$refs.tree.getCheckedNodes();
      }
      if (this.multipleSelection.length < 1) {
        this.$message.warning("至少选择一个记录");
        return;
      }
      const _opstion = this.multipleSelection.map((item) => {
        return item._id;
      });
      this.moduleService.batchdelete({ arrids: _opstion }).then((response) => {
        this.$message.success("删除成功");
        this.getList(this.params.page);
        this.getOptionList({ field: 1 });
        this.updateTree();
      });
    },
    // 更新菜单
    updateTree() {
      if (
        this.$route.path === "/system/power" ||
        this.$route.path === "/system/role"
      ) {
        // 更新用户信息和菜单，还可以优化，暂时先这样
        this.$store.dispatch("fetchUserInfo").then((res) => {
          const tree = res.data.powerTree;
          this.$store.dispatch("generateRoutes", tree);
        });
      }
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取数据
    getList(page) {
      this.listLoading = true;
      this.params.page = page || 1;
      this.moduleService.list(this.params).then((res) => {
        this.dataList = res.data.result;
        this.total = res.data.total;
        this.listLoading = false;
        this.callbark && this.endCallbark();
      });
    },
  },
};
