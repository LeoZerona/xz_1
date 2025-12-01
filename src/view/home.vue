<template>
  <div class="home-container">
    <!-- 背景层 -->
    <div class="background-layer">
      <div class="paper-texture"></div>
      <div class="ink-wash"></div>
    </div>

    <!-- 视频背景（可选） -->
    <video
      v-if="showVideo"
      ref="video"
      class="video-bg"
      autoplay
      loop
      muted
      @click="toggleVideo"
    >
      <source src="@/assets/home_video.mp4" type="video/mp4" />
    </video>

    <!-- 音频 -->
    <audio ref="music" autoplay loop>
      <source src="@/assets/home_music.mp3" type="audio/mp3" />
    </audio>

    <!-- 播放控制按钮 -->
    <div v-if="showVideo" class="video-control" @click="toggleVideo">
      <el-icon class="control-icon">
        <VideoPlay v-if="!playStatus" />
        <VideoPause v-else />
      </el-icon>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部装饰 -->
      <div class="top-decoration">
        <div class="seal-left"></div>
        <div class="title-seal">
          <div class="seal-text">篆</div>
        </div>
        <div class="seal-right"></div>
      </div>

      <!-- 主标题 -->
      <div class="main-title">
        <div class="title-line top-line"></div>
        <h1 class="title-text">
          <span class="title-char">小</span>
          <span class="title-char">篆</span>
          <span class="title-char">在</span>
          <span class="title-char">线</span>
          <span class="title-char">学</span>
          <span class="title-char">习</span>
        </h1>
        <div class="title-line bottom-line"></div>
      </div>

      <!-- 副标题 -->
      <div class="subtitle">
        <p class="subtitle-text">传承千年文字之美</p>
        <div class="subtitle-decoration">
          <span class="decoration-dot"></span>
          <span class="decoration-dot"></span>
          <span class="decoration-dot"></span>
        </div>
      </div>

      <!-- 开始学习按钮 -->
      <div class="start-button-wrapper">
        <button class="start-button" @click="learnStart">
          <span class="button-text">开始学习</span>
          <div class="button-brush"></div>
          <div class="button-ink"></div>
        </button>
      </div>

      <!-- 底部装饰 -->
      <div class="bottom-decoration">
        <div class="scroll-left"></div>
        <div class="scroll-right"></div>
      </div>
    </div>

    <!-- 浮动文字装饰 -->
    <floating-text
      :characters="floatingChars"
      :count="isMobile ? 12 : 16"
      :speed="15"
      :font-size="isMobile ? { min: 15, max: 40 } : { min: 20, max: 60 }"
      :opacity="{ min: 0, max: 0.6 }"
      :blur="{ min: 0, max: 8 }"
      :delay="0.8"
    />

    <!-- 墨点装饰 -->
    <div class="ink-dots">
      <div
        v-for="i in 12"
        :key="i"
        class="ink-dot"
        :style="getInkDotStyle(i)"
      ></div>
    </div>

    <!-- 水墨笔触装饰 -->
    <div class="brush-strokes">
      <div
        v-for="i in 6"
        :key="i"
        class="brush-stroke"
        :style="getBrushStrokeStyle(i)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
import { VideoPlay, VideoPause } from "@element-plus/icons-vue";
import FloatingText from "@/components/common/FloatingText.vue";

const router = useRouter();
const video = ref<HTMLVideoElement | null>(null);
const music = ref<HTMLAudioElement | null>(null);
const playStatus = ref(true);
const showVideo = ref(false); // 默认不显示视频，使用古朴背景

const floatingChars = [
  "篆",
  "书",
  "文",
  "字",
  "墨",
  "笔",
  "纸",
  "砚",
  "诗",
  "画",
  "印",
  "章",
  "古",
  "今",
  "雅",
  "韵",
];

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});

const toggleVideo = () => {
  if (video.value && music.value) {
    playStatus.value = !playStatus.value;
    if (playStatus.value) {
      video.value.play();
      music.value.play();
    } else {
      video.value.pause();
      music.value.pause();
    }
  }
};

const learnStart = () => {
  router.push({
    path: "/topic_bank",
  });
};

const getInkDotStyle = (index: number) => {
  const size = 25 + Math.random() * 50;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * 5;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
  };
};

