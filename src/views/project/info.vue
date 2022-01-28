<template>
  <div class="app-container">
    <div class="wpm">
      <div class="table-form">
        <el-form
          :model="projectInfo"
          :rules="rules"
          ref="projectInfo"
          label-width="120px"
        >
          <el-form-item label="专题名称" prop="name">
            <el-input
              placeholder="请输入专题名称"
              v-model="projectInfo.name"
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="专题描述" prop="describe">
            <el-input
              type="textarea"
              row="5"
              placeholder="请输入文章描述"
              v-model.number="projectInfo.describe"
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="缩略图" prop="img_path">
            <upload
              v-model="projectInfo.thumbnail"
              :file-data="uploadData"
              @upload-success="upload_success"
            >
              <img
                :src="projectInfo.thumbnail"
                v-if="projectInfo.thumbnail"
                class="avatar"
              />
              <i class="el-icon-plus" v-if="!projectInfo.thumbnail"></i>
            </upload>
          </el-form-item>
          <el-form-item label="内容详情" prop="content">
            <ueditor
              v-model="projectInfo.content"
              :config="config"
              @ready="thumbReady"
              :goods-thumb-list="goodsThumbList"
            ></ueditor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSave('projectInfo')"
              >确 定</el-button
            >
            <el-button @click="brak">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import ueditor from "@/components/Editor";
import Service from "@/api/service";
import Upload from "@/components/Upload";
import { mapGetters } from "vuex";
export default {
  name: "projectInfo",
  data() {
    return {
      goodsPath: "",
      uploadUrl: "/api/system/upload",
      preview: {},
      imageMogr_750:
        "imageMogr2/auto-orient/thumbnail/750x/blur/1x0/quality/75|imageslim",
      imageMogr_180:
        "?imageMogr2/auto-orient/thumbnail/180x/gravity/NorthWest/crop/180x180/blur/1x0/quality/75|imageslim",
      spceDialogVisible: false,
      colorDialogVisible: false,
      thumbnail: "picture",
      uploadData: {
        serverUrl: process.env.VUE_APP_SERVER_URL,
        isMultiSelect: false,
      }, // 上传图片的附带参数
      dialogVisible: false,
      category: [], // 分类数据存放
      fileList: [], // 商品组图存放
      imgPathList: [], // 图片存放
      goodsThumbList: [], // 商品详情图片存放
      projectInfo: {
        name: "",
        describe: "",
        content: "",
        poasword: "",
        goodsThumbId: "",
        thumbnail: "",
        thumbId: "",
      },
      config: {
        initialFrameWidth: 1200,
        initialFrameHeight: 420,
      },
      rules: {
        name: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入商品详情", trigger: "change" },
        ],
      },
    };
  },
  // 刷新数据
  watch: {
    $route: function (val) {
      if (val) {
        const _state = this.$route.params.name;
        if (_state === "add") {
          this.$set(this.articleInfo, "name", "");
          this.$set(this.articleInfo, "content", "");
          this.$set(this.articleInfo, "describe", "");
          this.$set(this.articleInfo, "thumbId", null);
          this.$set(this.articleInfo, "thumbnail", "");
          this.$set(this.articleInfo, "thumbId", "");
          this.$set(this.uploadData, "mid", "");
          this.$set(this, "goodsThumbList", []);
          this.$set(this, "color", []);
        }
        this.getData();
      }
    },
  },
  computed: {
    ...mapGetters(["SYS"]),
    paramsName() {
      const $path = this.$route.path.split("/");
      const _name = $path[$path.length - 1];
      return this.$route.params.name || _name;
    },
    moduleService() {
      const servicePath = "/api/pages/project";
      return new Service(servicePath);
    },
  },
  created() {
    // 判断七牛云
    this.uploadData.imageMogr =
      this.SYS.setup.edit_type === "1"
        ? "?imageMogr2/auto-orient/thumbnail/750x/gravity/NorthWest/crop/750x750/blur/1x0/quality/75|imageslim"
        : "";
    this.getData();
  },
  components: {
    ueditor,
    Upload,
  },

  methods: {
    getData() {
      const _state = this.$route.params.name || this.paramsName;
      if (_state === "update") {
        this.moduleService.query({ id: this.$route.query.id }).then((res) => {
          const result = res.data;
          this.$set(this.projectInfo, "name", result.name);
          this.$set(this.projectInfo, "describe", result.describe);
          this.$set(this.projectInfo, "content", result.content);
          this.$set(this.projectInfo, "categoryArr", result.categoryArr);
          this.$set(this.projectInfo, "thumbnail", result.thumbnail);
          // 产品图片集初始化
          if (result.thumbId) {
            this.$set(this.projectInfo, "thumbId", result.thumbId._id);
            this.$set(this.uploadData, "mid", result.thumbId._id);
          }
          // 详情图片初始化
          if (result.goodsThumbId) {
            this.$set(
              this.projectInfo,
              "goodsThumbId",
              result.goodsThumbId._id
            );
            this.$set(this.config, "imageMogr", this.imageMogr_750);
            this.$set(this.config, "mid", result.goodsThumbId._id);
            this.goodsThumbList = result.goodsThumbId.imgPath;
          }
        });
      }
    },
    upload_success(val) {
      this.$set(this.projectInfo, "thumbId", val.mid);
    },
    handleRemove(file, fileList) {
      const options = {
        files: {
          name: file.name,
          url: file.url,
        },
        _id: this.projectInfo.thumbId,
      };
      this.moduleService.thumbnailDelete(options).then((res) => {
        this.$message.success("删除成功");
      });
    },
    submitSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const state = this.$route.params.name || this.paramsName;
          this.projectInfo.id = this.$route.query.id || "";
          this.moduleService[state](this.projectInfo).then((res) => {
            this.$message.success(state === "add" ? "添加成功" : "更新成功");
            this.dialogVisible = false;
            this.$router.push(`/project?time=${+new Date()}`);
          });
        } else {
          return false;
        }
      });
    },
    thumbReady(val) {
      this.projectInfo.goodsThumbId = val;
    },
    brak() {
      this.$router.push({
        path: "/project",
        query: { time: +new Date() }, // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
      });
    },
  },
};
</script>
<style lang="less" scoped>
.table-form {
  margin-top: 20px;
}

.colorList {
  margin-left: 1px;
  .name {
    display: block;
    line-height: 24px;
  }
  img {
    vertical-align: top;
    margin: 2px;
  }
  .el-icon-plus {
    border: 1px solid #d8d6e1;
    padding: 4px;
    cursor: pointer;
  }
  .el-dialog__close {
    position: absolute;
    top: -8px;
    right: -8px;
    padding: 3px 2px;
    color: #fff;
    background-color: #ff4d51;
    border-radius: 50%;
  }
}

.specif {
  .el-icon-plus {
    border: 1px solid #d8d6e1;
    padding: 4px;
    cursor: pointer;
  }
}
</style>
