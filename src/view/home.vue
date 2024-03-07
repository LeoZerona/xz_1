<template>
  <!-- <video ref="video" class="video" autoplay loop muted @click="aaa">
    <source src="@/assets/home_video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video> -->
  <audio ref="music" autoplay loop>
    <source src="@/assets/home_music.mp3" type="audio/mp3" />
    Your browser does not support the audio element.
  </audio>
  <div class="playBtn">
    <div class="triangle">
      <div class="top"></div>
      <div class="bottom"></div>
      <div class="right"></div>
    </div>
  </div>
  <button id="playPauseBtn" class="playPauseBtn" @click="aaa">暂停/播放</button>
</template>
<script lang="ts" name="home" setup>
const video: Ref<HTMLVideoElement | null> = ref(null);
const music: Ref<HTMLAudioElement | null> = ref(null);
function aaa() {
  // video
  if (video.value && music.value) {
    if (video.value.paused) {
      video.value.play();
      music.value.play();
    } else {
      video.value.pause();
      music.value.pause();
    }
  }
}
</script>
<style lang="scss" scoped>
.video {
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  object-fit: cover; /* 保持视频的宽高比，多余的部分会被裁剪 */
  position: fixed; /* 固定定位 */
  top: -10;
  left: 0;
}
.playPauseBtn {
  position: absolute;
  top: 10px;
  left: 10px;
}
.playBtn {
  position: absolute;
  top: 50px;
  left: 10px;
  width: 200px;
  height: 200px;
  border: 2px solid red;
  padding: 50px;
  .triangle {
    position: relative;
    width: 100px;
    height: 100px;
    .top {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 80px;
      height: 20px;
      background-color: black;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      transform: rotate(-45deg); /* 旋转45度 */
    }
    .bottom {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 80px;
      height: 20px;
      background-color: red;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      transform: rotate(45deg); /* 旋转45度 */
    }
    .right {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 80px;
      height: 20px;
      background-color: blue;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      transform: rotate(-45deg); /* 旋转45度 */
    }
  }
}
</style>
