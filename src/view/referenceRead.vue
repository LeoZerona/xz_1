<template>
  <navigation></navigation>
  <div>对照阅读</div>
  <ul class="bh">
    <li>我</li>
    <li>是</li>
    <li>帅</li>
    <li>比</li>
    <li>比</li>
    <li>比</li>
    <li>我</li>
    <li>是</li>
    <li>帅</li>
    <li>比</li>
    <li>比</li>
    <li>比</li>
    <li>我</li>
    <li>是</li>
    <li>帅</li>
    <li>比</li>
    <li>比</li>
    <li>比</li>
  </ul>
</template>
<script setup lang="ts" name="compareRead">
</script>
<style lang="scss" scoped>
.bh {
  margin-top: 10px;

  li {
    /* ===== 基础格子 ===== */
    list-style: none;
    float: left;
    width: 69px;
    height: 69px;
    margin: 0 0 5px 10px;
    border: 1px dashed #aaa;
    position: relative;          /* 给十字线当定位包含块 */

    /* 文字绝对正中 + 占满 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;             /* 69 px 格子 → 60 px 字高几乎顶格 */
    line-height: 1;              /* 去掉行高多余空白 */
    color: #333;
    font-family: "kt", KaiTi, serif;

    /* ===== 虚线十字（沉到最底下） ===== */
    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;               /* 关键：沉到文字下面 */
    }

    /* 横向虚线 */
    &::before {
      background:
        repeating-linear-gradient(
          to right,
          #aaa 0 3px,
          transparent 3px 6px
        ) 0 50% / 100% 1px no-repeat;
    }

    /* 纵向虚线 */
    &::after {
      background:
        repeating-linear-gradient(
          to bottom,
          #aaa 0 3px,
          transparent 3px 6px
        ) 50% 0 / 1px 100% no-repeat;
    }
  }
}
</style>
