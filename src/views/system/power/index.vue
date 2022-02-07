<template>
  <div class="app-container">
    <div class="table-container">
      <div class="left">
        <to-link :val="$route.meta.btnList.add" @to="handleOpen">
          <el-button type="primary">添加</el-button>
        </to-link>
      </div>
    </div>
    <div class="_list">
      <div class="custom-tree-node tree-head">
        <span class="treeName">权限名称</span>
        <div class="tree-node">
          <table class="tree-table-th">
            <tr>
              <td class="td">排序</td>
              <td class="td">权限ID</td>
              <td class="td">父权限ID</td>
              <td class="td">等级</td>
              <td class="td">是否显示</td>
              <td class="td">描述信息</td>
              <td class="td">操作</td>
            </tr>
          </table>
        </div>
      </div>
      <el-tree
        class="treeMenu"
        :data="dataList"
        ref="tree"
        :props="props"
        default-expand-all
        show-checkbox
        :expand-on-click-node="false"
      >
        <div class="custom-tree-node" slot-scope="{ data }">
          <span class="treeName">{{ data.name }}</span>
          <div class="tree-node">
            <table class="tree-table">
              <tr>
                <td class="td">{{ data.sort }}</td>
                <td class="td">{{ data._id }}</td>
                <td class="td">{{ data.parentId }}</td>
                <td class="td">{{ data.level }}</td>
                <td class="td">
                  <el-tag :type="data.isChild === '1' ? 'success' : 'warning'">
                    {{ data.isChild === "1" ? "是" : "否" }}
                  </el-tag>
                </td>
                <td class="td">{{ data.routerDescribe }}</td>
                <td class="td">
                  <to-link
                    :val="$route.meta.btnList.edit"
                    @to="handleUpdata(data)"
                  >
                    <el-button size="mini" type="text">编辑</el-button>
                  </to-link>
                  <to-link
                    :val="$route.meta.btnList.delete"
                    @to="handleDelete(data)"
                  >
                    <el-button size="mini" type="text">删除</el-button>
                  </to-link>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </el-tree>
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
    <el-dialog
      title="权限添加"
      :visible.sync="dialogVisible"
      width="32%"
      top="5vh"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="dialogFormRules"
        label-width="110px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="父权限编号" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择">
            <el-option
              v-for="item in optionList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否子菜单" prop="isChild">
          <el-radio-group v-model="form.isChild">
            <el-radio label="1" border>是</el-radio>
            <el-radio label="2" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示" prop="isMenu">
          <el-radio-group v-model="form.isMenu">
            <el-radio label="1" border>是</el-radio>
            <el-radio label="2" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input type="input" v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="排序数" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="1"
            :max="100"
            label="排序数"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="菜单等级" prop="level">
          <el-input-number
            v-model="form.level"
            :min="1"
            :max="10"
            label="菜单等级"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="按钮菜单" prop="level">
          <el-checkbox-group v-model="btnListArr" size="mini">
            <el-tag
              v-for="(item, key) in btnList"
              :key="key"
              size="medium"
              :closable="!item.isLock"
              @close="handleClose(item)"
            >
              <el-checkbox :label="item._id">{{ item.btnName }}</el-checkbox>
            </el-tag>
          </el-checkbox-group>
          <div class="input">
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputNameValue"
              placeholder="菜单名称"
              ref="saveTagInput"
              @blur="blurInput"
              size="mini"
            />
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputBtnValue"
              placeholder="按钮标识"
              @blur="blurInput"
              size="mini"
            >
            </el-input>
            <el-button
              :type="inputVisible ? 'primary' : ''"
              class="button-new-tag"
              size="mini"
              @click="showInput"
              >{{ !inputVisible ? "+ 添加" : "提交" }}</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="Redirect Url" prop="routerUrl">
          <el-input type="input" v-model="form.routerUrl"></el-input>
        </el-form-item>
        <el-form-item label="路由参数" prop="routerParameter">
          <el-input type="input" v-model="form.routerParameter"></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="routerPath">
          <el-input type="input" v-model="form.routerPath"></el-input>
        </el-form-item>
        <el-form-item label="路由名称" prop="routerName">
          <el-input type="input" v-model="form.routerName"></el-input>
        </el-form-item>
        <el-form-item label="参数说明" prop="routerParameterDescribe">
          <el-input
            type="input"
            v-model="form.routerParameterDescribe"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述信息" prop="routerDescribe">
          <el-input type="textarea" v-model="form.routerDescribe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('dialogForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Service from "@/api/service";
