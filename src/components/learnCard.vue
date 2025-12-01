<template>
  <!-- 答题区 -->
  <el-card
    :style="cardStyle"
    class="answer-card"
  >
    <div class="learn-card">
      <div class="title">选择以下正确的选项</div>
      <learning-progress
        :current="topic.index"
        :total="topic.count"
      />
      <div class="characters">
        <character-display
          :character="topic.answer"
          :show-ft="false"
          :show-jt="false"
          size="large"
        />
      </div>
      <div
        v-if="showSearchBtn"
        class="search-btn"
        @click="handleSearchClick"
      >
        <el-icon><Search /></el-icon>
      </div>
      <!-- 题目卡片 -->
      <question-card
        :type="topic.type"
        :options="topic.options"
        @answer="handleAnswer"
      />
    </div>
    <!-- 答题提示 -->
    <answer-tip
      v-if="showTip"
      :visible="showTip"
      :is-correct="isCorrect ?? false"
      :answer="topic.answer"
      @confirm="handleNext"
    />
  </el-card>
  <!-- 字典查询区 -->
  <dictionary-search
    :visible="searchVisible"
    :card-style="searchCardStyle"
    @close="handleSearchClose"
  />
</template>

<script lang="ts" setup name="LearnCard">
import { unitData } from '@/store/unit';
import { storeToRefs } from 'pinia';
import CharacterDisplay from './common/CharacterDisplay.vue';
import DictionarySearch from './common/DictionarySearch.vue';
import LearningProgress from './common/LearningProgress.vue';
import AnswerTip from './common/AnswerTip.vue';
import QuestionCard from './common/QuestionCard.vue';

interface TopicType {
  index: number;
  count: number;
  type: string;
  answer: string;
  options: Array<string>;
}

const props = defineProps<{
  topic: TopicType;
}>();

const emit = defineEmits<{
  next: [index: number];
}>();

const unit = unitData();
const { endDialog, errorTopics } = storeToRefs(unit);

const isCorrect = ref<boolean | null>(null);
const searchVisible = ref(false);

const showTip = computed(() => isCorrect.value !== null);
const showSearchBtn = computed(() => isCorrect.value !== null);

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});

const cardStyle = computed(() => {
  if (isMobile.value) {
    // 移动端：始终居中，字典查询时卡片上移
    if (isCorrect.value !== null && searchVisible.value) {
      return { 
        left: '50%',
        top: '35%',
        transform: 'translate(-50%, -50%)'
      };
    }
    return { 
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  // PC端：原有逻辑
  if (isCorrect.value !== null && searchVisible.value) {
    return { left: '39.9%' };
  }
  return { left: '50%' };
});

const searchCardStyle = computed(() => {
  if (isMobile.value) {
    // 移动端：字典查询在卡片下方
    if (isCorrect.value !== null && searchVisible.value) {
      return { 
        left: '50%',
        top: '70%',
        transform: 'translate(-50%, -50%)'
      };
    }
    return { 
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  // PC端：原有逻辑
  if (isCorrect.value !== null && searchVisible.value) {
    return { left: '60%' };
  }
  return { left: '50%' };
});

const handleAnswer = (value: string) => {
  const correct = props.topic.answer === value;
  isCorrect.value = correct;
  
  if (!correct) {
    // 获取当前题目在原始字符数组中的索引
    let originalIndex: number;
    if (errorTopics.value.relearn) {
      // 错题重学模式：topic.index 是从1开始的题号，需要转换为错题数组索引
      const arrayIndex = props.topic.index - 1;
      if (arrayIndex >= 0 && arrayIndex < errorTopics.value.errIndexs.length) {
        originalIndex = errorTopics.value.errIndexs[arrayIndex];
      } else {
        // 如果索引无效，跳过记录
        searchVisible.value = false;
        return;
      }
    } else {
      // 正常模式：topic.index 是从1开始的题号，需要转换为数组索引
      originalIndex = props.topic.index - 1;
    }
    
    // 避免重复添加
    if (!errorTopics.value.errIndexs.includes(originalIndex)) {
      errorTopics.value.errIndexs.push(originalIndex);
    }
  }
  
  searchVisible.value = false;
};

const handleNext = () => {
  isCorrect.value = null;
  // 计算下一题的索引（原始字符数组中的索引）
  let nextIndex: number;
  if (errorTopics.value.relearn) {
    // 错题重学模式：topic.index 是从1开始的题号
    const currentArrayIndex = props.topic.index; // 当前在错题数组中的位置（从1开始）
    if (currentArrayIndex < errorTopics.value.errIndexs.length) {
      // 获取下一题在错题数组中的原始索引
      nextIndex = errorTopics.value.errIndexs[currentArrayIndex];
    } else {
      nextIndex = -1; // 没有下一题了
    }
  } else {
    // 正常模式：topic.index 是从1开始的题号，下一题是 index（转换为0-based）
    nextIndex = props.topic.index;
  }
  emit('next', nextIndex);
};

const handleSearchClick = () => {
  searchVisible.value = true;
};

const handleSearchClose = () => {
  searchVisible.value = false;
};
</script>

<style lang="scss" scoped>
.answer-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  min-height: 550px;
  border-right: 0px;
  z-index: 1;
  transition: all 0.5s ease;

  .learn-card {
    .title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .characters {
      margin-top: 30px;
      text-align: center;
    }

    .search-btn {
      position: absolute;
      top: 16%;
      right: 0;
      width: 30px;
      height: 15px;
      padding: 5px;
      cursor: pointer;
      border: 1px solid #c1c1c1;
      color: #c1c1c1;
      border-radius: 14px 0px 0px 14px;
      border-right: 0px;
      transition: all 0.3s;

      &:hover {
        color: #40a9ff;
        border-color: #40a9ff;
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .answer-card {
    width: 90%;
    min-height: auto;
    max-width: 500px;
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;

    .learn-card {
      .title {
        font-size: 18px;
        margin-bottom: 15px;
      }

      .characters {
        margin-top: 20px;
      }

      .search-btn {
        top: 12%;
        width: 35px;
        height: 20px;
        padding: 6px;
      }
    }
  }

  // 字典查询在移动端的样式
  :deep(.dictionary-search) {
    width: 90% !important;
    max-width: 500px !important;
    max-height: 50vh;
    overflow-y: auto;
  }
}

@media (max-width: 480px) {
  .answer-card {
    width: 95%;
    padding: 15px;
    max-height: 90vh;
    overflow-y: auto;

    .learn-card {
      .title {
        font-size: 16px;
        margin-bottom: 12px;
      }

      .characters {
        margin-top: 15px;
      }

      .search-btn {
        top: 10%;
        width: 32px;
        height: 18px;
        padding: 5px;
      }
    }
  }
}
</style>
