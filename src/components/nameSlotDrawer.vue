<template>
  <el-drawer
    :model-value="drawerVisiable"
    :direction="drawerConfig.direction"
    :size="drawerConfig.size"
    :show-close="drawerConfig.showClose"
    :close-on-click-modal="drawerConfig.closeOnClickModal"
    :close-on-press-escape="drawerConfig.closeOnPressEscape"
    :before-close="beforeCloseFn"
  >
    <template #header>
      <slot name="header"> </slot>
    </template>
    <slot name="content"> </slot>

    <template #footer>
      <slot name="foot"></slot>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
type drawerConfigType = {
  size: string | number;
  direction: "rtl" | "ltr" | "ttb" | "btt" | undefined;
  closeOnClickModal: boolean;
  closeOnPressEscape: boolean;
  showClose: boolean;
};
const { drawerVisiable } = defineProps({
  drawerVisiable: {
    type: Boolean,
    require: true,
  },
  drawerConfig: {
    type: Object as () => drawerConfigType,
    default: () => ({
      size: "30%",
      direction: "rtl",
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: false,
    }),
  },
  beforeCloseFn:{
    type: Function,
    default: ()=>{}
  }
});
</script>
<style lang="scss" scoped></style>
