<template>
  <div class="app-container">
    <div class="_list" style="margin-top: 15px">
      <el-table
        highlight-current-row
        ref="tableRow"
        @selection-change="handleSelectionChange"
        :data="dataList"
        :height="$tools.tableHeight()"
        style="width: 100%"
        v-loading.body="listLoading"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="留言内容" width="480">
          <template slot-scope="scope">
            <div class="user_info">
              <span class="thumbnail"><img :src="scope.row.avatar" /></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="电话">
          <template slot-scope="scope">
            {{ scope.row.province + "-" + scope.row.city }}
          </template>
        </el-table-column>
        <el-table-column label="留言时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <to-link
              :val="$route.meta.btnList.delete"
              @to="handleDelete(scope.row)"
            >
              <el-button type="primary">删除</el-button>
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
          :current-page.sync="page"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import mixinsTable from "@/utils/mixins.table";
import Upload from "@/components/Upload";
export default {
  name: "messageList",
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: "/api/message/list",
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
