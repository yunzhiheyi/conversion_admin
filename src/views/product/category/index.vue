<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <to-link :val="$route.meta.btnList.batchdelete" @to="handleOpen">
          <el-button type="primary">添加</el-button>
        </to-link>
      </div>
    </div>
    <div class="_list">
      <div class="menu_list">
        <el-row>
          <el-col :span="1"><span class="th">索引</span></el-col>
          <el-col :span="12"><span class="th">分类名称</span></el-col>
          <el-col :span="3"><span class="th">排序</span></el-col>
          <el-col :span="5"><span class="th">ID</span></el-col>
          <el-col :span="3"><span class="th">操作</span></el-col>
        </el-row>
        <div class="list">
          <div class="nodata" v-if="dataList.length == 0">暂时没有数据</div>
          <tree-category
            :render-content="renderContent"
            :treedata="dataList"
          ></tree-category>
        </div>
      </div>
    </div>
    <el-dialog
      title="分类添加"
      :visible.sync="dialogVisible"
      width="32%"
      top="5vh"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="dialogFormRules"
        label-width="110px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分类介绍" prop="describe">
          <el-input v-model="form.describe"></el-input>
        </el-form-item>
        <el-form-item label="父分类" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择">
            <el-option
              v-for="(item, key) in optionList"
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
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mixinsTable from "@/utils/mixins.table";
import TreeCategory from "./treeCategory";
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
        describe: "",
        parentId: "-1",
        sort: "",
        img_path: "",
      },
      dialogFormRules: {
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "父类不能为空", trigger: "blur" },
        ],
        sort: [{ required: true, message: "排序数不能为空", trigger: "blur" }],
      },
    };
  },
  computed: {
    paramsName() {
      const $path = this.$route.path.split("/");
      const _name = $path[$path.length - 1];
      return this.$route.params.name || _name;
    },
  },
  components: {
    TreeCategory,
    Upload,
  },
  created() {
    this.getOptionList();
    this.getList();
  },
  methods: {
    initForm(row) {
      this.setFormVal(row);
    },
    FormClear() {
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
      this.getOptionList(); // 更新分类
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
    renderContent(h, node) {
      var row = node.node;
      var _this = this;
      var add = h(
        "span",
        {
          attrs: {
            class: "o_text",
          },
          on: {
            click: function (e) {
              _this.addMenu(row);
            },
          },
        },
        "添加"
      );
      var edit = h(
        "span",
        {
          attrs: {
            class: "o_text",
          },
          on: {
            click: function (e) {
              _this.handleUpdata(row);
            },
          },
        },
        "编辑"
      );
      var del = h(
        "span",
        {
          attrs: {
            class: "o_text",
          },
          on: {
            click: function (e) {
              _this.handle_Delete(row);
            },
          },
        },
        "删除"
      );
      return h("div", [add, edit, del]);
    },
  },
};
</script>
<style lang="less">
.menu_list {
  position: relative;
  word-wrap: normal;
  text-overflow: ellipsis;
  vertical-align: middle;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
  .th {
    display: block;
    padding: 12px 14px;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    color: #90939d;
    background-color: #f5f5f5;
    font-weight: 700;
    border-bottom: 1px solid #ebeef5;
  }
  .list {
    margin-top: -1px; // border-bottom: 1px solid #ebeef5;
  }

  .ul {
    .li {
      border-top: 1px solid #ebeef5;
      transition: background-color 0.25s ease;
      font-size: 14px;
      .text {
        line-height: 23px;
        padding: 17px 0 17px 14px;
        display: block;
      }
      .o_text {
        display: inline-block;
        cursor: pointer;
        padding: 20px 6px;
        color: #409eff;
        &:hover {
          opacity: 0.7;
        }
      }
      .text.active {
        padding-left: 45px;
      }
    }
  }
  .nodata {
    text-align: center;
    line-height: 100px;
    border-bottom: 1px solid #ebeef5;
  }
  .row:hover {
    background-color: #f9f9f9;
  }
}
</style>
