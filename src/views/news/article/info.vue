<template>
  <div class="app-container">
    <div class="wpm">
      <div class="table-form">
        <el-form
          :model="articleInfo"
          :rules="rules"
          ref="articleInfo"
          label-width="120px"
        >
          <el-form-item label="文章标题" prop="title">
            <el-input
              placeholder="请输入文章标题"
              v-model="articleInfo.title"
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="文章描述" prop="describe">
            <el-input
              type="textarea"
              row="5"
              placeholder="请输入文章描述"
              v-model.number="articleInfo.describe"
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="文章分类" prop="categoryArr">
            <template v-if="category.length > 0">
              <el-cascader
                :options="category"
                :props="props"
                v-model="articleInfo.categoryArr"
                :show-all-levels="false"
              ></el-cascader>
            </template>
          </el-form-item>
          <el-form-item label="缩略图" prop="img_path">
            <upload
              v-model="articleInfo.thumbnail"
              :file-data="uploadData"
              @upload-success="upload_success"
            >
              <img
                :src="articleInfo.thumbnail"
                v-if="articleInfo.thumbnail"
                class="avatar"
              />
              <i class="el-icon-plus" v-if="!articleInfo.thumbnail"></i>
            </upload>
          </el-form-item>
          <el-form-item label="推荐首页" prop="isIndex">
            <el-switch
              v-model="articleInfo.isIndex"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="是否发布" prop="isSelves">
            <el-switch
              v-model="articleInfo.isSelves"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="是否热门" prop="isHot">
            <el-switch
              v-model="articleInfo.isHot"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="密码访问" prop="post_fee">
            <el-switch
              v-model="is_poasword"
              active-color="#13ce66"
              style="margin-right: 10px"
              inactive-color="#ff4949"
            ></el-switch>
            <el-input
              placeholder="请输入访问密码"
              v-if="is_poasword"
              v-model="articleInfo.poasword"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="内容详情" prop="content">
            <!-- {{ SYS.setup.edit_type }} -->
            <ueditor
              v-model="articleInfo.content"
              v-if="SYS.setup.edit_type === '1'"
              :config="config"
              @ready="thumbReady"
              :goods-thumb-list="goodsThumbList"
            ></ueditor>
            <mavon-editor
              ref="mavonEditor"
              v-model="articleInfo.markdownContent"
              :ishljs="true"
              @imgDel="imgDel"
              @imgAdd="imgAdd"
              @change="markdownChange"
              v-else-if="SYS.setup.edit_type === '2'"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSave('articleInfo')"
              >确 定</el-button
            >
            <el-button @click="brak">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      :title="preview.name"
      :visible.sync="dialogVisible"
      width="36.7%"
      top="5vh"
    >
      <div class="preview"><img :src="preview.url" :alt="preview.name" /></div>
    </el-dialog>
  </div>
