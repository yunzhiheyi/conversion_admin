<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <el-button type="success">立即备份</el-button>
        <el-button type="primary">备份设置</el-button>
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
        <el-table-column
          type="selection"
          :selectable="checkSelectable"
          width="55"
        >
        </el-table-column>
        <el-table-column label="数据名称" width="180">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column label="备份时间">
          <template slot-scope="scope">
            {{ scope.row.power && scope.row.power.name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" v-if="!scope.row.isLock">恢复</el-button>
            <el-button type="text" v-if="!scope.row.isLock">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
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
  </div>
</template>
<script lang="babel">
import mixinsTable from '@/utils/mixins.table'
import request from '@/utils/axios'
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
      servicePath: '/api/admin/user',
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
    this._rolesList.then(res => {
      this.rolesList = res.data.result.map(item => {
        return {
          key: item._id,
          label: item.name,
          isLock: item.isLock
        }
      })
    })
    this.getOptionList()
    this.getList()
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.isLock) {
        return 'warning-row'
      }
      return ''
    },
    submitData() {
      if(this.dialogState === "create" ) {
        delete this.form._id;
      }
    },
    initForm(row) {
      this.$set(this.form, '_id', row._id)
      this.$set(this.form, 'username', row.username)
      this.$set(this.form, 'database', row.database)
      this.form.power = row.power._id
    },
    checkSelectable(row) {
      return !row.isLock
    },
    FormClear() {
      this.$set(this.form, 'username', '')
      this.$set(this.form, 'password', '')
      this.$set(this.form, 'database', '')
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
</style>
