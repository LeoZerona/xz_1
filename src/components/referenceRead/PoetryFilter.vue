<template>
  <div class="poetry-filter">
    <!-- 顶部操作栏 -->
    <div class="filter-header">
      <div class="header-left">
        <el-button
          text
          @click="toggleCollapse"
          class="collapse-btn"
        >
          <el-icon>
            <ArrowUp v-if="!isCollapsed" />
            <ArrowDown v-else />
          </el-icon>
          {{ isCollapsed ? '展开筛选' : '收起筛选' }}
        </el-button>
        <span v-if="hasActiveFilters" class="active-count">
          已选择 {{ activeFilterCount }} 项
        </span>
      </div>
      <div class="header-right">
        <el-button
          v-if="hasActiveFilters"
          type="danger"
          plain
          size="small"
          @click="handleClearFilters"
        >
          <el-icon><RefreshLeft /></el-icon>
          重置
        </el-button>
        <span class="result-count">共找到 <strong>{{ resultCount }}</strong> 首</span>
      </div>
    </div>

    <!-- 已选择的筛选条件 -->
    <div v-if="hasActiveFilters && !isCollapsed" class="active-filters">
      <div class="active-filters-label">当前筛选：</div>
      <div class="active-filters-tags">
        <el-tag
          v-for="(formType, index) in localFormTypes"
          :key="`form-${formType}`"
          closable
          size="small"
          type="primary"
          @close="removeFormType(formType)"
        >
          {{ getFormTypeLabel(formType) }}
        </el-tag>
        <el-tag
          v-for="(themeType, index) in localThemeTypes"
          :key="`theme-${themeType}`"
          closable
          size="small"
          type="success"
          @close="removeThemeType(themeType)"
        >
          {{ getThemeTypeLabel(themeType) }}
        </el-tag>
        <el-tag
          v-for="(periodType, index) in localPeriodTypes"
          :key="`period-${periodType}`"
          closable
          size="small"
          type="info"
          @close="removePeriodType(periodType)"
        >
          {{ getPeriodTypeLabel(periodType) }}
        </el-tag>
        <el-tag
          v-if="localAuthor"
          closable
          size="small"
          type="warning"
          @close="handleAuthorChange('')"
        >
          作者：{{ localAuthor }}
        </el-tag>
        <el-tag
          v-if="localKeyword"
          closable
          size="small"
          type="warning"
          @close="handleKeywordChange('')"
        >
          关键词：{{ localKeyword }}
        </el-tag>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div v-show="!isCollapsed" class="search-bar">
      <el-input
        v-model="localKeyword"
        placeholder="搜索标题、内容"
        clearable
        class="search-input"
        @input="handleKeywordChange"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-input
        v-model="localAuthor"
        placeholder="作者"
        clearable
        class="search-input"
        @input="handleAuthorChange"
      >
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 筛选标签 -->
    <div v-show="!isCollapsed" class="filter-tabs">
      <el-tabs v-model="activeTab" type="card" @tab-change="handleTabChange">
        <!-- 体裁形式 -->
        <el-tab-pane label="体裁形式" name="form">
          <div class="filter-options">
            <el-checkbox-group v-model="localFormTypes" @change="handleFormTypeChange">
              <div class="option-group">
                <div class="group-label">古体诗</div>
                <div class="option-items">
                  <div class="checkbox-list">
                    <el-checkbox
                      v-for="(type, index) in gutiTypes"
                      :key="type.value"
                      :label="type.value"
                      class="filter-checkbox"
                      :class="{ 'hidden-item': !isGutiExpanded && index >= 6 }"
                    >
                      {{ type.label }}
                    </el-checkbox>
                  </div>
                  <div 
                    v-if="gutiTypes.length > 6" 
                    class="expand-toggle"
                    @click="isGutiExpanded = !isGutiExpanded"
                  >
                    <el-icon>
                      <ArrowDown v-if="!isGutiExpanded" />
                      <ArrowUp v-else />
                    </el-icon>
                    <span>{{ isGutiExpanded ? '收起' : '展开' }}</span>
                  </div>
                </div>
              </div>
              <div class="option-group">
                <div class="group-label">近体诗</div>
                <div class="option-items">
                  <div class="checkbox-list">
                    <el-checkbox
                      v-for="(type, index) in jintiTypes"
                      :key="type.value"
                      :label="type.value"
                      class="filter-checkbox"
                      :class="{ 'hidden-item': !isJintiExpanded && index >= 6 }"
                    >
                      {{ type.label }}
                    </el-checkbox>
                  </div>
                  <div 
                    v-if="jintiTypes.length > 6" 
                    class="expand-toggle"
                    @click="isJintiExpanded = !isJintiExpanded"
                  >
                    <el-icon>
                      <ArrowDown v-if="!isJintiExpanded" />
                      <ArrowUp v-else />
                    </el-icon>
                    <span>{{ isJintiExpanded ? '收起' : '展开' }}</span>
                  </div>
                </div>
              </div>
              <div class="option-group">
                <div class="group-label">其他</div>
                <div class="option-items">
                  <div class="checkbox-list">
                    <el-checkbox
                      v-for="(type, index) in otherTypes"
                      :key="type.value"
                      :label="type.value"
                      class="filter-checkbox"
                      :class="{ 'hidden-item': !isOtherExpanded && index >= 6 }"
                    >
                      {{ type.label }}
                    </el-checkbox>
                  </div>
                  <div 
                    v-if="otherTypes.length > 6" 
                    class="expand-toggle"
                    @click="isOtherExpanded = !isOtherExpanded"
                  >
                    <el-icon>
                      <ArrowDown v-if="!isOtherExpanded" />
                      <ArrowUp v-else />
                    </el-icon>
                    <span>{{ isOtherExpanded ? '收起' : '展开' }}</span>
                  </div>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </el-tab-pane>

        <!-- 内容题材 -->
        <el-tab-pane label="内容题材" name="theme">
          <div class="filter-options">
            <el-checkbox-group v-model="localThemeTypes" @change="handleThemeTypeChange">
              <div class="checkbox-list-wrapper">
                <div class="checkbox-list">
                  <el-checkbox
                    v-for="(config, key, index) in THEME_TYPE_CONFIG"
                    :key="key"
                    :label="key"
                    class="filter-checkbox"
                    :class="{ 'hidden-item': !isThemeExpanded && index >= 6 }"
                  >
                    {{ config.icon }} {{ config.label }}
                  </el-checkbox>
                </div>
                <div 
                  v-if="Object.keys(THEME_TYPE_CONFIG).length > 6" 
                  class="expand-toggle"
                  @click="isThemeExpanded = !isThemeExpanded"
                >
                  <el-icon>
                    <ArrowDown v-if="!isThemeExpanded" />
                    <ArrowUp v-else />
                  </el-icon>
                  <span>{{ isThemeExpanded ? '收起' : '展开' }}</span>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </el-tab-pane>

        <!-- 历史时期 -->
        <el-tab-pane label="历史时期" name="period">
          <div class="filter-options">
            <el-checkbox-group v-model="localPeriodTypes" @change="handlePeriodTypeChange">
              <div class="checkbox-list-wrapper">
                <div class="checkbox-list">
                  <el-checkbox
                    v-for="(config, key, index) in PERIOD_TYPE_CONFIG"
                    :key="key"
                    :label="key"
                    class="filter-checkbox"
                    :class="{ 'hidden-item': !isPeriodExpanded && index >= 6 }"
                  >
                    {{ config.icon }} {{ config.label }}
                  </el-checkbox>
                </div>
                <div 
                  v-if="Object.keys(PERIOD_TYPE_CONFIG).length > 6" 
                  class="expand-toggle"
                  @click="isPeriodExpanded = !isPeriodExpanded"
                >
                  <el-icon>
                    <ArrowDown v-if="!isPeriodExpanded" />
                    <ArrowUp v-else />
                  </el-icon>
                  <span>{{ isPeriodExpanded ? '收起' : '展开' }}</span>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Search, User, RefreshLeft, ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import {
  FORM_TYPE_CONFIG,
  THEME_TYPE_CONFIG,
  PERIOD_TYPE_CONFIG,
  type PoetryFormType,
  type PoetryThemeType,
  type PoetryPeriodType,
} from '@/utils/poetry';

