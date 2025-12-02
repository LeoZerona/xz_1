<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <el-button-group>
        <el-button @click="handleZoomOut" :disabled="fontSize <= minSize">
          <el-icon><ZoomOut /></el-icon>
        </el-button>
        <el-button>{{ fontSize }}px</el-button>
        <el-button @click="handleZoomIn" :disabled="fontSize >= maxSize">
          <el-icon><ZoomIn /></el-icon>
        </el-button>
      </el-button-group>
      
      <el-button-group class="preset-buttons">
        <el-button 
          v-for="preset in fontPresets" 
          :key="preset"
          :type="fontSize === preset ? 'primary' : 'default'"
          size="small"
          @click="handlePresetChange(preset)"
        >
          {{ preset }}px
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-right">
      <el-button @click="handleReset">
        <el-icon><Refresh /></el-icon>
        重置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ZoomIn, ZoomOut, Refresh } from '@element-plus/icons-vue';

interface Props {
  fontSize: number;
  minSize?: number;
  maxSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: 69,
  minSize: 30,
  maxSize: 120,
});

const emit = defineEmits<{
  'update:fontSize': [size: number];
  reset: [];
}>();

const fontPresets = [40, 50, 69, 80, 100];

const handleZoomIn = () => {
  const newSize = Math.min(props.fontSize + 5, props.maxSize);
  emit('update:fontSize', newSize);
};

const handleZoomOut = () => {
  const newSize = Math.max(props.fontSize - 5, props.minSize);
  emit('update:fontSize', newSize);
};

const handlePresetChange = (size: number) => {
  emit('update:fontSize', size);
};

const handleReset = () => {
  emit('reset');
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f5f6f7;
  border-radius: 8px;
  margin-bottom: 20px;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 15px;

    .preset-buttons {
      margin-left: 10px;
    }
  }

  .toolbar-right {
    display: flex;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 15px;
    padding: 12px;

    .toolbar-left,
    .toolbar-right {
      width: 100%;
      justify-content: center;
    }

    .preset-buttons {
      margin-left: 0;
      flex-wrap: wrap;
    }
  }
}
</style>

