<template>
  <div class="progress-bar" v-if="showProgress">
    <div class="progress-info">
      <span class="progress-text">阅读进度</span>
      <span class="progress-percentage">{{ percentage }}%</span>
    </div>
    <el-progress
      :percentage="percentage"
      :stroke-width="8"
      :show-text="false"
    />
    <div class="progress-stats">
      <span>已读: {{ readCount }}/{{ totalCount }}</span>
      <span v-if="readingTime > 0">阅读时长: {{ formatTime(readingTime) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPosition: number;
  totalCount: number;
  readingTime?: number; // 秒
  showProgress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readingTime: 0,
  showProgress: true,
});

const percentage = computed(() => {
  if (props.totalCount === 0) return 0;
  return Math.round((props.currentPosition / props.totalCount) * 100);
});

const readCount = computed(() => props.currentPosition);

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  } else {
    return `${secs}秒`;
  }
};
</script>

<style lang="scss" scoped>
.progress-bar {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .progress-text {
      font-weight: 600;
      color: #303133;
    }

    .progress-percentage {
      font-size: 18px;
      font-weight: 700;
      color: #409eff;
    }
  }

  .progress-stats {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
    font-size: 12px;
    color: #909399;
  }
}

@media (max-width: 768px) {
  .progress-bar {
    padding: 12px;
    margin-bottom: 15px;

    .progress-info {
      .progress-percentage {
        font-size: 16px;
      }
    }

    .progress-stats {
      flex-direction: column;
      gap: 5px;
    }
  }
}
</style>

