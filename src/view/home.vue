<template>
  <video ref="video" class="video" autoplay loop muted @click="videoPlay">
    <source src="@/assets/home_video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <audio ref="music" autoplay loop>
    <source src="@/assets/home_music.mp3" type="audio/mp3" />
    Your browser does not support the audio element.
  </audio>
  <div v-show="!playStatus" class="playBtn" @click="videoPlay">
    <div class="circle"></div>
    <div class="triangle">
      <div class="top"></div>
      <div class="bottom"></div>
      <div class="right"></div>
    </div>
  </div>
  <div class="start-area">
    <div class="left-line">
      <div class="left-top-line"></div>
      <div class="left-bottom-line"></div>
    </div>
    <div class="middle-content">
      <div class="graph">
        <div class="left-top"></div>
        <div class="right-top"></div>
        <div class="left-bottom"></div>
        <div class="right-bottom"></div>
      </div>
      <div class="btn" @click="learnStart">
        <el-icon class="icon"><Top /></el-icon>
        开始学习
      </div>
    </div>
    <div class="right-line">
      <div class="right-top-line"></div>
      <div class="right-bottom-line"></div>
    </div>
  </div>
</template>
<script lang="ts" name="home" setup>
const router = useRouter();
const video: Ref<HTMLVideoElement | null> = ref(null);
const music: Ref<HTMLAudioElement | null> = ref(null);
const playStatus: Ref<boolean> = ref(true);
function videoPlay() {
  console.log("暂停：", video, music);
  playStatus.value = !playStatus.value;
  video.value && music.value
    ? playStatus.value
      ? (video.value.play(), music.value.play())
      : (video.value.pause(), music.value.pause())
    : "";
}
/** 开始学习-跳转至单元界面 */
function learnStart() {
  router.push({
    path: "/topic_bank",
  });
}
</script>
<style lang="scss" scoped>
$line-color: #e6e9f3; // 定义一个名为 line-color 的变量并赋值为 #333

.video {
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  object-fit: cover; /* 保持视频的宽高比，多余的部分会被裁剪 */
  position: fixed; /* 固定定位 */
  top: -10;
  left: 0;
}
.playBtn {
  width: 100px;
  height: 100px;
  cursor: pointer;
  display: flex; /* 启用Flexbox布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: fixed; /* 使用固定定位 */
  top: 50%; /* 顶部偏移量设置为50% */
  left: 50%; /* 左侧偏移量设置为50% */
  transform: translate(
    -50%,
    -50%
  ); /* 通过转换向上和向左偏移自身的50%以达到完全居中 */
  animation: playTrianFloat 3s infinite alternate; /* 鼠标悬停时添加旋转和浮动动画 */
  .circle {
    width: 90px;
    height: 90px;
    border: 5px dashed rgba(255, 255, 255, 0.5); /* 将实线改为虚线 */
    border-radius: 50%; /* 使用50%确保是圆形 */
    transition: transform 0.2s; /* 平滑过渡效果 */
    animation: playBtnCircleRotate 10s linear infinite; /* 鼠标悬停时添加旋转和浮动动画 */
  }
  .triangle {
    .top {
      position: absolute;
      top: 30px;
      left: 11px;
      width: 64px;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.5); /* 设置背景颜色并添加透明度 */
      backdrop-filter: blur(10px); /* 添加背景滤镜模糊效果 */
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      transform: rotate(-30deg); /* 旋转30度 */
    }
    .bottom {
      position: absolute;
      top: 58px;
      left: 11px;
      width: 64px;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.5); /* 设置背景颜色并添加透明度 */
      backdrop-filter: blur(10px); /* 添加背景滤镜模糊效果 */
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      transform: rotate(30deg); /* 旋转30度 */
    }
    .right {
      position: absolute;
      top: 44px;
      left: 35px;
      width: 64px;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.5); /* 设置背景颜色并添加透明度 */
      backdrop-filter: blur(10px); /* 添加背景滤镜模糊效果 */
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      transform: rotate(90deg); /* 旋转30度 */
    }
  }
}
.playBtn:hover {
  animation: none;
}
.playBtn:hover .circle {
  animation: none;
}
@keyframes playBtnCircleRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes playTrianFloat {
  0% {
    top: 50%;
  }
  50% {
    top: 49%;
  }
  100% {
    top: 50%;
  }
}
.start-area {
  .left-line {
    position: absolute;
    bottom: 30px;
    .left-top-line {
      width: 850px;
      border: 1px solid $line-color;
    }
    .left-bottom-line {
      width: 800px;
      margin-top: 50px;
      border: 1px solid $line-color;
    }
  }
  .middle-content {
    .graph {
      position: absolute;
      bottom: 140px;
      left: 900px;
      animation: floatAnimation 2s infinite alternate;
      .left-top {
        position: absolute;
        left: 18px;
        width: 15px;
        height: 85px;
        background-color: #e6e9f3;
        // border: 1px solid #000;
        transform: rotate(60deg); /* 将元素旋转45度 */
      }
      .right-top {
        position: absolute;
        left: 85px;
        width: 15px;
        height: 85px;
        background-color: #e6e9f3;
        // border: 1px solid #000;
        transform: rotate(-60deg); /* 将元素旋转45度 */
      }
      .left-bottom {
        position: absolute;
        top: 35px;
        left: 30px;
        width: 10px;
        height: 60px;
        background-color: $line-color;
        // border: 1px solid #000;
        transform: rotate(60deg); /* 将元素旋转45度 */
      }
      .right-bottom {
        position: absolute;
        top: 35px;
        left: 77px;
        width: 10px;
        height: 60px;
        background-color: $line-color;
        // border: 1px solid #000;
        transform: rotate(-60deg); /* 将元素旋转45度 */
      }
    }
    .btn {
      position: absolute;
      bottom: 5px;
      left: 850px;
      color: $line-color;
      padding: 15px 70px;
      border: 1px solid $line-color;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      background-image: linear-gradient(#e6e9f3, #e6e9f3);
      background-size: 100% 0%;
      background-repeat: no-repeat;
      background-position: top;
      transition: background-size 0.5s;
      .icon {
        font-size: 17px;
        padding-right: 5px;
      }
    }
    .btn:hover {
      background-size: 100% 100%;
      color: #000;
    }
  }
  @keyframes floatAnimation {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-10px);
    }
  }
  .right-line {
    position: absolute;
    bottom: 30px;
    right: 0px;
    .right-top-line {
      width: 850px;
      border: 1px solid $line-color;
    }
    .right-bottom-line {
      margin-left: 50px;
      width: 800px;
      margin-top: 50px;
      border: 1px solid $line-color;
    }
  }
}
</style>
