<template>
  <div class="right-btn"></div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.right-btn {
  width: 100px;
  height: 100px;
  background-color: #d3e3fd;
  border-radius: 50px;
  position: relative;
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    // border: 2px solid #fff;
    // border-top: 0px;
    // border-left: 0px;
    // left: 50%;
    // margin-left: -6px;
    // top: 50%;
    // margin-top: -6px;
    // transform: rotate(-45deg); // 向左，逆天，注释也用这个写是吧

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(135deg); // 向左
    width: 10px;
    height: 10px;
    // border: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
}
</style>
