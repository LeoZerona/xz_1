<template>
  <!-- 上下布局模式 -->
  <ul
    v-if="layoutMode === 'vertical'"
    ref="wrapEl"
    class="rice-ul"
    :class="{ 'grid-none': gridType === 'none' }"
    @copy="handleCopy"
  >
    <li v-for="(ch, i) in textArr" :key="i" class="col">
      <!-- 上层：字体 A -->
      <paper-grid
        :grid-type="gridType"
        :show-pinyin="showPinyin"
        :pinyin="pinyinMap[i] || ''"
        :cell-size="cellSize"
        class="cell upper"
        :data-char="ch"
        :data-char-index="i"
        :class="{
          highlighted: isHighlighted(i),
          'interactive-highlight': interactiveIndex === i,
        }"
        :style="{ fontFamily: firstFont }"
        @click="handleCellClick(i)"
      >
        {{ ch }}
      </paper-grid>
      <!-- 下层：字体 B -->
      <paper-grid
        :grid-type="gridType"
        :show-pinyin="false"
        :cell-size="cellSize"
        :is-lower="true"
        class="cell lower"
        :data-char="ch"
        :data-char-index="i"
        :class="{
          highlighted: isHighlighted(i),
          'interactive-highlight': interactiveIndex === i,
        }"
        :style="{ fontFamily: secondFont }"
        @click="handleCellClick(i)"
      >
        {{ ch }}
      </paper-grid>
    </li>
  </ul>

  <!-- 左右布局模式 -->
  <div v-else class="horizontal-layout" @copy="handleCopy">
    <!-- 左侧区域：字体 A（楷体） -->
    <div class="text-area left-area">
      <ul
        ref="leftWrapEl"
        class="rice-ul"
        :class="{ 'grid-none': gridType === 'none' }"
      >
        <li v-for="(ch, i) in textArr" :key="i" class="col">
          <paper-grid
            :grid-type="gridType"
            :show-pinyin="showPinyin"
            :pinyin="pinyinMap[i] || ''"
            :cell-size="cellSize"
            class="cell left"
            :data-char="ch"
            :data-char-index="i"
            :class="{
              highlighted: isHighlighted(i),
              'interactive-highlight': interactiveIndex === i,
            }"
            :style="{ fontFamily: firstFont }"
            @click="handleCellClick(i)"
          >
            {{ ch }}
          </paper-grid>
        </li>
      </ul>
    </div>

    <!-- 右侧区域：字体 B（小篆） -->
    <div class="text-area right-area">
      <ul
        ref="rightWrapEl"
        class="rice-ul"
        :class="{ 'grid-none': gridType === 'none' }"
      >
        <li v-for="(ch, i) in textArr" :key="i" class="col">
          <paper-grid
            :grid-type="gridType"
            :show-pinyin="showPinyin"
            :pinyin="pinyinMap[i] || ''"
            :cell-size="cellSize"
            class="cell right"
            :data-char="ch"
            :data-char-index="i"
            :class="{
              highlighted: isHighlighted(i),
              'interactive-highlight': interactiveIndex === i,
            }"
            :style="{ fontFamily: secondFont }"
            @click="handleCellClick(i)"
          >
            {{ ch }}
          </paper-grid>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import PaperGrid from "./PaperGrid.vue";

interface Props {
  text: string;
  cellSize: number;
  gap: number;
  highlightIndexes?: number[];
  layoutMode?: "vertical" | "horizontal";
  gridType?: "tian" | "mi" | "none";
  showPinyin?: boolean;
  pinyinMap?: Record<number, string>;
  firstFont?: string;
  secondFont?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: "",
  cellSize: 69,
  gap: 10,
  highlightIndexes: () => [],
  layoutMode: "vertical",
  gridType: "tian",
  showPinyin: false,
  pinyinMap: () => ({}),
  firstFont: "HanYiKaiTiFan",
  secondFont: "FangZhengXiaoZhuan",
});

const wrapEl = ref<HTMLUListElement>();
const leftWrapEl = ref<HTMLUListElement>();
const rightWrapEl = ref<HTMLUListElement>();
const wrapW = ref(0);

// 交互高亮状态：当前鼠标悬停或点击的字符索引
const interactiveIndex = ref<number | null>(null);

