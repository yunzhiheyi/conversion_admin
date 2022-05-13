<template>
  <div class="login-container">
    <el-form autoComplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="card-box login-form">
      <h3 class="title">
        <img src="/images/logo.png"
          width="60" />
      </h3>
      <el-form-item prop="username">
        <div class="input">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="admin" />
          </span>
          <div class="input-text">
            <el-input name="username"
              type="text"
              v-model="loginForm.username"
              autoComplete="on"
              placeholder="请输入用户名" />
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="password">
        <div class="input">
          <span class="svg-container svg-container_password">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <div class="input-text">
            <el-input name="password"
              :type="pwdType"
              @keyup.enter.native="handleLogin"
              v-model="loginForm.password"
              autoComplete="on"
              placeholder="请输入密码"></el-input>
          </div>
          <span class="show-pwd"
            @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </div>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <div class="input">
          <span class="svg-container svg-container_verifyCode">
            <svg-icon icon-class="verifyCode"></svg-icon>
          </span>
          <div class="verifyCode">
            <el-input size="small"
              @keyup.enter.native="handleLogin"
              v-model="loginForm.verifyCode"
              auto-complete="off"
              placeholder="验证码">
            </el-input>
          </div>
          <div class="login-code"
            v-if="verifyCodeImage">
            <div class="login-code-img"
              @click="refreshCode"
              v-html="verifyCodeImage"></div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          style="width: 100%"
          :loading="loading"
          size="medium"
          @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>
      <div class="copyright">
        <span>©2018-2022</span>成都市云智合一科技有限公司
      </div>
    </el-form>
  </div>
</template>
<script>
import adminApi from "@/api/admin";
export default {
  name: "login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        verifyCode: "",
      },
      verifyCodeImage: "",
      loginRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
        verifyCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
        ],
      },
      loading: false,
      pwdType: "password",
    };
  },
  created() {
    this.refreshCode();
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    refreshCode() {
      console.log(adminApi);
      adminApi.getCaptcha().then((res) => {
        if (res) {
          this.verifyCodeImage = res;
        }
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then((res) => {
              this.loading = false;
              if (res.data) {
                this.$message({ message: "登录成功！", type: "success" });
                this.$router.push({ path: "/dashboard" });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style  lang="less">
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: @bg;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: @light_gray;
    height: 47px;
  }
  .svg-container_login,
  .svg-container_password {
    position: relative;
  }
  .svg-container_login {
    top: 5px;
  }
  .svg-container_password {
    left: 3px;
    top: 3px;
  }
  .svg-container_verifyCode {
    position: relative;
    left: 2px;
    top: 3px;
  }
  .copyright {
    color: #a2a2a6;
    font-size: 12px;
    text-align: center;
    margin-top: 36px;
    span {
      color: #eee;
      margin-right: 10px;
    }
  }
  .el-input {
    display: inline-block;
    width: 85%;
  }
  .input-text {
    flex: 1;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: normal;
    color: #d8d8da;
    margin: 0px auto 40px auto;
    text-align: center;
    text-shadow: 1px 6px 9px #232325;
    img {
      vertical-align: -8px;
      margin-right: 10px;
    }
    span {
      margin: 2px;
    }
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .show-pwd {
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    margin-right: 10px;
    margin-top: 5px;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.login-code-img {
  margin-top: -2px;
  margin-right: 8px;
  width: 110px;
  height: 38px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  cursor: pointer !important;
}
.verifyCode {
  padding: 8px 0;
  flex: 1;
}
.input {
  height: 50px;
  display: flex;
  align-items: center;
}
</style>