interface Props {
  formTypes?: PoetryFormType[];
  themeTypes?: PoetryThemeType[];
  periodTypes?: PoetryPeriodType[];
  author?: string;
  keyword?: string;
  resultCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  formTypes: () => [],
  themeTypes: () => [],
  periodTypes: () => [],
  author: '',
  keyword: '',
  resultCount: 0,
});

const emit = defineEmits<{
  'update:formTypes': [value: PoetryFormType[]];
  'update:themeTypes': [value: PoetryThemeType[]];
  'update:periodTypes': [value: PoetryPeriodType[]];
  'update:author': [value: string];
  'update:keyword': [value: string];
}>();

// 状态定义
const activeTab = ref<string>('form');
const isCollapsed = ref<boolean>(false);

// 展开/收起状态
const isGutiExpanded = ref<boolean>(false);
const isJintiExpanded = ref<boolean>(false);
const isOtherExpanded = ref<boolean>(false);
const isThemeExpanded = ref<boolean>(false);
const isPeriodExpanded = ref<boolean>(false);

const localFormTypes = ref<PoetryFormType[]>(props.formTypes);
const localThemeTypes = ref<PoetryThemeType[]>(props.themeTypes);
const localPeriodTypes = ref<PoetryPeriodType[]>(props.periodTypes);
const localAuthor = ref(props.author);
const localKeyword = ref(props.keyword);

