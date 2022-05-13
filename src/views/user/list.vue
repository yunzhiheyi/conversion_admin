<template>
  <div class="app-container">
    <div class="table-form">
      <el-form :inline="true"
        class="demo-form-inline">
        <el-form-item>
          <el-input type="input"
            placeholder="请输入昵称"
            v-model="params.keyword"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search"
            type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="_list">
      <el-table highlight-current-row
        ref="tableRow"
        @selection-change="handleSelectionChange"
        :data="dataList"
        style="width: 100%"
        v-loading.body="listLoading">
        <el-table-column type="selection"
          width="55"> </el-table-column>
        <el-table-column label="用户头像"
          width="180">
          <template slot-scope="scope">
            <div class="user_info">
              <span class="thumbnail"><img :src="
                    scope.row.avatar
                      ? scope.row.avatar
                      : 'https://cdn.maxbox.com.cn/upload/images/icon-avatar.png'
                  " /></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="手机号">
          <template slot-scope="scope">
            {{ scope.row.mobile }}
          </template>
        </el-table-column> -->
        <el-table-column label="是否关注公众号"
          align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isConcern ? 'success' : 'warning'">
              {{ scope.row.isConcern ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否绑定微信"
          align="center">
          <template slot-scope="scope">
            <el-tag :type="
                scope.row.is_bind_wechat && scope.row.avatar
                  ? 'success'
                  : 'warning'
              ">
              {{ scope.row.is_bind_wechat && scope.row.avatar ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="平台类型"
          align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.systemType ? 'success' : 'warning'">
              {{ scope.row.systemType || "无" }}
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <to-link :val="$route.meta.btnList.delete"
              @to="handleDelete(scope.row)">
              <el-button type="text">删除</el-button>
            </to-link>
            <el-button type="text"
              @click="openCDrawerVisible(scope.row)">转换记录</el-button>
            <el-button type="text"
              @click="openSDrawerVisible(scope.row)">分享记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <div class="left">
        <to-link :val="$route.meta.btnList.batchdelete"
          @to="handleAll">
          <el-tooltip class="item"
            effect="dark"
            content="批量删除"
            placement="top">
            <el-button type="danger">批量删除</el-button>
          </el-tooltip>
        </to-link>
      </div>
      <div class="right"
        v-if="total > 0">
        <el-pagination @current-change="handleCurrentChange"
          background
          :page-size="limit"
          :current-page.sync="page"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-drawer :append-to-body="true"
      :visible.sync="drawerVisible"
      :with-header="false"
      size="60%">
      <conversion-list v-if="drawerVisible && drawerConversionVisible"
        :user_id="user_id" />
      <share-list v-if="drawerVisible && drawerShareVisible"
        :invitee_code="invitee_code" />
    </el-drawer>
  </div>
</template>
<script lang="babel">
import ConversionList from "@/components/ConversionList";
import ShareList from "@/components/ShareList";
import mixinsTable from '@/utils/mixins.table'
export default {
  name: 'userList',
  mixins: [mixinsTable],
  data() {
    return {
      drawerVisible: false,
      drawerConversionVisible:false,
      drawerShareVisible: false,
      user_id:'',
      invitee_code: '',
      servicePath: '/api/admin/appuser'
    }
  },
  created() {
    this.getList()
  },
  components:{
    ConversionList,
    ShareList
  },
  methods: {
    openCDrawerVisible(row) {
      this.drawerVisible= true;
      this.drawerConversionVisible = true;
      this.drawerShareVisible = false;
      this.user_id= row._id
    },
    openSDrawerVisible(row) {
      this.drawerVisible= true;
      this.drawerShareVisible = true;
      this.drawerConversionVisible = false;
      console.log(row.inviter_code);
      this.invitee_code= row.inviter_code
    },
    handleCurrentChange(val) {
      this.getList(val)
    },
    search() {
      this.page=1;
      this.getList()
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
.table-form {
  padding: 15px 0 0 0;
  .el-form-item--small.el-form-item {
    margin-bottom: 15px;
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