const update = () => {
  if (props.layoutMode === "vertical") {
    wrapW.value = wrapEl.value?.getBoundingClientRect().width ?? 0;
  } else {
    // 左右布局模式下，使用左侧区域的宽度
    wrapW.value = leftWrapEl.value?.getBoundingClientRect().width ?? 0;
  }
};

// 处理文本选择事件
const handleSelectionChange = () => {
  if (props.layoutMode !== "horizontal") return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    // 选择被清除或折叠时，延迟清除高亮
    setTimeout(() => {
      if (!window.getSelection()?.toString()) {
        interactiveIndex.value = null;
      }
    }, 100);
    return;
  }

  const range = selection.getRangeAt(0);

  // 检查选择是否在左侧区域
  const leftCells = Array.from(
    leftWrapEl.value?.querySelectorAll(".cell.left") || []
  ).filter((cell) => range.intersectsNode(cell));

  if (leftCells.length > 0) {
    // 获取第一个选中的单元格的索引
    const firstCell = leftCells[0] as HTMLElement;
    const index = parseInt(firstCell.getAttribute("data-char-index") || "-1");
    if (index >= 0) {
      interactiveIndex.value = index;
    }
    return;
  }

  // 检查选择是否在右侧区域
  const rightCells = Array.from(
    rightWrapEl.value?.querySelectorAll(".cell.right") || []
  ).filter((cell) => range.intersectsNode(cell));

  if (rightCells.length > 0) {
    // 获取第一个选中的单元格的索引
    const firstCell = rightCells[0] as HTMLElement;
    const index = parseInt(firstCell.getAttribute("data-char-index") || "-1");
    if (index >= 0) {
      interactiveIndex.value = index;
    }
  }
};

onMounted(() => {
  update();
  window.addEventListener("resize", update);
  // 监听文本选择变化
  if (props.layoutMode === "horizontal") {
    document.addEventListener("selectionchange", handleSelectionChange);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", update);
  document.removeEventListener("selectionchange", handleSelectionChange);
  // 清理定时器
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
});

// 监听布局模式变化，动态添加/移除选择监听
watch(
  () => props.layoutMode,
  (newMode) => {
    if (newMode === "horizontal") {
      document.addEventListener("selectionchange", handleSelectionChange);
    } else {
      document.removeEventListener("selectionchange", handleSelectionChange);
      // 上下布局模式切换时不清除高亮，让用户可以看到点击效果
      // interactiveIndex.value = null;
    }
  }
);

const unit = computed(() => props.cellSize + props.gap);
const perRow = computed(() =>
  Math.max(1, Math.floor(wrapW.value / unit.value))
);
const textArr = computed(() => Array.from(props.text));
const firstFont = computed(() => props.firstFont);
const secondFont = computed(() => props.secondFont);

// CSS 变量计算
// 无格模式下，左右无间隙
const gapPx = computed(() =>
  props.gridType === "none" ? "0px" : `${props.gap}px`
);
const cellSizePx = computed(() => `${props.cellSize}px`);

const isHighlighted = (index: number) => {
  return props.highlightIndexes.includes(index);
};

/* ===== 处理单元格交互事件（左右布局模式和上下布局模式） ===== */
let clickTimer: number | null = null;

const handleCellClick = (index: number) => {
  // 清除之前的定时器
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
  interactiveIndex.value = index;
  // 点击后保持高亮一段时间
  clickTimer = window.setTimeout(() => {
    // 检查是否还有文本选择（仅左右布局模式）
    if (props.layoutMode === "horizontal") {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        interactiveIndex.value = null;
      }
    } else {
      // 上下布局模式：直接清除高亮
      interactiveIndex.value = null;
    }
    clickTimer = null;
  }, 2000);
};

