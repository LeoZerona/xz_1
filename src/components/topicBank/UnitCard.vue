<template>
  <div class="unit-card" @click="handleClick">
    <div class="type-badge">
      {{ data.type }}
    </div>
    <div class="detail">
      <div class="name">{{ data.name }}</div>
      <div class="info">
        <div class="overview">
          <el-tooltip effect="dark" placement="right">
            <template #content>
              <div class="tooltip-content">
                {{ displayText }}
              </div>
            </template>
            <span>新识：{{ previewText }}...</span>
          </el-tooltip>
        </div>
        <div class="num">
          数量：<span class="count">{{ data.characters.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="UnitCard">
interface UnitDataType {
  name: string;
  type: string;
  text: string;
  characters: string[];
}

const props = defineProps<{
  data: UnitDataType;
}>();

const emit = defineEmits<{
  click: [data: UnitDataType];
}>();

const displayText = computed(() => {
  return props.data.text.replace(/ /g, '、');
});

const previewText = computed(() => {
  return displayText.value.substring(0, 5);
});

const handleClick = () => {
  emit('click', props.data);
};
</script>

<style lang="scss" scoped>
.unit-card {
  display: flex;
  width: 270px;
  min-height: 60px;
  align-items: center;
  border-radius: 15px;
  background-color: #f8f8f8;
  padding: 20px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s;

  .type-badge {
    width: 50px;
    height: 50px;
    font-size: 25px;
    line-height: 50px;
    text-align: center;
    border-radius: 15px;
    font-family: 'FangZhengXiaoZhuan';
    margin-right: 20px;
    background-color: #f4f4f4;
    border: 1px solid #cfe4ee;
    flex-shrink: 0;
  }

  .detail {
    flex: 1;
    font-weight: 100;

    .name {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: 600;
    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #606266;

      .overview {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .num {
        margin-left: 10px;

        .count {
          color: #409eff;
          font-weight: 600;
        }
      }
    }
  }

  &:hover {
    background-color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.tooltip-content {
  max-width: 300px;
  word-break: break-all;
  line-height: 1.6;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .unit-card {
    width: 100%;
    max-width: 100%;
    padding: 15px;
    margin-top: 8px;

    .type-badge {
      width: 45px;
      height: 45px;
      font-size: 22px;
      line-height: 45px;
      margin-right: 15px;
    }

    .detail {
      .name {
        font-size: 15px;
        margin-bottom: 8px;
      }

      .info {
        font-size: 13px;
      }
    }
  }
}

@media (max-width: 480px) {
  .unit-card {
    padding: 12px;
    margin-top: 6px;

    .type-badge {
      width: 40px;
      height: 40px;
      font-size: 20px;
      line-height: 40px;
      margin-right: 12px;
    }

    .detail {
      .name {
        font-size: 14px;
        margin-bottom: 6px;
      }

      .info {
        font-size: 12px;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;

        .num {
          margin-left: 0;
        }
      }
    }
  }
}
</style>