import mixinsTable from "@/utils/mixins.table";
export default {
  name: "powerList",
  mixins: [mixinsTable],
  data() {
    return {
      servicePath: "/api/admin/menu",
      serviceBtbPath: "/api/admin/role/btn",
      inputVisible: false,
      inputNameValue: "",
      inputBtnValue: "",
      btnList: [],
      _id: "",
      btnListArr: [],
      form: {
        name: "",
        parentId: "-1",
        isChild: "",
        isMenu: "",
        level: "",
        icon: "",
        sort: "",
        routerUrl: "",
        routerParameter: "",
        routerPath: "",
        routerName: "",
        btnListArr: [],
        routerParameterDescribe: "",
        routerDescribe: "",
      },
      props: {
        value: "_id",
        label: "name",
      },
      dialogFormRules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "父编号不能为空", trigger: "change" },
        ],
        isChild: [
          {
            required: true,
            message: "是否叶子节点不能为空",
            trigger: "change",
          },
        ],
        sort: [
          { required: true, message: "排序数不能为空", trigger: "change" },
        ],
        routerName: [
          { required: true, message: "路由名称不能为空", trigger: "blur" },
        ],
        routerDescribe: [
          { required: true, message: "描述信息不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    btnService() {
      return new Service(this.serviceBtbPath);
    },
  },
  created() {
    this.getOptionList({ field: 1 });
    this.getList();
    this.handleBtnList();
  },
  methods: {
    initForm(row) {
      this._id = row._id;
      if (row.btnListArr && row.btnListArr.length > 0) {
        this.btnListArr = row.btnListArr.map((item) => item.btnId);
      }
      this.setFormVal(row);
    },
    FormClear() {
      this.btnListArr = [];
      var form = {
        name: "",
        parentId: "-1",
        isChild: "",
        isMenu: "",
        level: "",
        icon: "",
        sort: "",
        routerUrl: "",
        routerPath: "",
        routerParameter: "",
        routerName: "",
        btnListArr: [],
        routerParameterDescribe: "",
        routerDescribe: "",
      };
      this.setFormVal(form);
    },
    // changeBtnList(data, index) {
    //   var isChange =
    //     this.btnListArr.findIndex((item) => item === data._id) > -1;
    //   if (isChange) {
    //     this.form.btnListArr.splice(index, 0, data);
    //   } else {
    //     this.form.btnListArr.splice(index, 1);
    //   }
    // },
    showInput() {
      if (!this.inputVisible) {
        this.inputVisible = true;
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      } else {
        this.handleInputConfirm();
      }
    },
    blurInput() {
      if (!this.inputNameValue && !this.inputBtnValue) {
        this.inputVisible = false;
        this.$message.warning("菜单名称与按钮标识必须要填写");
      }
    },
    handleInputConfirm() {
      this.btnService
        .add({
          btnName: this.inputNameValue,
          btnId: this.inputBtnValue,
          menuId: this._id,
        })
        .then((res) => {
          this.inputVisible = false;
          this.inputNameValue = "";
          this.inputBtnValue = "";
          this.handleBtnList();
          this.$message.success("添加成功");
        });
    },
    handleClose(item) {
      this.btnService
        .delete({
          id: item._id,
        })
        .then((res) => {
          this.handleBtnList();
          this.$message.success("删除成功");
        });
    },
    handleBtnList() {
      this.btnService.list().then((res) => {
        this.btnList = res.data;
      });
    },
    setFormVal(row) {
      const formArr = Object.keys(row);
      formArr.map((item) => {
        this.$set(
          this.form,
          item,
          this.dialogState === "update" && row[item] ? row[item] : ""
        );
      });
    },
    submitData() {
      // 查找id
      this.form.btnListArr = [];
      this.btnListArr.map((_item) => {
        var resItem = this.btnList.find((item) => item._id === _item);
        this.form.btnListArr.push(resItem);
      });

      if (this.dialogState === "create") {
        delete this.form._id;
      } else {
        delete this.form.children;
      }
    },
    handleCurrentChange(val) {
      this.getList(val);
    },
    getHalfCheckedNodes(data) {
      this.multipleSelection = [];
      this.multipleSelection = this.$refs.tree.getCheckedNodes();
    },
  },
};
</script>
<style lang="less">
.tree-table-th {
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  color: #666;
  width: 100%;
  background-color: #f5f5f5;
  .name {
    width: 390px;
    padding-left: 42px;
  }
  .td {
    text-align: center;
  }
}
.tree-head {
  height: 45px;
  position: relative;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  .treeName {
    font-size: 13px;
    color: #666;
    width: 100%;
    display: inline-block;
    width: 340px;
    line-height: 44px;
    padding-left: 20px;
    background-color: #f5f7fa;
  }
}
.tree-node {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-left: 315px;
  overflow: hidden;
}
.tree-table {
  width: 100%;
}
.custom-tree-node {
  font-size: 13px;
  color: #666;
  width: 100%;
  .td {
    width: 15%;
    text-align: center;
    line-height: 38px;
  }
  .name {
    line-height: 38px;
    text-align: left;
  }
}
.input-new-tag {
  width: 100px;
  position: relative;
  margin-right: 10px;
}

.el-checkbox__label {
  font-size: 13px;
}
.el-tag {
  margin-right: 10px;
}
</style>