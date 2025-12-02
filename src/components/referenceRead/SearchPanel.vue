<template>
  <div class="search-panel">
    <el-input
      v-model="searchKey"
      placeholder="搜索文字..."
      clearable
      class="search-input"
      @input="handleSearch"
      @keyup.enter="handleNext"
      @keyup.esc="handleClear"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
      <template #suffix>
        <div class="search-actions" v-if="searchKey">
          <span class="search-count">{{ currentIndex + 1 }}/{{ totalCount }}</span>
          <el-button
            text
            size="small"
            @click="handlePrev"
            :disabled="totalCount === 0"
          >
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button
            text
            size="small"
            @click="handleNext"
            :disabled="totalCount === 0"
          >
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue';

interface Props {
  text: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  search: [searchKey: string, indexes: number[]];
  highlight: [indexes: number[]];
  clear: [];
}>();

const searchKey = ref('');
const searchIndexes = ref<number[]>([]);
const currentIndex = ref(-1);

const totalCount = computed(() => searchIndexes.value.length);

const handleSearch = (value: string) => {
  if (!value.trim()) {
    searchIndexes.value = [];
    currentIndex.value = -1;
    emit('clear');
    return;
  }

  const indexes: number[] = [];
  const text = props.text;
  const searchValue = value.trim();

  // 查找所有匹配的位置
  if (searchValue.length === 1) {
    // 单个字符匹配
    for (let i = 0; i < text.length; i++) {
      if (text[i] === searchValue) {
        indexes.push(i);
      }
    }
  } else {
    // 多个字符匹配
    let pos = text.indexOf(searchValue);
    while (pos !== -1) {
      for (let j = 0; j < searchValue.length; j++) {
        if (!indexes.includes(pos + j)) {
          indexes.push(pos + j);
        }
      }
      pos = text.indexOf(searchValue, pos + 1);
    }
  }

  searchIndexes.value = indexes;
  currentIndex.value = indexes.length > 0 ? 0 : -1;
  emit('search', value, indexes);
  emit('highlight', indexes);
};

const handleNext = () => {
  if (searchIndexes.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % searchIndexes.value.length;
  emit('highlight', [searchIndexes.value[currentIndex.value]]);
  scrollToIndex(searchIndexes.value[currentIndex.value]);
};

const handlePrev = () => {
  if (searchIndexes.value.length === 0) return;
  currentIndex.value = currentIndex.value <= 0 
    ? searchIndexes.value.length - 1 
    : currentIndex.value - 1;
  emit('highlight', [searchIndexes.value[currentIndex.value]]);
  scrollToIndex(searchIndexes.value[currentIndex.value]);
};

const handleClear = () => {
  searchKey.value = '';
  searchIndexes.value = [];
  currentIndex.value = -1;
  emit('clear');
};

const scrollToIndex = (index: number) => {
  // 滚动到指定位置
  nextTick(() => {
    const element = document.querySelector(`[data-char-index="${index}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
};
</script>

<style lang="scss" scoped>
.search-panel {
  margin-bottom: 20px;

  .search-input {
    max-width: 400px;

    .search-actions {
      display: flex;
      align-items: center;
      gap: 5px;

      .search-count {
        font-size: 12px;
        color: #909399;
        margin-right: 5px;
      }
    }
  }
}

@media (max-width: 768px) {
  .search-panel {
    margin-bottom: 15px;

    .search-input {
      max-width: 100%;
    }
  }
}
</style>

