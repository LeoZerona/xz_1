<template>
  <div class="navigation">
    <div class="left">
      <div class="logo">篆</div>
      <div class="text">小篆在线学习网站</div>
      <el-menu
        :default-active="activeIndex"
        class="menu-list"
        mode="horizontal"
        @select="handleSelect"
        style="width: 700px; margin-left: 20px;"
      >
        <el-menu-item index="1">Processing Center</el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <el-switch
        v-model="lang"
        active-color="#ff4949"
        inactive-color="#13ce66"
        active-text="Eng"
        inactive-text="中"
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
const lang: Ref<boolean> = ref(false);
const activeIndex: Ref<number> = ref(0);
function langSwitch() {
  console.log("语言方法更改！");
  // lang.value = !lang.value
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
    .logo {
      position: relative;
      font-size: 25px;
      font-weight: 700;
      font-family: "方正小篆体";
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
      font-family: "方正小篆体";
    }
  }

  .right {
    display: flex;
    align-items: center;
    .lang {
      display: block;
      margin-right: 10px;
    }
  }
}
</style>
