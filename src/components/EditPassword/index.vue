<template>
  <div class="editPassword">
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="25%"
      top="10vh"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="dialogFormRules"
        label-width="75px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="apassword">
          <el-input type="password" v-model="apassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="babel">
import { mapGetters } from 'vuex'
import Service from '@/api/service'
export default {
  name: 'Editpassword',
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
      servicePath: '/api/system/user',
      apassword: '',
      form: {
        _id: '',
        password: ''
      },
      dialogFormRules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        apassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'isEditPassword',
      'userInfo'
    ]),
    dialogVisible: {
      get: function() {
        return this.isEditPassword
      },
      set: function(val) {
        this.$store.dispatch('togglePassword')
      }
    },
    moduleService(servicePath) {
      return new Service(this.servicePath)
    }
  },
  methods: {
    handleCancel() {
      this.$store.dispatch('togglePassword')
    },
    handleSubmit() {
      this.listLoading = true
      const options = {
        _id: this.userInfo.uid,
        password: this.form.password
      }
      if (this.form.password === '' || !this.apassword === '') {
        this.$message.warning('密码不能为空')
        return
      }
      this.moduleService.update(options).then(res => {
        this.$store.dispatch('togglePassword')
        this.listLoading = false
        this.$message.success('修改成功,请退出重新登录')
      })
    }
  }
}
</script>
