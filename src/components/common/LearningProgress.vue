<template>
  <el-progress
    class="learning-progress"
    :percentage="percentage"
    :text-inside="true"
    :stroke-width="strokeWidth"
    :color="progressColor"
    :format="format"
  />
</template>

<script setup lang="ts" name="LearningProgress">
interface Props {
  current: number;
  total: number;
  strokeWidth?: number;
  showText?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  strokeWidth: 20,
  showText: true,
});

const percentage = computed(() => {
  if (props.total === 0) return 0;
  return Math.floor((props.current / props.total) * 100);
});

const customColors = [
  { color: '#9DD3A8', percentage: 20 },
  { color: '#F7D794', percentage: 40 },
  { color: '#FFAB91', percentage: 60 },
  { color: '#6A82FB', percentage: 80 },
  { color: '#78E08F', percentage: 100 },
];

const progressColor = computed(() => {
  return customColors;
});

const format = (percentage: number) => {
  if (!props.showText) return '';
  return percentage === 100 ? '完成' : `${props.current}/${props.total}`;
};
</script>

<style lang="scss" scoped>
.learning-progress {
  width: 100%;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .learning-progress {
    margin-bottom: 10px;

    :deep(.el-progress-bar__outer) {
      height: 18px !important;
      border-radius: 9px;
    }

    :deep(.el-progress-bar__inner) {
      border-radius: 9px;
    }

    :deep(.el-progress__text) {
      font-size: 12px;
      font-weight: 600;
    }
  }
}

@media (max-width: 480px) {
  .learning-progress {
    margin-bottom: 8px;

    :deep(.el-progress-bar__outer) {
      height: 16px !important;
      border-radius: 8px;
    }

    :deep(.el-progress-bar__inner) {
      border-radius: 8px;
    }

    :deep(.el-progress__text) {
      font-size: 11px;
    }
  }
}

@media (max-width: 360px) {
  .learning-progress {
    margin-bottom: 6px;

    :deep(.el-progress-bar__outer) {
      height: 14px !important;
      border-radius: 7px;
    }

    :deep(.el-progress-bar__inner) {
      border-radius: 7px;
    }

    :deep(.el-progress__text) {
      font-size: 10px;
    }
  }
}
</style>

