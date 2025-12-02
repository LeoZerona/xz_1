<template>
  <navigation></navigation>
  <div class="reference-read-container">
    <div class="control-panel">
      <!-- 文章选择器 -->
      <article-selector
        :articles="articles"
        :current-article-id="currentArticleId"
        @change="handleArticleChange"
      />
      
      <!-- 工具栏 -->
      <toolbar
        v-model:fontSize="cellSize"
        :min-size="30"
        :max-size="120"
        @reset="handleReset"
      />
      
      <!-- 搜索面板 -->
      <search-panel
        :text="text"
        @search="handleSearch"
        @highlight="handleHighlight"
        @clear="handleClearSearch"
      />
      
      <!-- 稿纸配置面板 -->
      <grid-config-panel
        v-model:grid-type="gridType"
        v-model:show-pinyin="showPinyin"
      />
      
      <!-- 进度条 -->
      <progress-bar
        :current-position="readingPosition"
        :total-count="text.length"
        :reading-time="readingTime"
      />
    </div>

    <!-- 文字网格 -->
    <div class="text-content" v-loading="loading">
      <text-grid
        v-if="text"
        :text="text"
        :cell-size="cellSize"
        :gap="gap"
        :highlight-indexes="highlightIndexes"
        :grid-type="gridType"
        :show-pinyin="showPinyin"
        :pinyin-map="pinyinMap"
      />
      <el-empty v-else description="暂无内容" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import ArticleSelector from '@/components/referenceRead/ArticleSelector.vue'
import TextGrid from '@/components/referenceRead/TextGrid.vue'
import SearchPanel from '@/components/referenceRead/SearchPanel.vue'
import Toolbar from '@/components/referenceRead/Toolbar.vue'
import ProgressBar from '@/components/referenceRead/ProgressBar.vue'
import GridConfigPanel from '@/components/referenceRead/GridConfigPanel.vue'
import { getPinyinMap } from '@/utils/pinyin'

interface Article {
  id: string;
  title: string;
  author?: string;
  source: string;
  category?: string;
}

/* ===== 文章数据 ===== */
const articles: Article[] = [
  {
    id: 'default',
    title: '默认文章',
    source: '/article.txt'
  },
  // 可以添加更多文章
  // {
  //   id: 'tengwangge',
  //   title: '滕王阁序',
  //   author: '王勃',
  //   source: '/articles/tengwangge.txt',
  //   category: '古诗文'
  // },
]

/* ===== 状态管理 ===== */
const currentArticleId = ref('default')
const text = ref('')
const loading = ref(false)
const cellSize = ref(69)
const gap = ref(10)
const highlightIndexes = ref<number[]>([])
const readingPosition = ref(0)
const readingTime = ref(0)
let readingTimer: number | null = null
const gridType = ref<'tian' | 'mi' | 'none'>('tian')
const showPinyin = ref(false)
const pinyinMap = ref<Record<number, string>>({})

/* ===== 加载文章 ===== */
const loadArticle = async (articleId: string) => {
  const article = articles.find(a => a.id === articleId)
  if (!article) {
    text.value = '文章不存在'
    return
  }

  loading.value = true
  try {
    const res = await fetch(article.source)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.text()
    text.value = data.trim()
    readingPosition.value = 0
    highlightIndexes.value = []
    
    // 加载保存的进度
    loadReadingProgress(articleId)
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error('读取文章失败', e)
    }
    text.value = '文件加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

/* ===== 文章切换 ===== */
const handleArticleChange = (articleId: string) => {
  currentArticleId.value = articleId
  loadArticle(articleId)
}

/* ===== 搜索功能 ===== */
const handleSearch = (searchKey: string, indexes: number[]) => {
  highlightIndexes.value = indexes
  if (indexes.length > 0) {
    // 滚动到第一个结果
    nextTick(() => {
      scrollToIndex(indexes[0])
    })
  }
}

const handleHighlight = (indexes: number[]) => {
  highlightIndexes.value = indexes
  if (indexes.length > 0) {
    scrollToIndex(indexes[0])
  }
}

const handleClearSearch = () => {
  highlightIndexes.value = []
}

const scrollToIndex = (index: number) => {
  // 通过计算位置滚动到指定字符
  const element = document.querySelector(`[data-char-index="${index}"]`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

/* ===== 字体大小重置 ===== */
const handleReset = () => {
  cellSize.value = 69
  gap.value = 10
}

/* ===== 阅读进度跟踪 ===== */
const startReadingTimer = () => {
  if (readingTimer) return
  readingTimer = window.setInterval(() => {
    readingTime.value++
    // 每10秒保存一次进度
    if (readingTime.value % 10 === 0) {
      saveReadingProgress()
    }
  }, 1000)
}

const stopReadingTimer = () => {
  if (readingTimer) {
    clearInterval(readingTimer)
    readingTimer = null
  }
}

const saveReadingProgress = () => {
  if (!currentArticleId.value || !text.value) return
  
  const progress = {
    articleId: currentArticleId.value,
    position: readingPosition.value,
    percentage: text.value.length > 0 
      ? Math.round((readingPosition.value / text.value.length) * 100) 
      : 0,
    readingTime: readingTime.value,
    lastReadTime: new Date().toISOString()
  }
  
  localStorage.setItem(
    `readingProgress_${currentArticleId.value}`,
    JSON.stringify(progress)
  )
}

const loadReadingProgress = (articleId: string) => {
  const saved = localStorage.getItem(`readingProgress_${articleId}`)
  if (saved) {
    try {
      const progress = JSON.parse(saved)
      readingPosition.value = progress.position || 0
      readingTime.value = progress.readingTime || 0
    } catch (e) {
      console.error('加载阅读进度失败', e)
    }
  }
}

/* ===== 监听滚动更新阅读位置 ===== */
const updateReadingPosition = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // 根据滚动位置估算阅读进度
  const scrollPercentage = scrollTop / (documentHeight - windowHeight)
  readingPosition.value = Math.round(text.value.length * scrollPercentage)
}

/* ===== 生命周期 ===== */
onMounted(async () => {
  await loadArticle(currentArticleId.value)
  startReadingTimer()
  window.addEventListener('scroll', updateReadingPosition)
  updateReadingPosition()
})

onBeforeUnmount(() => {
  stopReadingTimer()
  saveReadingProgress()
  window.removeEventListener('scroll', updateReadingPosition)
})

/* ===== 监听文本变化重置进度 ===== */
watch(() => text.value, () => {
  readingPosition.value = 0
  readingTime.value = 0
  // 更新拼音映射
  if (showPinyin.value) {
    pinyinMap.value = getPinyinMap(text.value)
  }
})

/* ===== 监听拼音显示开关 ===== */
watch(() => showPinyin.value, (show) => {
  if (show && text.value) {
    pinyinMap.value = getPinyinMap(text.value)
  } else {
    pinyinMap.value = {}
  }
})
</script>

<style lang="scss" scoped>
.reference-read-container {
  min-height: calc(100vh - 60px);
  padding: 20px;
  background-color: #f5f6f7;

  .control-panel {
    max-width: 1200px;
    margin: 0 auto 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .text-content {
    max-width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-height: 400px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .reference-read-container {
    padding: 15px;

    .control-panel {
      padding: 15px;
      margin-bottom: 15px;
    }

    .text-content {
      padding: 15px;
    }
  }
}

@media (max-width: 480px) {
  .reference-read-container {
    padding: 10px;

    .control-panel {
      padding: 12px;
      margin-bottom: 12px;
    }

    .text-content {
      padding: 12px;
    }
  }
}
</style>