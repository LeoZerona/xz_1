<template>
  <navigation></navigation>
  <div class="poetry-container">
    <div class="content">
      <h1 class="title">古诗文学习</h1>
      <p class="description">在这里可以学习古诗文的小篆写法</p>
      
      <!-- 古诗文筛选器 -->
      <poetry-filter
        v-model:form-types="filterFormTypes"
        v-model:theme-types="filterThemeTypes"
        v-model:period-types="filterPeriodTypes"
        v-model:author="filterAuthor"
        v-model:keyword="filterKeyword"
        :result-count="filteredPoetryList.length"
      />

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 古诗文列表 -->
      <div v-else class="poetry-list">
        <div
          v-for="poem in paginatedPoetryList"
          :key="poem.id"
          class="poetry-card"
          @click="selectPoem(poem)"
        >
          <div class="poetry-header">
            <h3 class="poetry-title">{{ poem.title }}</h3>
            <div class="poetry-meta">
              <span class="poetry-author">{{ poem.author }}</span>
              <span v-if="poem.dynasty" class="poetry-dynasty">{{ poem.dynasty }}</span>
            </div>
          </div>
          <div class="poetry-content">
            <div class="poetry-text">{{ poem.content }}</div>
          </div>
          <div class="poetry-footer">
            <el-tag
              v-for="formType in poem.formType"
              :key="formType"
              size="small"
              type="primary"
              class="form-tag"
            >
              {{ getFormTypeLabel(formType) }}
            </el-tag>
            <el-tag
              v-for="themeType in poem.themeType"
              :key="themeType"
              size="small"
              type="success"
              class="theme-tag"
            >
              {{ getThemeTypeLabel(themeType) }}
            </el-tag>
            <el-tag
              v-if="poem.periodType"
              size="small"
              type="info"
              class="period-tag"
            >
              {{ getPeriodTypeLabel(poem.periodType) }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && paginatedPoetryList.length === 0"
        description="暂无匹配的古诗文"
      />

      <!-- 分页组件 -->
      <div v-if="!loading && filteredPoetryList.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36, 48]"
          :total="filteredPoetryList.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 古诗文详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedPoem?.title"
      width="80%"
      class="poetry-dialog"
    >
      <div v-if="selectedPoem" class="poetry-detail">
        <div class="detail-header">
          <div class="detail-meta">
            <span class="author">作者：{{ selectedPoem.author }}</span>
            <span v-if="selectedPoem.dynasty" class="dynasty">朝代：{{ selectedPoem.dynasty }}</span>
          </div>
        </div>
        <div class="detail-content">
          <text-grid
            :text="selectedPoem.content"
            :cell-size="cellSize"
            :gap="gap"
            :grid-type="gridType"
            :show-pinyin="showPinyin"
            :pinyin-map="pinyinMap"
          />
        </div>
        <div class="detail-footer">
          <div class="detail-tags">
            <div class="tag-group">
              <span class="tag-label">体裁：</span>
              <el-tag
                v-for="formType in selectedPoem.formType"
                :key="formType"
                size="small"
                type="primary"
              >
                {{ getFormTypeLabel(formType) }}
              </el-tag>
            </div>
            <div v-if="selectedPoem.themeType && selectedPoem.themeType.length > 0" class="tag-group">
              <span class="tag-label">题材：</span>
              <el-tag
                v-for="themeType in selectedPoem.themeType"
                :key="themeType"
                size="small"
                type="success"
              >
                {{ getThemeTypeLabel(themeType) }}
              </el-tag>
            </div>
            <div v-if="selectedPoem.periodType" class="tag-group">
              <span class="tag-label">时期：</span>
              <el-tag size="small" type="info">
                {{ getPeriodTypeLabel(selectedPoem.periodType) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <grid-config-panel
            v-model:grid-type="gridType"
            v-model:show-pinyin="showPinyin"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Poetry">
import { ref, computed, watch, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import PoetryFilter from '@/components/referenceRead/PoetryFilter.vue';
import TextGrid from '@/components/referenceRead/TextGrid.vue';
import GridConfigPanel from '@/components/referenceRead/GridConfigPanel.vue';
import {
  POETRY_DATA,
  filterPoetry,
  FORM_TYPE_CONFIG,
  THEME_TYPE_CONFIG,
  PERIOD_TYPE_CONFIG,
  type Poetry,
  type PoetryFormType,
  type PoetryThemeType,
  type PoetryPeriodType,
} from '@/utils/poetry';
import { getPinyinMap } from '@/utils/pinyin';
import { searchPoetry } from '@/utils/poetryApi';

/* ===== 筛选状态 ===== */
const filterFormTypes = ref<PoetryFormType[]>([]);
const filterThemeTypes = ref<PoetryThemeType[]>([]);
const filterPeriodTypes = ref<PoetryPeriodType[]>([]);
const filterAuthor = ref('');
const filterKeyword = ref('');

/* ===== 分页状态 ===== */
const currentPage = ref(1);
const pageSize = ref(12);

/* ===== 数据状态 ===== */
const loading = ref(false);
const apiPoetryList = ref<Poetry[]>([]);
const useApiData = ref(false); // 是否使用API数据

/* ===== 显示状态 ===== */
const dialogVisible = ref(false);
const selectedPoem = ref<Poetry | null>(null);
const cellSize = ref(69);
const gap = ref(10);
const gridType = ref<'tian' | 'mi' | 'none'>('tian');
const showPinyin = ref(false);
const pinyinMap = ref<Record<number, string>>({});

/* ===== 合并数据源 ===== */
const allPoetryData = computed(() => {
  return useApiData.value ? apiPoetryList.value : POETRY_DATA;
});

/* ===== 筛选后的古诗文列表 ===== */
const filteredPoetryList = computed(() => {
  return filterPoetry(allPoetryData.value, {
    formType: filterFormTypes.value.length > 0 ? filterFormTypes.value : undefined,
    themeType: filterThemeTypes.value.length > 0 ? filterThemeTypes.value : undefined,
    periodType: filterPeriodTypes.value.length > 0 ? filterPeriodTypes.value : undefined,
    author: filterAuthor.value || undefined,
    keyword: filterKeyword.value || undefined,
  });
});

/* ===== 分页后的列表 ===== */
const paginatedPoetryList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredPoetryList.value.slice(start, end);
});

/* ===== 从API加载数据 ===== */
const loadPoetryFromAPI = async () => {
  loading.value = true;
  try {
    console.log('开始从API加载古诗数据...', {
      author: filterAuthor.value,
      keyword: filterKeyword.value,
      periodTypes: filterPeriodTypes.value,
    });
    
    const result = await searchPoetry({
      page: 1,
      pageSize: 100, // 加载更多数据
      author: filterAuthor.value || undefined,
      dynasty: filterPeriodTypes.value.length > 0 
        ? PERIOD_TYPE_CONFIG[filterPeriodTypes.value[0]]?.label 
        : undefined,
      keyword: filterKeyword.value || undefined,
    });
    
    console.log('API返回结果:', result);

    if (result.list.length > 0) {
      // 转换API数据为Poetry格式
      apiPoetryList.value = result.list.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        dynasty: item.dynasty,
        content: item.content,
        formType: [] as PoetryFormType[], // API可能不提供体裁信息
        themeType: [] as PoetryThemeType[],
        periodType: mapDynastyToPeriod(item.dynasty),
      }));
      useApiData.value = true;
    } else {
      // 如果API没有数据，使用本地数据
      useApiData.value = false;
    }
  } catch (error) {
    console.error('加载API数据失败，使用本地数据:', error);
    useApiData.value = false;
  } finally {
    loading.value = false;
  }
};

