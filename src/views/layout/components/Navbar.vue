<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"
    ></hamburger>
    <breadcrumb></breadcrumb>
    <div class="_admin">
      <span class="item-dot" @click="toggleNotification">
        <el-badge v-if="isBell" is-dot lass="item">
          <i class="el-icon-bell"></i>
        </el-badge>
        <el-badge v-else class="item">
          <i class="el-icon-bell"></i>
        </el-badge>
      </span>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src="/images/avatar.gif" />
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <span class="admin-name"
            >{{ userInfo.name }}<br /><em class="red">{{
              userInfo.rolesName
            }}</em></span
          >
          <el-dropdown-item divided>
            <span @click="togglePassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>
<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import Breadcrumb from "@/components/Breadcrumb";
export default {
  components: {
    Hamburger,
    Breadcrumb,
  },
  computed: {
    ...mapGetters(["userInfo", "sidebar", "isBell"]),
  },
  methods: {
    togglePassword() {
      this.$store.dispatch("togglePassword");
    },
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("toggleNotification", "close");
      this.$store.dispatch("LogOut").then(() => {
        location.reload();
      });
    },
    toggleNotification() {
      this.$store.dispatch("toggleNotification");
    },
  },
};
</script>
<style  lang="less" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background-color: #4c5765;
  ._admin {
    float: right;
    margin-right: 15px;
    .item-dot {
      position: relative;
      cursor: pointer;
    }
    .el-badge {
      height: 18px;
    }
    .item-dot {
      margin-right: 15px;
    }
    .el-icon-bell {
      color: #fff;
      font-size: 20px;
      vertical-align: top;
    }
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      line-height: 20px;
      .user-avatar {
        width: 21px;
        height: 21px;
        position: relative;
        border-radius: 3px;
      }
      .el-icon-caret-bottom {
        vertical-align: top;
        margin-top: 5px;
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
.user-dropdown {
  .admin-name {
    font-size: 14px;
    color: #333;
    display: block;
    line-height: 20px;
    margin-top: -5px;
    padding: 0 20px 5px;
    .red {
      color: #ff4d51;
      font-size: 12px;
      font-style: normal;
    }
  }
}
</style>
