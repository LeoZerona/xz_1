<template>
  <!-- <div @click="showOverlay">显示图层蒙版</div> -->
  <!-- 图层蒙版 -->
  <div class="overlay" v-if="overlayShow" @click="hideOverlayWithDelay">
    <characters-big-card
      v-for="(item, index) in bigStyles"
      :key="index"
      :styleConfig="item"
      :character="characters"
      :show="showCard"
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
const { overlayShow, characters } = defineProps({
  overlayShow: {
    type: Boolean,
    default: () => false,
  },
  characters: {
    type: String,
    default: () => "篆",
  },
});
const emit = defineEmits(["hideBigCharactersPanel"]); // 调用父组件方法
// const overlayFlag = ref(true);
const showCard = ref(true);

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

function hideOverlayWithDelay() {
  showCard.value = false;
  setTimeout(() => {
    showCard.value = true
    emit("hideBigCharactersPanel", "");
  }, 400); // 0.4秒后隐藏 overlay
}
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
