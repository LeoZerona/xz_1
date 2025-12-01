<template>
  <div class="question-card">
    <!-- 选择题 -->
    <div v-if="type === 'select'" class="options">
      <el-button
        v-for="(item, index) in options"
        :key="index"
        class="option-btn"
        @click="handleSelect(item)"
      >
        {{ item }}
      </el-button>
    </div>
    <!-- 填空题 -->
    <div v-else-if="type === 'write'" class="fill-blank">
      <el-input
        v-model="inputValue"
        class="input-box"
        placeholder="请输入对应答案"
        clearable
        @keyup.enter="handleConfirm"
      />
      <el-button
        type="primary"
        class="confirm-btn"
        @click="handleConfirm"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="QuestionCard">
interface Props {
  type: 'select' | 'write';
  options?: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  answer: [value: string];
}>();

const inputValue = ref('');

const handleSelect = (value: string) => {
  emit('answer', value);
};

const handleConfirm = () => {
  if (inputValue.value.trim()) {
    emit('answer', inputValue.value.trim());
  }
};

watch(() => props.type, () => {
  inputValue.value = '';
});
</script>

<style lang="scss" scoped>
.question-card {
  .options {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .option-btn {
      height: 64px;
      font-size: 20px;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .fill-blank {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .input-box {
      height: 50px;
      line-height: 50px;
    }

    .confirm-btn {
      height: 50px;
      font-size: 16px;
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .question-card {
    .options {
      margin-top: 15px;
      gap: 12px;

      .option-btn {
        height: 56px;
        font-size: 18px;
      }
    }

    .fill-blank {
      margin-top: 30px;
      gap: 12px;

      .input-box {
        height: 48px;
        line-height: 48px;
      }

      .confirm-btn {
        height: 48px;
        font-size: 15px;
      }
    }
  }
}

@media (max-width: 480px) {
  .question-card {
    .options {
      margin-top: 12px;
      gap: 10px;

      .option-btn {
        height: 50px;
        font-size: 16px;
      }
    }

    .fill-blank {
      margin-top: 25px;
      gap: 10px;

      .input-box {
        height: 44px;
        line-height: 44px;
      }

      .confirm-btn {
        height: 44px;
        font-size: 14px;
      }
    }
  }
}
</style>

