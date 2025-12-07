<template>
  <el-dialog
    v-model="visible"
    width="90%"
    :max-width="1400"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="config-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">对照阅读配置</span>
        <el-button
          type="default"
          :icon="RefreshLeft"
          @click="handleResetToDefault"
          size="small"
          class="reset-button"
        >
          恢复为默认设置
        </el-button>
      </div>
    </template>
    <div class="config-container">
      <!-- 左侧配置区域 -->
      <div class="config-panel">
        <el-tabs v-model="activeTab" class="config-tabs">
          <!-- 功能设置标签页 -->
          <el-tab-pane label="功能设置" name="function">
            <div class="tab-content">
              <div class="config-section">
                <div class="section-title">
                  <span class="title-icon">📖</span>
                  阅读模式
                </div>
                <el-radio-group
                  v-model="config.readMode"
                  @change="updatePreview"
                  class="radio-group-horizontal"
                >
                  <el-radio label="vertical">单行上下对照</el-radio>
                  <el-radio label="horizontal">左右布局阅读</el-radio>
                </el-radio-group>
              </div>

              <div class="config-section">
                <div class="section-title">
                  <span class="title-icon">🔤</span>
                  对照的字体
                </div>
                <div class="font-selector-group">
                  <div class="font-selector-item">
                    <span class="font-label">第一排：</span>
                    <div class="font-selector-wrapper">
                      <font-selector
                        v-model="config.firstFont"
                        @change="updatePreview"
                      />
                    </div>
                  </div>
                  <div class="font-selector-item">
                    <span class="font-label">第二排：</span>
                    <div class="font-selector-wrapper">
                      <font-selector
                        v-model="config.secondFont"
                        @change="updatePreview"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="config-section">
                <div class="section-title">
                  <span class="title-icon">📚</span>
                  学习内容
                </div>
                <el-select
                  v-model="config.contentId"
                  placeholder="请选择学习内容"
                  filterable
                  clearable
                  @change="handleContentChange"
                  class="full-width-select"
                >
                  <el-option
                    v-for="item in classicalTexts"
                    :key="item.id"
                    :label="`${item.title} - ${item.author}`"
                    :value="item.id"
                  >
                    <div class="content-option">
                      <div class="content-title">{{ item.title }}</div>
                      <div class="content-meta">
                        <span class="author">{{ item.author }}</span>
                        <span class="category">{{ item.category }}</span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </div>

              <div class="config-section">
                <div class="section-title">
                  <span class="title-icon">⚙️</span>
                  功能模式
                </div>
                <el-radio-group
                  v-model="config.functionMode"
                  @change="updatePreview"
                  class="radio-group-horizontal"
                >
                  <el-radio label="compare">对照阅读模式</el-radio>
                  <el-radio label="learn">学习模式</el-radio>
                </el-radio-group>
              </div>

              <div
                class="config-section"
                v-if="config.functionMode === 'learn'"
              >
                <div class="section-title">
                  <span class="title-icon">⌨️</span>
                  操作模式
                </div>
                <el-radio-group
                  v-model="config.operationMode"
                  @change="updatePreview"
                  class="radio-group-horizontal"
                >
                  <el-radio label="keyboard">方向键操控</el-radio>
                  <el-radio label="typing">打字模式</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-tab-pane>

          <!-- 稿纸设置标签页 -->
          <el-tab-pane label="稿纸设置" name="paper">
            <div class="tab-content">
              <div class="config-section paper-config-section">
                <div class="section-title">
                  <span class="title-icon">📄</span>
                  阅读稿纸设置
                </div>
                <div class="paper-config">
                  <div class="paper-item">
                    <div class="paper-label-wrapper">
                      <div class="paper-label">稿纸样式：</div>
                    </div>
                    <div class="paper-options-wrapper">
                      <el-radio-group
                        v-model="config.gridType"
                        @change="updatePreview"
                        class="paper-radio-group-with-preview"
                      >
                        <el-radio label="tian" class="radio-with-preview">
                          <div class="grid-preview-small">
                            <paper-grid
                              grid-type="tian"
                              :show-pinyin="
                                config.showOptions.includes('pinyin')
                              "
                              :pinyin="
                                config.showOptions.includes('pinyin')
                                  ? 'xué'
                                  : ''
                              "
                              :cell-size="35"
                              class="preview-grid-cell"
                            >
                              字
                            </paper-grid>
                          </div>
                          <span class="radio-label">田字格</span>
                        </el-radio>
                        <el-radio label="mi" class="radio-with-preview">
                          <div class="grid-preview-small">
                            <paper-grid
                              grid-type="mi"
                              :show-pinyin="
                                config.showOptions.includes('pinyin')
                              "
                              :pinyin="
                                config.showOptions.includes('pinyin')
                                  ? 'xué'
                                  : ''
                              "
                              :cell-size="35"
                              class="preview-grid-cell"
                            >
                              字
                            </paper-grid>
                          </div>
                          <span class="radio-label">米字格</span>
                        </el-radio>
                        <el-radio label="none" class="radio-with-preview">
                          <div class="grid-preview-small">
                            <paper-grid
                              grid-type="none"
                              :show-pinyin="
                                config.showOptions.includes('pinyin')
                              "
                              :pinyin="
                                config.showOptions.includes('pinyin')
                                  ? 'xué'
                                  : ''
                              "
                              :cell-size="35"
                              class="preview-grid-cell"
                            >
                              字
                            </paper-grid>
                          </div>
                          <span class="radio-label">无格</span>
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="paper-item">
                    <div class="paper-label-wrapper">
                      <div class="paper-label">显示选项：</div>
                    </div>
                    <div class="paper-options-wrapper">
                      <el-checkbox-group
                        v-model="config.showOptions"
                        @change="updatePreview"
                        class="paper-checkbox-group"
                      >
                        <el-checkbox label="pinyin">拼音</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧预览区域 -->
      <div class="preview-panel">
        <div class="preview-title">预览效果</div>
        <div class="preview-content">
          <text-grid-preview
            :text="previewText"
            :read-mode="config.readMode"
            :first-font="config.firstFont"
            :second-font="config.secondFont"
            :grid-type="config.gridType"
            :show-pinyin="config.showOptions.includes('pinyin')"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { RefreshLeft } from "@element-plus/icons-vue";
