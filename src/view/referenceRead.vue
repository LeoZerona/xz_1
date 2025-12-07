<template>
  <navigation></navigation>

  <!-- 配置抽屉 -->
  <config-dialog
    v-model="showConfigDialog"
    @confirm="handleConfigConfirm"
    @change="handleConfigChange"
  />

  <div
    class="reference-read-container"
    :class="{ 'config-open': showConfigDialog }"
  >
    <!-- 配置按钮 - 固定在右侧边缘中间 -->
    <el-button
      class="config-button"
      :class="{ 'config-open': showConfigDialog }"
      :icon="showConfigDialog ? Close : Setting"
      @click="showConfigDialog = !showConfigDialog"
    />

    <!-- 进度条 - 固定在左侧 -->
    <div class="fixed-progress-bar">
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
        :layout-mode="layoutMode"
        :grid-type="gridType"
        :show-pinyin="showPinyin"
        :pinyin-map="pinyinMap"
      />
      <el-empty v-else description="暂无内容" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Setting, Close } from "@element-plus/icons-vue";
import TextGrid from "@/components/referenceRead/TextGrid.vue";
import ProgressBar from "@/components/referenceRead/ProgressBar.vue";
import ConfigDialog from "@/components/referenceRead/ConfigDialog.vue";
import { getPinyinMap } from "@/utils/pinyin";

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
    id: "default",
    title: "默认文章",
    source: "/article.txt",
  },
  // 可以添加更多文章
  // {
  //   id: 'tengwangge',
  //   title: '滕王阁序',
  //   author: '王勃',
  //   source: '/articles/tengwangge.txt',
  //   category: '古诗文'
  // },
];

/* ===== 状态管理 ===== */
const showConfigDialog = ref(false); // 默认不显示配置抽屉
const currentArticleId = ref("default");
const text = ref("");
const loading = ref(false);
const cellSize = ref(69);
const gap = ref(10);
const highlightIndexes = ref<number[]>([]);
const readingPosition = ref(0);
const readingTime = ref(0);
let readingTimer: number | null = null;
const layoutMode = ref<"vertical" | "horizontal">("vertical");
const gridType = ref<"tian" | "mi" | "none">("tian");
const showPinyin = ref(false);
const pinyinMap = ref<Record<number, string>>({});

// 配置实时更新处理
const handleConfigChange = (config: any) => {
  // 实时应用配置到阅读模块
  layoutMode.value = config.readMode;
  gridType.value = config.gridType;
  showPinyin.value = config.showOptions.includes("pinyin");

  // 如果内容ID改变，加载新内容
  if (config.contentId && config.contentId !== currentArticleId.value) {
    loadClassicalText(config.contentId);
  }
};

// 配置确认处理
const handleConfigConfirm = (config: any) => {
  // 应用配置
  layoutMode.value = config.readMode;
  gridType.value = config.gridType;
  showPinyin.value = config.showOptions.includes("pinyin");

  // 加载选中的内容
  if (config.contentId) {
    loadClassicalText(config.contentId);
  }

  showConfigDialog.value = false;
};

// 加载文言文内容
const loadClassicalText = async (contentId: string) => {
  try {
    // 尝试从 public 目录加载
    const response = await fetch("/classical_texts.json");
    if (!response.ok) {
      // 如果失败，尝试从 src 目录加载（开发环境）
      const devResponse = await fetch(
        "/src/static/text_res/classical_texts.json"
      );
      if (!devResponse.ok) {
        throw new Error("无法加载文言文数据");
      }
      const data = await devResponse.json();
      const content = data.find((item: any) => item.id === contentId);
      if (content) {
        text.value = content.text;
        currentArticleId.value = contentId;
        if (showPinyin.value) {
          pinyinMap.value = getPinyinMap(text.value);
        }
      }
      return;
    }
    const data = await response.json();
    const content = data.find((item: any) => item.id === contentId);
    if (content) {
      text.value = content.text;
      currentArticleId.value = contentId;
      if (showPinyin.value) {
        pinyinMap.value = getPinyinMap(text.value);
      }
    }
  } catch (error) {
    console.error("加载文言文内容失败:", error);
  }
};

