<template>
  <div class="_system">
    <el-form
      ref="submitInfo"
      :model="form"
      label-width="110px"
      :label-position="`top`"
      v-if="form.xcx"
    >
      <el-form-item label="小程序名称" prop="name">
        <el-input
          v-model="form.xcx.name"
          style="width: 400px; float: left; margin-right: 20px"
        ></el-input>
        <div class="tis">填写小程序名称</div>
      </el-form-item>
      <el-form-item label="小程序描述" prop="routerDescribe">
        <el-input
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.xcx.describe"
        ></el-input>
        <div class="tis">填写小程序描述</div>
      </el-form-item>
      <el-form-item label="小程序appid" prop="name">
        <el-input
          v-model="form.xcx.appid"
          style="width: 400px; float: left; margin-right: 20px"
        ></el-input>
        <div class="tis">填写小程序appid,商户ID和公众号APPID要绑定</div>
      </el-form-item>
      <el-form-item label="小程序appid" prop="name">
        <el-input
          v-model="form.xcx.secret"
          style="width: 400px; float: left; margin-right: 20px"
        ></el-input>
        <div class="tis">填写小程序secret</div>
      </el-form-item>
      <el-form-item label="小程序LOGO" prop="icon" v-if="thumbnail">
        <upload v-model="thumbnail" @upload-success="upload_success">
          <img :src="thumbnail" v-if="thumbnail" class="avatar" />
          <i class="el-icon-plus" v-if="!thumbnail"></i>
        </upload>
      </el-form-item>
      <el-form-item label="客服微信" prop="kefu">
        <el-input
          type="input"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.xcx.kefuwx"
        ></el-input>
        <div class="tis">填写客服微信</div>
      </el-form-item>
      <el-form-item label="客服电话" prop="kefu">
        <el-input
          type="input"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.xcx.tel"
        ></el-input>
        <div class="tis">填写客服电话</div>
      </el-form-item>
      <el-form-item label="邮 箱" prop="tel">
        <el-input
          type="input"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.xcx.email"
        ></el-input>
        <div class="tis">填写邮箱</div>
      </el-form-item>
      <el-form-item label="版权信息" prop="copyright">
        <el-input
          type="input"
          style="width: 400px; float: left; margin-right: 20px"
          v-model="form.xcx.copyright"
        ></el-input>
        <div class="tis">版权信息</div>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button
        type="primary"
        style="margin-top: 10px"
        @click="submitInfo('submitInfo')"
        >确 定</el-button
      >
    </div>
  </div>
</template>
<script>
import Upload from "@/components/Upload";
import _mixins from "./mixins";
export default {
  name: "xiaochengxu",
  mixins: [_mixins],
  components: {
    Upload,
  },
  methods: {
    upload_success(val) {
      this.$set(this.form.xcx, "img_id", val.mid);
    },
  },
};
</script>