// 古体诗类型
const gutiTypes = computed(() => [
  { value: 'guti-siyan', label: FORM_TYPE_CONFIG['guti-siyan'].label },
  { value: 'guti-wuyan', label: FORM_TYPE_CONFIG['guti-wuyan'].label },
  { value: 'guti-qiyan', label: FORM_TYPE_CONFIG['guti-qiyan'].label },
  { value: 'guti-zayan', label: FORM_TYPE_CONFIG['guti-zayan'].label },
]);

// 近体诗类型
const jintiTypes = computed(() => [
  { value: 'jinti-wujue', label: FORM_TYPE_CONFIG['jinti-wujue'].label },
  { value: 'jinti-qijue', label: FORM_TYPE_CONFIG['jinti-qijue'].label },
  { value: 'jinti-wulv', label: FORM_TYPE_CONFIG['jinti-wulv'].label },
  { value: 'jinti-qilv', label: FORM_TYPE_CONFIG['jinti-qilv'].label },
  { value: 'jinti-pailv', label: FORM_TYPE_CONFIG['jinti-pailv'].label },
]);

// 其他类型
const otherTypes = computed(() => [
  { value: 'ci', label: FORM_TYPE_CONFIG['ci'].label },
  { value: 'qu', label: FORM_TYPE_CONFIG['qu'].label },
]);

const hasActiveFilters = computed(() => {
  return (
    localFormTypes.value.length > 0 ||
    localThemeTypes.value.length > 0 ||
    localPeriodTypes.value.length > 0 ||
    localAuthor.value.length > 0 ||
    localKeyword.value.length > 0
  );
});

const activeFilterCount = computed(() => {
  let count = 0;
  count += localFormTypes.value.length;
  count += localThemeTypes.value.length;
  count += localPeriodTypes.value.length;
  if (localAuthor.value) count += 1;
  if (localKeyword.value) count += 1;
  return count;
});

const getFormTypeLabel = (formType: PoetryFormType) => {
  return FORM_TYPE_CONFIG[formType]?.label || formType;
};

const getThemeTypeLabel = (themeType: PoetryThemeType) => {
  return THEME_TYPE_CONFIG[themeType]?.label || themeType;
};

