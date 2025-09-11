<template>
  <navigation></navigation>
  <div style="margin-top: 10px;"></div>
  <ul ref="wrapEl" class="rice-ul">
    <li
      v-for="(ch, i) in textArr"
      :key="i"
      class="col"
    >
      <!-- 上层：字体 A -->
      <div class="cell upper">{{ ch }}</div>
      <!-- 下层：字体 B -->
      <div class="cell lower">{{ ch }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/* ===== 可配参数 ===== */
const cellSize = 69
const gap      = 10
const text = ref('')          // 最终内容


/* ===== 容器宽度响应式 ===== */
const wrapEl = ref<HTMLUListElement>()
const wrapW  = ref(0)
const update = () => wrapW.value = wrapEl.value?.getBoundingClientRect().width ?? 0
onMounted(async () => { 
  update(); 
  window.addEventListener('resize', update) 
  try {
    const res  = await fetch('/article.txt')   // 相对于站点根
    const data = await res.text()
    text.value = data.trim()                   // 去掉末尾换行
  } catch (e) {
    console.error('读取 article.txt 失败', e)
  }
})


onBeforeUnmount(() => window.removeEventListener('resize', update))

/* ===== 每行个数 & 字数组 ===== */
// 一个“列”总宽 = 格子宽 + 间隙
const unit   = cellSize + gap
const perRow = computed(() => Math.max(1, Math.floor(wrapW.value / unit)))
const textArr = computed(() => Array.from(text.value))
</script>

<style scoped>
/* ------------ ul ------------ */
.rice-ul {
  display: flex;
  flex-wrap: wrap;
  gap: v-bind(gap + 'px');
  width: 100%;
  margin: 0;
  padding: 0;
}

/* ------------ 列单元 ------------ */
.col {
  display: flex;
  flex-direction: column;
  width: v-bind(cellSize + 'px');
  gap: 4px;              /* 上下两格之间小缝隙 */
}

/* ------------ 田字格公共样式 ------------ */
.cell {
  position: relative;
  width: v-bind(cellSize + 'px');
  height: v-bind(cellSize + 'px');
  border: 1px dashed #aaa;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: v-bind(cellSize + 'px');
  line-height: 1;
  color: #333;
}

/* 字体 A */
.upper { 
  font-family: 'KT', KaiTi, serif; 
  /* color: transparent; */
}

/* 字体 B */
.lower { 
  font-family: 'FangZhengXiaoZhuan', '思源黑体', sans-serif; 
  color: transparent;
}

/* ------------ 虚线十字（沉底）------------ */
.cell::before,
.cell::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}
.cell::before {
  background: repeating-linear-gradient(
    to right,#aaa 0 3px,transparent 3px 6px
  ) 0 50%/100% 1px no-repeat;
}
.cell::after {
  background: repeating-linear-gradient(
    to bottom,#aaa 0 3px,transparent 3px 6px
  ) 50% 0/1px 100% no-repeat;
}
</style>