/* ===== 映射朝代到历史时期 ===== */
const mapDynastyToPeriod = (dynasty: string): PoetryPeriodType | undefined => {
  const dynastyMap: Record<string, PoetryPeriodType> = {
    '先秦': 'xianqin',
    '汉': 'hanwei',
    '魏': 'hanwei',
    '晋': 'hanwei',
    '南北朝': 'hanwei',
    '唐': 'tang',
    '宋': 'song',
    '元': 'yuan',
    '明': 'mingqing',
    '清': 'mingqing',
  };
  return dynastyMap[dynasty] || undefined;
};

/* ===== 分页处理 ===== */
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置到第一页
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ===== 监听筛选条件变化，重新加载数据 ===== */
watch(
  [filterAuthor, filterKeyword, filterPeriodTypes],
  () => {
    // 如果有筛选条件，尝试从API加载
    if (filterAuthor.value || filterKeyword.value || filterPeriodTypes.value.length > 0) {
      loadPoetryFromAPI();
    } else {
      // 没有筛选条件时，使用本地数据
      useApiData.value = false;
    }
    currentPage.value = 1; // 重置到第一页
  },
  { deep: true }
);

/* ===== 初始化 ===== */
onMounted(() => {
  // 初始加载时尝试从API获取数据（即使没有筛选条件）
  // 这样可以测试API是否可用，并获取更多数据
  loadPoetryFromAPI();
});

/* ===== 工具函数 ===== */
const getFormTypeLabel = (formType: PoetryFormType) => {
  return FORM_TYPE_CONFIG[formType]?.label || formType;
};

