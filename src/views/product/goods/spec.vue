<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <to-link :val="$route.meta.btnList.add" @to="handleOpen()">
          <el-button type="primary">添加</el-button>
        </to-link>
      </div>
    </div>
    <div class="_list">
      <el-table
        ref="tableSelection"
        highlight-current-row
        :data="dataList"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="规格名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="规格值">
          <template slot-scope="scope">
            {{ scope.row.value }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <to-link
              :val="$route.meta.btnList.edit"
              @to="handleUpdata(scope.row)"
            >
              <el-button type="text">编辑</el-button>
            </to-link>
            <to-link
              :val="$route.meta.btnList.delete"
              @to="handleDelete(scope.row)"
            >
              <el-button type="text">删除</el-button>
            </to-link>
          </template>
        </el-table-column>
      </el-table>
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
      <div class="right" v-if="total > 0">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :page-size="limit"
          :current-page.sync="page"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="规格添加"
      :visible.sync="dialogVisible"
      width="30%"
      top="5vh"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="dialogFormRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="1"
            :max="100"
            label="排序数"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="字段名" prop="fieldName">
          <el-input v-model="form.fieldName"></el-input>
        </el-form-item>
        <el-form-item label="属性名" prop="sort">
          <draggable
            v-model="spceTags"
            @update="datadragEnd"
            :options="{ animation: 200 }"
          >
            <el-tag
              :key="tag"
              class="tags"
              v-for="tag in spceTags"
              closable
              size="medium"
              :disable-transitions="false"
              @close="handleClose(tag)"
              >{{ tag }}</el-tag
            >
          </draggable>
          <span class="tag" v-if="spceTags.length > 0"></span>
          <el-input
            class="input-new-tag"
            v-if="tagVisible"
            v-model="tagValue"
            ref="saveTagInput"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag"
            type="primary"
            @click="showInput"
            >+</el-button
          >
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
import Service from "@/api/service";
export default {
  name: "specList",
  mixins: [mixinsTable],
  data() {
    return {
      listLoading: false,
      multipleSelection: [],
      spceTags: [],
      tagVisible: false,
      tagValue: "",
      form: {
        name: "",
        _id: "",
        sort: "",
        fieldName: "",
        tagValue: [],
        value: "",
      },
      dialogFormRules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    moduleService() {
      return new Service("/api/product/spec");
    },
  },
  created() {
    this.getList();
  },
  methods: {
    initForm(row) {
      if (row.value) {
        this.$set(this, "spceTags", row.value.split(","));
      }
      this.setFormVal(row);
    },
    FormClear() {
      this.$set(this.form, "name", "");
      this.$set(this.form, "value", "");
      this.$set(this.form, "_id", "");
      this.$set(this.form, "fieldName", "");
      this.$set(this.form, "tagValue", "");
      this.$set(this.form, "sort", "");
      this.$set(this, "spceTags", []);
    },
    async datadragEnd(evt) {
      evt.preventDefault();
      let arr = this.spceTags;
      // console.log('拖动前的索引 :' + evt.oldIndex)
      // console.log('拖动后的索引 :' + evt.newIndex)
      let newArr = await arr.map((item, i) => {});
      console.log(this.spceTags);
    },
    submitData() {
      this.$set(this.form, "tagValue", this.spceTags);
      this.$set(this.form, "value", this.spceTags.join(","));
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
    showInput() {
      this.tagVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(tag) {
      this.spceTags.splice(this.spceTags.indexOf(tag), 1);
    },
    handleInputConfirm() {
      const tagValue = this.tagValue;
      if (tagValue) {
        this.spceTags.push(tagValue);
      }
      this.tagVisible = false;
      this.tagValue = "";
    },
  },
};
</script>
<style lang="less" scoped>
.spec-body {
  margin: -25px 0;
}
.tag {
  display: inline-block;
}
.tags {
  margin-right: 10px;
  margin-bottom: 8px;
  height: 30px;
  line-height: 30px;
  cursor: move;
}
.button-new-tag {
  height: 30px;
  // line-height: 30p;
  display: inline-flex;
  align-items: center;
  position: relative;
  top: -1px;
}
.input-new-tag {
  width: 90px;
  height: 30px;
  position: relative;
}
</style>
