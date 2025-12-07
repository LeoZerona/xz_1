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
          'keyboard-selected': isKeyboardSelected(i),
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
          'show-second-font': shouldShowSecondFont(i),
          'keyboard-selected': isKeyboardSelected(i),
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
              'keyboard-selected': isKeyboardSelected(i),
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
              'show-second-font': shouldShowSecondFont(i),
              'keyboard-selected': isKeyboardSelected(i),
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
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
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
  functionMode?: "compare" | "learn";
  operationMode?: "keyboard" | "typing";
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
  functionMode: "compare",
  operationMode: "keyboard",
});

const wrapEl = ref<HTMLUListElement>();
const leftWrapEl = ref<HTMLUListElement>();
const rightWrapEl = ref<HTMLUListElement>();
const wrapW = ref(0);

// 交互高亮状态：当前鼠标悬停或点击的字符索引
const interactiveIndex = ref<number | null>(null);

// 方向键操控模式：当前选中的字符索引
const selectedIndex = ref<number | null>(null);

// 方向键操控模式：显示第二行字体的字符索引集合
const visibleSecondFonts = ref<Set<number>>(new Set());

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
  // 监听键盘事件
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", update);
  document.removeEventListener("selectionchange", handleSelectionChange);
  window.removeEventListener("keydown", handleKeyDown);
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
  
  // 如果是学习模式且是方向键操控模式，只记录选中的索引，不显示第二行字体
  if (props.functionMode === "learn" && props.operationMode === "keyboard") {
    selectedIndex.value = index;
    // 不立即显示被点击字符的第二行字体，需要按右键才显示
    // 滚动到可见区域
    scrollToIndex(index);
  }
  
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

// 获取指定索引所在行的所有字符索引
const getRowIndexes = (index: number): number[] => {
  const rowNumber = Math.floor(index / perRow.value);
  const startIndex = rowNumber * perRow.value;
  const endIndex = Math.min(startIndex + perRow.value, props.text.length);
  const rowIndexes: number[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    rowIndexes.push(i);
  }
  return rowIndexes;
};

// 检查指定索引所在行的所有字符是否都已经显示
const isRowAllVisible = (index: number): boolean => {
  const rowIndexes = getRowIndexes(index);
  return rowIndexes.length > 0 && rowIndexes.every((idx) => visibleSecondFonts.value.has(idx));
};

// 检查指定索引所在行的所有字符是否都已经隐藏
const isRowAllHidden = (index: number): boolean => {
  const rowIndexes = getRowIndexes(index);
  return rowIndexes.length > 0 && rowIndexes.every((idx) => !visibleSecondFonts.value.has(idx));
};

