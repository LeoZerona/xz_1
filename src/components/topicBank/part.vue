<template>
  <div class="part">
    <div class="title">{{ data.label }}</div>
    <el-row :gutter="20">
      <el-col 
        v-for="(item, index) in processedData" 
        :key="index" 
        :xs="24" 
        :sm="12" 
        :md="8"
      >
        <unit-card :data="item" @click="(data) => unitSelect(data)" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Part">
import { unitInfoHomeData } from '@/store/home';
import UnitCard from './UnitCard.vue';

type StageType = {
  name: string;
  text: string;
  type?: string;
  characters?: string[];
};

type DataType = {
  label: string;
  icon: string;
  type: string;
  stage: StageType[];
};

const props = defineProps<{
  data: DataType;
}>();

const unitInfoHome = unitInfoHomeData();
const processedData = ref<StageType[]>([]);

onMounted(async () => {
  const processedStageInfo = props.data.stage.map((item, index) => {
    return {
      ...item,
      name: `${props.data.label}（${index + 1}/${props.data.stage.length}）`,
      type: props.data.type,
      characters: item.text.split(' ').filter(Boolean),
    };
  });

  await nextTick();
  processedData.value = processedStageInfo;
});

function unitSelect(data: StageType) {
  unitInfoHome.setunitInfo(data);
  unitInfoHome.setUnitInfoDialogFlog(true);
}
</script>

<style lang="scss" scoped>
.part {
  padding: 10px;
  background-color: #fff;

  .title {
    position: relative;
    font-size: 25px;
    height: 35px;
    margin-left: 0px;
    margin-bottom: 10px;
  }

  .title::after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    top: 30px;
    left: 0;
    background-color: #EBEEF5;
  }

  .unit-list {
    display: flex;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .part {
    padding: 8px;

    .title {
      font-size: 20px;
      height: 30px;
      margin-bottom: 8px;
    }

    .title::after {
      top: 28px;
    }

    :deep(.el-row) {
      margin: 0 !important;
    }

    :deep(.el-col) {
      padding: 0 5px !important;
      margin-bottom: 8px;
    }
  }
}

@media (max-width: 480px) {
  .part {
    padding: 5px;

    .title {
      font-size: 18px;
      height: 28px;
      margin-bottom: 6px;
    }

    .title::after {
      top: 26px;
    }

    :deep(.el-col) {
      padding: 0 3px !important;
      margin-bottom: 6px;
    }
  }
}
</style>