const getThemeTypeLabel = (themeType: PoetryThemeType) => {
  return THEME_TYPE_CONFIG[themeType]?.label || themeType;
};

const getPeriodTypeLabel = (periodType: PoetryPeriodType) => {
  return PERIOD_TYPE_CONFIG[periodType]?.label || periodType;
};

/* ===== 选择古诗文 ===== */
const selectPoem = (poem: Poetry) => {
  selectedPoem.value = poem;
  dialogVisible.value = true;
  
  // 如果显示拼音，更新拼音映射
  if (showPinyin.value) {
    pinyinMap.value = getPinyinMap(poem.content);
  }
};

/* ===== 监听拼音显示开关 ===== */
watch(() => showPinyin.value, (show) => {
  if (show && selectedPoem.value) {
    pinyinMap.value = getPinyinMap(selectedPoem.value.content);
  } else {
    pinyinMap.value = {};
  }
});

/* ===== 监听选中的古诗文变化 ===== */
watch(() => selectedPoem.value, (poem) => {
  if (poem && showPinyin.value) {
    pinyinMap.value = getPinyinMap(poem.content);
  }
});
</script>

<style lang="scss" scoped>
.poetry-container {
  min-height: calc(100vh - 60px);
  padding: 20px;
  padding-top: 80px; // 为固定的 navigation 留出空间（60px navigation + 20px 间距）
  background-color: #f5f6f7;

  .content {
    max-width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 15px;
      color: #303133;
    }

    .description {
      font-size: 16px;
      color: #606266;
      margin-bottom: 30px;
    }

    .loading-container {
      margin-top: 20px;
    }

    .loading-container {
      margin-top: 20px;
    }

    .poetry-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;

      .poetry-card {
        background-color: #f5f6f7;
        border-radius: 10px;
        padding: 25px;
        cursor: pointer;
        transition: all 0.3s;
        border: 2px solid transparent;

        &:hover {
          background-color: #e6e9f3;
          border-color: #409eff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .poetry-header {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #dcdfe6;

          .poetry-title {
            font-size: 24px;
            font-weight: 700;
            color: #303133;
            margin: 0 0 10px 0;
          }

          .poetry-meta {
            display: flex;
            gap: 15px;
            align-items: center;

            .poetry-author {
              font-size: 16px;
              color: #606266;
              font-weight: 500;
            }

            .poetry-dynasty {
              font-size: 14px;
              color: #909399;
            }
          }
        }

        .poetry-content {
          margin-bottom: 15px;
          min-height: 80px;

          .poetry-text {
            font-size: 16px;
            line-height: 1.8;
            color: #606266;
            white-space: pre-wrap;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        .poetry-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .form-tag,
          .theme-tag,
          .period-tag {
            margin: 0;
          }
        }
      }
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;
    }
  }
}

/* 对话框样式 */
:deep(.poetry-dialog) {
  .poetry-detail {
    .detail-header {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #dcdfe6;

      .detail-meta {
        display: flex;
        gap: 20px;
        font-size: 14px;
        color: #606266;

        .author,
        .dynasty {
          font-weight: 500;
        }
      }
    }

    .detail-content {
      margin: 20px 0;
      min-height: 200px;
    }

    .detail-footer {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #dcdfe6;

      .detail-tags {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .tag-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;

          .tag-label {
            font-size: 14px;
            color: #606266;
            font-weight: 500;
            min-width: 50px;
          }
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .poetry-container {
    padding: 15px;
    padding-top: 65px; // 移动端 navigation 高度（50px）+ 间距（15px）

    .content {
      padding: 20px;

      .title {
        font-size: 24px;
        margin-bottom: 12px;
      }

      .description {
        font-size: 14px;
        margin-bottom: 20px;
      }

      .poetry-list {
        grid-template-columns: 1fr;
        gap: 15px;

        .poetry-card {
          padding: 20px;

          .poetry-header {
            .poetry-title {
              font-size: 20px;
            }

            .poetry-meta {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;

              .poetry-author {
                font-size: 14px;
              }

              .poetry-dynasty {
                font-size: 12px;
              }
            }
          }

          .poetry-content {
            .poetry-text {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  :deep(.poetry-dialog) {
    width: 95% !important;
  }
}

@media (max-width: 480px) {
  .poetry-container {
    padding: 10px;
    padding-top: 58px; // 超小屏幕 navigation 高度（48px）+ 间距（10px）

    .content {
      padding: 15px;

      .title {
        font-size: 20px;
      }

      .description {
        font-size: 13px;
      }

      .poetry-list {
        gap: 12px;

        .poetry-card {
          padding: 15px;
        }
      }
    }
  }
}
</style>