const getPeriodTypeLabel = (periodType: PoetryPeriodType) => {
  return PERIOD_TYPE_CONFIG[periodType]?.label || periodType;
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const removeFormType = (formType: PoetryFormType) => {
  const index = localFormTypes.value.indexOf(formType);
  if (index > -1) {
    localFormTypes.value.splice(index, 1);
    handleFormTypeChange();
  }
};

const removeThemeType = (themeType: PoetryThemeType) => {
  const index = localThemeTypes.value.indexOf(themeType);
  if (index > -1) {
    localThemeTypes.value.splice(index, 1);
    handleThemeTypeChange(localThemeTypes.value);
  }
};

const removePeriodType = (periodType: PoetryPeriodType) => {
  const index = localPeriodTypes.value.indexOf(periodType);
  if (index > -1) {
    localPeriodTypes.value.splice(index, 1);
    handlePeriodTypeChange(localPeriodTypes.value);
  }
};

const handleFormTypeChange = () => {
  emit('update:formTypes', localFormTypes.value);
};

const handleThemeTypeChange = (value: PoetryThemeType[]) => {
  emit('update:themeTypes', value);
};

const handlePeriodTypeChange = (value: PoetryPeriodType[]) => {
  emit('update:periodTypes', value);
};

const handleAuthorChange = (value: string) => {
  emit('update:author', value);
};

const handleKeywordChange = (value: string) => {
  emit('update:keyword', value);
};

const handleTabChange = () => {
  // 切换标签时不做任何操作，只是UI切换
};

const handleClearFilters = () => {
  localFormTypes.value = [];
  localThemeTypes.value = [];
  localPeriodTypes.value = [];
  localAuthor.value = '';
  localKeyword.value = '';
  emit('update:formTypes', []);
  emit('update:themeTypes', []);
  emit('update:periodTypes', []);
  emit('update:author', '');
  emit('update:keyword', '');
};

// 监听 props 变化
watch(
  () => props.formTypes,
  (newVal) => {
    localFormTypes.value = newVal;
  }
);

watch(
  () => props.themeTypes,
  (newVal) => {
    localThemeTypes.value = newVal;
  }
);

watch(
  () => props.periodTypes,
  (newVal) => {
    localPeriodTypes.value = newVal;
  }
);

watch(
  () => props.author,
  (newVal) => {
    localAuthor.value = newVal;
  }
);

watch(
  () => props.keyword,
  (newVal) => {
    localKeyword.value = newVal;
  }
);

</script>

<style lang="scss" scoped>
.poetry-filter {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;

      .collapse-btn {
        padding: 0;
        color: #606266;
        font-size: 14px;

        &:hover {
          color: #409eff;
        }
      }

      .active-count {
        font-size: 13px;
        color: #909399;
        padding: 4px 10px;
        background-color: #f5f7fa;
        border-radius: 4px;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;

      .result-count {
        font-size: 14px;
        color: #606266;

        strong {
          color: #409eff;
          font-weight: 600;
          font-size: 16px;
        }
      }
    }
  }

  .active-filters {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 15px;
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 6px;
    flex-wrap: wrap;

    .active-filters-label {
      font-size: 13px;
      color: #606266;
      font-weight: 500;
      white-space: nowrap;
      line-height: 24px;
    }

    .active-filters-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      flex: 1;
    }
  }

  .search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;

    .search-input {
      flex: 1;
      max-width: 300px;
    }
  }

  .filter-tabs {
    margin-bottom: 15px;

    :deep(.el-tabs__header) {
      margin: 0 0 15px 0;
    }

    :deep(.el-tabs__item) {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
    }

    .filter-options {
      padding: 10px 0;

      .option-group {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        .group-label {
          font-size: 14px;
          font-weight: 600;
          color: #606266;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ebeef5;
        }

        .option-items {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: flex-start;

          .checkbox-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            flex: 1;
          }

          .expand-toggle {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            color: #409eff;
            cursor: pointer;
            font-size: 13px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            background-color: #fff;
            transition: all 0.3s;
            margin-left: auto;
            align-self: flex-end;

            &:hover {
              border-color: #409eff;
              background-color: #ecf5ff;
            }

            .el-icon {
              font-size: 14px;
            }
          }
        }
      }

      .checkbox-list-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: flex-start;
        position: relative;

        .checkbox-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          flex: 1;
        }

        .expand-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          color: #409eff;
          cursor: pointer;
          font-size: 13px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          background-color: #fff;
          transition: all 0.3s;
          white-space: nowrap;

          &:hover {
            border-color: #409eff;
            background-color: #ecf5ff;
          }

          .el-icon {
            font-size: 14px;
          }
        }
      }

      .filter-checkbox {
        margin: 0;
        padding: 6px 14px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        background-color: #f5f7fa;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;
          background-color: #ecf5ff;
        }

        :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
          color: #409eff;
        }

        :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
          background-color: #409eff;
          border-color: #409eff;
        }

        &.hidden-item {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .poetry-filter {
    padding: 15px;

    .filter-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      .header-left,
      .header-right {
        width: 100%;
        justify-content: space-between;
      }
    }

    .active-filters {
      flex-direction: column;
      align-items: flex-start;

      .active-filters-label {
        margin-bottom: 8px;
      }
    }

    .search-bar {
      flex-direction: column;
      gap: 10px;

      .search-input {
        max-width: 100%;
      }
    }

    .filter-tabs {
      :deep(.el-tabs__item) {
        padding: 0 12px;
        font-size: 14px;
      }

      .filter-options {
        .option-group {
          margin-bottom: 15px;

          .option-items {
            gap: 8px;
          }
        }

        .filter-checkbox {
          padding: 4px 10px;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