/* ===== 加载文章 ===== */
const loadArticle = async (articleId: string) => {
  const article = articles.find((a) => a.id === articleId);
  if (!article) {
    text.value = "文章不存在";
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(article.source);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.text();
    text.value = data.trim();
    readingPosition.value = 0;
    highlightIndexes.value = [];

    // 加载保存的进度
    loadReadingProgress(articleId);
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error("读取文章失败", e);
    }
    text.value = "文件加载失败，请稍后重试";
  } finally {
    loading.value = false;
  }
};

/* ===== 文章切换 ===== */
// 保留函数以备将来使用
// const handleArticleChange = (articleId: string) => {
//   currentArticleId.value = articleId;
//   loadArticle(articleId);
// };

/* ===== 搜索功能 ===== */
// 保留函数以备将来使用
// const handleSearch = (_searchKey: string, indexes: number[]) => {
//   highlightIndexes.value = indexes;
//   if (indexes.length > 0) {
//     nextTick(() => {
//       scrollToIndex(indexes[0]);
//     });
//   }
// };

// const handleHighlight = (indexes: number[]) => {
//   highlightIndexes.value = indexes;
//   if (indexes.length > 0) {
//     scrollToIndex(indexes[0]);
//   }
// };

// const handleClearSearch = () => {
//   highlightIndexes.value = [];
// };

// const scrollToIndex = (index: number) => {
//   const element = document.querySelector(`[data-char-index="${index}"]`);
//   if (element) {
//     element.scrollIntoView({ behavior: "smooth", block: "center" });
//   }
// };

/* ===== 字体大小重置 ===== */
// 保留函数以备将来使用
// const handleReset = () => {
//   cellSize.value = 69;
//   gap.value = 10;
// };

/* ===== 阅读进度跟踪 ===== */
const startReadingTimer = () => {
  if (readingTimer) return;
  readingTimer = window.setInterval(() => {
    readingTime.value++;
    // 每10秒保存一次进度
    if (readingTime.value % 10 === 0) {
      saveReadingProgress();
    }
  }, 1000);
};

const stopReadingTimer = () => {
  if (readingTimer) {
    clearInterval(readingTimer);
    readingTimer = null;
  }
};

const saveReadingProgress = () => {
  if (!currentArticleId.value || !text.value) return;

  const progress = {
    articleId: currentArticleId.value,
    position: readingPosition.value,
    percentage:
      text.value.length > 0
        ? Math.round((readingPosition.value / text.value.length) * 100)
        : 0,
    readingTime: readingTime.value,
    lastReadTime: new Date().toISOString(),
  };

  localStorage.setItem(
    `readingProgress_${currentArticleId.value}`,
    JSON.stringify(progress)
  );
};

const loadReadingProgress = (articleId: string) => {
  const saved = localStorage.getItem(`readingProgress_${articleId}`);
  if (saved) {
    try {
      const progress = JSON.parse(saved);
      readingPosition.value = progress.position || 0;
      readingTime.value = progress.readingTime || 0;
    } catch (e) {
      console.error("加载阅读进度失败", e);
    }
  }
};

/* ===== 监听滚动更新阅读位置 ===== */
const updateReadingPosition = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 根据滚动位置估算阅读进度
  const scrollPercentage = scrollTop / (documentHeight - windowHeight);
  readingPosition.value = Math.round(text.value.length * scrollPercentage);
};

