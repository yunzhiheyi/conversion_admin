<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <to-link :val="$route.meta.btnList.backup" @to="mongodump">
          <el-button type="success">立即备份</el-button>
        </to-link>
      </div>
    </div>
    <div class="_list">
      <el-table
        highlight-current-row
        ref="tableRow"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
        :data="dataList"
        :height="$tools.tableHeight()"
        style="width: 100%"
        v-loading.body="listLoading"
      >
        <el-table-column width="15"> </el-table-column>
        <el-table-column label="数据名称" width="220">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="数据路径">
          <template slot-scope="scope">
            <el-tag size="medium" type="info"> {{ scope.row.path }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备份时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <to-link
              :val="$route.meta.btnList.restore"
              @to="handleRestore(scope.row)"
            >
              <el-button type="text">恢复</el-button>
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
import request from '@/utils/axios'
import Request from "@/api/request";
import Upload from '@/components/Upload'
export default {
  name: 'database',
  mixins: [mixinsTable],
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.apassword === '') {
        callback(new Error('请再次输入密码'))
      } else if (this.apassword !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      servicePath: '/api/admin/system/database',
      rolesList: [],
      apassword: '',
      form: {
        _id: '',
        username: '',
        password: '',
        database: '',
        power: ''
      },
      dialogFormRules: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        database: [
          { required: true, message: '数据库不能为空', trigger: 'blur' }
        ],
        apassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Upload
  },
  computed: {
    _rolesList() {
      return request({
        url: '/api/admin/role/list',
        method: 'get'
      })
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 立即备份
    mongodump(){
      this.listLoading = true;
       Request.post({
        url: "/api/admin/system/mongodump",
        params: {},
      }).then((res) => {
        this.listLoading = false;
         this.getList()
      });
    },
    // 数据恢复
    handleRestore(data) {
       this.listLoading = true;
       Request.get({
        url: "/api/admin/system/mongorestore",
        params: {
          id:data._id
        },
      }).then((res) => {
        this.listLoading = false;
        this.$message.success("数据恢复成功");
      });
    },
    tableRowClassName({ row }) {
      if (row.isLock) {
        return 'warning-row'
      }
      return ''
    },
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
</style>
