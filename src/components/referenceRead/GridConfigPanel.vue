<template>
  <div class="grid-config-panel">
    <div class="config-section">
      <div class="config-label">布局模式：</div>
      <el-radio-group v-model="localLayoutMode" @change="handleLayoutModeChange">
        <el-radio label="vertical">上下阅读</el-radio>
        <el-radio label="horizontal">左右阅读</el-radio>
      </el-radio-group>
    </div>
    
    <div class="config-section">
      <div class="config-label">稿纸样式：</div>
      <el-radio-group v-model="localGridType" @change="handleGridTypeChange">
        <el-radio label="tian">田字格</el-radio>
        <el-radio label="mi">米字格</el-radio>
        <el-radio label="none">无格</el-radio>
      </el-radio-group>
    </div>
    
    <div class="config-section">
      <div class="config-label">显示选项：</div>
      <el-checkbox-group v-model="localShowOptions" @change="handleOptionsChange">
        <el-checkbox label="pinyin">拼音</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  layoutMode?: 'vertical' | 'horizontal';
  gridType: 'tian' | 'mi' | 'none';
  showPinyin: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  layoutMode: 'vertical',
});

const emit = defineEmits<{
  'update:layoutMode': [mode: 'vertical' | 'horizontal'];
  'update:gridType': [type: 'tian' | 'mi' | 'none'];
  'update:showPinyin': [show: boolean];
}>();

const localLayoutMode = ref(props.layoutMode);
const localGridType = ref(props.gridType);
const localShowOptions = ref<string[]>(props.showPinyin ? ['pinyin'] : []);

const handleLayoutModeChange = (value: 'vertical' | 'horizontal') => {
  localLayoutMode.value = value;
  emit('update:layoutMode', value);
};

const handleGridTypeChange = (value: 'tian' | 'mi' | 'none') => {
  localGridType.value = value;
  emit('update:gridType', value);
};

const handleOptionsChange = (values: string[]) => {
  localShowOptions.value = values;
  emit('update:showPinyin', values.includes('pinyin'));
};

watch(() => props.layoutMode, (newVal) => {
  localLayoutMode.value = newVal;
});

watch(() => props.gridType, (newVal) => {
  localGridType.value = newVal;
});

watch(() => props.showPinyin, (newVal) => {
  localShowOptions.value = newVal ? ['pinyin'] : [];
});
</script>

<style lang="scss" scoped>
.grid-config-panel {
  padding: 15px;
  background-color: #f5f6f7;
  border-radius: 8px;
  margin-bottom: 20px;

  .config-section {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    .config-label {
      min-width: 80px;
      font-weight: 600;
      color: #303133;
      margin-right: 15px;
    }

    :deep(.el-radio-group),
    :deep(.el-checkbox-group) {
      display: flex;
      gap: 15px;
    }
  }
}

@media (max-width: 768px) {
  .grid-config-panel {
    padding: 12px;
    margin-bottom: 15px;

    .config-section {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 12px;

      .config-label {
        min-width: auto;
        margin-bottom: 8px;
        margin-right: 0;
      }

      :deep(.el-radio-group),
      :deep(.el-checkbox-group) {
        flex-direction: column;
        gap: 10px;
      }
    }
  }
}
</style>