const getBrushStrokeStyle = (index: number) => {
  const width = 3 + Math.random() * 5;
  const height = 100 + Math.random() * 200;
  const left = Math.random() * 100;
  const top = -50 + Math.random() * 50;
  const rotation = -30 + Math.random() * 60;
  const delay = Math.random() * 8;
  const duration = 20 + Math.random() * 15;

  return {
    width: `${width}px`,
    height: `${height}px`,
    left: `${left}%`,
    top: `${top}%`,
    transform: `rotate(${rotation}deg)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
};
</script>

<style lang="scss" scoped>
.home-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f1e8 0%, #e8ddd4 50%, #d4c4b0 100%);
}

/* 背景层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.paper-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(139, 120, 100, 0.03) 2px,
      rgba(139, 120, 100, 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(139, 120, 100, 0.03) 2px,
      rgba(139, 120, 100, 0.03) 4px
    );
  opacity: 0.6;
}

.ink-wash {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 200%;
  background: radial-gradient(
    ellipse at center,
    rgba(101, 67, 33, 0.15) 0%,
    transparent 70%
  );
  transform: rotate(-15deg);
  animation: inkFlow 20s ease-in-out infinite;
}

@keyframes inkFlow {
  0%,
  100% {
    transform: rotate(-15deg) translateY(0);
    opacity: 0.15;
  }
  50% {
    transform: rotate(-12deg) translateY(-5%);
    opacity: 0.2;
  }
}

/* 视频背景 */
.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
  z-index: 1;
  transition: opacity 0.5s;
}

.video-control {
  position: fixed;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(139, 120, 100, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s;
  border: 2px solid rgba(101, 67, 33, 0.5);

  &:hover {
    background: rgba(101, 67, 33, 0.9);
    transform: scale(1.1);
  }

  .control-icon {
    font-size: 24px;
    color: #f5f1e8;
  }
}

/* 主要内容 */
.main-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 40px 20px;
}

/* 顶部装饰 */
.top-decoration {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  opacity: 0;
  animation: fadeInDown 1s ease-out 0.3s forwards;
}

.seal-left,
.seal-right {
  width: 60px;
  height: 60px;
  border: 3px solid #8b7864;
  border-radius: 50%;
  position: relative;
  background: rgba(245, 241, 232, 0.5);
  backdrop-filter: blur(5px);

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border: 2px solid #8b7864;
    border-radius: 50%;
  }
}

.title-seal {
  width: 100px;
  height: 100px;
  border: 4px solid #654321;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f1e8 0%, #e8ddd4 100%);
  box-shadow: 0 0 20px rgba(101, 67, 33, 0.3),
    inset 0 0 20px rgba(139, 120, 100, 0.2);
  animation: sealPulse 3s ease-in-out infinite;

  .seal-text {
    font-family: "FangZhengXiaoZhuan", serif;
    font-size: 48px;
    color: #654321;
    font-weight: bold;
  }
}

@keyframes sealPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(101, 67, 33, 0.3),
      inset 0 0 20px rgba(139, 120, 100, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(101, 67, 33, 0.5),
      inset 0 0 25px rgba(139, 120, 100, 0.3);
  }
}

/* 主标题 */
.main-title {
  text-align: center;
  margin: 40px 0;
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.6s forwards;
}

.title-line {
  height: 2px;
  background: linear-gradient(to right, transparent, #8b7864, transparent);
  margin: 20px auto;
  width: 300px;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    background: #654321;
    border-radius: 50%;
    transform: translateY(-50%);
  }

  &::before {
    left: -10px;
  }

  &::after {
    right: -10px;
  }
}

.title-text {
  font-family: "FangZhengXiaoZhuan", serif;
  font-size: 72px;
  color: #654321;
  font-weight: bold;
  letter-spacing: 20px;
  margin: 30px 0;
  text-shadow: 2px 2px 4px rgba(101, 67, 33, 0.3),
    0 0 20px rgba(139, 120, 100, 0.2);
}

.title-char {
  display: inline-block;
  animation: charFloat 3s ease-in-out infinite;

  @for $i from 1 through 6 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.2}s;
    }
  }
}

@keyframes charFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 副标题 */
.subtitle {
  text-align: center;
  margin: 30px 0;
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.9s forwards;
}

.subtitle-text {
  font-size: 24px;
  color: #8b7864;
  font-weight: 300;
  letter-spacing: 8px;
  margin-bottom: 15px;
  font-family: "HanYiKaiTiFan", serif;
}

.subtitle-decoration {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.decoration-dot {
  width: 6px;
  height: 6px;
  background: #654321;
  border-radius: 50%;
  animation: dotPulse 2s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.3s;
  }

  &:nth-child(3) {
    animation-delay: 0.6s;
  }
}

@keyframes dotPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

/* 开始学习按钮 */
.start-button-wrapper {
  margin: 60px 0;
  opacity: 0;
  animation: fadeInUp 1s ease-out 1.2s forwards;
}

.start-button {
  position: relative;
  padding: 20px 80px;
  font-size: 24px;
  font-weight: 600;
  color: #654321;
  background: linear-gradient(135deg, #f5f1e8 0%, #e8ddd4 100%);
  border: 3px solid #8b7864;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: "HanYiKaiTiFan", serif;
  letter-spacing: 4px;
  box-shadow: 0 4px 15px rgba(101, 67, 33, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(101, 67, 33, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(101, 67, 33, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    border-color: #654321;

    &::before {
      left: 100%;
    }

    .button-ink {
      width: 100%;
      height: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-brush {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background: radial-gradient(
    circle,
    rgba(101, 67, 33, 0.1) 0%,
    transparent 70%
  );
  border-radius: 50%;
  transition: all 0.6s;
  z-index: 1;
}

.button-ink {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  background: linear-gradient(
    to top,
    rgba(101, 67, 33, 0.2) 0%,
    transparent 100%
  );
  transition: all 0.6s;
  z-index: 1;
}

.start-button:hover .button-brush {
  width: 200px;
  height: 200px;
}

/* 底部装饰 */
.bottom-decoration {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 400px;
  opacity: 0;
  animation: fadeInUp 1s ease-out 1.5s forwards;
}

.scroll-left,
.scroll-right {
  width: 120px;
  height: 8px;
  background: linear-gradient(to right, transparent, #8b7864, transparent);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    border: 2px solid #8b7864;
    border-radius: 50%;
    background: rgba(245, 241, 232, 0.8);
  }
}

/* 墨点装饰 */
.ink-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.ink-dot {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(101, 67, 33, 0.2) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: inkDotFloat 15s ease-in-out infinite;
}

@keyframes inkDotFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.08;
  }
  25% {
    transform: translate(30px, -40px) scale(1.3);
    opacity: 0.18;
  }
  50% {
    transform: translate(-25px, -60px) scale(0.8);
    opacity: 0.25;
  }
  75% {
    transform: translate(40px, -30px) scale(1.2);
    opacity: 0.15;
  }
}

/* 水墨笔触装饰 */
.brush-strokes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
  overflow: hidden;
}

.brush-stroke {
  position: absolute;
  background: linear-gradient(
    to bottom,
    rgba(101, 67, 33, 0.25) 0%,
    rgba(101, 67, 33, 0.15) 30%,
    rgba(101, 67, 33, 0.08) 60%,
    transparent 100%
  );
  border-radius: 50%;
  animation: brushStrokeFlow 25s ease-in-out infinite;
  filter: blur(2px);
  will-change: transform, opacity;
}

@keyframes brushStrokeFlow {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scaleY(0.5);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  30% {
    transform: translateY(30vh) translateX(20px) rotate(5deg) scaleY(1);
    opacity: 0.4;
  }
  60% {
    transform: translateY(60vh) translateX(-15px) rotate(-3deg) scaleY(1.2);
    opacity: 0.3;
  }
  90% {
    transform: translateY(100vh) translateX(10px) rotate(2deg) scaleY(0.8);
    opacity: 0.1;
  }
  100% {
    transform: translateY(120vh) translateX(0) rotate(0deg) scaleY(0.5);
    opacity: 0;
  }
}

/* 动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-control {
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;

    .control-icon {
      font-size: 20px;
    }
  }

  .main-content {
    padding: 20px 15px;
  }

  .top-decoration {
    gap: 10px;
    margin-bottom: 20px;
  }

  .seal-left,
  .seal-right {
    width: 40px;
    height: 40px;

    &::before {
      width: 20px;
      height: 20px;
    }
  }

  .title-seal {
    width: 70px;
    height: 70px;

    .seal-text {
      font-size: 36px;
    }
  }

  .title-text {
    font-size: 36px;
    letter-spacing: 8px;
    margin: 20px 0;
  }

  .title-char {
    font-size: 36px;
  }

  .title-line {
    width: 200px;
    margin: 15px auto;
  }

  .subtitle {
    margin: 20px 0;
  }

  .subtitle-text {
    font-size: 16px;
    letter-spacing: 4px;
  }

  .start-button-wrapper {
    margin: 40px 0;
  }

  .start-button {
    padding: 16px 60px;
    font-size: 18px;
    letter-spacing: 2px;
  }

  .bottom-decoration {
    gap: 100px;
    bottom: 20px;
  }

  .scroll-left,
  .scroll-right {
    width: 80px;
    height: 6px;

    &::before {
      width: 20px;
      height: 20px;
      top: -12px;
    }
  }
}

@media (max-width: 480px) {
  .video-control {
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;

    .control-icon {
      font-size: 18px;
    }
  }

  .main-content {
    padding: 15px 10px;
  }

  .top-decoration {
    gap: 8px;
    margin-bottom: 15px;
  }

  .seal-left,
  .seal-right {
    width: 35px;
    height: 35px;

    &::before {
      width: 18px;
      height: 18px;
    }
  }

  .title-seal {
    width: 60px;
    height: 60px;

    .seal-text {
      font-size: 32px;
    }
  }

  .title-text {
    font-size: 28px;
    letter-spacing: 4px;
    margin: 15px 0;
  }

  .title-char {
    font-size: 28px;
  }

  .title-line {
    width: 150px;
    margin: 10px auto;
  }

  .subtitle {
    margin: 15px 0;
  }

  .subtitle-text {
    font-size: 14px;
    letter-spacing: 2px;
  }

  .start-button-wrapper {
    margin: 30px 0;
  }

  .start-button {
    padding: 14px 50px;
    font-size: 16px;
    letter-spacing: 1px;
  }

  .bottom-decoration {
    gap: 60px;
    bottom: 15px;
  }

  .scroll-left,
  .scroll-right {
    width: 60px;
    height: 5px;

    &::before {
      width: 18px;
      height: 18px;
      top: -10px;
    }
  }
}
</style>
