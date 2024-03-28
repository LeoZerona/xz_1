<template>
  <!-- 图层蒙版 -->
  <div class="overlay" v-if="showOverlay" @click="showOverlay = false">
    <characters-big-card
      v-for="(item, index) in bigStyles"
      :key="index"
      :styleConfig="item"
      character="办"
    ></characters-big-card>
  </div>
</template>
<script setup lang="ts">
type styleConfigType = {
  location: {
    top: string;
    left: string;
  };
  fontFamily: string;
};
const showOverlay = ref(true);

const addOverlay = () => {
  showOverlay.value = true;
};

const removeOverlay = () => {
  showOverlay.value = false;
};

const bigStyles: Array<styleConfigType> = [
  {
    location: {
      top: "20%",
      left: "14%",
    },
    fontFamily: "HanYiKaiTiFan",
  },
  {
    location: {
      top: "20%",
      left: "43%",
    },
    fontFamily: "FangZhengXiaoZhuan",
  },
  {
    location: {
      top: "20%",
      left: "71%",
    },
    fontFamily: "华文楷体",
  },
];
</script>
<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明灰色背景 */
  z-index: 9999;
}
</style>
