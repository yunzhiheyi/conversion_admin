<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <to-link :val="$route.meta.btnList.add" @to="handleOpen">
          <el-button type="primary">添加</el-button>
        </to-link>
      </div>
    </div>
    <div class="_list">
      <div class="menu_list">
        <div class="custom-tree-node tree-head">
          <span class="treeName">{{
            $route.params.name === "navigate" ? "导航名称" : "分类名称"
          }}</span>
          <div class="tree-node">
            <table class="tree-table-th">
              <tr>
                <td class="td">排序</td>
                <td class="td">ID</td>
                <td class="td">父类ID</td>
                <td class="td">
                  {{
                    $route.params.name === "navigate" ? "导航连接" : "分类介绍"
                  }}
                </td>
                <td class="td">操作</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="list">
          <el-tree
            class="treeMenu"
            :data="dataList"
            ref="tree"
            :props="props"
            default-expand-all
            show-checkbox
            :expand-on-click-node="false"
          >
            <div class="custom-tree-node" slot-scope="{ data }">
              <span class="treeName">{{ data.name }}</span>
              <div class="tree-node">
                <table class="tree-table">
                  <tr>
                    <td class="td">{{ data.sort }}</td>
                    <td class="td">{{ data._id }}</td>
                    <td class="td">{{ data.parentId }}</td>
                    <td class="td">{{ data.describe }}</td>
                    <td class="td">
                      <to-link
                        :val="$route.meta.btnList.add"
                        @to="addMenu(data)"
                      >
                        <el-button size="mini" type="text">添加</el-button>
                      </to-link>
                      <to-link
                        :val="$route.meta.btnList.edit"
                        @to="updateMenu(data)"
                      >
                        <el-button size="mini" type="text">编辑</el-button>
                      </to-link>
                      <to-link
                        :val="$route.meta.btnList.delete"
                        @to="handle_Delete(data)"
                      >
                        <el-button size="mini" type="text">删除</el-button>
                      </to-link>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </el-tree>
        </div>
      </div>
    </div>
    <div class="pages">
      <div class="left">
        <to-link :val="$route.meta.btnList.batchdelete" @to="handleAll">
          <el-tooltip
            class="item"
            effect="dark"
            content="批量删除"
            placement="top"
          >
            <el-button type="danger">批量删除</el-button>
          </el-tooltip>
        </to-link>
      </div>
    </div>
    <el-dialog
      :title="$route.params.name === 'navigate' ? '添加导航' : '添加分类'"
      :visible.sync="dialogVisible"
      width="32%"
      top="5vh"
      :before-close="beforeClose"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="dialogFormRules"
        label-width="110px"
      >
        <el-form-item label="类型" prop="parentId">
          <el-select v-model="form.typeId" placeholder="请选择" disabled>
            <el-option
              v-for="(item, key) in typeIdList"
              :key="key"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$route.params.name === 'navigate' ? '导航名称' : '分类名称'"
          prop="name"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          :label="$route.params.name === 'navigate' ? '导航连接' : '分类介绍'"
          prop="describe"
        >
          <el-input v-model="form.describe"></el-input>
        </el-form-item>
        <el-form-item label="父分类" prop="parentId">
          <el-select
            v-model="form.parentId"
            v-if="optionList.length > 0"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, key) in optionList"
              :key="key"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
          <el-select v-model="form.parentId" v-else placeholder="请选择">
            <el-option
              v-for="(item, key) in option"
              :key="key"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缩略图" prop="img_path">
          <upload v-model="form.img_path" @upload-success="upload_success">
            <img :src="form.img_path" v-if="form.img_path" class="avatar" />
            <i class="el-icon-plus" v-if="!form.img_path"></i>
          </upload>
        </el-form-item>
        <el-form-item label="排序数" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="1"
            :max="10"
            label="排序数"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('dialogForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mixinsTable from "@/utils/mixins.table";
import Upload from "@/components/Upload";
export default {
  name: "categoryList",
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: "/api/product/category",
      form: {
        img_id: "",
        name: "",
        typeId: "",
        describe: "",
        parentId: "-1",
        sort: "",
        img_path: "",
      },
      typeIdList: [
        {
          id: "1",
          name: "文章分类",
        },
        {
          id: "2",
          name: "商品分类",
        },
        {
          id: "3",
          name: "导航分类",
        },
      ],
      props: {
        value: "_id",
        label: "name",
      },
      dialogFormRules: {
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "父类ID不能为空", trigger: "blur" },
        ],
        sort: [{ required: true, message: "排序数不能为空", trigger: "blur" }],
      },
    };
  },
  components: {
    Upload,
  },
  computed: {
    paramsName() {
      const $path = this.$route.path.split("/");
      const _name = $path[$path.length - 1];
      return this.$route.params.name || _name;
    },
  },
  created() {
    this.getDada();
  },
  methods: {
    initForm(row) {
      this.setFormVal(row);
    },
    beforeClose(done) {
      this.optionList = [];
      done();
    },
    updateMenu(row) {
      this.getOptionListData(); // 更新分类
      this.handleUpdata(row);
    },
    getDada() {
      this.params.type =
        this.paramsName === "article"
          ? "1"
          : this.paramsName === "product"
          ? "2"
          : "3";
      this.params.field = "2";
      this.getList();
    },
    getOptionListData() {
      this.params.type =
        this.paramsName === "article"
          ? "1"
          : this.paramsName === "product"
          ? "2"
          : "3";
      this.getOptionList({ type: this.params.type });
    },
    FormClear() {
      this.params.type =
        this.paramsName === "article"
          ? "1"
          : this.paramsName === "product"
          ? "2"
          : "3";
      this.$set(this.form, "typeId", this.params.type);
      this.$set(this.form, "img_id", "");
      this.$set(this.form, "img_path", "");
      this.$set(this.form, "name", "");
      this.$set(this.form, "describe", "");
      this.$set(this.form, "parentId", "-1");
      this.$set(this.form, "sort", "");
      this.$set(this.form, "_id", "");
      this.$set(this.form, "level", 0);
    },
    addMenu(row) {
      this.$set(this.form, "parentId", row._id);
      this.params.type =
        this.paramsName === "article"
          ? "1"
          : this.paramsName === "product"
          ? "2"
          : "3";
      this.$set(this.form, "typeId", this.params.type);
      this.$set(this.form, "name", "");
      this.$set(this.form, "describe", "");
      this.$set(this.form, "img_id", "");
      this.$set(this.form, "img_path", "");
      this.$set(this.form, "sort", "");
      if (row && row._id) {
        this.$set(this.form, "_id", row._id);
      }
      this.$set(
        this.form,
        "level",
        (row.parentId === "-1" ? row.level + 1 : row.level) + 1
      );
      this.getOptionListData(); // 更新分类
      this.dialogState = "create";
      this.dialogVisible = true;
      this.isDisabled = false;
    },
    setFormVal(row) {
      const formArr = Object.keys(row);
      formArr.map((item) => {
        this.$set(
          this.form,
          item,
          this.dialogState === "update" ? row[item] : ""
        );
      });
    },
    handle_Delete(row) {
      this.$confirm("确认删除该记录吗？", "提示", { type: "warning" }).then(
        () => {
          if (row.isChildren) {
            this.$message.warning("有子类不能删除");
            return;
          }
          this.moduleService.delete({ id: row._id }).then((response) => {
            this.$message.success("删除成功");
            this.getList();
          });
        }
      );
    },
    upload_success(val) {
      this.$set(this.form, "img_id", val.mid);
    },
  },
};
</script>
<style lang="less">
.tree-table-th {
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  color: #666;
  width: 100%;
  background-color: #f5f5f5;
  .name {
    width: 390px;
    padding-left: 42px;
  }
  .td {
    text-align: center;
  }
}
.tree-head {
  height: 45px;
  position: relative;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  .treeName {
    font-size: 13px;
    color: #666;
    width: 100%;
    display: inline-block;
    width: 340px;
    line-height: 44px;
    padding-left: 20px;
    background-color: #f5f7fa;
  }
}
.tree-node {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-left: 315px;
  overflow: hidden;
}
.tree-table {
  width: 100%;
}
.custom-tree-node {
  font-size: 13px;
  color: #666;
  width: 100%;
  .td {
    width: 15%;
    text-align: center;
    line-height: 38px;
  }
  .name {
    line-height: 38px;
    text-align: left;
  }
}
</style>
