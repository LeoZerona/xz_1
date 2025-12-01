<template>
  <name-slot-drawer
    :drawer-config="drawerConfig"
    :drawer-visiable="visible"
    :before-close-fn="handleClose"
    class="dictionary-drawer"
  >
    <template #header>
      <span>{{ title }}</span>
    </template>
    <template #content>
      <el-input
        v-model="searchKey"
        :maxlength="maxLength"
        :placeholder="placeholder"
        show-word-limit
        type="text"
        class="search-input"
        @input="handleInput"
      />
      <div class="search-result">
        <character-display
          :character="searchKey"
          size="xlarge"
        />
      </div>
    </template>
  </name-slot-drawer>
</template>

<script setup lang="ts" name="DictionaryDrawer">
import CharacterDisplay from './CharacterDisplay.vue';

interface Props {
  visible: boolean;
  title?: string;
  placeholder?: string;
  maxLength?: number;
  drawerConfig?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '字典查询',
  placeholder: '请输入文字查询小篆',
  maxLength: 10,
  drawerConfig: () => ({
    size: '30%',
    direction: 'rtl',
    closeOnClickModal: true,
    closeOnPressEscape: false,
    showClose: false,
  }),
});

const emit = defineEmits<{
  close: [];
  input: [value: string];
}>();

const searchKey = ref('');

const handleClose = () => {
  searchKey.value = '';
  emit('close');
};

const handleInput = (value: string) => {
  emit('input', value);
};

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    searchKey.value = '';
  }
});
</script>

<style lang="scss" scoped>
.dictionary-drawer {
  .search-input {
    width: 100%;
    margin-bottom: 20px;
  }

  .search-result {
    margin-top: 30px;
    text-align: center;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dictionary-drawer {
    :deep(.el-drawer) {
      width: 85% !important;
    }

    .search-input {
      margin-bottom: 15px;
    }

    .search-result {
      margin-top: 20px;
    }
  }
}

@media (max-width: 480px) {
  .dictionary-drawer {
    :deep(.el-drawer) {
      width: 90% !important;
    }

    .search-input {
      margin-bottom: 12px;
    }

    .search-result {
      margin-top: 15px;
    }
  }
}
</style>

