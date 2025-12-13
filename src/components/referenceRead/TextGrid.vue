<template>
  <!-- 上下布局模式 -->
  <ul
    v-if="layoutMode === 'vertical'"
    ref="wrapEl"
    class="rice-ul"
    :class="{ 'grid-none': gridType === 'none' }"
    @copy="handleCopy"
    @click="handleContainerClick"
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
          'interactive-highlight': interactiveIndex === i && !isTypingMode,
          'keyboard-selected': isKeyboardSelected(i),
          'typing-correct': isTypingCorrect(i),
          'typing-error': isTypingError(i),
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
          'interactive-highlight': interactiveIndex === i && !isTypingMode,
          'show-second-font': shouldShowSecondFont(i),
          'keyboard-selected': isKeyboardSelected(i),
          'typing-cursor': isTypingCursor(i),
          'typing-correct': isTypingCorrect(i),
          'typing-error': isTypingError(i),
          'typing-has-input': typingInputs.has(i),
        }"
        :style="{ fontFamily: secondFont }"
        @click="handleCellClick(i)"
      >
        <span class="typing-input-text">{{
          typingInputs.get(i) || (isTypingMode ? "" : ch)
        }}</span>
        <!-- 打字模式光标和拼音显示 -->
        <div
          v-if="isTypingMode && isTypingCursor(i)"
          class="typing-cursor-container"
        >
          <!-- 拼音显示（在输入时） -->
          <div v-if="isComposing && composingText" class="pinyin-display">
            <span class="pinyin-text">{{
              composingText.slice(0, composingCursorPos)
            }}</span>
            <span class="pinyin-cursor"></span>
            <span class="pinyin-text">{{
              composingText.slice(composingCursorPos)
            }}</span>
          </div>
          <!-- 普通光标（未输入时或在已输入文字的右边） -->
          <div
            v-else
            class="typing-cursor-indicator cursor-blink"
            :class="{
              'cursor-after-text': cursorAtRight && typingInputs.has(i),
            }"
          />
        </div>
      </paper-grid>
    </li>
  </ul>

  <!-- 隐藏的输入框用于捕获中文输入 -->
  <input
    v-if="isTypingMode"
    ref="hiddenInputRef"
    type="text"
    class="hidden-input"
    @input="handleInput"
    @compositionstart="handleCompositionStart"
    @compositionupdate="handleCompositionUpdate"
    @compositionend="handleCompositionEnd"
    @keydown="handleHiddenInputKeyDown"
    @keyup="handleHiddenInputKeyUp"
    @click="updateComposingCursorPos"
    @select="updateComposingCursorPos"
    @blur="
      () => {
        if (isTypingMode) {
          hiddenInputRef?.focus();
        }
      }
    "
  />

  <!-- 左右布局模式 -->
  <div
    v-else
    class="horizontal-layout"
    @copy="handleCopy"
    @click="handleContainerClick"
  >
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
              'interactive-highlight': interactiveIndex === i && !isTypingMode,
              'keyboard-selected': isKeyboardSelected(i),
              'typing-correct': isTypingCorrect(i),
              'typing-error': isTypingError(i),
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
              'interactive-highlight': interactiveIndex === i && !isTypingMode,
              'show-second-font': shouldShowSecondFont(i),
              'keyboard-selected': isKeyboardSelected(i),
              'typing-cursor': isTypingCursor(i),
              'typing-correct': isTypingCorrect(i),
              'typing-error': isTypingError(i),
              'typing-has-input': typingInputs.has(i),
            }"
            :style="{ fontFamily: secondFont }"
            @click="handleCellClick(i)"
          >
            <span class="typing-input-text">{{
              typingInputs.get(i) || (isTypingMode ? "" : ch)
            }}</span>
            <!-- 打字模式光标和拼音显示 -->
            <div
              v-if="isTypingMode && isTypingCursor(i)"
              class="typing-cursor-container"
            >
              <!-- 拼音显示（在输入时） -->
              <div v-if="isComposing && composingText" class="pinyin-display">
                <span class="pinyin-text">{{
                  composingText.slice(0, composingCursorPos)
                }}</span>
                <span class="pinyin-cursor"></span>
                <span class="pinyin-text">{{
                  composingText.slice(composingCursorPos)
                }}</span>
              </div>
              <!-- 普通光标（未输入时或在已输入文字的右边） -->
              <div
                v-else
                class="typing-cursor-indicator cursor-blink"
                :class="{
                  'cursor-after-text': cursorAtRight && typingInputs.has(i),
                }"
              />
            </div>
          </paper-grid>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
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
  gap: 11,
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

