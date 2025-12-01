<template>
  <div class="character-display" :class="size">
    <span v-if="showXz" class="xz" :style="xzStyle">
      {{ character }}
    </span>
    <span v-if="showSeparator && showXz && (showFt || showJt)" class="separator">|</span>
    <span v-if="showFt" class="ft" :style="ftStyle">
      {{ character }}
    </span>
    <span v-if="showSeparator && showFt && showJt" class="separator">|</span>
    <span v-if="showJt" class="jt" :style="jtStyle">
      {{ character }}
    </span>
  </div>
</template>

<script setup lang="ts" name="CharacterDisplay">
interface Props {
  character: string;
  showXz?: boolean; // 显示小篆
  showFt?: boolean; // 显示繁体
  showJt?: boolean; // 显示简体
  showSeparator?: boolean; // 显示分隔符
  size?: 'small' | 'medium' | 'large' | 'xlarge'; // 尺寸
  fontSize?: string; // 自定义字体大小
}

const props = withDefaults(defineProps<Props>(), {
  showXz: true,
  showFt: true,
  showJt: true,
  showSeparator: true,
  size: 'medium',
  fontSize: '',
});

const xzStyle = computed(() => ({
  fontFamily: 'FangZhengXiaoZhuan',
  fontSize: props.fontSize || '',
}));

const ftStyle = computed(() => ({
  fontFamily: 'HanYiKaiTiFan',
  fontSize: props.fontSize || '',
}));

const jtStyle = computed(() => ({
  fontSize: props.fontSize || '',
}));
</script>

<style lang="scss" scoped>
.character-display {
  display: flex;
  align-items: center;
  gap: 5px;

  .xz {
    font-family: 'FangZhengXiaoZhuan';
  }

  .ft {
    font-family: 'HanYiKaiTiFan';
  }

  .separator {
    margin: 0 5px;
    color: #ccc;
  }

  &.small {
    font-size: 20px;
  }

  &.medium {
    font-size: 30px;
  }

  &.large {
    font-size: 50px;
  }

  &.xlarge {
    font-size: 70px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .character-display {
    gap: 4px;

    .separator {
      margin: 0 4px;
    }

    &.small {
      font-size: 18px;
    }

    &.medium {
      font-size: 26px;
    }

    &.large {
      font-size: 42px;
    }

    &.xlarge {
      font-size: 55px;
    }
  }
}

@media (max-width: 480px) {
  .character-display {
    gap: 3px;

    .separator {
      margin: 0 3px;
    }

    &.small {
      font-size: 16px;
    }

    &.medium {
      font-size: 22px;
    }

    &.large {
      font-size: 36px;
    }

    &.xlarge {
      font-size: 45px;
    }
  }
}
</style>

