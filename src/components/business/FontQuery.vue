<template>
  <!-- 抽屉模式 -->
  <dictionary-drawer
    v-if="mode === 'drawer'"
    :visible="visible"
    :drawer-config="drawerConfig"
    :title="title"
    :placeholder="placeholder"
    :max-length="maxLength"
    @close="handleClose"
    @input="handleInput"
  />
  
  <!-- 卡片模式 -->
  <dictionary-search
    v-else-if="mode === 'card'"
    :visible="visible"
    :card-style="cardStyle"
    :title="title"
    :placeholder="placeholder"
    :max-length="maxLength"
    @close="handleClose"
    @input="handleInput"
  />
</template>

<script setup lang="ts" name="FontQuery">
import DictionaryDrawer from '@/components/common/DictionaryDrawer.vue';
import DictionarySearch from '@/components/common/DictionarySearch.vue';

interface Props {
  visible: boolean;
  mode?: 'drawer' | 'card'; // 显示模式：抽屉或卡片
  title?: string;
  placeholder?: string;
  maxLength?: number;
  drawerConfig?: Record<string, any>; // 抽屉配置
  cardStyle?: Record<string, any>; // 卡片样式
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  mode: 'drawer',
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
  cardStyle: () => ({}),
});

const emit = defineEmits<{
  close: [];
  input: [value: string];
}>();

const handleClose = () => {
  emit('close');
};

const handleInput = (value: string) => {
  emit('input', value);
};
</script>

<style lang="scss" scoped>
// 业务组件样式，如果需要可以在这里添加
</style>