/* ===== 处理复制事件，避免重复复制 ===== */
const handleCopy = (e: ClipboardEvent) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  let text = "";

  if (props.layoutMode === "vertical") {
    // 上下布局：优先获取上层单元格（楷体）
    const upperCells = Array.from(
      wrapEl.value?.querySelectorAll(".cell.upper") || []
    )
      .filter((cell) => range.intersectsNode(cell))
      .map(
        (cell) =>
          cell.getAttribute("data-char") || cell.textContent?.trim() || ""
      )
      .filter((char) => char);
    text = upperCells.join("");

    // 如果上层没有选中，尝试获取下层（小篆）
    if (!text) {
      const lowerCells = Array.from(
        wrapEl.value?.querySelectorAll(".cell.lower") || []
      )
        .filter((cell) => range.intersectsNode(cell))
        .map(
          (cell) =>
            cell.getAttribute("data-char") || cell.textContent?.trim() || ""
        )
        .filter((char) => char);
      text = lowerCells.join("");
    }
  } else {
    // 左右布局：优先获取左侧单元格（楷体）
    const leftCells = Array.from(
      leftWrapEl.value?.querySelectorAll(".cell.left") || []
    )
      .filter((cell) => range.intersectsNode(cell))
      .map(
        (cell) =>
          cell.getAttribute("data-char") || cell.textContent?.trim() || ""
      )
      .filter((char) => char);
    text = leftCells.join("");

    // 如果左侧没有选中，尝试获取右侧（小篆）
    if (!text) {
      const rightCells = Array.from(
        rightWrapEl.value?.querySelectorAll(".cell.right") || []
      )
        .filter((cell) => range.intersectsNode(cell))
        .map(
          (cell) =>
            cell.getAttribute("data-char") || cell.textContent?.trim() || ""
        )
        .filter((char) => char);
      text = rightCells.join("");
    }
  }

  // 将处理后的文字写入剪贴板
  if (e.clipboardData && text) {
    e.clipboardData.setData("text/plain", text);
  }
};

defineExpose({
  update,
  wrapEl,
  leftWrapEl,
  rightWrapEl,
});
</script>

<style scoped>
/* ------------ ul ------------ */
.rice-ul {
  display: flex;
  flex-wrap: wrap;
  gap: v-bind(gapPx);
  width: 100%;
  margin: 0;
  padding: 0;
}

/* ------------ 列单元 ------------ */
.col {
  display: flex;
  flex-direction: column;
  width: v-bind(cellSizePx);
  gap: 0; /* 无间隙，使用负边距解决边框重叠 */
}

/* ------------ 单元格公共样式 ------------ */
.cell {
  position: relative;
  width: v-bind(cellSizePx);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: v-bind(cellSizePx);
  line-height: 1;
  color: #333;
  transition: background-color 0.2s;
  /* 高度由 PaperGrid 组件控制 */
}

.cell.highlighted {
  background-color: rgba(255, 255, 0, 0.3);
}

/* 交互高亮动画 - 左右布局模式和上下布局模式 - 优化版 */
.cell.interactive-highlight {
  animation: highlightPulse 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  position: relative;
  border-radius: 4px;
}

.cell.interactive-highlight :deep(.paper-grid) {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  /* border-color: #ffd700 !important; */
  border-color: #ffd700 !important;
  border-width: 2px !important;
  box-shadow: 0 0 15px rgba(255, 215, 0, 1), 0 0 25px rgba(255, 215, 0, 0.8),
    0 0 35px rgba(255, 215, 0, 0.6), 0 0 45px rgba(255, 215, 0, 0.4),
    inset 0 0 15px rgba(255, 215, 0, 0.3) !important;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.9));
}

.cell.interactive-highlight :deep(.paper-grid .character-section),
.cell.interactive-highlight :deep(.paper-grid .pinyin-section) {
  border-color: #ffd700 !important;
  border-width: 1.5px !important;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.9), 0 0 15px rgba(255, 215, 0, 0.7),
    0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 8px rgba(255, 215, 0, 0.4) !important;
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));
}

/* 田字格内框线 - 金黄色 + 发光效果 */
.cell.interactive-highlight :deep(.paper-grid.tian .character-section::before) {
  background: repeating-linear-gradient(
      to right,
      #ffd700 0 3px,
      transparent 3px 5px
    )
    0 50% / 100% 3px no-repeat !important;
  z-index: 0 !important;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1))
    drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))
    drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))
    drop-shadow(0 0 35px rgba(255, 215, 0, 0.5)) !important;
  opacity: 1 !important;
}

.cell.interactive-highlight :deep(.paper-grid.tian .character-section::after) {
  background: repeating-linear-gradient(
      to bottom,
      #ffd700 0 3px,
      transparent 3px 5px
    )
    50% 0 / 3px 100% no-repeat !important;
  z-index: 0 !important;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1))
    drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))
    drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))
    drop-shadow(0 0 35px rgba(255, 215, 0, 0.5)) !important;
  opacity: 1 !important;
}