</template>
<script>
import ueditor from "@/components/Editor";
import Service from "@/api/service";
import Upload from "@/components/Upload";
import { mapGetters } from "vuex";
export default {
  name: "goodsInfo",
  data() {
    return {
      goodsPath: "",
      is_poasword: false, // 是否密码访问
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
        serverUrl: "",
        isMultiSelect: false,
      }, // 上传图片的附带参数
      dialogVisible: false,
      category: [], // 分类数据存放
      fileList: [], // 商品组图存放
      imgPathList: [], // 图片存放
      specification: [], // 尺寸存放
      goodsThumbList: [], // 商品详情图片存放
      color: [],
      props: {
        value: "_id",
        label: "name",
      },
      articleInfo: {
        title: "",
        describe: "",
        category: null,
        categoryArr: null,
        content: "",
        poasword: "",
        goodsThumbId: "",
        markdownContent: "",
        thumbnail: "",
        thumbId: "",
        isIndex: false,
        isSelves: false,
        isHot: false,
      },
      config: {
        initialFrameWidth: 1200,
        initialFrameHeight: 420,
      },
      rules: {
        name: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 5,
            max: 30,
            message: "长度在 10 到 52 个字符",
            trigger: "blur",
          },
        ],
        categoryArr: [
          { required: true, message: "请选择文章分类", trigger: "change" },
        ],
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
        if (this.paramsName === "add") {
          this.$set(this.articleInfo, "title", "");
          this.$set(this.articleInfo, "content", "");
          this.$set(this.articleInfo, "markdownContent", "");
          this.$set(this.articleInfo, "describe", "");
          this.$set(this.articleInfo, "categoryArr", []);
          this.$set(this.articleInfo, "thumbId", null);
          this.$set(this.articleInfo, "thumbnail", "");
          this.$set(this.articleInfo, "isIndex", false);
          this.$set(this.articleInfo, "isHot", false);
          this.$set(this.articleInfo, "isSelves", "");
          this.$set(this.articleInfo, "thumbId", "");
          this.$set(this.uploadData, "mid", "");
          this.$set(this, "fileList", []);
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
      const servicePath = "/api/news/article";
      return new Service(servicePath);
    },
    moduleServiceImg() {
      const servicePath = "/api/system/upload";
      return new Service(servicePath);
    },
    moduleServiceType() {
      const servicePath = "/api/class/category";
      return new Service(servicePath);
    },
  },
  created() {
    this.moduleServiceType.list({ field: 1, type: 1 }).then((res) => {
      this.$set(this, "category", res.data.result);
    });
    this.$set(this.uploadData, "serverUrl", this.SYS.setup.serverUrl);
    this.getData();
  },
  components: {
    ueditor,
    Upload,
  },

  methods: {
    markdownChange(value, html) {
      this.$set(this.articleInfo, "content", html);
    },
    imgAdd(pos, $file) {
      var _file = { files: $file };
      if (this.articleInfo.goodsThumbId) {
        _file.mid = this.articleInfo.goodsThumbId;
      }
      this.moduleServiceImg.uploadFile(_file).then((res) => {
        this.$refs.mavonEditor.$img2Url(pos, res.data.file);
        this.$set(this.articleInfo, "goodsThumbId", res.data.mid);
      });
    },
    imgDel(pos, $file) {
      console.log(pos, $file);
    },
    getData() {
      const _state = this.paramsName;
      if (_state === "update") {
        this.moduleService.query({ id: this.$route.query.id }).then((res) => {
          const result = res.data;
          this.$set(this.articleInfo, "title", result.title);
          this.$set(this.articleInfo, "describe", result.describe);
          this.$set(this.articleInfo, "content", result.content);
          this.$set(
            this.articleInfo,
            "markdownContent",
            result.markdownContent
          );
          this.$set(this.articleInfo, "categoryArr", result.categoryArr);
          this.$set(this.articleInfo, "thumbnail", result.thumbnail);
          this.$set(this.articleInfo, "isIndex", result.isIndex);
          this.$set(this.articleInfo, "isHot", result.isHot);
          this.$set(this.articleInfo, "isSelves", result.isSelves);
          // 产品图片集初始化
          if (result.thumbId) {
            this.$set(this.articleInfo, "thumbId", result.thumbId._id);
            this.$set(this.uploadData, "mid", result.thumbId._id);
            this.fileList = result.thumbId.imgPath;
          }
          // 详情图片初始化
          if (result.goodsThumbId) {
            this.$set(
              this.articleInfo,
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
      this.$set(this.articleInfo, "thumbId", val.mid);
    },
    handleRemove(file, fileList) {
      const options = {
        files: {
          name: file.name,
          url: file.url,
        },
        _id: this.articleInfo.thumbId,
      };
      this.moduleService.thumbnailDelete(options).then((res) => {
        this.$message.success("删除成功");
      });
    },
    submitSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const state = this.paramsName;
          this.articleInfo.id = this.$route.query.id || "";
          this.articleInfo.category =
            this.articleInfo.categoryArr[
              this.articleInfo.categoryArr.length - 1
            ]; // 重新取分类ID
          this.moduleService[state](this.articleInfo).then((res) => {
            this.$message.success(state === "add" ? "添加成功" : "更新成功");
            this.dialogVisible = false;
            this.$router.push(`/article?time=${+new Date()}`);
          });
        } else {
          return false;
        }
      });
    },
    thumbReady(val) {
      this.$set(this.articleInfo, "goodsThumbId", val);
    },
    brak() {
      this.$router.push({
        path: "/article",
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
