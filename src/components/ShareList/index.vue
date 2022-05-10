<template>
  <div class="table-container-price">
    <div class="_list order" style="margin-top: 15px">
      <el-table
        highlight-current-row
        ref="tableRow"
        @selection-change="handleSelectionChange"
        :data="dataList"
        style="width: 100%"
        v-loading.body="listLoading"
      >
        <el-table-column label="用户头像">
          <template slot-scope="scope">
            <div class="user_info">
              <span class="thumbnail"
                ><img
                  :src="
                    scope.row.avatar
                      ? scope.row.avatar
                      : 'https://cdn.maxbox.com.cn/upload/images/icon-avatar.png'
                  "
              /></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="是否关注公众号" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isConcern ? 'success' : 'warning'">
              {{ scope.row.isConcern ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否绑定微信" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.is_bind_wechat && scope.row.avatar
                  ? 'success'
                  : 'warning'
              "
            >
              {{ scope.row.is_bind_wechat && scope.row.avatar ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="剩余时间">
          <template slot-scope="scope">
            {{ scope.row.remaining_time | formatSeconds }}
          </template>
        </el-table-column>
        <el-table-column label="加入时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="最后一次登录时间">
          <template slot-scope="scope">
            {{ scope.row.last_login_time | formatDate }}
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
  name: "ShareList",
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: "/api/admin/appuser/share",
    };
  },
  props: {
    invitee_code: {
      type: String,
    },
  },
  computed: {},
  mounted() {
    this.params.invitee_code = this.invitee_code;
    this.getList();
  },
  methods: {},
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

.user_info {
  padding: 10px 0;
  overflow: hidden;
  .thumbnail {
    width: 40px;
    height: 40px;
    float: left;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .info {
    overflow: hidden;
    padding-left: 10px;
  }
}
</style>
