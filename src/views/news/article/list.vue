<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <to-link :val="$route.meta.btnList.add" @to="handleLink('add')">
          <el-button type="primary">添加</el-button>
        </to-link>
      </div>
      <div class="right">
        <el-row :gutter="10" type="flex" style="width: 365px">
          <el-col :span="5" style="width: 100px">
            <el-cascader
              :options="category"
              :props="props"
              v-model="categoryType"
              :show-all-levels="false"
            ></el-cascader>
          </el-col>
          <el-col :span="8" style="width: 220px">
            <el-input
              type="input"
              placeholder="请输入文章标题"
              v-model="search_title"
            ></el-input>
          </el-col>
          <el-col :span="3" style="width: 70px">
            <el-button type="primary" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="_list">
      <el-table
        highlight-current-row
        @selection-change="handleSelectionChange"
        :data="dataList"
        :height="$tools.tableHeight()"
        style="width: 100%"
        v-loading.body="listLoading"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="文章标题" width="580">
          <template slot-scope="scope">
            <span class="_name">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属分类">
          <template slot-scope="scope">
            {{ scope.row.category && scope.row.category.name }}
          </template>
        </el-table-column>
        <el-table-column label="密码访问">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isPassword ? 'success' : 'warning'">
              {{ scope.row.isPassword ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.isSelves ? "发布中" : "草稿箱" }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="添加时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="updataAt" label="更新时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.updataAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <to-link
              :val="$route.meta.btnList.shelves"
              @to="handleShelves(scope.row)"
            >
              <el-button type="text">{{
                scope.row.isSelves ? "草稿箱" : "发布"
              }}</el-button>
            </to-link>
            <to-link
              :val="$route.meta.btnList.edit"
              @to="handleLink('update', scope.row._id)"
            >
              <el-button type="text">编辑</el-button>
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
      <div class="left">
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
<script>
import mixinsTable from "@/utils/mixins.table";
import Service from "@/api/service";
export default {
  name: "newsList",
  mixins: [mixinsTable],
  data() {
    return {
      dataTime: +new Date(),
      servicePath: "/api/news/article",
      search_title: "",
      categoryType: [],
      category: [],
      editInfo: "",
      props: {
        value: "_id",
        label: "name",
      },
    };
  },
  created() {
    // 初始化分类 field = 1 | 递归后的数据
    this.categoryService.list({ field: 1, type: 1 }).then((res) => {
      this.category = res.data.result;
    });
    this.getList();
  },
  computed: {
    categoryService() {
      return new Service("/api/class/category");
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.getList(val);
    },
    handleLink(state, id) {
      const query = {};
      if (state === "update" && id) {
        query.id = id;
      }
      this.$router.push({
        path: "/article/info/" + state,
        query: query,
      });
    },
    // 搜索功能
    search() {
      if (this.search_title.length > 0) {
        this.params.name = this.search_title;
      } else {
        delete this.params.name;
      }
      if (this.categoryType.length > 0) {
        this.params.category = this.categoryType[this.categoryType.length - 1];
      } else {
        delete this.params.category;
      }
      this.getList();
    },
    // 上架和下架
    handleShelves(row) {
      this.moduleService
        .update({ id: row._id, isSelves: !row.isSelves })
        .then((res) => {
          this.$message.success(!row.isSelves ? "发布成功" : "放入成功");
          this.getList();
        });
    },
    // 列表修改价格和库存
    edit_Price_Inventory(row, _key) {
      const _options = { id: row._id };
      _options[_key] = this.editInfo;
      this.moduleService.update(_options).then((res) => {
        this.$message.success("更新成功");
        this.getList();
        document.querySelector(".thumbnail").click(); // el-popover没有关闭方法，只好使用这种方式
        this.editInfo = "";
      });
    },
  },
};
</script>
<style lang="less">
.el-popover {
  padding: 6px;
}

.editArea {
  padding: 3px;
  cursor: pointer;
  &:hover {
    margin: -1px;
    border: 1px dashed #666;
  }
}

.product_info {
  padding: 3px 0;
  overflow: hidden;
  .thumbnail {
    width: 50px;
    height: 50px;
    float: left;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .info {
    overflow: hidden;
    padding-left: 10px;
    .price {
      color: red;
      font-size: 14px;
    }
    .p_price {
      color: #b7b5b5;
      text-decoration: line-through;
    }
    ._name {
      display: block;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