// 初始化配置
const initConfig = async () => {
  // 加载保存的配置
  const savedConfig = localStorage.getItem("referenceReadConfig");
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      layoutMode.value = config.readMode || "vertical";
      gridType.value = config.gridType || "tian";
      showPinyin.value = config.showOptions?.includes("pinyin") || false;

      // 如果有保存的内容ID，加载对应内容
      if (config.contentId) {
        await loadClassicalText(config.contentId);
        return;
      }
    } catch (error) {
      console.error("加载保存的配置失败:", error);
    }
  }

  // 如果没有保存的配置，加载默认文章
  await loadArticle(currentArticleId.value);
};

/* ===== 生命周期 ===== */
onMounted(async () => {
  await initConfig();
  startReadingTimer();
  window.addEventListener("scroll", updateReadingPosition);
  updateReadingPosition();
});

onBeforeUnmount(() => {
  stopReadingTimer();
  saveReadingProgress();
  window.removeEventListener("scroll", updateReadingPosition);
});

/* ===== 监听文本变化重置进度 ===== */
watch(
  () => text.value,
  () => {
    readingPosition.value = 0;
    readingTime.value = 0;
    // 更新拼音映射
    if (showPinyin.value) {
      pinyinMap.value = getPinyinMap(text.value);
    }
  }
);

/* ===== 监听拼音显示开关 ===== */
watch(
  () => showPinyin.value,
  (show) => {
    if (show && text.value) {
      pinyinMap.value = getPinyinMap(text.value);
    } else {
      pinyinMap.value = {};
    }
  }
);
</script>

<style lang="scss" scoped>
.reference-read-container {
  min-height: calc(100vh - 100px);
  padding: 20px;
  padding-top: 80px; // 为固定的 navigation 留出空间（60px navigation + 20px 间距）
  background-color: #f5f6f7;
  position: relative;
  display: flex;
  gap: 20px;

  .config-button {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000; // 确保在配置面板之上
    background-color: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px 0 0 6px;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 0px 5px;
    height: 40px;
    color: #606266;
    transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: #f5f7fa;
      color: #409eff;
    }

    &.config-open {
      right: 400px; // 移动到配置面板左侧（面板宽度400px）
      background-color: #ffffff;
      color: #909399;

      &:hover {
        background-color: #f5f7fa;
        color: #606266;
      }
    }
  }

  .fixed-progress-bar {
    position: fixed;
    left: 20px;
    top: 80px; // 60px navigation + 20px 间距
    width: 200px;
    z-index: 100;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .text-content {
    flex: 1;
    max-width: 1200px;
    margin-left: 220px;
    margin-right: auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-height: 400px;
    transition: all 0.3s ease;
  }

  &.config-open {
    .text-content {
      max-width: calc(
        100% - 240px - 420px
      ); // 减去进度条宽度(220px)和配置面板宽度(400px)+间距(20px)
      margin-right: 420px; // 为右侧配置面板留出空间（400px面板 + 20px间距）
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .reference-read-container {
    padding: 15px;
    padding-top: 65px; // 移动端 navigation 高度（50px）+ 间距（15px）
    flex-direction: column;

    .config-button {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 6px 0 0 6px;
      padding: 0px 5px;
      height: 40px;

      &.config-open {
        right: 90%; // 移动端面板宽度为90%
      }
    }

    .fixed-progress-bar {
      position: relative;
      left: auto;
      top: auto;
      width: 100%;
      max-height: none;
      margin-bottom: 15px;
    }

    .text-content {
      margin-left: 0;
      padding: 15px;
    }

    &.config-open {
      .text-content {
        max-width: 100%;
        margin-right: 0;
      }
    }
  }
}

@media (max-width: 480px) {
  .reference-read-container {
    padding: 10px;
    padding-top: 58px; // 超小屏幕 navigation 高度（48px）+ 间距（10px）

    .config-button {
      padding: 0px 5px;
      height: 40px;

      &.config-open {
        right: 100%; // 超小屏幕面板宽度为100%
      }
    }

    .fixed-progress-bar {
      margin-bottom: 12px;
    }

    .text-content {
      padding: 12px;
    }
  }
}
</style>