import FontSelector from "./FontSelector.vue";
import TextGridPreview from "./TextGridPreview.vue";
import PaperGrid from "./PaperGrid.vue";

interface Config {
  readMode: "vertical" | "horizontal";
  firstFont: string;
  secondFont: string;
  contentId: string;
  functionMode: "compare" | "learn";
  operationMode: "keyboard" | "typing";
  gridType: "tian" | "mi" | "none";
  showOptions: string[];
}

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [config: Config];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const classicalTexts = ref<any[]>([]);

// 默认配置
const defaultConfig: Config = {
  readMode: "vertical",
  firstFont: "HanYiKaiTiFan",
  secondFont: "FangZhengXiaoZhuan",
  contentId: "",
  functionMode: "compare",
  operationMode: "keyboard",
  gridType: "tian",
  showOptions: [],
};

// 加载文言文数据
const loadClassicalTexts = async () => {
  try {
    const response = await fetch("/src/static/text_res/classical_texts.json");
    const data = await response.json();
    classicalTexts.value = data;
  } catch (error) {
    console.error("加载文言文数据失败:", error);
    // 使用默认数据
    classicalTexts.value = [
      {
        id: "lunyu_1",
        title: "论语·学而",
        author: "孔子",
        category: "儒家经典",
        text: "学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？",
      },
    ];
  }
};

const config = ref<Config>({ ...defaultConfig });

const previewText = ref("学而时习之，不亦说乎？有朋自远方来，不亦乐乎？");
const activeTab = ref("function"); // 当前激活的标签页

const handleContentChange = (contentId: string) => {
  const content = classicalTexts.value.find((item) => item.id === contentId);
  if (content) {
    previewText.value = content.text;
  }
  updatePreview();
};

const updatePreview = () => {
  // 预览更新逻辑
};

const handleConfirm = () => {
  // 保存配置到 localStorage
  try {
    localStorage.setItem("referenceReadConfig", JSON.stringify(config.value));
  } catch (error) {
    console.error("保存配置失败:", error);
  }

  emit("confirm", { ...config.value });
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
};

// 恢复为默认设置
const handleResetToDefault = () => {
  config.value = { ...defaultConfig };
  previewText.value = "学而时习之，不亦说乎？有朋自远方来，不亦乐乎？";
  updatePreview();
};

