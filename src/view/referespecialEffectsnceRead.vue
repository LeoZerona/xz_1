<template>
  <div class="stage">
    <!-- <span
      v-for="t in sortedTexts"
      :key="t.id"
      class="text"
      :style="getStyle(t)"
    >
      {{ t.content }}
    </span> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from "vue";

interface TextItem {
  id: number;
  content: string;
  x: number;
  y: number;
  z: number; // 当前深度
  bornZ: number; // 出生深度（负值表示更远）
}

const DICT = [
  "按",
  "设",
  "计",
  "大",
  "咖",
  "十",
  "九",
  "大",
  "精",
  "卡",
  "贷",
  "时",
  "间",
];

const texts = reactive<TextItem[]>([]);
let last = performance.now();
let rafId = 0;

/* 生成新文字，默认出生在 –1.5 ~ –0.2 之间，可调整 */
function createText(): TextItem {
  return {
    id: Math.random(),
    content: DICT[Math.floor(Math.random() * DICT.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 0.5, // 出生更远
    bornZ: 0,
  };
}

/* 初始化池子 */
function init(count = 60) {
  for (let i = 0; i < count; i++) texts.push(createText());
}

/* 每帧更新 */
function update(now: number) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  for (let i = texts.length - 1; i >= 0; i--) {
    const t = texts[i];
    // 速度 ∝ 当前 z，整体再慢 1/3
    const speed = (0.06 + t.z * 0.08) * 0.1;
    t.z += speed * dt * 60;
    if (t.z >= 1) {
      texts.splice(i, 1);
      texts.push(createText());
    }
  }
  rafId = requestAnimationFrame(update);
}

onMounted(() => {
  init();
  rafId = requestAnimationFrame(update);
});
onUnmounted(() => cancelAnimationFrame(rafId));

/* 样式：大小 / 模糊 / 透明度 仍只与当前 z 有关 */
function getStyle(t: TextItem) {
  const size = 0.8 + t.z * 3.2;
  const blur = Math.max(0, (1 - t.z) * 3);
  const opacity = 0.35 + t.z * 0.65;
  return {
    left: `${t.x}%`,
    top: `${t.y}%`,
    fontSize: `${size.toFixed(2)}rem`,
    filter: `blur(${blur.toFixed(2)}px)`,
    opacity,
  };
}

/* 按 z 排序，远的先画 */
const sortedTexts = computed(() => [...texts].sort((a, b) => a.z - b.z));
</script>

<style scoped>
.stage {
  position: relative;
  width: 100vw;
  height: 100vh;
  perspective: 900px;
  /* background: #000; */
}

.text {
  position: absolute;
  color: #fff;
  font-family: sans-serif;
  white-space: nowrap;
  user-select: none;
  transform: translate(-50%, -50%);
  will-change: transform, opacity, filter;
}

.aaa {
  position: absolute;
  top: 10px;
  bottom: 10px;
  width: 50px;
  height: 50px;
  background-color: violet;
  .bbb {
    width: 10px;
    height: 10px;
    /* position: absolute; */
    top: 10px;
    background-color: darkblue;
  }
  .ccc {
    width: 10px;
    height: 10px;
    /* position: absolute; */
    top: 30px;
    background-color: darkcyan;
  }
}
</style>
