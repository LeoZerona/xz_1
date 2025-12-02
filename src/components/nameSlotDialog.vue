<template>
  <el-dialog
    :model-value="dialogFlog"
    @update:model-value="handleUpdate"
    :width="dialogConfig.width"
    :append-to-body="dialogConfig.appendToBody"
    :show-close="dialogConfig.showClose"
    :close-on-click-modal="dialogConfig.closeOnClickModal"
    :close-on-press-escape="dialogConfig.closeOnPressEscape"
    :before-close="handleBeforeClose"
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
const props = defineProps({
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

const emit = defineEmits<{
  'update:dialogFlog': [value: boolean]
}>();

const handleUpdate = (value: boolean) => {
  emit('update:dialogFlog', value);
};

const handleBeforeClose = (done: () => void) => {
  if (props.beforeCloseFn) {
    props.beforeCloseFn();
  }
  done();
};
</script>

<style lang="scss" scoped>
/* 移动端适配 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    max-width: 500px !important;
    margin: 5vh auto !important;
  }

  :deep(.el-dialog__body) {
    padding: 15px !important;
  }
}

@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 3vh auto !important;
  }

  :deep(.el-dialog__header) {
    padding: 15px 15px 10px !important;
  }

  :deep(.el-dialog__body) {
    padding: 12px !important;
  }

  :deep(.el-dialog__footer) {
    padding: 10px 15px !important;
  }
}
</style>