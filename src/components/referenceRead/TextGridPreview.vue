<template>
  <div class="preview-grid" :class="{ 'preview-vertical': readMode === 'vertical', 'preview-horizontal': readMode === 'horizontal' }">
    <!-- 上下布局预览 -->
    <ul v-if="readMode === 'vertical'" class="preview-ul" :class="{ 'grid-none': gridType === 'none' }">
      <li
        v-for="(ch, i) in textArr"
        :key="i"
        class="preview-col"
      >
        <!-- 上层：字体 A -->
        <paper-grid
          :grid-type="gridType"
          :show-pinyin="showPinyin"
          :pinyin="pinyinMap[i] || ''"
          :cell-size="previewCellSize"
          class="preview-cell preview-upper"
          :style="{ fontFamily: firstFont }"
        >
          {{ ch }}
        </paper-grid>
        <!-- 下层：字体 B -->
        <paper-grid
          :grid-type="gridType"
          :show-pinyin="false"
          :cell-size="previewCellSize"
          :is-lower="true"
          class="preview-cell preview-lower"
          :style="{ fontFamily: secondFont }"
        >
          {{ ch }}
        </paper-grid>
      </li>
    </ul>

    <!-- 左右布局预览 -->
    <div v-else class="horizontal-preview">
      <div class="preview-left">
        <ul class="preview-ul" :class="{ 'grid-none': gridType === 'none' }">
          <li
            v-for="(ch, i) in textArr"
            :key="i"
            class="preview-col"
          >
            <paper-grid
              :grid-type="gridType"
              :show-pinyin="showPinyin"
              :pinyin="pinyinMap[i] || ''"
              :cell-size="previewCellSize"
              class="preview-cell preview-left-cell"
              :style="{ fontFamily: firstFont }"
            >
              {{ ch }}
            </paper-grid>
          </li>
        </ul>
      </div>
      <div class="preview-right">
        <ul class="preview-ul" :class="{ 'grid-none': gridType === 'none' }">
          <li
            v-for="(ch, i) in textArr"
            :key="i"
            class="preview-col"
          >
            <paper-grid
              :grid-type="gridType"
              :show-pinyin="showPinyin"
              :pinyin="pinyinMap[i] || ''"
              :cell-size="previewCellSize"
              class="preview-cell preview-right-cell"
              :style="{ fontFamily: secondFont }"
            >
              {{ ch }}
            </paper-grid>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PaperGrid from './PaperGrid.vue'
import { getPinyinMap } from '@/utils/pinyin'

interface Props {
  text: string
  readMode: 'vertical' | 'horizontal'
  firstFont: string
  secondFont: string
  gridType: 'tian' | 'mi' | 'none'
  showPinyin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  readMode: 'vertical',
  firstFont: 'HanYiKaiTiFan',
  secondFont: 'FangZhengXiaoZhuan',
  gridType: 'tian',
  showPinyin: false
})

const textArr = computed(() => Array.from(props.text).slice(0, 20)) // 预览只显示前20个字符
const previewCellSize = 50 // 预览格子大小
const previewGap = 8 // 预览间距

// 计算拼音映射
const pinyinMap = computed(() => {
  if (props.showPinyin && props.text) {
    return getPinyinMap(props.text)
  }
  return {}
})

// CSS 变量
const gapPx = computed(() => props.gridType === 'none' ? '0px' : `${previewGap}px`)
const cellSizePx = computed(() => `${previewCellSize}px`)
</script>

<style lang="scss" scoped>
.preview-grid {
  width: 100%;
}

/* 预览列表样式 */
.preview-ul {
  display: flex;
  flex-wrap: wrap;
  gap: v-bind(gapPx);
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* 预览列单元 */
.preview-col {
  display: flex;
  flex-direction: column;
  width: v-bind(cellSizePx);
  gap: 0;
}

/* 预览单元格 */
.preview-cell {
  position: relative;
  width: v-bind(cellSizePx);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  line-height: 1;
  color: #333;
}

/* 上下布局预览 */
.preview-upper,
.preview-lower {
  /* 样式由 PaperGrid 组件控制 */
}

/* 左右布局预览 */
.horizontal-preview {
  display: flex;
  gap: 20px;

  .preview-left,
  .preview-right {
    flex: 1;
    min-width: 0;
  }

  .preview-left-cell,
  .preview-right-cell {
    /* 样式由 PaperGrid 组件控制 */
  }
}

/* 无格模式：左右无间隙 */
.preview-ul.grid-none {
  gap: 0;
}
</style>