// 监听对话框打开，重置配置
watch(visible, (newVal) => {
  if (newVal) {
    loadClassicalTexts();
    // 可以在这里加载保存的配置，如果没有保存的配置，则使用默认配置
    const savedConfig = localStorage.getItem("referenceReadConfig");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        config.value = { ...defaultConfig, ...parsed };
        // 如果有保存的内容ID，更新预览文本
        if (parsed.contentId) {
          const content = classicalTexts.value.find(
            (item) => item.id === parsed.contentId
          );
          if (content) {
            previewText.value = content.text;
          }
        }
      } catch (error) {
        console.error("加载保存的配置失败:", error);
        config.value = { ...defaultConfig };
      }
    } else {
      config.value = { ...defaultConfig };
    }
    updatePreview();
  }
});

onMounted(() => {
  loadClassicalTexts();
});
</script>

<style lang="scss" scoped>
.config-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.config-container {
  display: flex;
  gap: 30px;
  min-height: 600px;
}

.dialog-header {
  display: flex;
  align-items: center;
  width: 100%;

  .dialog-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-right: 20px;
  }

  .reset-button {
    flex-shrink: 0;
  }
}

.config-panel {
  flex: 0 0 420px;
  padding-right: 24px;
  border-right: 1px solid #e4e7ed;
  max-height: 70vh;
  display: flex;
  flex-direction: column;

  .config-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    :deep(.el-tabs__header) {
      margin: 0 0 16px 0;
    }

    :deep(.el-tabs__content) {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }
  }

  .tab-content {
    padding: 0;
  }

  .config-section {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #409eff;

      .title-icon {
        font-size: 18px;
        margin-right: 8px;
      }
    }

    .font-selector-group {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .font-selector-item {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .font-label {
          font-size: 14px;
          color: #606266;
          font-weight: 500;
        }

        .font-selector-wrapper {
          width: 100%;
        }
      }
    }

    &.paper-config-section {
      .paper-config {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .paper-item {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;

          &:last-child {
            margin-bottom: 0;
          }

          .paper-label-wrapper {
            flex-shrink: 0;
            margin-bottom: 4px;

            .paper-label {
              font-size: 14px;
              font-weight: 600;
              color: #303133;
              line-height: 1.5;
            }
          }

          .paper-options-wrapper {
            flex: 1;
            width: 100%;
            margin-top: 0;
          }

          .paper-radio-group-with-preview {
            width: 100%;

            :deep(.el-radio-group) {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              gap: 16px;
              width: 100%;
            }

            :deep(.el-radio) {
              margin: 0;
              height: auto;
              line-height: normal;
              border: 1px solid #e4e7ed;
              border-radius: 6px;
              padding: 16px 20px;
              transition: all 0.3s;
              cursor: pointer;
              display: flex;
              align-items: center;
              flex: 0 1 calc(33.333% - 11px);
              box-sizing: border-box;
              margin-bottom: 0;

              &:hover {
                border-color: #409eff;
                background-color: #f0f9ff;
              }

              .el-radio__input {
                margin-right: 12px;
                flex-shrink: 0;
              }

              .el-radio__label {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
                padding-left: 0;
                width: 100%;
                flex: 1;

                .radio-label {
                  font-size: 14px;
                  color: #303133;
                  font-weight: 500;
                  flex-shrink: 0;
                }

                .grid-preview-small {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 8px;
                  background-color: #fff;
                  border-radius: 4px;
                  border: 1px solid #e4e7ed;
                  flex-shrink: 0;

                  .preview-grid-cell {
                    margin: 0;
                  }
                }
              }

              &.is-checked {
                border-color: #409eff;
                background-color: #ecf5ff;
              }
            }
          }

          .paper-checkbox-group {
            width: 100%;

            :deep(.el-checkbox-group) {
              display: flex;
              gap: 15px;
            }
          }
        }
      }
    }

    .full-width-select {
      width: 100%;
    }

    .radio-group-horizontal {
      :deep(.el-radio) {
        margin-right: 20px;
        margin-bottom: 0;
        white-space: nowrap;
      }
    }

    :deep(.el-radio-group) {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    :deep(.el-checkbox-group) {
      display: flex;
      gap: 15px;
    }
  }
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;

  .preview-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 20px;
  }

  .preview-content {
    flex: 1;
    background-color: #f5f6f7;
    border-radius: 8px;
    padding: 20px;
    overflow-y: auto;
    max-height: 60vh;
  }
}

.content-option {
  .content-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }

  .content-meta {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;

    .author {
      margin-right: 10px;
    }

    .category {
      color: #409eff;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .config-container {
    flex-direction: column;
    gap: 20px;
  }

  .config-panel {
    flex: none;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
    padding-right: 0;
    padding-bottom: 20px;
    max-height: none;
  }

  .preview-panel {
    .preview-content {
      max-height: 40vh;
    }
  }
}
</style>
