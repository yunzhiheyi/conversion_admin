<template>
  <div class="table-container-price">
    <div class="table-form">
      <div>
        <el-button @click="openDrawerVisible" type="success"
          >添加价格</el-button
        >
      </div>
    </div>
    <div class="_list order" style="margin-top: 15px">
      <el-table
        highlight-current-row
        @selection-change="handleSelectionChange"
        :data="dataList"
        style="width: 100%"
        v-loading.body="listLoading"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="价格名称">
          <template slot-scope="scope"> {{ scope.row.name }} </template>
        </el-table-column>
        <el-table-column label="价格金额">
          <template slot-scope="scope">
            <span v-if="scope.row.payment_price">
              {{ scope.row.payment_price }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column label="排序">
          <template slot-scope="scope">
            <span v-if="scope.row.sort">
              {{ scope.row.sort }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span v-if="scope.row.expir_time">
              {{ scope.row.expir_time }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="product_code" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.product_code">
              {{ scope.row.product_code }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="是否推荐">
          <template slot-scope="scope">
            <div class="tags">
              <el-tag v-if="scope.row.isRecommended" type="success">
                是
              </el-tag>
              <el-tag v-else type="danger"> 否 </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="editDrawerVisible(scope.row)"
              >编辑</el-button
            ><el-button type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
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
    <el-dialog
      title="价格添加"
      :visible.sync="dialogVisible"
      width="400px"
      top="5vh"
      append-to-body
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="dialogFormRules"
        label-width="100px"
      >
        <el-form-item label="价格名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格金额" prop="isChild">
          <el-input v-model="form.payment_price"></el-input>
        </el-form-item>
        <el-form-item label="排序数" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="1"
            :max="100"
            label="排序数"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="时间" prop="expir_time">
          <el-input type="input" v-model="form.expir_time"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input type="input" v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="isRecommended">
          <el-radio-group v-model="form.isRecommended">
            <el-radio :label="true" border>是</el-radio>
            <el-radio :label="false" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Product_code" prop="product_code">
          <el-input type="input" v-model="form.product_code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('dialogForm')"
            >确 定</el-button
          >
        </el-form-item>
        <div style="height: 1px"></div>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('dialogForm')"
          >确 定</el-button
        >
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import mixinsTable from "@/utils/mixins.table";
export default {
  name: "DrawerPrice",
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: "/api/admin/price",
      dialogVisible: false,
      form: {
        _id: null,
        name: "",
        payment_price: "",
        sort: null,
        expir_time: null,
        type: null,
        product_code: "",
        isRecommended: false,
      },
    };
  },
  computed: {},
  mounted() {
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
</style>
