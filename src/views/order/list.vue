<template>
  <div class="app-container">
    <div class="table-form">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="statusValue"
            placeholder="请选择"
            style="width: 100px"
            @change="selectStateWeach"
          >
            <el-option label="全部" value="-1"></el-option>
            <el-option label="支付成功" value="PAY_SUCCESS"></el-option>
            <el-option label="支付关闭" value="TRADING_HALT"></el-option>
            <el-option label="支付中" value="ING_PAYMENT"></el-option>
            <el-option label="支付失败" value="FAILURE_PAYMENT"></el-option>
            <el-option label="支付超时" value="TIME_OUT_HALT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            type="input"
            placeholder="请输入订单编号"
            v-model="search_order_sn"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="_search" type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="_list order">
      <el-table
        highlight-current-row
        @selection-change="handleSelectionChange"
        :data="dataList"
        :height="$tools.tableHeight()"
        style="width: 100%"
        v-loading.body="listLoading"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="订单ID" width="180">
          <template slot-scope="scope"> {{ scope.row._id }} </template>
        </el-table-column>
        <el-table-column label="外部订单号" width="260">
          <template slot-scope="scope">
            <span v-if="scope.row.transaction_id">
              {{ scope.row.transaction_id }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="用户手机号" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.user_id && scope.row.user_id.mobile">
              {{ scope.row.user_id.mobile }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="订单信息" width="180">
          <template slot-scope="scope">
            <div class="orderInfo">
              <span
                v-if="
                  scope.row.product_code && scope.row.product_code.expir_time
                "
              >
                购买{{ scope.row.product_code.expir_time | formatSeconds }}时长
              </span>
              <span v-else>--</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="总金额">
          <template slot-scope="scope">
            <span
              class="price"
              v-if="
                scope.row.product_code && scope.row.product_code.payment_price
              "
            >
              ￥{{ scope.row.product_code.payment_price / 100 }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'PAY_SUCCESS'" type="success">
              支付成功
            </el-tag>
            <el-tag v-if="scope.row.status === 'TRADING_HALT'" type="danger">
              支付关闭
            </el-tag>
            <el-tag v-if="scope.row.status === 'ING_PAYMENT'"> 支付中 </el-tag>
            <el-tag
              v-if="scope.row.status === 'FAILURE_PAYMENT'"
              type="warning"
            >
              支付失败
            </el-tag>
            <el-tag v-if="scope.row.status === 'TIME_OUT_HALT'" type="warning">
              支付超时
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="超时时间" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.timeout_time">
              {{ scope.row.timeout_time | formatDate }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="payment_time" label="支付完成时间" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.payment_time">
              {{ scope.row.payment_time | formatDate }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="close_time" label="订单关闭时间" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.close_time">
              {{ scope.row.close_time | formatDate }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <to-link
              :val="$route.meta.btnList.delete"
              @to="handleDelete(scope.row)"
            >
              <el-button type="text">删除</el-button>
            </to-link>
          </template>
        </el-table-column> -->
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
    <order-details v-model="dialogVisible" :details="details"></order-details>
    <shipping
      v-model="shippingDialogVisible"
      :isShipping="isShipping"
      v-if="shippingDialogVisible"
    ></shipping>
  </div>
</template>
<script>
import mixinsTable from "@/utils/mixins.table";
import orderDetails from "./details";
import shipping from "./shipping";
import { mapGetters } from "vuex";
export default {
  name: "orderList",
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: "/api/admin/order",
      search_order_sn: "",
      isShipping: false,
      shipping_info: {},
      details: {
        order_goods: {},
        order_shipping: {},
        other: {
          post_fee: null,
          status: null,
          createdAt: null,
          payment_time: null,
          consign_time: null,
          end_time: null,
        },
        shipping_info: {
          shipping_name: "",
          shipping_code: "",
        },
      },
      statusValue: "-1",
      shippingDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters(["msgData"]),
  },
  components: {
    orderDetails,
    shipping,
  },
  watch: {
    msgData: function (data, oldVal) {
      if (data.isMsg && data.type === 2) {
        this.getList();
        this.$store.dispatch("setMsg", {
          isMsg: false,
          type: data.type,
        });
      }
    },
  },
  created() {
    this.getList();
  },
  // 点击列表刷新数据
  watch: {
    $route: function (val) {
      if (val) {
        this.statusValue = "1";
        this.search_order_sn = "";
        this.params = {
          page: 1,
        };
        this.getList();
      }
    },
  },
  methods: {
    // 确认信息
    confirmInfo(row) {
      this.moduleService.update({ _id: row._id, status: 30 }).then((res) => {
        this.getList(this.params.page);
      });
    },
    handleCurrentChange(val) {
      this.getList(val);
    },
    initForm(row) {
      this.$set(this.details, "order_goods", row.order_goods);
      this.$set(this.details, "order_shipping", row.order_shipping);
      this.$set(this.details, "other", {
        post_fee: row.post_fee,
        status: row.status,
        createdAt: row.createdAt,
        payment_time: row.payment_time,
        consign_time: row.consign_time,
        end_time: row.end_time,
      });
      const shipping_info = {
        _id: row._id,
        status: 40,
        shipping_name: row.shipping_name,
        shipping_code: row.shipping_code,
        consign_time: new Date(),
      };
      this.$store.dispatch("setShipping", shipping_info); // 设置物流信息
    },
    openShipping(row) {
      const shipping_info = {
        _id: row._id,
        status: 40,
        shipping_name: row.shipping_name,
        shipping_code: row.shipping_code,
        consign_time: new Date(),
      };
      this.$store.dispatch("setShipping", shipping_info); // 设置物流信息
      this.shippingDialogVisible = true;
    },
    FormClear() {},
    // 按订单状态搜索
    selectStateWeach(val) {
      this.search_order_sn = "";
      delete this.params.order_id;
      if (val !== "-1") {
        this.params.status = val;
      } else {
        delete this.params.status;
      }
      this.getList();
    },
    // 按订单号搜索
    _search() {
      delete this.params.status;
      if (this.search_order_sn.length > 0) {
        this.params.keyword = this.search_order_sn;
      } else {
        delete this.params.keyword;
      }
      if (this.statusValue != "-1") {
        this.params.status = this.statusValue;
      }
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
.price {
  color: red;
}
.table-form {
  padding: 15px 0 0 0;
  .el-form-item--small.el-form-item {
    margin-bottom: 15px;
  }
}
.el-table td {
  border: 1px solid #ebeef5;
}
.orderInfo {
  padding: 12px 0;
}
.product_info {
  padding: 10px;
  overflow: hidden;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  margin: 0 -10px;
  &:last-child {
    border-bottom: none;
  }
  .thumbnail {
    width: 50px;
    height: 50px;
    float: left;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .info {
    overflow: hidden;
    padding-left: 10px;

    ._name {
      display: block;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
