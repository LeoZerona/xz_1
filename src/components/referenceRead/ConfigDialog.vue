<template>
  <el-drawer
    v-model="visible"
    direction="rtl"
    size="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :modal="false"
    :append-to-body="true"
    :with-header="true"
    class="config-drawer"
  >
    <template #header>
      <div class="drawer-header">
        <span class="drawer-title">对照阅读配置</span>
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
                              :cell-size="25"
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
                              :cell-size="25"
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
                              :cell-size="25"
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
    </div>

    <div class="drawer-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { RefreshLeft } from "@element-plus/icons-vue";
import FontSelector from "./FontSelector.vue";
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
  change: [config: Config];
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
  // 实时更新配置到阅读模块
  emit("change", { ...config.value });
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

// 监听对话框关闭，清理唯一标识类
watch(visible, (newVal) => {
  if (!newVal) {
    // 关闭时清理 class，避免影响其他组件
    nextTick(() => {
      const drawer = document.querySelector(".reference-read-config-drawer");
      const overlay = document.querySelector(".reference-read-config-overlay");
      if (drawer) {
        drawer.classList.remove("reference-read-config-drawer");
      }
      if (overlay) {
        overlay.classList.remove("reference-read-config-overlay");
      }
    });
    return;
  }

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

    // 动态设置抽屉样式，确保不覆盖导航栏，并添加唯一标识类
    // 使用 setTimeout 确保 drawer 已经渲染到 DOM 中
    setTimeout(() => {
      // 查找所有 drawer，找到当前组件打开的 drawer
      const allDrawers = document.querySelectorAll(".el-drawer.rtl");
      const allOverlays = document.querySelectorAll(".el-overlay");

      // 找到最近打开的 drawer（通常是最后一个，且包含 config-drawer 相关的元素）
      // 通过查找包含 "对照阅读配置" 文本的 drawer 来确认
      let targetDrawer: HTMLElement | null = null;
      let targetOverlay: HTMLElement | null = null;

      for (let i = allDrawers.length - 1; i >= 0; i--) {
        const drawer = allDrawers[i] as HTMLElement;
        // 检查 drawer 中是否包含当前组件的特定内容
        if (
          drawer
            .querySelector(".drawer-title")
            ?.textContent?.includes("对照阅读配置")
        ) {
          targetDrawer = drawer;
          break;
        }
      }

      // 如果没找到，使用最后一个 drawer（假设是当前打开的）
      if (!targetDrawer && allDrawers.length > 0) {
        targetDrawer = allDrawers[allDrawers.length - 1] as HTMLElement;
      }

      // 找到对应的 overlay（通常是 drawer 的兄弟元素或父元素的子元素）
      if (targetDrawer && allOverlays.length > 0) {
        // overlay 通常在 drawer 之前
        const drawerIndex = Array.from(allDrawers).indexOf(targetDrawer);
        if (drawerIndex < allOverlays.length) {
          targetOverlay = allOverlays[drawerIndex] as HTMLElement;
        } else if (allOverlays.length > 0) {
          targetOverlay = allOverlays[allOverlays.length - 1] as HTMLElement;
        }
      }

      // 添加唯一标识类
      if (targetDrawer) {
        targetDrawer.classList.add("reference-read-config-drawer");
      }
      if (targetOverlay) {
        targetOverlay.classList.add("reference-read-config-overlay");
      }
    }, 100);
  }
});

onMounted(() => {
  loadClassicalTexts();
});
</script>

<style lang="scss" scoped>
.config-drawer {
  :deep(.el-drawer) {
    z-index: 999 !important; // 低于导航栏的 z-index: 1000
    position: fixed !important;
    right: 0 !important;
    top: 60px !important; // 从导航栏下方开始显示
    height: calc(100vh - 60px) !important; // 减去导航栏高度
    box-shadow: none !important; // 移除阴影
  }

  :deep(.el-drawer.rtl) {
    z-index: 999 !important;
    position: fixed !important;
    right: 0 !important;
    top: 60px !important;
    height: calc(100vh - 60px) !important;
    box-shadow: none !important; // 移除阴影
  }

  :deep(.el-drawer__header) {
    margin-bottom: 20px;
    padding: 20px 20px 0 20px;
    position: relative;
    z-index: 1;
  }

  :deep(.el-overlay) {
    z-index: 998 !important; // 低于抽屉，确保在导航栏下方
    background-color: transparent !important;
    pointer-events: none !important;
    top: 60px !important; // 从导航栏下方开始
    height: calc(100vh - 60px) !important; // 减去导航栏高度
  }

  :deep(.el-drawer__body) {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.config-container {
  flex: 1;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 1;

  .drawer-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    flex: 1;
  }

  .reset-button {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
  flex-shrink: 0;
}

.config-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

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
              gap: 12px;
              width: 100%;
            }

            :deep(.el-radio) {
              margin: 0;
              height: auto;
              line-height: normal;
              border: none;
              border-radius: 0;
              padding: 10px 12px;
              transition: all 0.3s;
              cursor: pointer;
              display: flex;
              align-items: center;
              flex: 0 0 auto;
              box-sizing: border-box;
              margin-bottom: 0;
              background-color: transparent;

              &:hover {
                background-color: transparent;
              }

              .el-radio__input {
                margin-right: 8px;
                flex-shrink: 0;
              }

              .el-radio__label {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding-left: 0;
                width: 100%;
                flex: 1;

                .radio-label {
                  font-size: 13px;
                  color: #303133;
                  font-weight: 500;
                  flex-shrink: 0;
                  margin-top: 4px;
                }

                .grid-preview-small {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 4px;
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
                background-color: transparent;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .config-drawer {
    :deep(.el-drawer) {
      width: 90% !important;
    }
  }

  .config-container {
    flex-direction: column;
    gap: 20px;
  }

  .config-panel {
    padding-bottom: 20px;
  }
}
</style>

<style lang="scss">
// 使用唯一的 class 名称限定样式作用范围，只影响当前组件的 drawer
// 这样不会影响其他组件中的 drawer
.reference-read-config-drawer {
  top: 60px !important;
  height: calc(100vh - 60px) !important;
  z-index: 999 !important;
  position: fixed !important;
  box-shadow: none !important; // 移除阴影
}

// 遮罩层也要调整，只针对当前组件的遮罩层
.reference-read-config-overlay {
  top: 60px !important;
  height: calc(100vh - 60px) !important;
  z-index: 998 !important;
}
</style>
