<template>
  <el-card
    :class="['dictionary-search', { 'is-visible': visible }]"
    :style="cardStyle"
  >
    <div class="header">
      <div class="title">{{ title }}</div>
      <el-icon class="icon" @click="handleClose"><Close /></el-icon>
    </div>
    <el-input
      v-model="searchKey"
      :placeholder="placeholder"
      clearable
      type="text"
      :maxlength="maxLength"
      show-word-limit
      class="input-box"
      @input="handleInput"
    />
    <div class="result">
      <div class="result-item">
        <span class="label">繁：</span>
        <span class="ft">{{ searchKey }}</span>
      </div>
      <div class="result-item">
        <span class="label">篆：</span>
        <span class="xz">{{ searchKey }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="DictionarySearch">
interface Props {
  visible?: boolean;
  title?: string;
  placeholder?: string;
  maxLength?: number;
  position?: 'left' | 'right' | 'center';
  cardStyle?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '字典查询',
  placeholder: '请输入汉字进行查询',
  maxLength: 4,
  position: 'right',
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
.dictionary-search {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  min-height: 300px;
  transition: all 0.5s ease;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title {
      font-size: 18px;
      font-weight: 600;
    }

    .icon {
      cursor: pointer;
      font-size: 20px;
      color: #909399;

      &:hover {
        color: #409eff;
      }
    }
  }

  .input-box {
    width: 100%;
  }

  .result {
    margin-top: 30px;

    .result-item {
      margin-bottom: 20px;

      .label {
        font-size: 16px;
        color: #606266;
        margin-right: 10px;
      }

      .ft,
      .xz {
        font-size: 70px;
        font-weight: 700;
      }

      .ft {
        font-family: 'HanYiKaiTiFan';
      }

      .xz {
        font-family: 'FangZhengXiaoZhuan';
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dictionary-search {
    width: 85%;
    max-width: 400px;
    min-height: 250px;
    padding: 15px;

    .header {
      margin-bottom: 15px;

      .title {
        font-size: 16px;
      }

      .icon {
        font-size: 18px;
      }
    }

    .result {
      margin-top: 20px;

      .result-item {
        margin-bottom: 15px;

        .label {
          font-size: 14px;
        }

        .ft,
        .xz {
          font-size: 50px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .dictionary-search {
    width: 90%;
    min-height: 200px;
    padding: 12px;

    .header {
      margin-bottom: 12px;

      .title {
        font-size: 14px;
      }

      .icon {
        font-size: 16px;
      }
    }

    .result {
      margin-top: 15px;

      .result-item {
        margin-bottom: 12px;

        .label {
          font-size: 12px;
        }

        .ft,
        .xz {
          font-size: 40px;
        }
      }
    }
  }
}
</style>

