<template>
  <el-dialog :model-value="dialogFlog" :width="dialogConfig.width" :show-close="dialogConfig.showClose"
    :close-on-click-modal="dialogConfig.closeOnClickModal" :close-on-press-escape="dialogConfig.closeOnPressEscape">
    <template #header>
      {{ title }}
    </template>
    <slot name="content"></slot>
    <template #footer>
      <slot name="foot"></slot>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="nameSlotDialog">
type dialogConfigType = {
  width: number,
  closeOnClickModal: boolean,
  closeOnPressEscape: boolean,
  showClose: boolean,
}
const { dialogFlog } = defineProps({
  dialogFlog:{
    type:Boolean,
    require: true
  },
  title: {
    type: String,
    default: '提示'
  },
  dialogConfig: {
    type: Object as () => dialogConfigType,
    default: () => ({
      width: 500,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: false,
    })
  }
})
const aaa:Ref<boolean> = ref(false)
// 监听方法
watchEffect(() => {
  console.log('unitInfo changed:', dialogFlog);
})
</script>
