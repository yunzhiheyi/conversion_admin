<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <to-link :val="$route.meta.btnList.add" @to="handleOpen">
          <el-button type="primary">添加角色</el-button>
        </to-link>
      </div>
    </div>
    <div class="_list">
      <el-table
        highlight-current-row
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
        <el-table-column label="角色名称" width="180">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="角色介绍">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <to-link
              :val="$route.meta.btnList.edit"
              @to="handleUpdata(scope.row)"
            >
              <el-button type="text">编辑</el-button>
            </to-link>
            <to-link
              v-if="!scope.row.isLock"
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
    <el-dialog
      title="角色添加"
      :visible.sync="dialogVisible"
      width="400px"
      top="5vh"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="dialogFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" prop="description">
          <el-input
            type="textarea"
            :disabled="isDisabled"
            v-model="form.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="1"
            :max="10"
            label="排序数"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="角色权限" prop="sort">
          <el-tree
            class="treePower"
            node-key="_id"
            check-strictly
            accordion
            :data="powerList"
            ref="tree"
            :props="props"
            :default-checked-keys="form.power"
            show-checkbox
            :expand-on-click-node="false"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit('dialogForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script lang="babel">
import mixinsTable from '@/utils/mixins.table'
import request from '@/utils/axios'
export default {
  name: 'rolesList',
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: '/api/admin/role/',
      powerList: [],
      form: {
        _id: '',
        name: '',
        description: '',
        sort: '',
        power: []
      },
      props: {
        value: '_id',
        label: 'label'
      },
      dialogFormRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色介绍不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
 
  created() {
    this.getPowerList();
    this.getOptionList()
    this.getList()
  },
  methods: {
    async getPowerList() {
     var res = await request({
        url: '/api/admin/menu/list',
        method: 'get',
        params: {
          _btn:'1'
        }
      })
      this.powerList = res.data.result
    },
    tableRowClassName({ row }) {
      if (row.isLock) {
        return 'warning-row'
      }
      return ''
    },
    submitData() {
      var _checked = this.$refs.tree.getCheckedNodes()
      const checkedList = _checked.map(item => {
        return item._id
      })
      this.form.power = checkedList
    },
    initForm(row) {
      this.$set(this.form, '_id', row._id)
      this.$set(this.form, 'name', row.name)
      this.$set(this.form, 'description', row.description)
      this.$set(this.form, 'sort', row.sort)
      this.form.power = row.power
      setTimeout(() => {
        this.$refs.tree && this.$refs.tree.setCheckedKeys(row.power);
      }, 0)
    },
    // setChecked(powerList) {
    // powerList && powerList.length> 0 && powerList.map((item)=>{
    //     this.$refs.tree && this.$refs.tree.setChecked(item._id,true,false);
    //     item.children && this.setChecked(item.children);
    //   })
    // },
    checkSelectable(row) {
      return !row.isLock
    },
    FormClear() {
      this.$set(this.form, '_id', '')
      this.$set(this.form, 'name', '')
      this.$set(this.form, 'description', '')
      this.$set(this.form, 'sort', '')
      this.form.power = []
      setTimeout(() => {
         this.$refs.tree && this.$refs.tree.setCheckedKeys([])
      }, 0)
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
.treePower .el-tree-node__content {
  height: 28px;
}
.treePower .el-tree-node__content .el-tree-node__label {
  font-size: 13px;
}
</style>
