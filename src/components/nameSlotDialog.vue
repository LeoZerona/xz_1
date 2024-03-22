<template>
  <el-dialog
    :model-value="dialogFlog"
    :width="dialogConfig.width"
    :append-to-body="dialogConfig.appendToBody"
    :show-close="dialogConfig.showClose"
    :close-on-click-modal="dialogConfig.closeOnClickModal"
    :close-on-press-escape="dialogConfig.closeOnPressEscape"
    :before-close="beforeCloseFn"
  >
    <template #header>
      <slot name="header"> </slot>
    </template>
    <slot name="content"></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="nameSlotDialog">
type dialogConfigType = {
  width: number;
  appendToBody: boolean,
  closeOnClickModal: boolean;
  closeOnPressEscape: boolean;
  showClose: boolean;
};
const { dialogFlog } = defineProps({
  dialogFlog: {
    type: Boolean,
    require: true,
  },
  dialogConfig: {
    type: Object as () => dialogConfigType,
    default: () => ({
      width: 500, // 弹窗宽度
      appendToBody: false,
      closeOnClickModal: false, // 是否支持点击空白处关闭弹窗
      closeOnPressEscape: false, // 是否支持通过按下ESC关闭弹窗
      showClose: false, // 是否显示关闭按钮
    }),
  },
  beforeCloseFn:{
    type: Function,
    default: ()=>{}
  }
});
// 监听方法
watchEffect(() => {
  console.log("unitInfo changed:", dialogFlog);
});
</script>
