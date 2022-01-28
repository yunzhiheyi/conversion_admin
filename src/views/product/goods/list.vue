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
              placeholder="请输入产品名称"
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
        <el-table-column label="产品名称" width="380">
          <template slot-scope="scope">
            <div class="product_info">
              <span class="thumbnail"><img :src="scope.row.thumbnail" /></span>
              <div class="info">
                <span class="_name">{{ scope.row.name }}</span>
                <span class="price">￥{{ scope.row.promo_price }}</span>
                <span class="p_price">￥{{ scope.row.original_price }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属分类">
          <template slot-scope="scope">
            {{ scope.row.category && scope.row.category.name }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="规格">
          <template slot-scope="scope">
            {{scope.row.attrValue && scope.row.attrValue.memory.join(',')}}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="库存">
          <template slot-scope="scope">
            
          </template>
        </el-table-column> -->
        <el-table-column label="邮费">
          <template slot-scope="scope">
            {{ scope.row.post_fee ? "￥" + scope.row.post_fee : "包邮" }}
          </template>
        </el-table-column>
        <el-table-column label="热门">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isHot ? 'success' : 'danger'">
              {{ scope.row.isHot ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="推荐首页">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isIndex ? 'success' : 'danger'">
              {{ scope.row.isIndex ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isSelves ? 'success' : 'danger'">
              {{ scope.row.isSelves ? "上架中" : "已下架" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="添加时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <to-link :val="'M7mVYYqrL'" @to="handleShelves(scope.row)">
              <el-button type="text">{{
                scope.row.isSelves ? "下架" : "上架"
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
  name: "goodsList",
  mixins: [mixinsTable],
  data() {
    return {
      dataTime: +new Date(),
      servicePath: "/api/product/goods",
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
    this.categoryService.list({ field: 1, type: 2 }).then((res) => {
      this.category = res.data.result;
    });
    this.getList();
  },
  computed: {
    categoryService() {
      return new Service("/api/product/category");
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.getList(val);
    },
    handleLink(state, id) {
      const query = {
        // time: +new Date()
      };
      if (state === "update" && id) {
        query.id = id;
      }
      this.$router.push({
        path: "/product/info/" + state,
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
          this.$message.success(!row.isSelves ? "上架成功" : "下架成功");
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