// 打字模式：当前输入位置索引
const typingPosition = ref<number>(0);

// 打字模式：已输入字符的状态（true=正确, false=错误, null=未输入）
const typingStatus = ref<Map<number, boolean | null>>(new Map());

// 打字模式：用户输入的内容
const typingInputs = ref<Map<number, string>>(new Map());

// 打字模式：光标位置状态（true=在字符右侧，false=在字符左侧）
const cursorAtRight = ref<boolean>(false);

// 打字模式：光标闪烁状态
const cursorVisible = ref<boolean>(true);

// 打字模式：是否启用
const isTypingMode = computed(() => {
  return props.functionMode === "learn" && props.operationMode === "typing";
});

// 中文输入法状态
const isComposing = ref<boolean>(false);
const composingText = ref<string>(""); // 当前输入的拼音内容
const composingCursorPos = ref<number>(0); // 拼音输入框内的光标位置
const hiddenInputRef = ref<HTMLInputElement | null>(null);

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

// 光标闪烁动画
let cursorBlinkTimer: number | null = null;

const startCursorBlink = () => {
  if (cursorBlinkTimer) return;
  cursorBlinkTimer = window.setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, 530); // Windows系统标准光标闪烁时间：530ms
};

const stopCursorBlink = () => {
  if (cursorBlinkTimer) {
    clearInterval(cursorBlinkTimer);
    cursorBlinkTimer = null;
  }
  cursorVisible.value = true;
};

