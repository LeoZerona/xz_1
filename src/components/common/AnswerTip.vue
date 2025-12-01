<template>
  <el-card
    v-if="visible"
    class="answer-tip"
    :style="tipStyle"
  >
    <div class="head">
      <el-icon class="icon">
        <component :is="iconComponent" />
      </el-icon>
      <div class="text">{{ title }}</div>
    </div>
    <div class="content">
      <div class="tip-label">参考答案：</div>
      <div class="answer">
        <character-display
          :character="answer"
          :show-ft="false"
          :show-separator="false"
          size="medium"
        />
        <span class="answer-jt">（{{ answer }}）</span>
      </div>
      <el-button
        :type="isCorrect === null ? 'info' : (isCorrect ? 'success' : 'danger')"
        class="btn"
        @click="handleConfirm"
      >
        知道了
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="AnswerTip">
import CharacterDisplay from './CharacterDisplay.vue';

interface Props {
  visible: boolean;
  isCorrect: boolean | null;
  answer: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  confirm: [];
}>();

const iconComponent = computed(() => {
  if (props.isCorrect === null) return 'QuestionFilled';
  return props.isCorrect ? 'CircleCheckFilled' : 'CircleCloseFilled';
});

const title = computed(() => {
  if (props.isCorrect === null) return '等待答题';
  return props.isCorrect ? '太棒了！' : '可惜';
});

const tipStyle = computed(() => {
  if (props.isCorrect === null) return { color: '#909399' };
  return {
    color: props.isCorrect ? '#92d436' : '#d74746',
  };
});

const handleConfirm = () => {
  emit('confirm');
};
</script>

<style lang="scss" scoped>
.answer-tip {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;

  .head {
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;

    .icon {
      font-size: 30px;
      margin-top: 2px;
    }

    .text {
      font-size: 30px;
      margin-left: 10px;
    }
  }

  .content {
    margin-top: 10px;

    .tip-label {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .answer {
      margin-top: 10px;
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 10px;

      .answer-jt {
        color: #909399;
      }
    }
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    color: #191b26;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
    box-shadow: inset 2px -5px 4px rgba(0, 0, 0, 0.2);

    &:focus {
      color: rgba(25, 27, 38, 0.5);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .answer-tip {
    .head {
      height: 28px;
      line-height: 28px;

      .icon {
        font-size: 26px;
      }

      .text {
        font-size: 26px;
        margin-left: 8px;
      }
    }

    .content {
      margin-top: 8px;

      .tip-label {
        font-size: 16px;
        margin-bottom: 8px;
      }

      .answer {
        margin-top: 8px;
        font-size: 18px;
        gap: 8px;
      }
    }

    .btn {
      margin-top: 8px;
      height: 48px;
      font-size: 15px;
    }
  }
}

@media (max-width: 480px) {
  .answer-tip {
    .head {
      height: 26px;
      line-height: 26px;

      .icon {
        font-size: 24px;
      }

      .text {
        font-size: 24px;
        margin-left: 6px;
      }
    }

    .content {
      margin-top: 6px;

      .tip-label {
        font-size: 14px;
        margin-bottom: 6px;
      }

      .answer {
        margin-top: 6px;
        font-size: 16px;
        gap: 6px;
      }
    }

    .btn {
      margin-top: 6px;
      height: 44px;
      font-size: 14px;
    }
  }
}
</style>

