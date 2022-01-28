<template>
  <div class="app-container">
    <div class="_list" style="margin-top: 15px">
      <el-table
        highlight-current-row
        ref="tableRow"
        @selection-change="handleSelectionChange"
        :data="dataList"
        style="width: 100%"
        v-loading.body="listLoading"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="用户头像" width="180">
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
        <el-table-column label="手机号">
          <template slot-scope="scope">
            {{ scope.row.mobile }}
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
            {{ scope.row.lastLogin | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
  </div>
</template>
<script lang="babel">
import mixinsTable from '@/utils/mixins.table'
export default {
  name: 'userList',
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: '/api/admin/appuser'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCurrentChange(val) {
      this.getList(val)
    },
    initForm(row) {
      this.$set(this.form, '_id', row._id)
      this.$set(this.form, 'username', row.username)
      this.form.power = row.power._id
    },
    FormClear() {
      this.$set(this.form, 'username', '')
      this.$set(this.form, 'password', '')
      this.$set(this, 'apassword', '')
    }
  }
}

</script>
<style lang="less">
.el-table {
  .warning-row {
    background-color: #f3f3f3;
    color: #c3bfbf;
  }
}
.user_info {
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
