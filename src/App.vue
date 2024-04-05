<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
onMounted(() => {
  /**
   * 解决 css 引入图片在 github pages 无法获取的问题
   */
  // const { NODE_ENV } = process.env;
  // document.documentElement.className = NODE_ENV as string;
});
</script>
<style scoped></style>