// 处理键盘方向键事件
const handleKeyDown = (event: KeyboardEvent) => {
  // 只在学习模式且方向键操控模式下处理
  if (props.functionMode !== "learn" || props.operationMode !== "keyboard") {
    return;
  }
  
  // 如果没有选中任何字符，不处理
  if (selectedIndex.value === null) {
    return;
  }
  
  const currentIndex = selectedIndex.value;
  const textLength = props.text.length;
  
  switch (event.key) {
    case "ArrowLeft":
      // 左键：隐藏当前字符的第二行字体（回撤）
      if (currentIndex >= 0 && currentIndex < textLength) {
        visibleSecondFonts.value.delete(currentIndex);
        // 移动到前一个字符
        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          selectedIndex.value = prevIndex;
          // 滚动到可见区域
          scrollToIndex(prevIndex);
        }
      }
      event.preventDefault();
      break;
    case "ArrowRight":
      // 右键：显示当前字符的第二行字体，然后移动到下一个字符
      if (currentIndex >= 0 && currentIndex < textLength) {
        // 先显示当前字符的第二行字体
        visibleSecondFonts.value.add(currentIndex);
        // 然后移动到下一个字符
        if (currentIndex < textLength - 1) {
          const nextIndex = currentIndex + 1;
          selectedIndex.value = nextIndex;
          // 滚动到可见区域
          scrollToIndex(nextIndex);
        }
      }
      event.preventDefault();
      break;
    case "ArrowUp":
      // 上键：隐藏当前行的所有字符的第二行字体
      if (currentIndex >= 0 && currentIndex < textLength) {
        // 如果当前行已经全部隐藏，则移动到上一行并隐藏上一行
        if (isRowAllHidden(currentIndex)) {
          if (currentIndex >= perRow.value) {
            const prevRowIndex = currentIndex - perRow.value;
            const prevRowIndexes = getRowIndexes(prevRowIndex);
            prevRowIndexes.forEach((idx) => {
              visibleSecondFonts.value.delete(idx);
            });
            selectedIndex.value = prevRowIndex;
            scrollToIndex(prevRowIndex);
          }
        } else {
          // 否则隐藏当前行
          const rowIndexes = getRowIndexes(currentIndex);
          rowIndexes.forEach((idx) => {
            visibleSecondFonts.value.delete(idx);
          });
          // 移动到上一行的相同位置
          if (currentIndex >= perRow.value) {
            const prevRowIndex = currentIndex - perRow.value;
            selectedIndex.value = prevRowIndex;
            scrollToIndex(prevRowIndex);
          }
        }
      }
      event.preventDefault();
      break;
    case "ArrowDown":
      // 下键：显示当前行的所有字符的第二行字体
      if (currentIndex >= 0 && currentIndex < textLength) {
        // 如果当前行已经全部显示，则移动到下一行并显示下一行
        if (isRowAllVisible(currentIndex)) {
          const nextRowIndex = currentIndex + perRow.value;
          if (nextRowIndex < textLength) {
            const nextRowIndexes = getRowIndexes(nextRowIndex);
            nextRowIndexes.forEach((idx) => {
              visibleSecondFonts.value.add(idx);
            });
            selectedIndex.value = nextRowIndex;
            scrollToIndex(nextRowIndex);
          }
        } else {
          // 否则显示当前行
          const rowIndexes = getRowIndexes(currentIndex);
          rowIndexes.forEach((idx) => {
            visibleSecondFonts.value.add(idx);
          });
          // 移动到下一行的相同位置
          const nextRowIndex = currentIndex + perRow.value;
          if (nextRowIndex < textLength) {
            selectedIndex.value = nextRowIndex;
            scrollToIndex(nextRowIndex);
          }
        }
      }
      event.preventDefault();
      break;
  }
};

// 检查第二行字体是否应该显示
const shouldShowSecondFont = (index: number) => {
  return visibleSecondFonts.value.has(index);
};

// 检查是否是键盘选中的字符
const isKeyboardSelected = (index: number) => {
  return (
    props.functionMode === "learn" &&
    props.operationMode === "keyboard" &&
    selectedIndex.value === index
  );
};

// 滚动到指定索引的字符
const scrollToIndex = (index: number) => {
  nextTick(() => {
    const element = document.querySelector(
      `[data-char-index="${index}"]`
    ) as HTMLElement;
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  });
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

// 重置功能：清除所有显示的第二行字体
const resetVisibleFonts = () => {
  visibleSecondFonts.value.clear();
  selectedIndex.value = null;
};

defineExpose({
  update,
  wrapEl,
  leftWrapEl,
  rightWrapEl,
  resetVisibleFonts,
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
  transition: color 0.2s ease;
}

/* 显示第二行字体 */
.lower.show-second-font {
  color: #333 !important;
}

/* 键盘选中状态的视觉指示器 */
.cell.keyboard-selected {
  animation: keyboardSelectedPulse 1.5s ease-in-out infinite;
  z-index: 15;
  position: relative;
}

.cell.keyboard-selected :deep(.paper-grid) {
  border-color: #409eff !important;
  border-width: 3px !important;
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.6),
    0 0 40px rgba(64, 158, 255, 0.4),
    inset 0 0 10px rgba(64, 158, 255, 0.2) !important;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* 键盘选中状态的脉冲动画 */
@keyframes keyboardSelectedPulse {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.08);
    filter: brightness(1.15);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

/* 字体 B - 左右布局的右侧 */
.right {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* 显示第二行字体（左右布局模式）- 添加淡入动画 */
.right.show-second-font {
  animation: fadeInRight 0.3s ease-out;
}

@keyframes fadeInRight {
  from {
    opacity: 0.7;
    transform: translateX(-3px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