/* 米字格内框线 - 金黄色 + 发光效果 */
.cell.interactive-highlight :deep(.paper-grid.mi .character-section::before) {
  background: repeating-linear-gradient(
        to right,
        #ffd700 0 3px,
        transparent 3px 5px
      )
      0 50% / 100% 3px no-repeat,
    repeating-linear-gradient(to bottom, #ffd700 0 3px, transparent 3px 5px) 50%
      0 / 3px 100% no-repeat !important;
  z-index: 0 !important;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1))
    drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))
    drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))
    drop-shadow(0 0 35px rgba(255, 215, 0, 0.5)) !important;
  opacity: 1 !important;
}

.cell.interactive-highlight :deep(.paper-grid.mi .character-section::after) {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23FFD700' stroke-width='2.5' stroke-dasharray='3,3'/%3E%3Cline x1='100' y1='0' x2='0' y2='100' stroke='%23FFD700' stroke-width='2.5' stroke-dasharray='3,3'/%3E%3C/svg%3E") !important;
  z-index: 0 !important;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1))
    drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))
    drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))
    drop-shadow(0 0 35px rgba(255, 215, 0, 0.5)) !important;
  opacity: 1 !important;
}

/* 拼音区域分隔线 - 金黄色 + 发光效果 */
.cell.interactive-highlight :deep(.paper-grid .pinyin-section::before),
.cell.interactive-highlight :deep(.paper-grid .pinyin-section::after) {
  background: repeating-linear-gradient(
    to right,
    #ffd700 0 3px,
    transparent 3px 5px
  ) !important;
  height: 2.5px !important;
  z-index: 0 !important;
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 1))
    drop-shadow(0 0 12px rgba(255, 215, 0, 0.9))
    drop-shadow(0 0 20px rgba(255, 215, 0, 0.7))
    drop-shadow(0 0 28px rgba(255, 215, 0, 0.5)) !important;
  opacity: 1 !important;
}

@keyframes highlightPulse {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

/* 字体 A - 上下布局的上层，左右布局的左侧 */
.upper,
.left {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* 字体 B - 上下布局的下层 */
.lower {
  color: transparent;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* 字体 B - 左右布局的右侧 */
.right {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* 应用字体样式到内部文字 - 确保字体能够传递到 PaperGrid 内部的文字内容 */
.cell {
  /* 字体样式会通过 style 绑定传递到 PaperGrid，然后继承到内部文字 */
}

.cell :deep(.character-section) {
  font-family: inherit;
}

.cell :deep(.character-section *) {
  font-family: inherit;
}

/* 选择时的样式优化 */
.cell.upper::selection,
.cell.left::selection {
  background-color: rgba(64, 158, 255, 0.3);
  color: #333;
}

.cell.upper::-moz-selection,
.cell.left::-moz-selection {
  background-color: rgba(64, 158, 255, 0.3);
  color: #333;
}

/* 字体B选中时才显示 - 上下布局的下层 */
.cell.lower::selection {
  background-color: rgba(64, 158, 255, 0.3);
  color: #333 !important;
  -webkit-text-fill-color: #333;
}

.cell.lower::-moz-selection {
  background-color: rgba(64, 158, 255, 0.3);
  color: #333 !important;
  -webkit-text-fill-color: #333;
}

/* 左右布局的右侧字体 */
.cell.right::selection {
  background-color: rgba(64, 158, 255, 0.3);
  color: #333;
}

.cell.right::-moz-selection {
  background-color: rgba(64, 158, 255, 0.3);
  color: #333;
}

/* 稿纸样式由 PaperGrid 组件处理 */

/* 无格模式：左右无间隙 */
.rice-ul.grid-none {
  gap: 0;
}

/* 左右布局模式 */
.horizontal-layout {
  display: flex;
  width: 100%;
  gap: 20px;

  .text-area {
    flex: 1;
    min-width: 0; /* 防止 flex 子元素溢出 */

    .rice-ul {
      width: 100%;
    }
  }
}

/* 移动端适配 - 左右布局在小屏幕上改为上下堆叠 */
@media (max-width: 768px) {
  .horizontal-layout {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
