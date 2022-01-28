<template>
  <div class="orderDetails">
    <el-dialog title="订单详情" :visible.sync="Visible" width="30%" top="5vh">
      <div class="goods">
        <div class="order_info">
          <el-row :gutter="10">
            <el-col :span="13">
              <span class="order_sn"
                >订单编号：{{ details.order_goods.order_id }}</span
              >
              <span class="time"
                >创建时间：{{ details.other.createdAt | formatDate }}</span
              >
              <span class="time" v-if="details.other.payment_time"
                >付款时间：{{ details.other.payment_time | formatDate }}</span
              >
              <span class="time" v-if="details.other.consign_time"
                >发货时间：{{ details.other.consign_time | formatDate }}</span
              >
              <span class="time" v-if="details.other.colse_time"
                >关闭时间：{{ details.other.colse_time | formatDate }}</span
              >
              <span class="time" v-if="details.other.end_time"
                >完成时间：{{ details.other.end_time | formatDate }}</span
              >
            </el-col>
            <el-col :span="11">
              <div class="order_state">
                订单状态：<span class="price">
                  {{
                    details.other.status == 10
                      ? "未付款"
                      : details.other.status == 20
                      ? "已付款"
                      : details.other.status == 30
                      ? "未发货"
                      : details.other.status == 40
                      ? "已发货"
                      : details.other.status == 50
                      ? "已完成"
                      : "已关闭"
                  }}</span
                >
              </div>
            </el-col>
          </el-row>
        </div>
        <h3><span class="s">商品信息</span></h3>
        <div class="goods_info">
          <template v-for="(item, key) in details.order_goods.goodsInfo">
            <div class="shop" :key="key">
              <span class="thumbnail">
                <img :src="item.thumbnail" alt="" />
              </span>
              <div class="info">
                <div class="name">{{ item.name }}</div>
                <div class="color">
                  <span class="l">{{ item.attribute }}</span
                  ><span class="r">x{{ item.num }}</span>
                </div>
                <div class="num">
                  <span class="price">￥{{ item.promo_price | toFixed }}</span>
                </div>
              </div>
            </div>
          </template>
          <div class="total_" :key="key">
            <div class="item">
              商品总金额：<span class="price">￥{{ total | toFixed }}</span>
            </div>
            <div class="item">
              邮费：<span class="price"
                >￥{{ details.other.post_fee | toFixed }}</span
              >
            </div>
            <div class="item">
              总金额：<span class="price"
                >￥{{ (total + details.other.post_fee) | toFixed }}</span
              >
            </div>
          </div>
        </div>
        <h3 v-if="details.order_shipping"><span class="s">收货信息</span></h3>
        <div class="receiver_info" v-if="details.order_shipping">
          <ul>
            <li>
              <span class="name">收货人</span>
              <p>
                {{ details.order_shipping && details.order_shipping.userName }}
              </p>
            </li>
            <li>
              <span class="name">收货人电话</span>
              <p>
                {{ details.order_shipping && details.order_shipping.telNumber }}
              </p>
            </li>
            <li>
              <span class="name">收货人地址</span>
              <p>
                {{
                  details.order_shipping &&
                  details.order_shipping.provinceName +
                    details.order_shipping.cityName +
                    details.order_shipping.countyName +
                    details.order_shipping.detailInfo
                }}
              </p>
            </li>
            <li>
              <span class="name">邮编</span>
              <p>
                {{
                  details.order_shipping && details.order_shipping.postalCode
                }}
              </p>
            </li>
          </ul>
        </div>
        <h3 v-if="details.shipping_info">
          <span class="s">物流信息</span>&nbsp;&nbsp;[<span
            class="edit"
            @click="editShippingInfo"
            >修改</span
          >]
        </h3>
        <div class="shipping_info" v-if="shipping">
          <el-row :gutter="10">
            <el-col :span="12">
              物流名称：{{ shipping && shipping.shipping_name }}
            </el-col>
            <el-col :span="12">
              物流单号：{{ shipping && shipping.shipping_code }}
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "orderDetails",
  data() {
    return {};
  },
  props: {
    details: {
      type: Object,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["shipping"]),
    Visible: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
    total() {
      var _total = 0;
      if (this.details && this.Visible) {
        this.details.order_goods.goodsInfo.map((item) => {
          _total += item.promo_price * item.num;
        });
      }
      return _total;
    },
  },
  methods: {
    editShippingInfo() {
      this.$parent.isShipping = true;
      this.$parent.shippingDialogVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
.goods {
  margin-top: -30px;
  overflow: hidden;
  .price {
    color: red;
  }
  h3 {
    font-size: 14px;
    font-weight: normal;
    span.s {
      border-bottom: 1px solid #666;
      padding: 5px 0;
    }
    .edit {
      color: #ff4d51;
      cursor: pointer;
    }
  }
  .order_info {
    font-size: 14px;
    .time {
      font-size: 12px;
      display: block;
      text-align: left;
      color: #adacac;
      margin-top: 10px;
    }
    .order_state {
      text-align: right;
      // margin-top: 10px;
    }
    .order_sn {
      margin-top: 10px;
      text-align: left;
    }
  }
  .goods_info {
    border: 1px solid #eee;
    font-size: 13px;
    .shop {
      padding: 10px;
      overflow: hidden;
      border-bottom: 1px solid #eee;
    }
    .thumbnail {
      width: 60px;
      height: 60px;
      float: left;
      img {
        width: 60px;
        height: 60px;
      }
    }
    .info {
      overflow: hidden;
      padding-left: 15px;
      .name {
        height: 14px;
        line-height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgb(78, 78, 78);
      }
      .color {
        margin: 6px 0;
        overflow: hidden;
      }
      .num {
      }
      .r {
        float: right;
        color: #c5c2c2;
      }
      .l {
        color: #868686;
        float: left;
      }
    }
    .total_ {
      text-align: right;
      font-size: 12px;
      line-height: 26px;
      padding: 10px 0;
      .item {
        padding-right: 15px;
        span {
          font-size: 14px;
        }
      }
    }
  }
  .shipping_info {
    padding: 10px 0 20px 0;
  }
  .receiver_info {
    li {
      border: 1px solid #eee;
      margin-top: -1px;
      .name {
        float: left;
        width: 100px;
        line-height: 45px;
        text-indent: 10px;
        border-right: 1px solid #eee;
      }
      p {
        overflow: hidden;
        line-height: 45px;
        text-indent: 10px;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
