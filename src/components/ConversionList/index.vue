<template>
  <div class="table-container-price">
    <div class="_list order" style="margin-top: 15px">
      <el-table
        highlight-current-row
        :data="dataList"
        style="width: 100%"
        v-loading.body="listLoading"
      >
        <el-table-column label="视频信息">
          <template slot-scope="scope">
            <div class="metaInfo">
              <div class="rows">文件名：{{ scope.row.metaInfo.fileName }}</div>
              <div class="rows">
                时长：{{ scope.row.metaInfo.duration | formatSeconds }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文本">
          <template slot-scope="scope">
            <div class="content">
              <el-popover
                placement="right"
                width="350"
                trigger="hover"
                v-if="scope.row.taskText && scope.row.taskText.length > 10"
              >
                <div class="con">{{ scope.row.taskText }}</div>
                <div slot="reference" class="reference">
                  {{ scope.row.taskText }}
                </div>
              </el-popover>
              <div v-else class="reference">{{ scope.row.taskText }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div class="tags">
              <el-tag v-if="scope.row.taskStatus === 3" type="success">
                已转换
              </el-tag>
              <el-tag v-if="scope.row.taskStatus === 2" type="success">
                转换失败
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <div class="right" v-if="total > 1">
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
  </div>
</template>
<script>
import mixinsTable from "@/utils/mixins.table";
export default {
  name: "ConversionList",
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: "/api/admin/appuser/conversion",
    };
  },
  props: {
    user_id: {
      type: String,
    },
  },
  computed: {},
  mounted() {
    console.log(this.user_id);
    this.params.user_id = this.user_id;
    this.getList();
  },
  methods: {
    openDrawerVisible() {
      this.dialogVisible = true;
      this.FormClear();
    },
    FormClear() {
      this.dialogState = "create";
      this.form = {
        _id: null,
        name: "",
        payment_price: "",
        sort: null,
        expir_time: null,
        type: null,
        product_code: "",
        isRecommended: false,
      };
    },
    editDrawerVisible(row) {
      this.dialogState = "update";
      this.form = {
        _id: row._id,
        name: row.name,
        payment_price: row.payment_price,
        sort: row.sort,
        expir_time: row.expir_time,
        type: row.type,
        product_code: row.product_code,
        isRecommended: row.isRecommended,
      };
      this.dialogVisible = true;
    },
    submitData() {
      // 查找id
      this.form.expir_time = Number(this.form.expir_time);
      this.form.payment_price = Number(this.form.payment_price);
      if (this.dialogState === "create") {
        delete this.form._id;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.tags {
  padding: 12px 0;
}
.metaInfo {
  padding: 5px 0;
  text-align: left;
}
.content {
  .reference,
  .reference p {
    display: block;
    height: 40px;
    line-height: 40px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
