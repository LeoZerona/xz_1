<template>
  <div class="nuit">
    <div class="type">
      {{ data.type }}
    </div>
    <div class="detail">
      <div class="name">
        {{ data.name }}
      </div>
      <div class="info">
        <div class="overview">
          <el-tooltip effect="dark"  placement="right">
            <template #content>
              {{ data.text.replace(/ /g, '、').substring(0, 9) }}
              <br />
              {{ data.text.replace(/ /g, '、').substring(10, 19) }}
              <br />
              {{ data.text.replace(/ /g, '、').substring(20, 29) }}
              <br />
              {{ data.text.replace(/ /g, '、').substring(30, 39) }}
              <br />
              {{ data.text.replace(/ /g, '、').substring(40, 49) }}
            </template>
            新识：{{ data.text.replace(/ /g, "、").substring(0, 5) }}...
          </el-tooltip>
        </div>
        <div class="num">
          数量：<span>{{ data.characters.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="unit">
type dataType = {
  name: string,
  type: string,
  text: string,
  characters: string[]
}
const { data } = defineProps<{ data: { type: dataType, require: true } }>()
onMounted(() => {
})
</script>
<style lang="scss" scoped>
.nuit {
  display: flex;
  width: 270px;
  height: 60px;
  align-items: center;
  border-radius: 15px;
  background-color: #f8f8f8;
  padding: 20px;
  cursor: pointer;
  margin-top: 10px;
  transition: box-shadow 0.3s, transform 0.3s;

  .type {
    width: 50px;
    height: 50px;
    font-size: 25px;
    line-height: 50px;
    border-radius: 15px;
    font-family: 'FangZhengXiaoZhuan';
    margin-right: 20px;
    background-color: #f4f4f4;
    border: 1px solid #cfe4ee;
  }

  .detail {
    font-weight: 100;

    .name {
      margin-bottom: 10px;
    }

    .info {}
  }
}

.nuit:hover {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: translateY(5px);
}
</style>