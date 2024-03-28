<template>
  <el-card
    class="card"
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
const { styleConfig, character } = defineProps({
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
}
.content {
  font-size: 200px;
}
</style>
