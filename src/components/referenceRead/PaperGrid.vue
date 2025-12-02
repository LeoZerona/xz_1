<template>
  <div 
    class="paper-grid" 
    :class="[gridType, { 'with-pinyin': showPinyin }]"
    :style="gridStyle"
  >
    <!-- 拼音区域（上方）- 始终显示，即使没有拼音 -->
    <div 
      v-if="showPinyin" 
      class="pinyin-section"
    >
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
  gridType?: 'tian' | 'mi' | 'none'; // 田字格、米字格、无格
  showPinyin?: boolean; // 是否显示拼音
  pinyin?: string; // 拼音内容
  cellSize?: number; // 格子大小（汉字区域的高度）
}

const props = withDefaults(defineProps<Props>(), {
  gridType: 'tian',
  showPinyin: false,
  pinyin: '',
  cellSize: 69,
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
    
    // 拼音区域内部两条水平虚线 - 虚线在文字下方，不压住文字
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 1.5px; // 加粗虚线
      background: repeating-linear-gradient(
        to right, #d3d3d3 0 3px, transparent 3px 5px
      );
      z-index: 0; // 虚线在底层
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
      z-index: 2; // 文字在上层，确保不被虚线压住
      position: relative;
      background-color: #fff; // 添加背景色，让文字更清晰
      padding: 0 3px;
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
    
    // 确保文字在虚线上方，不被压住
    > * {
      position: relative;
      z-index: 1;
    }
  }

  /* 田字格样式 */
  &.tian {
    .character-section {
      &::before,
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
      }
      
      // 水平虚线 - 加粗
      &::before {
        background: repeating-linear-gradient(
          to right, #d3d3d3 0 3px, transparent 3px 5px
        ) 0 50% / 100% 1.5px no-repeat;
      }
      
      // 垂直虚线 - 加粗
      &::after {
        background: repeating-linear-gradient(
          to bottom, #d3d3d3 0 3px, transparent 3px 5px
        ) 50% 0 / 1.5px 100% no-repeat;
      }
    }
  }

  /* 米字格样式 - 田字格 + 两条中心对角虚线 */
  &.mi {
    .character-section {
      position: relative;
      
      &::before,
      &::after {
        content: '';
        position: absolute;
        pointer-events: none;
        z-index: 0;
      }
      
      // 水平虚线（中心横线）和垂直虚线（中心竖线）- 加粗
      &::before {
        inset: 0;
        background: 
          repeating-linear-gradient(
            to right, #d3d3d3 0 3px, transparent 3px 5px
          ) 0 50% / 100% 1.5px no-repeat,
          repeating-linear-gradient(
            to bottom, #d3d3d3 0 3px, transparent 3px 5px
          ) 50% 0 / 1.5px 100% no-repeat;
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

  /* 无格样式 - 横线格式（类似横线纸） */
  &.none {
    border: 1px solid #dc143c; // 红色边框
    
    .pinyin-section {
      border-bottom: 1px solid #dc143c;
      background-color: #fff;
      
      // 拼音区域也使用红色虚线
      &::before,
      &::after {
        background: repeating-linear-gradient(
          to right, #dc143c 0 2px, transparent 2px 4px
        );
      }
    }
    
    .character-section {
      // 无格样式：只有横线，没有竖线和格子
      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 0;
        // 多条横线
        background-image: repeating-linear-gradient(
          to bottom,
          transparent 0,
          transparent calc(12.5% - 1px),
          #dc143c calc(12.5% - 1px),
          #dc143c 12.5%,
          transparent 12.5%,
          transparent calc(25% - 1px),
          #dc143c calc(25% - 1px),
          #dc143c 25%,
          transparent 25%,
          transparent calc(37.5% - 1px),
          #dc143c calc(37.5% - 1px),
          #dc143c 37.5%,
          transparent 37.5%,
          transparent calc(50% - 1px),
          #dc143c calc(50% - 1px),
          #dc143c 50%,
          transparent 50%,
          transparent calc(62.5% - 1px),
          #dc143c calc(62.5% - 1px),
          #dc143c 62.5%,
          transparent 62.5%,
          transparent calc(75% - 1px),
          #dc143c calc(75% - 1px),
          #dc143c 75%,
          transparent 75%,
          transparent calc(87.5% - 1px),
          #dc143c calc(87.5% - 1px),
          #dc143c 87.5%,
          transparent 87.5%
        );
      }
      
      &::after {
        display: none; // 无格样式不需要竖线
      }
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

