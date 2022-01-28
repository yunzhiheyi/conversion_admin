<template>
  <div class="app-container">
    <div class="wpm">
      <div class="table-form">
        <el-form
          :model="productInfo"
          :rules="rules"
          ref="productInfo"
          label-width="120px"
        >
          <el-form-item label="商品名称" prop="name">
            <el-input
              placeholder="请输入商品名称"
              v-model="productInfo.name"
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品原价" prop="original_price">
            <el-input
              placeholder="请输入商品原价"
              v-model="productInfo.original_price"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="categoryArr">
            <template v-if="category.length > 0">
              <el-cascader
                :options="category"
                :props="props"
                v-model="productInfo.categoryArr"
                :show-all-levels="false"
              ></el-cascader>
            </template>
          </el-form-item>
          <el-form-item label="产品图片" prop="fileList">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-error="handleError"
              :on-remove="handleRemove"
              :list-type="thumbnail"
              :on-success="handleSuccess"
              :multiple="false"
              :data="uploadData"
              :file-list="fileList"
            >
              <el-button type="primary">点击上传</el-button>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
          <!-- <pre> {{ productInfo.attrValue }}</pre> -->
          <el-form-item label="规格列表">
            <div class="specList" style="width: 700px">
              <template v-for="(item, key) in SpecList">
                <div class="list" :key="key">
                  <span class="name">
                    {{ item.name }}
                  </span>
                  <div class="checkbox">
                    <template v-for="(_item, _key) in item.tagValue">
                      <el-checkbox
                        :key="_key"
                        :label="_item"
                        @change="
                          handleCheckedCitiesChange(_item, item, key, _key)
                        "
                        v-model="_item.isChecked"
                        :disabled="_item.isDisabled"
                        :name="'checkbox_' + key + '_' + _key"
                        >{{ _item.value }}</el-checkbox
                      >
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </el-form-item>
          <draggable
            v-model="selectedSpecList"
            @update="draggableUpdate"
            handle=".el-form-item__label"
            :options="{ animation: 200 }"
          >
            <template v-for="(item, key) in selectedSpecList">
              <el-form-item
                class="draggable-goods-info"
                :label="item.name"
                :key="key"
              >
                <div class="specif" style="width: 700px">
                  <checkbox-group style="float: left">
                    <template v-for="(_item, _key) in item.tagValue">
                      <checkbox-button
                        :key="_key"
                        v-model="productInfo.attrValue[item.fieldName]"
                        :name="'checkbox_' + key + '_' + _key"
                        :label="_item"
                        :attr-value="{
                          key: key,
                          name: item.fieldName,
                          index: _key,
                        }"
                        @change="changeAttrValue"
                      >
                        <div class="img"></div>
                        <span class="name">{{ _item.value }}</span>
                      </checkbox-button>
                    </template>
                  </checkbox-group>
                </div>
              </el-form-item>
            </template>
          </draggable>
          <!-- <pre> {{ selectedSpecList }}</pre> -->
          <el-form-item label="SKU库存" v-if="selectedColumnSpec.length > 0">
            <el-table
              :data="skuArrValue"
              class="skuTable"
              style="width: 700px"
              height="474px"
              @current-change="handleCurrentChange"
            >
              <el-table-column
                v-for="(item, key) in selectedColumnSpec"
                :label="item.name"
                :key="key"
              >
                <template slot-scope="scope">
                  {{ scope.row[key].value }}
                </template>
              </el-table-column>
              <el-table-column>
                <template slot="header" slot-scope="scope">
                  <el-popover placement="bottom" width="180" trigger="click">
                    <el-input
                      placeholder="批量修改"
                      v-model="editInfo.Inventory"
                      size="mini"
                      style="width: 88px"
                    ></el-input>
                    <el-button
                      size="mini"
                      style="margin: 0 0 0 10px"
                      @click="
                        edit_Price_Inventory(
                          selectedSpecList.length,
                          'Inventory',
                          scope.$index
                        )
                      "
                      type="primary"
                      >确定</el-button
                    >
                    <span class="pedit" slot="reference"
                      >库存<i class="el-icon-edit"></i
                    ></span>
                  </el-popover>
                </template>
                <template slot-scope="scope">
                  <sku-title
                    @skuInputready="skuInputready"
                    :index="{
                      pindex: scope.$index,
                      value: scope.row.length - 3,
                      name: 'Inventory',
                    }"
                    v-model="scope.row[scope.row.length - 3].value"
                    @skuInput="skuInput"
                  ></sku-title>
                </template>
              </el-table-column>
              <el-table-column label="价格">
                <template slot="header" slot-scope="scope">
                  <el-popover placement="bottom" width="180" trigger="click">
                    <el-input
                      placeholder="批量修改"
                      v-model="editInfo.Price"
                      size="mini"
                      style="width: 88px"
                    ></el-input>
                    <el-button
                      size="mini"
                      style="margin: 0 0 0 10px"
                      @click="
                        edit_Price_Inventory(
                          selectedSpecList.length + 1,
                          'Price',
                          scope.$index
                        )
                      "
                      type="primary"
                      >确定</el-button
                    >
                    <span class="pedit" slot="reference"
                      >价格<i class="el-icon-edit"></i
                    ></span>
                  </el-popover>
                </template>
                <template slot-scope="scope">
                  <sku-title
                    @skuInputready="skuInputready"
                    :is-price="true"
                    v-model="scope.row[scope.row.length - 2].value"
                    :index="{
                      pindex: scope.$index,
                      value: scope.row.length - 2,
                      name: 'Price',
                    }"
                    @skuInput="skuInput"
                  ></sku-title>
                </template>
              </el-table-column>
              <el-table-column width="80">
                <template slot-scope="scope">
                  <div class="sku-show">
                    <el-button
                      type="text"
                      @click="edit_Price_Show(scope.$index)"
                      v-if="!scope.row[scope.row.length - 1].value"
                      >设为展示</el-button
                    >
                    <div
                      class="sku-show-success"
                      v-if="scope.row[scope.row.length - 1].value"
                    >
                      <i class="el-icon-upload-success el-icon-check" />
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="邮费" prop="post_fee">
            <el-switch
              v-model="is_post_fee"
              active-color="#13ce66"
              style="margin-right: 10px"
              inactive-color="#ff4949"
            >
            </el-switch>
            <el-input
              placeholder="请输入邮费"
              v-if="is_post_fee"
              v-model="productInfo.post_fee"
              style="width: 150px"
            ></el-input>
          </el-form-item>
          <el-form-item label="推荐首页" prop="isIndex">
            <el-switch
              v-model="productInfo.isIndex"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="是否上架" prop="isSelves">
            <el-switch
              v-model="productInfo.isSelves"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="是否热门" prop="isHot">
            <el-switch
              v-model="productInfo.isHot"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="商品详情" prop="content">
            <ueditor
              v-model="productInfo.content"
              :config="config"
              @ready="thumbReady"
              :goods-thumb-list="goodsThumbList"
            ></ueditor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSave('productInfo')"
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
import CheckboxGroup from "@/components/CheckboxGroup";
import CheckboxButton from "@/components/CheckboxGroup/CheckboxButton";
import SkuTitle from "@/components/SkuTitle";
import Service from "@/api/service";
import { mapGetters } from "vuex";
import { color } from "echarts";
export default {
  name: "goodsInfo",
  data() {
    return {
      goodsPath: "",
      is_post_fee: false, // 是否包邮
      uploadUrl: "/api/system/upload",
      preview: {},
      tagValue: "",
      editInfo: {
        Price: "",
        Inventory: "",
      },
      _index: 0,
      isInput: false,
      imageMogr_750:
        "imageMogr2/auto-orient/thumbnail/750x/blur/1x0/quality/75|imageslim",
      imageMogr_180:
        "?imageMogr2/auto-orient/thumbnail/180x/gravity/NorthWest/crop/180x180/blur/1x0/quality/75|imageslim",
      spceDialogVisible: false,
      colorDialogVisible: false,
      thumbnail: "picture",
      uploadData: {
        serverUrl: process.env.VUE_APP_SERVER_URL,
        isMultiSelect: true,
      }, // 上传图片的附带参数
      dialogVisible: false,
      category: [], // 分类数据存放
      fileList: [], // 商品组图存放
      imgPathList: [], // 图片存放
      SpecList: [], // 规格数组
      selectedSpecList: [], //当前选中规格数组
      selectedColumnSpec: [], // 表头数组
      goodsThumbList: [], // 商品详情图片存放
      historySpecList: [], // 存放历史规格
      skuValue: [],
      skuArrValue: [],
      skuPrice: [],
      props: {
        value: "_id",
        label: "name",
      },
      productInfo: {
        name: "",
        category: null,
        categoryArr: null,
        attrValue: {},
        content: "",
        skuId: "",
        specIds: [],
        skuArrValue: [],
        goodsThumbId: null,
        post_fee: "",
        original_price: "",
        skuCurrentPrice: [],
        thumbnail: "",
        promo_price: "",
        thumbId: null,
        isIndex: false,
        isSelves: false,
        isHot: false,
      },
      config: {
        initialFrameWidth: 1200,
        initialFrameHeight: 320,
      },

      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 10,
            max: 100,
            message: "长度在 10 到 100 个字符",
            trigger: "blur",
          },
        ],
        categoryArr: [
          { required: true, message: "请选择商品分类", trigger: "change" },
        ],
        // specification: [
        //   { required: true, message: "请选择商品尺寸", trigger: "change" },
        // ],
        color: [
          { required: true, message: "请选择颜色尺寸", trigger: "change" },
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
        const _state = this.paramsName;
        if (_state === "add") {
          this.$set(this.productInfo, "name", "");
          this.$set(this.productInfo, "content", "");
          this.$set(this.productInfo, "attrValue", {});
          this.$set(this.productInfo, "categoryArr", []);
          this.$set(this.productInfo, "thumbId", null);
          this.$set(this.productInfo, "thumbnail", "");
          this.$set(this.productInfo, "original_price", "");
          this.$set(this.productInfo, "post_fee", "");
          this.$set(this.productInfo, "promo_price", "");
          this.$set(this.productInfo, "isIndex", false);
          this.$set(this.productInfo, "isHot", false);
          this.$set(this.productInfo, "isSelves", "");
          this.$set(this.productInfo, "thumbId", "");
          this.$set(this.productInfo, "skuId", "");
          this.$set(this.uploadData, "mid", "");
          this.$set(this.productInfo, "specIds", "");
          this.$set(this.productInfo, "skuArrValue", "");
          this.$set(this, "fileList", []);
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
      const servicePath = "/api/product/goods";
      return new Service(servicePath);
    },
    moduleServiceSpec() {
      return new Service("/api/product/spec");
    },
    moduleServiceType() {
      const servicePath = "/api/product/category";
      return new Service(servicePath);
    },
  },
  created() {
    // 判断七牛云
    (this.uploadData.imageMogr =
      this.SYS.setup.edit_type === "2"
        ? "?imageMogr2/auto-orient/thumbnail/750x/gravity/NorthWest/crop/750x750/blur/1x0/quality/75|imageslim"
        : ""),
      this.moduleServiceType.list({ field: 1, type: 2 }).then((res) => {
        this.$set(this, "category", res.data.result);
      });
    this.moduleServiceSpec.list({ type: 1 }).then((res) => {
      if (res.data.result) {
        res.data.result.map((item, key) => {
          if (item.fieldName) {
            this.productInfo.attrValue[item.fieldName] = [];
          }
        });
        this.SpecList = res.data.result.map((item) => {
          item.isChecked = false;
          return item;
        });
        this.getData();
      }
    });
  },
  components: {
    ueditor,
    CheckboxGroup,
    SkuTitle,
    CheckboxButton,
  },
  methods: {
    handleInputConfirm() {},
    addPeople() {},
    // 拖动更新
    draggableUpdate(evt) {
      evt.preventDefault();
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      var index = evt.oldIndex;
      var tindex = evt.newIndex;
      // 拖动时更新表头
      if (this.selectedColumnSpec.length > 0) {
        if (index > tindex) {
          this.selectedColumnSpec.splice(
            tindex,
            0,
            this.selectedColumnSpec[index]
          );
          this.selectedColumnSpec.splice(index + 1, 1);
        } else {
          this.selectedColumnSpec.splice(
            tindex + 1,
            0,
            this.selectedColumnSpec[index]
          );
          this.selectedColumnSpec.splice(index, 1);
        }
      }
      // 拖动更新数组
      this.skuArrValue.map((_item, key) => {
        if (index > tindex) {
          _item.splice(tindex, 0, _item[index]);
          _item.splice(index + 1, 1);
        } else {
          _item.splice(tindex + 1, 0, _item[index]);
          _item.splice(index, 1);
        }
        return _item;
      });
    },
    getData() {
      const _state = this.paramsName;
      if (_state === "update") {
        this.moduleService.query({ id: this.$route.query.id }).then((res) => {
          const result = res.data;
          this.$set(this.productInfo, "name", result.name);
          this.$set(this.productInfo, "price", result.price);
          this.$set(
            this.productInfo,
            "attrValue",
            result.attrValue || this.productInfo.attrValue
          ); // 坑死人了这里
          this.$set(this.productInfo, "content", result.content);
          this.$set(this.productInfo, "promo_price", result.promo_price);
          this.$set(this.productInfo, "categoryArr", result.categoryArr);
          this.$set(this.productInfo, "thumbnail", result.thumbnail);
          this.$set(this.productInfo, "post_fee", result.post_fee);
          this.$set(this.productInfo, "isIndex", result.isIndex);
          this.$set(this.productInfo, "skuId", result.skuId);
          this.$set(this.productInfo, "original_price", result.original_price);
          this.$set(this.productInfo, "promo_price", result.promo_price);
          this.$set(this.productInfo, "isHot", result.isHot);
          this.$set(this.productInfo, "isSelves", result.isSelves);
          this.$set(this.productInfo, "specIds", result.specIds);
          this.$set(
            this.productInfo,
            "skuCurrentPrice",
            result.skuId.currentPrice
          );
          if (result.post_fee) {
            this.$set(this, "is_post_fee", true);
          }
          // 产品图片集初始化
          if (result.thumbId) {
            this.$set(this.productInfo, "thumbId", result.thumbId._id);
            this.$set(this.uploadData, "mid", result.thumbId._id);
            this.fileList = result.thumbId.imgPath;
          }
          // 详情图片初始化
          if (result.goodsThumbId) {
            this.$set(
              this.productInfo,
              "goodsThumbId",
              result.goodsThumbId._id
            );
            this.$set(this.config, "imageMogr", this.imageMogr_750);
            this.$set(this.config, "mid", result.goodsThumbId._id);
            this.goodsThumbList = result.goodsThumbId.imgPath;
          }
          this.selectedSpecList = result.specIds;
          this.selectedColumnSpec = result.specIds.map((_item) => {
            delete _item.value;
            return _item;
          });
          // 选中值
          this.SpecList.map((item, key) => {
            var _result = result.specIds.find(
              (_item) => _item._id === item._id
            );
            item.tagValue.map((_res) => {
              var _index =
                _result &&
                _result.tagValue.findIndex((_item) => _item._id === _res._id) >
                  -1;
              _res.isChecked = _index;
              if (_index) {
                item.isChecked = true;
              }
              return _res;
            });

            return item;
          });

          result.specIds.map((item, key) => {
            this.skuValue.splice(
              key,
              1,
              (result.attrValue && result.attrValue[item.fieldName]) || []
            );
          });
          this.skuArrValue = result.skuId.skuInfo;
          this.$set(this, "historySpecList", result.skuId.skuInfo); // 这里必须要记录一下数据,不然在重新选择规格时数据会清空
          // this.skuArrValue = this.attrValue(this.skuValue);
        });
      }
    },
    edit_Price_Show(index) {
      var length = this.skuArrValue[index].length;
      this.skuArrValue.map((item, key) => {
        this.skuArrValue[key].splice(length - 1, 1, {
          _id: "isShow",
          value: index === key,
        });
        // 列表值等于当前设置值时
        if (index === key) {
          this.$set(
            this.productInfo,
            "skuCurrentPrice",
            this.skuArrValue[index]
          );
        }
      });
      this.$set(this, "historySpecList", this.skuArrValue);
    },
    // 列表修改价格和库存
    edit_Price_Inventory(rowIndex, name, index) {
      this.skuArrValue.map((item, key) => {
        this.skuArrValue[key].splice(rowIndex, 1, {
          _id: name,
          value: this.editInfo[name],
        });
      });
      this.$set(this.productInfo, "skuCurrentPrice", this.skuArrValue[index]);
      this.$set(this, "historySpecList", this.skuArrValue);
    },
    handleCurrentChange(key, index) {},
    skuInput(data) {
      this.$set(
        this.productInfo,
        "skuCurrentPrice",
        this.skuArrValue[data.key]
      );
      this.$set(this, "historySpecList", this.skuArrValue);
      this.skuArrValue[data.key].splice(data.index, 1, {
        _id: data.name,
        value: data.value,
      });
    },
    // 选择规格
    handleCheckedCitiesChange(data, pItem, pIndex, index) {
      // 这里所有的索引与当前Item都是要从selectedSpecList，
      // 如果没selectedSpecList没有值就取当前传过来的值，主要是考虑拖动后会改变值
      var _pItemIndex = this.selectedSpecList.findIndex(
        (item) => item.fieldName === pItem.fieldName
      );
      var _pIndex = _pItemIndex > -1 ? _pItemIndex : pIndex;
      var _sItemIndex =
        this.selectedSpecList[_pIndex] &&
        this.selectedSpecList[_pIndex].tagValue.findIndex(
          (item) => item._id === data._id
        );
      var _sIndex = _sItemIndex > -1 ? _sItemIndex : index;
      var _sItem =
        this.selectedSpecList[_pIndex] &&
        this.selectedSpecList[_pIndex].tagValue.find(
          (item) => item._id === data._id
        );

      if (_sItem && _sItem.isChecked) {
        data.isChecked = true;
        return;
      }
      var _mIndex =
        this.productInfo.attrValue[pItem.fieldName] &&
        this.productInfo.attrValue[pItem.fieldName].findIndex(
          (item) => item._id === data._id
        );
         // 通过当前选择尺寸查找当前位置
      var _item = {
        value: data.value,
        _id: data._id,
        isChecked: false,
        isDisabled: false,
      };
      var sItem = this.SpecList[pIndex];
      var _pItemTagValue = sItem.tagValue.filter((_res) => _res.isChecked);
      var resTag = {
        _id: sItem._id,
        name: sItem.name,
        isChecked: false,
        fieldName: sItem.fieldName,
      };
      if (!sItem.isChecked) {
        resTag.tagValue = [];
      }
      if (data.isChecked) {
        // 如果当前行没有选择
        if (!sItem.isChecked) {
          resTag.tagValue.splice(_sIndex, 0, _item);
        } else {
          this.selectedSpecList[_pIndex].tagValue.splice(_sIndex, 0, _item);
        }
      } else {
        this.selectedSpecList[_pIndex].tagValue.splice(_sIndex, 1);
        this.productInfo.attrValue[pItem.fieldName].splice(_sIndex, 1);
        // 删除SKU关联数据
        if (_mIndex > -1) {
          // 单选取消后重置SKU
          this.setResetSkuVal(
            _pIndex,
            pItem.fieldName,
            pItem.isChecked,
            _sItem._id,
            _sItem.isChecked
          );
        }
        // 删除SKU关联数据END
      }
      if (!sItem.isChecked) {
        sItem.isChecked = true;
        this.productInfo.attrValue[pItem.fieldName] = [];
        this.selectedSpecList.splice(_pIndex, 0, resTag); // 这里不能用splice
      }
      if (_pItemTagValue.length === 0) {
        sItem.isChecked = false;
        // 当前行所有取消后重置SKU
        this.setResetSkuVal(
          _pIndex,
          pItem.fieldName,
          pItem.isChecked,
          _sItem._id,
          _sItem.isChecked
        );
        // delete this.productInfo.attrValue[sItem.fieldName]; // 删除提交规格
        this.selectedSpecList.splice(_pIndex, 1);
        this.selectedColumnSpec.splice(_pIndex, 1);
      }
    },
    //查找二维数组找出对应Key
    findKey(arr, id, key) {
      var obj = {
        checked: false,
        pIndex: key,
      };
      arr.map((_item, index) => {
        if (!_item.length) {
          obj.checked = true;
          obj.pIndex = index;
        }
        _item.map((_res, _index) => {
          if (_res._id === id) {
            obj.checked = true;
            obj.pIndex = index;
            obj.sIndex = _index;
          }
        });
      });
      return obj;
    },
    // 通用生成SKU方法
    setResetSkuVal(_pIndex, fieldName, isChecked, id, checked) {
      // 判断当前SKU与选择的属性对应，不能取选择的，要取skuValue数组里的索引，这里还会进行拖动
      var _plen = this.findKey(this.skuValue, id, _pIndex);
      var _fieldLen = this.productInfo.attrValue[fieldName];
      var _skuLen = this.skuValue[_plen.pIndex];
      // 判断当前行是否有全部选中，当前按钮是否选中
      if (isChecked && !_plen.checked && checked) {
        this.skuValue.splice(_plen.pIndex, 0, _fieldLen);
      }
      // 取当前SKU当前行对应的值是不选中
      if (_plen.checked && checked) {
        this.skuValue.splice(_plen.pIndex, 1, _fieldLen);
      }
      // 判断当前行是有存在就剔除
      if (
        !isChecked &&
        ((_skuLen && !_skuLen.length) || (!_skuLen && _plen.checked))
      ) {
        this.skuValue.splice(_plen.pIndex, 1);
      }
      // console.log(this.skuValue, _plen, isChecked);
      // 有值就去生成SKU
      if (this.skuValue.length > 0) {
        // 生成SKU
        var _skuVal = this.skuAttrValue(this.skuValue, true);
        // 将旧的规格列表与新的SKU合并去重
        this.skuArrValue = this.arrtArrToValue(_skuVal, this.historySpecList);
      } else {
        this.skuArrValue = [];
      }
    },
    skuInputready(key) {
      this.skuPrice[key] = [];
    },
    handleRemove(file, fileList) {
      const options = {
        files: {
          name: file.name,
          url: file.url,
        },
        _id: this.productInfo.thumbId,
      };
      this.moduleService.thumbnailDelete(options).then((res) => {
        this.$message.success("删除成功");
      });
    },
    handleSuccess(response, file, fileList) {
      this.fileList = response.data.files;
      this.productInfo.thumbId = this.uploadData.mid = response.data.mid;
    },
    handleError(val) {
      this.$message.error("上传失败");
    },
    handlePreview(file) {
      this.preview.url = file.url;
      this.preview.name = file.name;
      this.dialogVisible = true;
    },
    submitSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const state = this.paramsName;
          if (state === "update") {
            this.productInfo.id = this.$route.query.id || "";
          }
          this.productInfo.category =
            this.productInfo.categoryArr[
              this.productInfo.categoryArr.length - 1
            ]; // 重新取分类ID
          // 将当前价SKU价格写入promo_price
          if (this.productInfo.skuCurrentPrice.length > 0) {
            var _price = this.productInfo.skuCurrentPrice.find(
              (_res) => _res._id === "Price"
            );
            var _inventory = this.productInfo.skuCurrentPrice.find(
              (_res) => _res._id === "Inventory"
            );
          } else {
            this.$message.error("没有设置默认SKU");
          }

          this.productInfo.promo_price = _price.value;
          this.productInfo.inventory = _inventory.value;
          this.productInfo.skuArrValue = this.skuArrValue;
          this.productInfo.specIds = this.selectedSpecList;
          this.moduleService[state](this.productInfo).then((res) => {
            this.$message.success(state === "add" ? "添加成功" : "更新成功");
            this.dialogVisible = false;
            this.$router.push(`/product?time=${+new Date()}`);
          });
        } else {
          return false;
        }
      });
    },
    thumbReady(val) {
      this.productInfo.goodsThumbId = val;
    },
    brak() {
      this.$router.push({
        path: "/product",
        query: { time: +new Date() }, // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
      });
    },
    // 选择SKU
    changeAttrValue(data) {
      var dataItem = this.selectedSpecList.find(
        (item) => item.fieldName === data.name
      );
      var selectedItem = this.selectedSpecList[data.key];
      var selectedTagValue =
        this.selectedSpecList[data.key].tagValue[data.index];
      var _isDisabled = selectedItem.tagValue.filter((_res) => _res.isDisabled);
      if (!selectedItem.isChecked) {
        selectedItem.isChecked = true;
        this.selectedColumnSpec.splice(data.key, 0, {
          _id: dataItem._id,
          name: dataItem.name,
        });
      }
      selectedTagValue.isDisabled = data.isChecked;
      if (!data.isChecked && _isDisabled.length == 1) {
        selectedItem.isChecked = false;
        this.selectedColumnSpec.splice(data.key, 1);
      }
      // 判断当前行是否选择
      var isChecked = dataItem.isChecked;
      // 重置sku
      this.setResetSkuVal(
        data.key,
        data.name,
        isChecked,
        selectedTagValue._id,
        data.isChecked
      );
    },
    // SKU生成方法
    skuAttrValue(arrVal) {
      var arr = [];
      var skuFunc = function (skuarr = [], i, list, _keys = []) {
        for (let j = 0; j < list[i].length; j++) {
          if (i < list.length - 1) {
            skuarr[i] = list[i][j];
            skuFunc(skuarr, i + 1, list, _keys);
          } else {
            var sku_arr = [
              ...skuarr,
              list[i][j],
              { _id: "Inventory", value: "0" },
              { _id: "Price", value: "0" },
              { _id: "isShow", value: false },
            ];
            arr.push(sku_arr);
          }
        }
        return arr;
      };
      var _arrVal = skuFunc([], 0, arrVal);
      return _arrVal;
    },
    // 合并数据
    arrtArrToValue(arr1, arr2) {
      const arr4 = [];
      // 将属性ID拼成Key
      const _setKey = function (arr) {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
          if (
            arr[i]._id &&
            arr[i]._id !== "Inventory" &&
            arr[i]._id !== "Price" &&
            arr[i]._id !== "isShow"
          ) {
            str += arr[i]._id + "_";
          }
        }
        return str;
      };
      // 将重新拼装带Key的数组
      const _setArr = function (arr) {
        const arr4 = [];
        for (let i = 0; i < arr.length; i++) {
          var key = _setKey(arr[i]);
          arr4.push({ key: key, value: arr[i] });
        }
        return arr4;
      };
      const toArr_1 = _setArr(arr1); // 当前数据
      const toArr_2 = _setArr(arr2); // 历史数据
      // 过滤相同Key的数据
      toArr_1.map((item) => {
        let isFalg = true;
        toArr_2.map((_item) => {
          if (item.key === _item.key) {
            arr4.push(_item.value);
            isFalg = false;
          }
        });
        if (isFalg) {
          arr4.push(item.value);
        }
      });
      return arr4;
    },
  },
};
</script>
<style lang="less" scoped>
.table-form {
  margin-top: 20px;
}
.skuTitle {
  overflow: hidden;
  margin-left: -1px;
  .sname {
    display: inline-block;
    background-color: #eee;
    width: 119px;
    text-align: center;
    line-height: 34px;
    color: #3a3838;
  }
  .sname:last-child {
    width: 120px;
  }
}
.skuValue {
  height: 35px;
  .name {
    display: inline-block;
    width: 120px;
    text-align: center;
    border: 1px solid #eee;
    line-height: 34px;
    color: #3a3838;
    margin: -1px 0 0 -1px;
  }
  .input {
    margin: 0 8px;
  }
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
  overflow: hidden;
  .el-icon-plus {
    border: 1px solid #d8d6e1;
    padding: 4px;
    cursor: pointer;
  }
}

.el-form-item[draggable="true"] {
  background-color: #f5f8fa;
  border: 1px dashed #278fe7;
  border-radius: 4px;
}
.pedit {
  cursor: pointer;
}
.sku-show {
  position: relative;
  height: 30px;
  .sku-show-success {
    position: absolute;
    right: -28px;
    top: -9px;
    width: 46px;
    height: 26px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 1px 1px #ccc;
    box-shadow: 0 1px 1px #ccc;
    i.el-icon-check {
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      color: #fff;
      margin-left: 4px;
      margin-top: 12px;
    }
  }
}
.specList {
  background-color: #f7fbff;
  padding: 5px 18px;
  border-radius: 6px;
  border: 1px dashed #278fe7;
  .list {
    padding: 5px 0;
    display: flex;
    .name {
      margin-right: 10px;
    }
    .checkbox {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