// 处理滚动事件，更新输入框位置
const handleScroll = () => {
  if (
    isTypingMode.value &&
    hiddenInputRef.value &&
    typingPosition.value < props.text.length
  ) {
    // 找到当前输入位置的元素
    const currentIndex = typingPosition.value;
    let element: HTMLElement | null = null;

    if (props.layoutMode === "vertical") {
      element = document.querySelector(
        `.cell.lower[data-char-index="${currentIndex}"]`
      ) as HTMLElement;
    } else {
      element = document.querySelector(
        `.cell.right[data-char-index="${currentIndex}"]`
      ) as HTMLElement;
    }

    if (!element) {
      element = document.querySelector(
        `[data-char-index="${currentIndex}"]`
      ) as HTMLElement;
    }

    if (element) {
      updateInputPosition(element);
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
  // 如果是打字模式，启动光标闪烁并聚焦隐藏输入框，并监听滚动事件
  if (isTypingMode.value) {
    startCursorBlink();
    window.addEventListener("scroll", handleScroll, { passive: true });
    nextTick(() => {
      if (hiddenInputRef.value) {
        // 先定位到第一个字符位置
        const firstElement = document.querySelector(
          `[data-char-index="0"]`
        ) as HTMLElement;
        if (firstElement) {
          updateInputPosition(firstElement);
        }
        hiddenInputRef.value.focus();
      }
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", update);
  document.removeEventListener("selectionchange", handleSelectionChange);
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("scroll", handleScroll);
  // 清理定时器
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
  // 清理光标闪烁定时器
  stopCursorBlink();
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

// 监听打字模式变化
watch(
  () => isTypingMode.value,
  (isTyping) => {
    if (isTyping) {
      // 重置打字状态
      typingPosition.value = 0;
      typingStatus.value.clear();
      typingInputs.value.clear();
      cursorAtRight.value = false;
      startCursorBlink();
      // 监听滚动事件
      window.addEventListener("scroll", handleScroll, { passive: true });
      // 滚动到起始位置并聚焦隐藏输入框
      nextTick(() => {
        scrollToIndex(0);
        if (hiddenInputRef.value) {
          hiddenInputRef.value.focus();
        }
      });
    } else {
      stopCursorBlink();
      window.removeEventListener("scroll", handleScroll);
      typingPosition.value = 0;
      typingStatus.value.clear();
      typingInputs.value.clear();
      cursorAtRight.value = false;
      if (hiddenInputRef.value) {
        hiddenInputRef.value.blur();
      }
    }
  },
  { immediate: true }
);

// 监听文本变化，重置打字状态
watch(
  () => props.text,
  () => {
    if (isTypingMode.value) {
      typingPosition.value = 0;
      typingStatus.value.clear();
      typingInputs.value.clear();
      cursorAtRight.value = false;
      nextTick(() => {
        scrollToIndex(0);
      });
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

// 处理容器点击事件（聚焦隐藏输入框）
const handleContainerClick = (event: MouseEvent) => {
  // 如果点击的不是单元格，且是打字模式，聚焦输入框
  const target = event.target as HTMLElement;
  if (isTypingMode.value && !target.closest(".cell")) {
    if (hiddenInputRef.value) {
      hiddenInputRef.value.focus();
    }
  }
};

const handleCellClick = (index: number) => {
  // 如果是学习模式且是打字模式，跳转到该位置并聚焦输入框，但不显示放大动画
  if (props.functionMode === "learn" && props.operationMode === "typing") {
    typingPosition.value = index;
    // 根据当前位置是否有输入决定光标位置
    cursorAtRight.value = typingInputs.value.has(index);
    scrollToIndex(index);
    // 聚焦隐藏输入框
    nextTick(() => {
      if (hiddenInputRef.value) {
        hiddenInputRef.value.focus();
      }
    });
    return;
  }

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
  return (
    rowIndexes.length > 0 &&
    rowIndexes.every((idx) => visibleSecondFonts.value.has(idx))
  );
};

// 检查指定索引所在行的所有字符是否都已经隐藏
const isRowAllHidden = (index: number): boolean => {
  const rowIndexes = getRowIndexes(index);
  return (
    rowIndexes.length > 0 &&
    rowIndexes.every((idx) => !visibleSecondFonts.value.has(idx))
  );
};

// 处理输入事件（打字模式）- 支持中文输入和多个字符输入
const handleInput = (event: Event) => {
  if (!isTypingMode.value) {
    return;
  }

  // 如果在 composition 状态下，更新光标位置
  if (isComposing.value) {
    // 使用 requestAnimationFrame 确保在浏览器更新后获取准确的光标位置
    requestAnimationFrame(() => {
      if (hiddenInputRef.value && isComposing.value) {
        composingCursorPos.value = hiddenInputRef.value.selectionStart || 0;
      }
    });
    return;
  }

  const input = event.target as HTMLInputElement;
  const inputValue = input.value;

  if (inputValue.length > 0) {
    // 将输入的字符逐个处理
    const inputChars = Array.from(inputValue);
    let currentPos = typingPosition.value;

    for (
      let i = 0;
      i < inputChars.length && currentPos < props.text.length;
      i++
    ) {
      const inputChar = inputChars[i];
      const currentChar = props.text[currentPos];
      const isCorrect = inputChar === currentChar;

      // 记录输入内容和状态
      typingInputs.value.set(currentPos, inputChar);
      typingStatus.value.set(currentPos, isCorrect);

      currentPos++;
    }

    // 更新位置
    typingPosition.value = Math.min(currentPos, props.text.length);
    // 输入后光标在右侧
    cursorAtRight.value = true;

    // 滚动到当前位置并更新输入框位置
    if (typingPosition.value < props.text.length) {
      scrollToIndex(typingPosition.value);
    } else if (
      typingPosition.value >= props.text.length &&
      props.text.length > 0
    ) {
      // 如果已经到达末尾，定位到最后一个字符
      const lastIndex = props.text.length - 1;
      scrollToIndex(lastIndex);
    }

    // 清空输入框
    input.value = "";
  }
};

// 处理组合输入开始（中文输入法）
const handleCompositionStart = () => {
  isComposing.value = true;
  composingText.value = "";
  composingCursorPos.value = 0;
};

// 更新拼音光标位置
const updateComposingCursorPos = () => {
  if (!hiddenInputRef.value || !isComposing.value) {
    return;
  }
  // 使用 requestAnimationFrame 确保在浏览器更新后获取准确的光标位置
  requestAnimationFrame(() => {
    if (hiddenInputRef.value && isComposing.value) {
      composingCursorPos.value = hiddenInputRef.value.selectionStart || 0;
    }
  });
};

// 处理组合输入更新（中文输入法）- 显示拼音
const handleCompositionUpdate = (event: CompositionEvent) => {
  if (!isTypingMode.value) return;

  const input = event.target as HTMLInputElement;
  // 先同步获取光标位置（在更新文本之前，避免位置被重置）
  const currentCursorPos = input.selectionStart ?? input.value.length;
  // 获取拼音内容（可能是input.value或event.data）
  composingText.value = event.data || input.value || "";
  // 立即使用保存的光标位置
  composingCursorPos.value = currentCursorPos;
};

// 处理组合输入结束（中文输入法）
const handleCompositionEnd = (event: CompositionEvent) => {
  isComposing.value = false;
  composingText.value = "";

  if (!isTypingMode.value) {
    return;
  }

  const input = event.target as HTMLInputElement;
  const inputValue = input.value;

  if (inputValue.length > 0) {
    // 将输入的字符逐个处理（支持多个字符）
    const inputChars = Array.from(inputValue);
    let currentPos = typingPosition.value;

    for (
      let i = 0;
      i < inputChars.length && currentPos < props.text.length;
      i++
    ) {
      const inputChar = inputChars[i];
      const currentChar = props.text[currentPos];
      const isCorrect = inputChar === currentChar;

      // 记录输入内容和状态
      typingInputs.value.set(currentPos, inputChar);
      typingStatus.value.set(currentPos, isCorrect);

      currentPos++;
    }

    // 更新位置
    typingPosition.value = Math.min(currentPos, props.text.length);
    // 输入后光标在右侧
    cursorAtRight.value = true;

    // 滚动到当前位置并更新输入框位置
    if (typingPosition.value < props.text.length) {
      scrollToIndex(typingPosition.value);
    } else if (
      typingPosition.value >= props.text.length &&
      props.text.length > 0
    ) {
      // 如果已经到达末尾，定位到最后一个字符
      const lastIndex = props.text.length - 1;
      scrollToIndex(lastIndex);
    }

    // 清空输入框
    input.value = "";
  }
};

// 处理隐藏输入框的键盘事件（用于在composition状态下编辑拼音）
const handleHiddenInputKeyDown = (event: KeyboardEvent) => {
  // 在composition状态下，允许所有编辑键正常使用
  if (isComposing.value) {
    // 不阻止任何键，让输入框正常处理方向键等
    return;
  }
  // 非composition状态下，阻止默认行为，由handleTypingInput处理
  if (event.key === "Backspace") {
    event.preventDefault();
  }
};

// 处理隐藏输入框的键盘释放事件（用于更新光标位置）
const handleHiddenInputKeyUp = () => {
  // 在composition状态下，更新光标位置
  if (isComposing.value) {
    updateComposingCursorPos();
  }
};

// 处理键盘输入事件（打字模式）- 处理退格等特殊键
const handleTypingInput = (event: KeyboardEvent) => {
  // 只在学习模式且打字模式下处理
  if (!isTypingMode.value) {
    return;
  }

  // 如果正在输入中文（composition状态），允许方向键传递给输入框以编辑拼音
  if (isComposing.value) {
    // 在composition状态下，方向键应该传递给输入框，不阻止默认行为
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      // 允许输入框处理这些键，用于编辑拼音
      return;
    }
    return;
  }

  // 处理退格键
  if (event.key === "Backspace") {
    const currentPos = typingPosition.value;
    const hasInput = typingInputs.value.has(currentPos);

    if (cursorAtRight.value && hasInput) {
      // 光标在右侧且有输入：删除当前位置的字符，光标移动到当前格子的左侧
      typingStatus.value.delete(currentPos);
      typingInputs.value.delete(currentPos);
      cursorAtRight.value = false; // 光标移动到当前格子的左侧
      // 不改变位置，保持在当前格子
    } else {
      // 光标在左侧或当前位置没有输入：删除上一个字符，光标移动到上一个方格的左侧
      if (currentPos > 0) {
        const prevPos = currentPos - 1;
        typingStatus.value.delete(prevPos);
        typingInputs.value.delete(prevPos);
        typingPosition.value = prevPos;
        cursorAtRight.value = false; // 光标在左侧
        scrollToIndex(typingPosition.value);
      }
    }
    // 清空隐藏输入框
    if (hiddenInputRef.value) {
      hiddenInputRef.value.value = "";
    }
    event.preventDefault();
    return;
  }

  // 如果不在composition状态，处理方向键切换格子
  if (
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown"
  ) {
    // 允许方向键切换格子（在handleKeyDown中处理）
    return;
  }

  // 聚焦到隐藏输入框以捕获输入
  if (hiddenInputRef.value && event.key.length === 1) {
    hiddenInputRef.value.focus();
  }
};

// 处理键盘方向键事件
const handleKeyDown = (event: KeyboardEvent) => {
  // 如果是打字模式
  if (isTypingMode.value) {
    // 如果正在输入中文（composition状态），不处理方向键切换
    if (isComposing.value) {
      handleTypingInput(event);
      return;
    }

    // 处理方向键切换格子（在非composition状态下）
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
      const currentPos = typingPosition.value;
      const textLength = props.text.length;
      let newPos = currentPos;

      switch (event.key) {
        case "ArrowLeft":
          if (cursorAtRight.value && typingInputs.value.has(currentPos)) {
            // 如果光标在右侧，先移动到左侧
            cursorAtRight.value = false;
          } else if (currentPos > 0) {
            // 如果光标在左侧，移动到上一个字符
            newPos = currentPos - 1;
            cursorAtRight.value = typingInputs.value.has(newPos); // 根据上一个字符是否有输入决定光标位置
          }
          break;
        case "ArrowRight":
          if (!cursorAtRight.value && typingInputs.value.has(currentPos)) {
            // 如果光标在左侧且有输入，移动到右侧
            cursorAtRight.value = true;
          } else if (currentPos < textLength) {
            // 如果光标在右侧，移动到下一个字符
            newPos = Math.min(currentPos + 1, textLength);
            cursorAtRight.value = false; // 新位置光标在左侧
          }
          break;
        case "ArrowUp":
          // 向上移动到上一行
          if (currentPos >= perRow.value) {
            newPos = Math.max(0, currentPos - perRow.value);
          }
          break;
        case "ArrowDown":
          // 向下移动到下一行
          if (currentPos < textLength - perRow.value) {
            newPos = Math.min(textLength, currentPos + perRow.value);
          } else if (currentPos < textLength) {
            // 如果不在最后一行，移动到行尾
            const currentRow = Math.floor(currentPos / perRow.value);
            const lastRowStart = currentRow * perRow.value;
            const lastRowEnd = Math.min(
              lastRowStart + perRow.value,
              textLength
            );
            newPos = Math.min(
              currentPos + (lastRowEnd - currentPos),
              textLength
            );
          }
          break;
      }

      if (newPos !== currentPos) {
        typingPosition.value = newPos;
        scrollToIndex(newPos);
        event.preventDefault();
      }
      return;
    }

    // 其他按键交给handleTypingInput处理
    handleTypingInput(event);
    return;
  }

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

// 检查是否是打字模式的光标位置
const isTypingCursor = (index: number) => {
  return isTypingMode.value && typingPosition.value === index;
};

// 检查是否是打字模式中正确的字符
const isTypingCorrect = (index: number) => {
  return isTypingMode.value && typingStatus.value.get(index) === true;
};

// 检查是否是打字模式中错误的字符
const isTypingError = (index: number) => {
  return isTypingMode.value && typingStatus.value.get(index) === false;
};

// 滚动到指定索引的字符
const scrollToIndex = (index: number) => {
  nextTick(() => {
    // 在打字模式下，优先使用下层格子（拼音显示的位置）
    let element: HTMLElement | null = null;

    if (isTypingMode.value && props.layoutMode === "vertical") {
      // 上下布局：使用下层格子
      element = document.querySelector(
        `.cell.lower[data-char-index="${index}"]`
      ) as HTMLElement;
    } else if (isTypingMode.value && props.layoutMode === "horizontal") {
      // 左右布局：使用右侧格子
      element = document.querySelector(
        `.cell.right[data-char-index="${index}"]`
      ) as HTMLElement;
    }

    // 如果找不到，使用通用选择器
    if (!element) {
      element = document.querySelector(
        `[data-char-index="${index}"]`
      ) as HTMLElement;
    }

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      // 如果是打字模式，等待滚动完成后再更新输入框位置
      if (isTypingMode.value && hiddenInputRef.value) {
        // 平滑滚动是异步的，需要等待滚动完成
        // 使用 requestAnimationFrame 等待几帧，确保元素位置已更新
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // 再次等待一帧，确保滚动动画完成
            requestAnimationFrame(() => {
              updateInputPosition(element!);
            });
          });
        });
      }
    }
  });
};

// 更新输入框位置到当前输入位置的下方（直接根据显示拼音的元素定位）
const updateInputPosition = (element: HTMLElement) => {
  if (!hiddenInputRef.value) return;

  // 获取当前字符索引
  const currentIndex = parseInt(element.getAttribute("data-char-index") || "0");

  // 直接找到显示拼音的元素（下层格子或右侧格子）
  let pinyinElement: HTMLElement | null = null;
  let alignElement: HTMLElement | null = null; // 用于对齐的元素（上层格子或左侧格子）

  if (props.layoutMode === "vertical") {
    // 上下布局：拼音显示在下层格子
    pinyinElement = document.querySelector(
      `.cell.lower[data-char-index="${currentIndex}"]`
    ) as HTMLElement;
    // 使用上层格子进行对齐
    alignElement = document.querySelector(
      `.cell.upper[data-char-index="${currentIndex}"]`
    ) as HTMLElement;
  } else {
    // 左右布局：拼音显示在右侧格子
    pinyinElement = document.querySelector(
      `.cell.right[data-char-index="${currentIndex}"]`
    ) as HTMLElement;
    // 使用左侧格子进行对齐
    alignElement = document.querySelector(
      `.cell.left[data-char-index="${currentIndex}"]`
    ) as HTMLElement;
  }

  // 如果找不到拼音元素，使用当前元素
  if (!pinyinElement) {
    pinyinElement = element;
  }

  const pinyinRect = pinyinElement.getBoundingClientRect();

  // 使用 fixed 定位时，getBoundingClientRect() 返回的是相对于视口的位置，直接使用即可
  // 定位到拼音显示元素的底部下方，固定间距
  const spacing = -30; // 间距，可以调整这个值
  const targetTop = pinyinRect.bottom + spacing;

  // 使用对齐元素的位置和宽度（如果存在），否则使用拼音元素
  let targetLeft: number;
  let targetWidth: number;

  if (alignElement) {
    const alignRect = alignElement.getBoundingClientRect();
    targetLeft = alignRect.left;
    targetWidth = alignRect.width;
  } else {
    targetLeft = pinyinRect.left;
    targetWidth = pinyinRect.width;
  }

  hiddenInputRef.value.style.position = "fixed";
  hiddenInputRef.value.style.left = `${targetLeft}px`;
  hiddenInputRef.value.style.top = `${targetTop}px`;
  hiddenInputRef.value.style.width = `${targetWidth}px`;
  hiddenInputRef.value.style.height = "1px";
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

// 重置打字模式
const resetTyping = () => {
  typingPosition.value = 0;
  typingStatus.value.clear();
  typingInputs.value.clear();
  cursorAtRight.value = false;
  nextTick(() => {
    scrollToIndex(0);
  });
};

defineExpose({
  update,
  wrapEl,
  leftWrapEl,
  rightWrapEl,
  resetVisibleFonts,
  resetTyping,
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 显示第二行字体 */
.lower.show-second-font {
  color: #333 !important;
}

/* 打字模式：有输入内容时显示 */
.lower.typing-has-input {
  color: #333 !important;
}

/* 打字模式输入文字 - 显示在格子正中间 */
.typing-input-text {
  display: block;
  text-align: center;
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
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.6), 0 0 40px rgba(64, 158, 255, 0.4),
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

/* 打字模式：有输入内容时显示 */
.right.typing-has-input {
  opacity: 1;
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

/* 打字模式样式 */
/* 隐藏输入框 - 定位到当前输入位置的下方 */
.hidden-input {
  position: fixed;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: auto;
  z-index: 1000;
  caret-color: transparent;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
}

/* 光标容器 */
.typing-cursor-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

/* 拼音显示容器 - 显示在格子上半部分 */
.pinyin-display {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: rgba(255, 255, 255, 0.98);
  padding: 4px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  border: 1px solid #dcdfe6;
  white-space: nowrap;
  z-index: 101;
  min-width: fit-content;
  max-width: none;
  overflow: visible;
}

/* 拼音文本 - 放大到肉眼可见，使用固定字体，增加字母间距 */
.pinyin-text {
  font-size: 22px;
  color: #303133;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
    "Microsoft YaHei", "Segoe UI", Arial, sans-serif;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: 0.136em; /* 字母间距 = 光标宽度(2px) + 1px = 3px，3px/22px ≈ 0.136em */
}

/* 拼音光标 - 使用负边距避免挤占字母位置 */
.pinyin-cursor {
  display: inline-block;
  width: 2px; /* 光标宽度：2px（可在此处调整） */
  height: 22px;
  background-color: #000000;
  animation: pinyinCursorBlink 1.06s easei infinite;
  vertical-align: middle;
  margin-left: -0.072em; /* 负边距，让光标位于字母间隙中（3px间距的一半，约0.068em） */
  margin-right: -0.072em; /* 负边距，让光标位于字母间隙中 */
  flex-shrink: 0; /* 防止光标被压缩 */
}

@keyframes pinyinCursorBlink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

/* 光标指示器 - 在格子内部左侧，黑色闪烁（Windows标准530ms） */
.typing-cursor-indicator {
  position: absolute;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  width: 2px;
  height: 80%;
  background-color: #000000;
  border-radius: 1px;
  pointer-events: none;
  animation: cursorBlink 1.06s ease-in-out infinite;
  transition: left 0.1s ease, right 0.1s ease;
}

/* 光标在文字右边 - 当有输入文字时 */
.typing-cursor-indicator.cursor-after-text {
  left: auto;
  right: 2px;
}

@keyframes cursorBlink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

/* 打字模式光标位置高亮 */
.cell.typing-cursor {
  position: relative;
  z-index: 20;
}

.cell.typing-cursor :deep(.paper-grid) {
  border-color: #409eff !important;
  border-width: 2px !important;
  box-shadow: none !important;
  filter: none !important;
}

/* 打字模式正确字符 - 绿色（无发光效果） */
.cell.typing-correct {
  color: #67c23a !important;
}

.cell.typing-correct :deep(.paper-grid) {
  border-color: #67c23a !important;
  border-width: 2px !important;
  box-shadow: none !important;
  filter: none !important;
}

.cell.typing-correct :deep(.character-section) {
  color: #67c23a !important;
  text-shadow: none !important;
  filter: none !important;
}

/* 打字模式错误字符 - 红色（无发光效果） */
.cell.typing-error {
  color: #f56c6c !important;
}

.cell.typing-error :deep(.paper-grid) {
  border-color: #f56c6c !important;
  border-width: 2px !important;
  box-shadow: none !important;
  filter: none !important;
}

.cell.typing-error :deep(.character-section) {
  color: #f56c6c !important;
  text-shadow: none !important;
  filter: none !important;
}

/* 打字模式下鼠标悬停显示文本输入光标 */
.cell.lower.typing-cursor,
.cell.right.typing-cursor {
  cursor: text;
}

.cell.lower:hover,
.cell.right:hover {
  cursor: text;
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
