<template>
  <div
    class="paper-grid"
    :class="[gridType, { 'with-pinyin': showPinyin, 'is-lower': isLower }]"
    :style="gridStyle"
  >
    <!-- 拼音区域（上方）- 始终显示，即使没有拼音 -->
    <div v-if="showPinyin" class="pinyin-section">
      <div class="pinyin-content" v-if="pinyin">{{ pinyin }}</div>
    </div>
    <!-- 汉字区域（下方） -->
    <div class="character-section">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  gridType?: "tian" | "mi" | "none"; // 田字格、米字格、无格
  showPinyin?: boolean; // 是否显示拼音
  pinyin?: string; // 拼音内容
  cellSize?: number; // 格子大小（汉字区域的高度）
  isLower?: boolean; // 是否为下层格子（字体B）
}

const props = withDefaults(defineProps<Props>(), {
  gridType: "tian",
  showPinyin: false,
  pinyin: "",
  cellSize: 69,
  isLower: false,
});

const gridStyle = computed(() => {
  const baseHeight = props.cellSize;
  const pinyinHeight = props.showPinyin ? Math.floor(baseHeight * 0.25) : 0; // 拼音区域占25%
  const totalHeight = baseHeight + pinyinHeight;

  return {
    width: `${props.cellSize}px`,
    height: `${totalHeight}px`,
  };
});
</script>

<style lang="scss" scoped>
.paper-grid {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid #d3d3d3; // 外边框
  margin: -0.5px; // 解决相邻格子边框重叠问题

  /* 拼音区域 - 始终显示，即使没有拼音 */
  .pinyin-section {
    width: 100%;
    height: 25%; // 拼音区域高度
    border-bottom: 1px solid #d3d3d3;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    position: relative;
    z-index: 0; // 确保整个区域在底层

    // 拼音区域内部两条水平虚线 - 横线完整连续，在文字下方
    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      height: 1.5px; // 加粗虚线
      background: repeating-linear-gradient(
        to right,
        #d3d3d3 0 3px,
        transparent 3px 5px
      );
      z-index: -1; // 横线在底层，确保文字在上方
    }

    // 上横线
    &::before {
      top: 33%;
    }

    // 下横线
    &::after {
      top: 67%;
    }

    .pinyin-content {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      z-index: 10; // 文字在上层，确保显示在横线上方
      position: relative;
      background-color: transparent; // 透明背景，让横线可以完整显示
      // 使用text-shadow让文字更清晰，不被横线影响
      text-shadow: 0 0 1px rgba(255, 255, 255, 0.8);
    }
  }

  /* 汉字区域 */
  .character-section {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 0; // 确保整个区域在底层

    // 确保文字在虚线上方，横线完整连续
    > * {
      position: relative;
      z-index: 10; // 文字在上层，确保显示在横线上方
      // 使用text-shadow让文字更清晰，不被横线影响
      text-shadow: 0 0 1px rgba(255, 255, 255, 0.8);
    }
  }

  /* 田字格样式 */
  &.tian {
    .character-section {
      &::before,
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: -1; // 横线在底层，确保文字在上方
      }

      // 水平虚线 - 加粗
      &::before {
        background: repeating-linear-gradient(
            to right,
            #d3d3d3 0 3px,
            transparent 3px 5px
          )
          0 50% / 100% 1.5px no-repeat;
      }

      // 垂直虚线 - 加粗
      &::after {
        background: repeating-linear-gradient(
            to bottom,
            #d3d3d3 0 3px,
            transparent 3px 5px
          )
          50% 0 / 1.5px 100% no-repeat;
      }
    }
  }

  /* 米字格样式 - 田字格 + 两条中心对角虚线 */
  &.mi {
    .character-section {
      position: relative;

      &::before,
      &::after {
        content: "";
        position: absolute;
        pointer-events: none;
        z-index: -1; // 横线和对角线在底层，确保文字在上方
      }

      // 水平虚线（中心横线）和垂直虚线（中心竖线）- 加粗
      &::before {
        inset: 0;
        background: repeating-linear-gradient(
              to right,
              #d3d3d3 0 3px,
              transparent 3px 5px
            )
            0 50% / 100% 1.5px no-repeat,
          repeating-linear-gradient(
              to bottom,
              #d3d3d3 0 3px,
              transparent 3px 5px
            )
            50% 0 / 1.5px 100% no-repeat;
      }

      // 两条中心对角虚线 - 使用SVG创建单条对角线，加粗
      &::after {
        inset: 0;
        background-image: 
          // 从左上到右下的对角线（虚线）
          url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23d3d3d3' stroke-width='1' stroke-dasharray='3,3'/%3E%3Cline x1='100' y1='0' x2='0' y2='100' stroke='%23d3d3d3' stroke-width='1' stroke-dasharray='3,3'/%3E%3C/svg%3E");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }

  /* 无格样式 - 左右无间隙，上下边框合并 */
  &.none {
    border: none; // 无外边框
    margin: 0; // 移除负边距，让格子紧密排列
    border-left: none; // 无左边框
    border-right: none; // 无右边框

    .pinyin-section {
      border-bottom: 1px solid #d3d3d3;
      background-color: #fff;

      // 拼音区域保持原有的两条横线样式
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 1.5px;
        background: repeating-linear-gradient(
          to right,
          #d3d3d3 0 3px,
          transparent 3px 5px
        );
        z-index: -1;
      }

      &::before {
        top: 33%;
      }

      &::after {
        top: 67%;
      }
    }

    .character-section {
      // 顶部边框：用于分隔不同行的格子（上层格子有，下层格子无）
      border-top: 1px solid #d3d3d3;
      // 底部边框：用于与下层格子（字体B）合并成一条线
      border-bottom: 1px solid #d3d3d3;
      border-left: none; // 无左边框
      border-right: none; // 无右边框

      // 移除所有格子线条
      &::before,
      &::after {
        display: none;
      }
    }

    // 下层格子（字体B）：移除顶部边框，让上层格子的底部边框与之合并成一条线
    &.is-lower .character-section {
      border-top: none; // 移除顶部边框，与上层格子的底部边框合并
      margin-top: -1px; // 负边距让边框重叠，合并成一条线
    }
  }

  /* 带拼音时的样式调整 */
  &.with-pinyin {
    .character-section {
      // 确保汉字内容在田字格中心
      > * {
        position: relative;
        z-index: 1;
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .paper-grid {
    .pinyin-section {
      .pinyin-content {
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 480px) {
  .paper-grid {
    .pinyin-section {
      .pinyin-content {
        font-size: 11px;
      }
    }
  }
}
</style>
