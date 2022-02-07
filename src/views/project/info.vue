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
              v-model="projectThumbnail"
              :file-data="uploadData"
              @upload-success="upload_success"
            >
              <img
                :src="projectThumbnail"
                v-if="projectThumbnail"
                class="avatar"
              />
              <i class="el-icon-plus" v-if="!projectThumbnail"></i>
            </upload>
          </el-form-item>
          <el-form-item label="内容详情" prop="content">
            <ueditor
              v-model="projectInfoContent"
              :config="config"
              @ready="thumbReady"
              @markdownChange="markdownChange"
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
import Request from "@/api/request";
import Upload from "@/components/Upload";
import { mapGetters } from "vuex";
export default {
  name: "projectInfo",
  data() {
    return {
      goodsPath: "",
      uploadUrl: "/api/admin/system/fileUpload",
      preview: {},
      imageMogr_750:
        "imageMogr2/auto-orient/thumbnail/750x/blur/1x0/quality/75|imageslim",
      imageMogr_180:
        "?imageMogr2/auto-orient/thumbnail/180x/gravity/NorthWest/crop/180x180/blur/1x0/quality/75|imageslim",
      spceDialogVisible: false,
      colorDialogVisible: false,
      thumbnail: "picture",
      projectThumbnail: "",
      uploadData: {
        serverUrl: process.env.VUE_APP_SERVER_URL,
        isMultiSelect: false,
      }, // 上传图片的附带参数
      dialogVisible: false,
      category: [], // 分类数据存放
      fileList: [], // 商品组图存放
      imgPathList: [], // 图片存放
      goodsThumbList: [], // 商品详情图片存放
      projectInfoContent: "", //存放内容
      projectInfo: {
        name: "",
        describe: "",
        content: "",
        contentImageId: "",
        thumbnailId: "",
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
          this.$set(this.projectInfo, "name", "");
          this.$set(this.projectInfo, "content", "");
          this.$set(this.projectInfo, "describe", "");
          this.$set(this.projectInfo, "thumbnailId", null);
          this.$set(this.projectInfo, "contentImageId", null);
          this.$set(this.projectInfo, "markdownContent", "");
          this.$set(this.uploadData, "mid", "");
          this.$set(this, "projectThumbnail", "");
          this.$set(this, "goodsThumbList", []);
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
      const servicePath = "/api/admin/project";
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
    markdownChange(html) {
      this.$set(this.projectInfo, "content", html);
    },
    imgAdd(pos, $file) {
      let formdata = new FormData();
      if (this.projectInfo.contentImageId) {
        formdata.mid = this.projectInfo.contentImageId._id;
      }
      formdata.append("file", $file);
      Request.post({
        url: "/api/admin/system/fileUpload",
        params: formdata,
      }).then((res) => {
        console.log(res.data.fileName);
        this.$refs.mavonEditor.$img2Url(pos, res.data.fileUrl);
        this.$set(this.projectInfo, "contentImageId", res.data.mid);
      });
    },
    imgDel(pos) {
      const options = {
        name: pos[0].replace(/^(.*)\/([^/]*)$/, "$2"),
        mid: this.projectInfo.contentImageId,
      };
      Request.post({
        url: "/api/admin/system/fileDelete",
        params: options,
      }).then((res) => {
        this.$message.success("删除成功");
      });
    },
    getData() {
      const _state = this.$route.params.name || this.paramsName;
      if (_state === "update") {
        this.moduleService.query({ id: this.$route.query.id }).then((res) => {
          const result = res.data;
          this.$set(this.projectInfo, "name", result.name);
          this.$set(this.projectInfo, "describe", result.describe);

          // 初始化
          this.projectInfoContent =
            this.SYS.setup.edit_type === "2"
              ? result.markdownContent
              : result.content;
          // 产品图片集初始化
          if (result.thumbnailId) {
            this.$set(this.projectInfo, "thumbnailId", result.thumbnailId._id);
            this.$set(
              this,
              "projectThumbnail",
              result.thumbnailId.imgPath[0].url
            );
          }
          // 详情图片初始化
          if (result.contentImageId) {
            this.$set(
              this.projectInfo,
              "contentImageId",
              result.contentImageId._id
            );
            this.$set(this.config, "imageMogr", this.imageMogr_750);
            this.$set(this.config, "mid", result.contentImageId._id);
            this.goodsThumbList = result.contentImageId.imgPath.map((item) => {
              return {
                file: item.url,
                name: item.name,
                mid: result.contentImageId._id,
              };
            });
            console.log(this.goodsThumbList);
          }
        });
      }
    },
    upload_success(val) {
      this.$set(this.projectInfo, "thumbnailId", val.mid);
    },

    submitSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const state = this.$route.params.name || this.paramsName;
          this.projectInfo._id = this.$route.query.id || "";
          this.$set(
            this.projectInfo,
            this.SYS.setup.edit_type === "1" ? "content" : "markdownContent",
            this.projectInfoContent
          );

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
      this.projectInfo.contentImageId = val;
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
