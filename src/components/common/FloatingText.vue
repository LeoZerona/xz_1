<template>
  <div class="floating-text-container" :style="containerStyle">
    <span
      v-for="(char, index) in characters"
      :key="index"
      class="floating-char"
      :style="getCharStyle(index)"
    >
      {{ char }}
    </span>
  </div>
</template>

<script setup lang="ts" name="FloatingText">
interface Props {
  characters?: string[];
  count?: number; // 同时显示的文字数量
  speed?: number; // 动画速度（秒）
  fontSize?: {
    min?: number;
    max?: number;
  };
  opacity?: {
    min?: number;
    max?: number;
  };
  blur?: {
    min?: number;
    max?: number;
  };
  delay?: number; // 每个文字之间的延迟（秒）
}

const props = withDefaults(defineProps<Props>(), {
  characters: () => ['篆', '书', '文', '字', '墨', '笔', '纸', '砚', '诗', '画', '印', '章', '古', '今', '雅', '韵'],
  count: 16,
  speed: 15,
  fontSize: () => ({ min: 20, max: 60 }),
  opacity: () => ({ min: 0, max: 0.6 }),
  blur: () => ({ min: 0, max: 8 }),
  delay: 0.8,
});

const containerStyle = computed(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  overflow: 'hidden',
  zIndex: 5,
}));

const getCharStyle = (index: number) => {
  // 计算位置（随机分布在水平方向）
  const left = 5 + (index % 5) * 18 + Math.random() * 5;
  
  // 计算动画延迟
  const delay = index * props.delay;
  
  // 计算动画时长（添加一些随机性）
  const duration = props.speed + Math.random() * 6;
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    '--font-size-max': `${props.fontSize.max}px`,
    '--font-size-min': `${props.fontSize.min}px`,
    '--opacity-max': props.opacity.max,
    '--opacity-min': props.opacity.min,
    '--blur-max': `${props.blur.max}px`,
    '--blur-min': `${props.blur.min}px`,
  };
};
</script>

<style lang="scss" scoped>
.floating-text-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}

.floating-char {
  position: absolute;
  font-family: 'FangZhengXiaoZhuan', serif;
  font-weight: bold;
  animation: floatUp 15s linear infinite;
  will-change: transform, opacity, filter, font-size;
  transform-origin: center;
  
  // 使用渐变文字效果
  background: linear-gradient(
    180deg,
    rgba(101, 67, 33, 0.8) 0%,
    rgba(101, 67, 33, 0.4) 50%,
    rgba(101, 67, 33, 0.2) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  // 文字阴影
  text-shadow: 
    0 0 10px rgba(101, 67, 33, 0.2),
    0 0 20px rgba(139, 120, 100, 0.1),
    0 0 30px rgba(101, 67, 33, 0.05);
}

@keyframes floatUp {
  0% {
    // 屏幕底部外：大、清晰、不透明（从底部开始）
    transform: translateY(100vh) translateX(0) rotate(0deg) scale(1);
    font-size: var(--font-size-max);
    opacity: var(--opacity-max);
    filter: blur(var(--blur-min));
  }
  
  2% {
    // 刚进入屏幕底部：稍微缩小，保持清晰
    transform: translateY(98vh) translateX(5px) rotate(1deg) scale(0.99);
    font-size: calc(var(--font-size-max) * 0.99);
    opacity: var(--opacity-max);
    filter: blur(var(--blur-min));
  }
  
  10% {
    // 屏幕下部：开始缩小和轻微模糊
    transform: translateY(90vh) translateX(-8px) rotate(-2deg) scale(0.95);
    font-size: calc(var(--font-size-max) * 0.95);
    opacity: calc(var(--opacity-max) * 0.98);
    filter: blur(calc(var(--blur-min) + (var(--blur-max) - var(--blur-min)) * 0.05));
  }
  
  25% {
    // 屏幕中下部：继续缩小，模糊度增加
    transform: translateY(75vh) translateX(12px) rotate(3deg) scale(0.88);
    font-size: calc(var(--font-size-max) * 0.88);
    opacity: calc(var(--opacity-max) * 0.9);
    filter: blur(calc(var(--blur-min) + (var(--blur-max) - var(--blur-min)) * 0.2));
  }
  
  45% {
    // 屏幕中部：中等大小，明显模糊
    transform: translateY(55vh) translateX(-15px) rotate(-4deg) scale(0.75);
    font-size: calc(var(--font-size-max) * 0.75);
    opacity: calc(var(--opacity-max) * 0.75);
    filter: blur(calc(var(--blur-min) + (var(--blur-max) - var(--blur-min)) * 0.4));
  }
  
  65% {
    // 屏幕中上部：较小，很模糊
    transform: translateY(35vh) translateX(10px) rotate(2deg) scale(0.6);
    font-size: calc(var(--font-size-max) * 0.6);
    opacity: calc(var(--opacity-max) * 0.55);
    filter: blur(calc(var(--blur-min) + (var(--blur-max) - var(--blur-min)) * 0.6));
  }
  
  80% {
    // 接近顶部：很小，非常模糊
    transform: translateY(20vh) translateX(-8px) rotate(-1deg) scale(0.45);
    font-size: calc(var(--font-size-max) * 0.45);
    opacity: calc(var(--opacity-max) * 0.35);
    filter: blur(calc(var(--blur-min) + (var(--blur-max) - var(--blur-min)) * 0.8));
  }
  
  92% {
    // 即将消失：极小，几乎完全模糊
    transform: translateY(8vh) translateX(5px) rotate(0.5deg) scale(0.32);
    font-size: calc(var(--font-size-max) * 0.32);
    opacity: calc(var(--opacity-max) * 0.2);
    filter: blur(calc(var(--blur-min) + (var(--blur-max) - var(--blur-min)) * 0.92));
  }
  
  100% {
    // 完全消失：最小，完全模糊，透明
    transform: translateY(-10vh) translateX(0) rotate(0deg) scale(0.2);
    font-size: var(--font-size-min);
    opacity: var(--opacity-min);
    filter: blur(var(--blur-max));
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .floating-char {
    // 移动端减小字体大小范围
    font-size: calc(var(--font-size-max) * 0.7) !important;
  }
}

@media (max-width: 480px) {
  .floating-char {
    // 超小屏幕进一步减小
    font-size: calc(var(--font-size-max) * 0.6) !important;
  }
}
</style>

