<template>
  <ul ref="wrapEl" class="rice-ul" @copy="handleCopy">
    <li
      v-for="(ch, i) in textArr"
      :key="i"
      class="col"
    >
      <!-- 上层：字体 A -->
      <paper-grid
        :grid-type="gridType"
        :show-pinyin="showPinyin"
        :pinyin="pinyinMap[i] || ''"
        :cell-size="cellSize"
        class="cell upper"
        :data-char="ch"
        :data-char-index="i"
        :class="{ 'highlighted': isHighlighted(i) }"
      >
        {{ ch }}
      </paper-grid>
      <!-- 下层：字体 B -->
      <paper-grid
        :grid-type="gridType"
        :show-pinyin="false"
        :cell-size="cellSize"
        class="cell lower"
        :data-char="ch"
        :data-char-index="i"
        :class="{ 'highlighted': isHighlighted(i) }"
      >
        {{ ch }}
      </paper-grid>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PaperGrid from './PaperGrid.vue'

interface Props {
  text: string;
  cellSize: number;
  gap: number;
  highlightIndexes?: number[];
  gridType?: 'tian' | 'mi' | 'none';
  showPinyin?: boolean;
  pinyinMap?: Record<number, string>;
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  cellSize: 69,
  gap: 10,
  highlightIndexes: () => [],
  gridType: 'tian',
  showPinyin: false,
  pinyinMap: () => ({}),
});

const wrapEl = ref<HTMLUListElement>()
const wrapW = ref(0)

const update = () => {
  wrapW.value = wrapEl.value?.getBoundingClientRect().width ?? 0
}

onMounted(() => {
  update()
  window.addEventListener('resize', update)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', update)
})

const unit = computed(() => props.cellSize + props.gap)
const perRow = computed(() => Math.max(1, Math.floor(wrapW.value / unit.value)))
const textArr = computed(() => Array.from(props.text))

// CSS 变量计算
const gapPx = computed(() => `${props.gap}px`)
const cellSizePx = computed(() => `${props.cellSize}px`)

const isHighlighted = (index: number) => {
  return props.highlightIndexes.includes(index)
}

/* ===== 处理复制事件，避免重复复制 ===== */
const handleCopy = (e: ClipboardEvent) => {
  e.preventDefault()
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  
  // 获取所有选中的上层单元格（楷体）
  const upperCells = Array.from(wrapEl.value?.querySelectorAll('.cell.upper') || [])
    .filter(cell => range.intersectsNode(cell))
    .map(cell => cell.getAttribute('data-char') || cell.textContent?.trim() || '')
    .filter(char => char)
  
  // 如果上层没有选中，尝试获取下层（小篆）
  let text = upperCells.join('')
  if (!text) {
    const lowerCells = Array.from(wrapEl.value?.querySelectorAll('.cell.lower') || [])
      .filter(cell => range.intersectsNode(cell))
      .map(cell => cell.getAttribute('data-char') || cell.textContent?.trim() || '')
      .filter(char => char)
    text = lowerCells.join('')
  }
  
  // 将处理后的文字写入剪贴板
  if (e.clipboardData && text) {
    e.clipboardData.setData('text/plain', text)
  }
}

defineExpose({
  update,
  wrapEl
})
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
  gap: 0;              /* 无间隙，使用负边距解决边框重叠 */
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

/* 字体 A */
.upper { 
  font-family: 'KT', KaiTi, serif; 
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* 字体 B */
.lower { 
  font-family: 'FangZhengXiaoZhuan', '思源黑体', sans-serif; 
  color: transparent;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* 选择时的样式优化 */
.cell.upper::selection {
  background-color: rgba(64, 158, 255, 0.3);
  color: #333;
}

.cell.upper::-moz-selection {
  background-color: rgba(64, 158, 255, 0.3);
  color: #333;
}

/* 字体B选中时才显示 */
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

/* 稿纸样式由 PaperGrid 组件处理 */
</style>

