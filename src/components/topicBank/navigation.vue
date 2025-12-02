<template>
  <div class="navigation">
    <div class="left">
      <div class="title" @click="backHome">
        <div class="logo">篆</div>
        <div class="text">小篆在线学习网站</div>
      </div>
      <!-- PC端菜单 -->
      <el-menu
        v-if="!isMobile"
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
      <!-- 移动端汉堡菜单按钮 -->
      <el-icon 
        v-if="isMobile" 
        class="menu-toggle"
        @click="mobileMenuVisible = !mobileMenuVisible"
      >
        <Menu />
      </el-icon>
    </div>
    <div class="right">
      <el-switch
        v-if="!isMobile"
        v-model="lang"
        active-color="#ff4949"
        inactive-color="#13ce66"
        active-text="繁"
        inactive-text="简"
        class="lang"
        @change="langSwitch"
      >
      </el-switch>
      <el-button v-if="!isMobile" type="primary">注册</el-button>
      <el-button v-if="!isMobile" type="success">登录</el-button>
      <!-- 移动端用户操作按钮 -->
      <el-icon 
        v-if="isMobile" 
        class="user-icon"
        @click="userMenuVisible = !userMenuVisible"
      >
        <User />
      </el-icon>
    </div>
    <!-- 移动端菜单抽屉 -->
    <el-drawer
      v-model="mobileMenuVisible"
      title="菜单"
      direction="rtl"
      size="70%"
      :with-header="true"
    >
      <el-menu
        mode="vertical"
        :default-active="menuActiveIndex"
        @select="handleMobileSelect"
      >
        <el-menu-item
          v-for="(item, index) in menus"
          :key="item.value"
          :index="String(index)"
        >
          {{ item.label }}
        </el-menu-item>
      </el-menu>
      <div class="mobile-menu-footer">
        <el-switch
          v-model="lang"
          active-color="#ff4949"
          inactive-color="#13ce66"
          active-text="繁"
          inactive-text="简"
          class="lang"
          @change="langSwitch"
        />
        <div class="mobile-buttons">
          <el-button type="primary" style="width: 100%; margin-bottom: 10px">注册</el-button>
          <el-button type="success" style="width: 100%">登录</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 移动端用户菜单 -->
    <el-drawer
      v-model="userMenuVisible"
      title="用户"
      direction="rtl"
      size="60%"
      :with-header="true"
    >
      <div class="user-menu-content">
        <el-switch
          v-model="lang"
          active-color="#ff4949"
          inactive-color="#13ce66"
          active-text="繁"
          inactive-text="简"
          class="lang"
          @change="langSwitch"
        />
        <div class="mobile-buttons">
          <el-button type="primary" style="width: 100%; margin-bottom: 10px">注册</el-button>
          <el-button type="success" style="width: 100%">登录</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="navigation">
import { Menu, User } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const lang: Ref<boolean> = ref(false);
const menuActiveIndex: Ref<string> = ref("0");
const mobileMenuVisible = ref(false);
const userMenuVisible = ref(false);
const isMobile = ref(false);

const menus: Array<any> = [
  {
    label: "题库",
    value: "topicBank",
    path: "/topic_bank",
  },
  {
    label: "词语",
    value: "words",
    path: "/words",
  },
  {
    label: "古诗文",
    value: "poetry",
    path: "/poetry",
  },
  {
    label: "对照阅读",
    value: "referenceRead",
    path: "/reference_read",
  },
];

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 根据当前路由设置激活的菜单项
const setActiveMenu = () => {
  const currentPath = route.path;
  const activeIndex = menus.findIndex(item => item.path === currentPath);
  if (activeIndex !== -1) {
    menuActiveIndex.value = String(activeIndex);
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  setActiveMenu();
});

watch(() => route.path, () => {
  setActiveMenu();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});

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

/** 菜单选择处理 */
function handleSelect(index: string) {
  menuActiveIndex.value = index;
  const menuItem = menus[Number(index)];
  if (menuItem && menuItem.path) {
    router.push(menuItem.path);
  }
  // TODO: 根据不同的菜单项实现相应的导航逻辑
}

/** 移动端菜单选择处理 */
function handleMobileSelect(index: string) {
  handleSelect(index);
  mobileMenuVisible.value = false;
}

/** 搜索文字 */
function searchCharacters() {}

/** 语言切换 */
function langSwitch() {
  // TODO: 实现语言切换功能
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
  position: relative;
  z-index: 1000;

  .left {
    display: flex;
    line-height: $vertical-height;
    flex: 1;
    min-width: 0;
    
    .title {
      display: flex;
      cursor: pointer;
      align-items: center;
      flex-shrink: 0;
      
      .logo {
        position: relative;
        font-size: 25px;
        font-weight: 700;
        font-family: "FangZhengXiaoZhuan";
        flex-shrink: 0;
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 5px;
      }
    }

    .menu-list {
      flex: 1;
      min-width: 0;
    }
  }

  .right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 8px;
    
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

/* 移动端适配 */
@media (max-width: 768px) {
  .navigation {
    height: 50px;
    padding: 0px 8px;

    .left {
      line-height: 50px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .title {
        flex: 1;
        min-width: 0;
        
        .logo {
          font-size: 22px;
        }

        .logo::after {
          height: 20px;
          top: calc(50% - 10px);
        }

        .text {
          font-size: 16px;
          display: none; // 小屏幕隐藏文字
        }
      }

      .menu-list {
        display: none; // 移动端隐藏水平菜单
      }

      .menu-toggle {
        font-size: 24px;
        cursor: pointer;
        color: #409eff;
        margin-left: 10px;
        flex-shrink: 0;
        padding: 5px;
        transition: transform 0.3s;

        &:active {
          transform: scale(0.9);
        }
      }
    }

    .right {
      gap: 8px;
      flex-shrink: 0;
      
      .lang {
        display: none; // 移动端在抽屉中显示
      }

      :deep(.el-button) {
        display: none; // 移动端在抽屉中显示
      }

      .user-icon {
        font-size: 24px;
        cursor: pointer;
        color: #409eff;
        padding: 5px;
        transition: transform 0.3s;

        &:active {
          transform: scale(0.9);
        }
      }
    }
  }

  .mobile-menu-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;

    .lang {
      display: block;
      margin-bottom: 20px;
    }

    .mobile-buttons {
      display: flex;
      flex-direction: column;
    }
  }

  .user-menu-content {
    padding: 20px 0;

    .lang {
      display: block;
      margin-bottom: 20px;
    }

    .mobile-buttons {
      display: flex;
      flex-direction: column;
    }
  }
}

@media (max-width: 480px) {
  .navigation {
    height: 48px;
    padding: 0px 5px;

    .left {
      line-height: 48px;
      
      .title {
        .logo {
          font-size: 20px;
        }

        .logo::after {
          height: 18px;
          top: calc(50% - 9px);
        }
      }

      .menu-toggle {
        font-size: 22px;
        margin-left: 8px;
      }
    }

    .right {
      .user-icon {
        font-size: 22px;
      }
    }
  }

  :deep(.el-drawer) {
    .el-drawer__header {
      margin-bottom: 20px;
      padding: 20px;
    }

    .el-drawer__body {
      padding: 20px;
    }
  }
}
</style>
