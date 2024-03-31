<template></template>
<script lang="ts" setup>
type drawerConfigType = {
  width: number;
  closeOnClickModal: boolean;
  closeOnPressEscape: boolean;
  showClose: boolean;
};
const { drawerConfig } = defineProps({
  drawerValue: {
    type: Object as any,
    default: () => {},
  },
  drawerConfig: {
    type: Object as () => drawerConfigType,
    default: () => ({
      width: 500,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: false,
    }),
  },
});
</script>
<style lang="scss" scoped></style>
