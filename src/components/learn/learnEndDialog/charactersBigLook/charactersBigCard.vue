<template>
  <el-card
    class="card"
    :class="show ? '' : 'hide'"
    shadow="hover"
    :style="{
      top: styleConfig.location.top,
      left: styleConfig.location.left,
      fontFamily: styleConfig.fontFamily,
    }"
  >
    <div class="content">{{ character }}</div>
  </el-card>
</template>
<script setup lang="ts">
type styleConfigType = {
  location: {
    top: string;
    left: string;
  };
  fontFamily: string;
};
const { show, styleConfig, character } = defineProps({
  show: {
    type: Boolean,
    require: true,
  },
  styleConfig: {
    type: Object as PropType<styleConfigType>,
    require: true,
  },
  character: {
    type: String,
    require: true,
  },
});
</script>
<style scoped lang="scss">
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 15%;
  height: 40%;
  animation: jelly 0.5s ease both; /* 应用名为"jelly"的动画，持续0.5秒，以ease方式进行动画，并保持最终状态 */
}
.hide {
  animation: shrink 0.5s ease both; /* 应用名为"jelly"的动画，持续0.5秒，以ease方式进行动画，并保持最终状态 */
}
@keyframes jelly {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1.1, 0.9);
  }
  50% {
    transform: scale(0.9, 1.1);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes shrink {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

.content {
  font-size: 200px;
}
</style>
