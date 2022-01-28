<template>
  <div class="spec">
    <el-dialog
      title="颜色管理"
      :visible.sync="dialogVisible"
      width="460px"
      top="10vh"
    >
      <div class="spec-body">
        <el-table
          ref="tableSelection"
          highlight-current-row
          @selection-change="handleSelectionChange"
          :data="dataList"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.thumbnail" width="80" height="80" />
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdata(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="pages" style="margin-bottom: 20px">
          <div class="left">
            <el-button @click="_Add" type="primary">添加</el-button>
          </div>
          <div class="right" v-if="dataList.length > 1">
            <el-pagination
              @current-change="handleCurrentChange"
              background
              :page-size="4"
              :current-page.sync="page"
              layout="prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="颜色添加"
      :visible.sync="colorAddVisible"
      width="360px"
      top="20vh"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="colorFormRules"
        label-width="70px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="thumbnail">
          <el-button
            @click="thumbnailSelection"
            v-if="$parent.fileList.length > 0 && !form.thumbnail"
            >从产品图片选择</el-button
          >
          <upload
            v-model="form.thumbnail"
            v-if="$parent.fileList.length == 0"
            @upload-success="upload_success"
          >
            <img :src="form.thumbnail" v-if="form.thumbnail" class="avatar" />
            <i class="el-icon-plus" v-if="!form.thumbnail"></i>
          </upload>
          <img
            :src="form.thumbnail"
            @click="thumbnailSelection"
            v-if="$parent.fileList.length > 0 && form.thumbnail"
            class="img_avatar"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colorAddVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="_Submit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="产品图片列表"
      :visible.sync="productAddVisible"
      :before-close="productAddhide"
      width="560px"
      top="20vh"
    >
      <div class="imgagesList">
        <ul>
          <li
            v-for="item in $parent.fileList"
            :key="item.id"
            @click="itemUrl(item.url)"
          >
            <img :src="item.url" class="img" />
            <label class="status-label" v-if="item.url === thumbnail">
              <span class="el-icon-upload-success el-icon-check"></span>
            </label>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productAddhide()">取消</el-button>
        <el-button type="primary" @click="productAddSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Service from "@/api/service";
import { mapGetters } from "vuex";
import Upload from "@/components/Upload";
export default {
  name: "colorList",
  data() {
    return {
      pathsState: "add",
      listLoading: false,
      colorAddVisible: false,
      productAddVisible: false,
      multipleSelection: [],
      page: 1,
      total: 0,
      dataList: [],
      _selection: [],
      thumbnail: "",
      form: {
        name: "",
        _id: "",
        goods_id: "",
        thumb_id: "",
        thumbnail: "",
      },
      colorFormRules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        thumbnail: [
          { required: true, message: "缩略图不能为空", trigger: "change" },
        ],
      },
    };
  },
  components: {
    Upload,
  },
  computed: {
    ...mapGetters(["uploadId"]),
    dialogVisible: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
    moduleService() {
      return new Service("/api/product/color");
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    selection: {
      type: Array,
    },
    success: {
      type: String,
      default: null,
    },
  },
  created() {
    this.multipleSelection = this.selection;
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      // 暂时找不到好方法可以解决
      setTimeout(() => {
        this.readySelection(this._selection);
      }, 100);
    });
  },
  methods: {
    productAddhide() {
      if (!this.form.thumbnail) {
        this.$set(this, "thumbnail", "");
      }
      this.productAddVisible = false;
    },
    productAddSubmit() {
      this.$set(this.form, "thumbnail", this.thumbnail);
      this.productAddVisible = false;
    },
    handleUpdata(row) {
      this.colorAddVisible = true;
      this.pathsState = "update";
      this.$set(this.form, "name", row.name);
      this.$set(this.form, "_id", row._id);
      this.$set(this.form, "goods_id", row.goods_id);
      this.$set(this.form, "thumb_id", row.thumb_id);
      this.$set(this.form, "thumbnail", row.thumbnail);
    },
    thumbnailSelection() {
      this.productAddVisible = true;
    },
    itemUrl(url) {
      this.$set(this, "thumbnail", url);
    },
    handleDelete(row) {
      this.$confirm("确认删除该记录吗？", "提示", { type: "warning" }).then(
        () => {
          this.moduleService.delete({ id: row._id }).then((response) => {
            this.$message.success("删除成功");
            this.getList();
          });
        }
      );
    },
    readySelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.tableSelection.toggleRowSelection(row);
        });
      } else {
        this.$refs.tableSelection.clearSelection();
      }
    },
    handleCancel() {
      this.dialogVisible = false;
      this.pathsState = "add";
    },
    upload_success(val) {
      this.$set(this.form, "thumb_id", val.mid);
    },
    _Add() {
      this.colorAddVisible = true;
      this.$set(this.form, "name", "");
      this.$set(this.form, "goods_id", "");
      this.$set(this.form, "thumb_id", "");
      this.$set(this.form, "thumbnail", "");
      this.$set(this.form, "_id", "");
    },
    _Submit() {
      this.$set(this.form, "thumb_id", this.$store.state.app.uploadId);
      this.$set(this.form, "goods_id", this.$route.query.id);
      this.listLoading = true;
      this.moduleService[this.pathsState](this.form).then((res) => {
        this.$message.success(
          this.pathsState === "add" ? "添加成功" : "更新成功"
        );
        this.colorAddVisible = false;
        this.listLoading = false;
        this.getList();
      });
    },
    _productSubmit() {},
    handleSubmit() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("必须选一个规格！");
        return;
      }
      this.$emit("success", this.multipleSelection);
      this.dialogVisible = false;
      this.state = false;
      this.form = {
        name: "",
        _id: "",
        goods_id: "",
        thumb_id: "",
        thumbnail: "",
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.getList(val);
      setTimeout(() => {
        this.readySelection(this._selection);
      }, 100);
    },
    getList(page) {
      this.moduleService
        .list({ page: page || this.page, id: this.$route.query.id })
        .then((res) => {
          this.dataList = res.data.result;
          this.total = res.data.total;
          this._selection = this.selection.map((item) => {
            return this.dataList.find((_item) => _item.name === item.name);
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.spec-body {
  margin: -30px 0;
}
.img_avatar {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
.img_avatar:hover {
  border-color: #409eff;
}
.imgagesList {
  overflow: hidden;
  li {
    float: left;
    position: relative;
    overflow: hidden;
    .img {
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
    }
    .status-label {
      position: absolute;
      right: -17px;
      top: -7px;
      width: 40px;
      height: 25px;
      background: #13ce66;
      text-align: center;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      -webkit-box-shadow: 0 1px 1px #ccc;
      box-shadow: 0 1px 1px #ccc;
    }
    .el-icon-upload-success {
      margin: 11px 0 0 -2px;
      color: #fff;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }
  }
}
</style>
