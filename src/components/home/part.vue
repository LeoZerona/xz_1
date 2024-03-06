<template>
  <div class="part">
    <div class="title">{{ data.label }}</div>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in processedData" :key="index" :span="8">
        <unit :key="index" :data="item" @click="unitSelect(item)"></unit>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="part">
import unit from '@/components/home/unit.vue'
import { unitInfoHomeData } from '@/store/home'
import { storeToRefs } from 'pinia';
type stageType = {
  name: string,
  text: string
}

type dataType = {
  label: string,
  icon: string,
  type: string,
  stage: stageType[]
}
// const { data } = defineProps<{ data: { type: dataType, required: true } }>()
const { data } = defineProps({
  data:{
    type: Object as PropType<dataType>,
      require: true
  }
})
const unitInfoHome = unitInfoHomeData()
const processedData = ref([])

onMounted(async () => {
  const processedStageInfo = data.stage.map((item, index) => {
    item.name = `${data.label}（${index + 1}/${data.stage.length}）`
    item.type = data.type
    item.characters = item.text.split(' ')
    return item
  })

  // 使用nextTick等待下一个DOM更新周期
  await new Promise((resolve: any) => {
    nextTick(resolve)
  })

  processedData.value = processedStageInfo
})
function unitSelect(data: any) {
  unitInfoHome.setunitInfo(data)  // 设置用户选择的单元信息
  unitInfoHome.setUnitInfoDialogFlog(true)  // 显示单元信息弹窗
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
</style>