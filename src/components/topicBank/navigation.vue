<template>
  <div class="navigation">
    <div class="left">
      <div class="title" @click="backHome">
        <div class="logo">篆</div>
        <div class="text">小篆在线学习网站</div>
      </div>
      <el-menu
        class="menu-list"
        mode="horizontal"
        :default-active="menuActiveIndex"
        :ellipsis="false"
        @select="handleSelect"
        :popper-offset="16"
        style="background-color: #f5f6f7; margin-left: 20px"
      >
        <el-menu-item
          v-for="(item, index) in menus"
          :key="item.value"
          :index="String(index)"
          >{{ item.label }}</el-menu-item
        >
      </el-menu>
    </div>
    <div class="right">
      <el-switch
        v-model="lang"
        active-color="#ff4949"
        inactive-color="#13ce66"
        active-text="繁"
        inactive-text="简"
        class="lang"
        @change="langSwitch"
      >
      </el-switch>
      <el-button type="primary">注册</el-button>
      <el-button type="success">登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="navigation">
import { Search } from "@element-plus/icons-vue";
const router = useRouter();
const lang: Ref<boolean> = ref(false);
const menuActiveIndex: Ref<string> = ref("0");
const menus: Array<any> = [
  {
    label: "题库",
    value: "",
    path: "",
  },
  {
    label: "词语",
    value: "",
    path: "",
  },
  {
    label: "古诗文",
    value: "",
    path: "",
  },
  {
    label: "对照阅读",
    value: "",
    path: "",
  },
];
const searchConfig: Ref<any> = ref({
  title: "字典查询",
  dialogConfig: {
    width: 700,
    closeOnClickModal: true,
    closeOnPressEscape: false,
    showClose: false,
  },
  searchTip: "请输入汉字查询小篆",
  searchKey: "",
});
const searchDialog: Ref<boolean> = ref(true);
/** 返回主页 */
function backHome() {
  router.push("./home");
}
/** 搜索文字 */
function searchCharacters() {}
/**  */
function langSwitch() {
  console.log("语言方法更改！");
}
/**
 * 切换菜单
 */
function handleSelect(){

}
</script>

<style lang="scss">
$vertical-height: 60px;

.navigation {
  height: $vertical-height;
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
  box-shadow: 0 4px 6px -3px rgba(200, 200, 200, 0.8);

  .left {
    display: flex;
    line-height: $vertical-height;
    .title {
      display: flex;
      cursor: pointer;
      .logo {
        position: relative;
        font-size: 25px;
        font-weight: 700;
        font-family: "FangZhengXiaoZhuan";
      }

      .logo::after {
        position: absolute;
        content: "";
        width: 1px;
        height: 25px;
        font-weight: 100;
        top: calc(50% - 12px);
        background-color: #000;
      }

      .text {
        font-size: 25px;
        font-family: "FangZhengXiaoZhuan";
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    .search-btn {
      margin-right: 10px;
      border-radius: 15px;
      background-color: transparent;
      border: 1px solid transparent;
      color: #409eff;
    }
    .search-btn:hover {
      border: 1px solid #409eff;
    }
    .lang {
      display: block;
      margin-right: 10px;
    }
  }
}
.search-dialog {
  .search-result {
    margin-top: 10px;
    .result {
      margin-bottom: 30px;
      .jt,
      .ft,
      .xz {
        font-size: 50px;
        font-weight: 700;
        color: #000;
      }
      .ft {
        font-family: 'HanYiKaiTiFan';
      }
      .xz {
        font-family: 'FangZhengXiaoZhuan';
      }
    }
  }
}
</style>
