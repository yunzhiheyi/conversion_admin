<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <to-link :val="$route.meta.btnList.add" @to="handleOpen">
          <el-button type="primary">添加</el-button>
        </to-link>
      </div>
      <div class="right">
        <el-radio-group v-model="search_type" @change="search_type_value">
          <el-radio-button border :key="`0`" :label="`0`">全部</el-radio-button>
          <el-radio-button
            border
            v-for="item in ad_type"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </div>
    </div>
    <div class="_list">
      <el-table
        highlight-current-row
        @selection-change="handleSelectionChange"
        :data="dataList"
        style="width: 100%"
        :height="$tools.tableHeight()"
        v-loading.body="listLoading"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="图片" width="220">
          <template slot-scope="scope">
            <div class="thumbnail">
              <img :src="scope.row.img_path" width="160" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="广告名称" width="180">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="广告类型" width="180">
          <template slot-scope="scope">
            {{ scope.row.ad_type === "1" ? "轮播" : "广告" }}
          </template>
        </el-table-column>
        <el-table-column label="广告连接" width="240">
          <template slot-scope="scope">
            {{ scope.row.link }}
          </template>
        </el-table-column>
        <el-table-column label="广告描述">
          <template slot-scope="scope">
            {{ scope.row.describe }}
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
      title="广告添加"
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
        <el-form-item label="广告名称" prop="name">
          <el-input v-model="form.name"></el-input>
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
        <el-form-item label="广告类型" prop="ad_type">
          <el-select v-model="form.ad_type" placeholder="请选择">
            <el-option
              v-for="item in ad_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告连接" prop="link">
          <el-input type="input" v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item label="广告描述" prop="describe">
          <el-input type="textarea" v-model="form.describe"></el-input>
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
  name: "powerList",
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: "/api/marketing/advertising",
      ad_type: [
        {
          value: "1",
          label: "轮播",
        },
        {
          value: "2",
          label: "广告",
        },
      ],
      search_type: "0",
      form: {
        _id: "",
        name: "",
        img_path: "",
        img_id: "",
        sort: "",
        link: "",
        ad_type: "",
        describe: "",
      },
      dialogFormRules: {
        name: [
          { required: true, message: "广告名称不能为空", trigger: "blur" },
        ],
        sort: [{ required: true, message: "排序数不能为空", trigger: "blur" }],
        img_path: [
          { required: true, message: "图片不能为空", trigger: "blur" },
        ],
        describe: [
          { required: true, message: "描述信息不能为空", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Upload,
  },
  created() {
    this.getOptionList();
    this.getList();
  },
  sockets: {
    connect() {
      console.log("socket connect");
    },
    news(val) {
      this.$notify.success(val);
    },
  },
  methods: {
    initForm(row) {
      this.setFormVal(row);
    },
    FormClear() {
      this.setFormVal(this.form);
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
    handleCurrentChange(val) {
      this.getList(val);
    },
    upload_success(val) {
      this.$set(this.form, "img_id", val.mid);
    },
    search_type_value(val) {
      if (val !== "0") {
        this.$set(this.params, "ad_type", val);
      } else {
        delete this.params.ad_type;
      }
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
</style>
