<template>
  <div
    class="config-panel-wrapper"
    :class="{ 'panel-visible': visible }"
  >
    <div class="config-panel-content">
      <!-- 头部 -->
      <div class="config-header">
        <span class="config-title">对照阅读配置</span>
        <el-button
          type="default"
          :icon="RefreshLeft"
          @click="handleResetToDefault"
          size="small"
          class="reset-button"
        >
          默认设置
        </el-button>
      </div>

      <!-- 配置内容 -->
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
                      <span class="font-label">字体一：</span>
                      <div class="font-selector-wrapper">
                        <font-selector
                          v-model="config.firstFont"
                          @change="updatePreview"
                        />
                      </div>
                    </div>
                    <div class="font-selector-item">
                      <span class="font-label">字体二：</span>
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
                  
                  <!-- PDF上传功能 -->
                  <div class="pdf-upload-section">
                    <el-divider>
                      <span style="color: #909399; font-size: 12px;">或</span>
                    </el-divider>
                    <el-upload
                      ref="uploadRef"
                      :auto-upload="false"
                      :on-change="handlePdfChange"
                      :show-file-list="false"
                      accept=".pdf"
                      class="pdf-upload"
                    >
                      <template #trigger>
                        <el-button type="primary" :icon="Upload" :loading="pdfLoading">
                          {{ pdfLoading ? '正在解析PDF...' : '上传PDF文档' }}
                        </el-button>
                      </template>
                    </el-upload>
                    <div v-if="uploadedPdfName" class="uploaded-pdf-info">
                      <el-icon class="pdf-icon"><Document /></el-icon>
                      <span class="pdf-name">{{ uploadedPdfName }}</span>
                      <el-button
                        type="danger"
                        :icon="Delete"
                        size="small"
                        text
                        @click="clearUploadedPdf"
                      >
                        清除
                      </el-button>
                    </div>
                  </div>
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

      <!-- 底部按钮 -->
      <div class="config-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { RefreshLeft, Upload, Document, Delete } from "@element-plus/icons-vue";
import FontSelector from "./FontSelector.vue";
import PaperGrid from "./PaperGrid.vue";
// 动态导入pdfjs-dist以避免SSR问题
let pdfjsLib: any = null;

// 初始化PDF.js
const initPdfJs = async () => {
  if (typeof window === "undefined" || pdfjsLib) return;
  
  try {
    // 动态导入pdfjs-dist
    const pdfjsModule = await import("pdfjs-dist");
    
    // pdfjs-dist 5.x版本的导入方式
    // 检查是否有default导出，如果没有则使用命名空间导入
    if (pdfjsModule.default) {
      pdfjsLib = pdfjsModule.default;
    } else {
      // 使用命名空间导入
      pdfjsLib = pdfjsModule;
    }
    
    // 设置PDF.js worker路径
    // 使用unpkg CDN，版本号与package.json中的版本对应
    if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.js`;
    } else {
      console.warn("PDF.js GlobalWorkerOptions未找到，尝试使用默认配置");
    }
  } catch (error) {
    console.error("PDF.js初始化失败:", error);
    ElMessage.error("PDF解析库加载失败，请刷新页面重试");
  }
};

// 在组件挂载时初始化
onMounted(() => {
  initPdfJs();
});

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
  "pdf-upload": [text: string];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const classicalTexts = ref<any[]>([]);
const pdfLoading = ref(false);
const uploadedPdfName = ref("");
const uploadRef = ref();

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
  // 清除上传的PDF
  if (uploadedPdfName.value) {
    clearUploadedPdf();
  }
  updatePreview();
};

// 处理PDF文件选择
const handlePdfChange = async (file: any) => {
  if (!file.raw) return;
  
  if (file.raw.type !== "application/pdf") {
    ElMessage.error("请上传PDF格式的文件");
    return;
  }

  // 确保PDF.js已初始化
  if (!pdfjsLib) {
    await initPdfJs();
  }

  if (!pdfjsLib) {
    ElMessage.error("PDF解析库加载失败，请刷新页面重试");
    return;
  }

  pdfLoading.value = true;
  uploadedPdfName.value = file.name;

  try {
    const arrayBuffer = await file.raw.arrayBuffer();
    
    // 使用正确的API调用方式
    // pdfjs-dist 5.x版本中，getDocument可能是命名导出
    const getDocument = pdfjsLib.getDocument || (pdfjsLib as any).getDocument;
    if (!getDocument) {
      console.error("PDF.js库结构:", pdfjsLib);
      throw new Error("PDF.js getDocument方法未找到，请检查库是否正确加载");
    }
    
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = "";
    const numPages = pdf.numPages;

    // 提取所有页面的文本
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join("");
      fullText += pageText + "\n";
    }

    // 清理文本：移除多余的空格和换行
    fullText = fullText
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    if (fullText) {
      // 清除contentId，因为使用的是上传的PDF
      config.value.contentId = "";
      previewText.value = fullText;
      
      // 通知父组件更新文本
      emit("pdf-upload", fullText);
      updatePreview();
      
      ElMessage.success(`PDF解析成功！共 ${numPages} 页`);
    } else {
      ElMessage.warning("PDF文件中没有提取到文本内容");
      clearUploadedPdf();
    }
  } catch (error) {
    console.error("PDF解析失败:", error);
    ElMessage.error("PDF解析失败，请检查文件格式");
    clearUploadedPdf();
  } finally {
    pdfLoading.value = false;
  }
};

// 清除上传的PDF
const clearUploadedPdf = () => {
  uploadedPdfName.value = "";
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
  // 恢复默认内容选择
  config.value.contentId = "";
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

// 默认设置
const handleResetToDefault = () => {
  config.value = { ...defaultConfig };
  previewText.value = "学而时习之，不亦说乎？有朋自远方来，不亦乐乎？";
  updatePreview();
};

// 监听面板显示/隐藏，加载配置
watch(visible, (newVal) => {
  if (newVal) {
    loadClassicalTexts();
    // 加载保存的配置，如果没有保存的配置，则使用默认配置
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
  } else {
    // 面板关闭时的清理操作
    // 可以在这里添加必要的清理逻辑，例如：
    // - 重置某些临时状态
    // - 清理定时器
    // - 取消未完成的请求等
  }
});

onMounted(() => {
  loadClassicalTexts();
});
</script>

<style lang="scss" scoped>
.config-panel-wrapper {
  position: fixed;
  right: 0;
  top: 60px; // 从导航栏下方开始
  width: 400px;
  height: calc(100vh - 60px);
  z-index: 999; // 低于导航栏的 z-index: 1000
  background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08), -2px 0 8px rgba(0, 0, 0, 0.04);
  transform: translateX(100%);
  will-change: transform;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  pointer-events: none; // 隐藏时禁用交互

  &.panel-visible {
    transform: translateX(0);
    pointer-events: auto; // 显示时启用交互
  }
}

.config-panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px 20px 20px;
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  backdrop-filter: blur(10px);

  .config-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    flex: 1;
    letter-spacing: -0.3px;
  }

  .reset-button {
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

.config-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px;

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

.config-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(to top, #ffffff 0%, #fafbfc 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.02);
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
      margin: 0 0 20px 0;
      padding: 0 4px;
    }

    :deep(.el-tabs__nav-wrap::after) {
      background-color: rgba(0, 0, 0, 0.06);
    }

    :deep(.el-tabs__item) {
      font-weight: 500;
      color: #606266;
      transition: all 0.2s ease;

      &:hover {
        color: #409eff;
      }

      &.is-active {
        color: #409eff;
        font-weight: 600;
      }
    }

    :deep(.el-tabs__active-bar) {
      background-color: #409eff;
      height: 3px;
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
    padding: 4px 0;
  }

  .config-section {
    margin-bottom: 28px;
    padding: 20px;
    padding-bottom: 24px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border-color: rgba(64, 158, 255, 0.2);
    }

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #409eff;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 40px;
        height: 2px;
        background: linear-gradient(to right, #409eff, rgba(64, 158, 255, 0.3));
      }

      .title-icon {
        font-size: 20px;
        margin-right: 10px;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
      }
    }

    .font-selector-group {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .font-selector-item {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
          background: #f0f2f5;
        }

        .font-label {
          font-size: 14px;
          color: #606266;
          font-weight: 600;
          letter-spacing: 0.2px;
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
              border: 1px solid rgba(0, 0, 0, 0.08);
              border-radius: 8px;
              padding: 12px;
              transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              cursor: pointer;
              display: flex;
              align-items: center;
              flex: 0 0 auto;
              box-sizing: border-box;
              margin-bottom: 0;
              background: #ffffff;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

              &:hover {
                background: #f8f9fa;
                border-color: rgba(64, 158, 255, 0.4);
                box-shadow: 0 2px 6px rgba(64, 158, 255, 0.15);
                transform: translateY(-1px);
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
                  padding: 6px;
                  background: linear-gradient(
                    to bottom,
                    #ffffff 0%,
                    #fafbfc 100%
                  );
                  border-radius: 8px;
                  border: 1px solid rgba(0, 0, 0, 0.08);
                  flex-shrink: 0;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                  transition: all 0.2s ease;

                  &:hover {
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    border-color: rgba(64, 158, 255, 0.3);
                  }

                  .preview-grid-cell {
                    margin: 0;
                  }
                }
              }

              &.is-checked {
                background: linear-gradient(
                  to bottom,
                  #ecf5ff 0%,
                  #e1f0ff 100%
                );
                border-color: #409eff;
                box-shadow: 0 2px 8px rgba(64, 158, 255, 0.25);
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
  padding: 4px 0;

  .content-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 6px;
  }

  .content-meta {
    font-size: 12px;
    color: #909399;
    display: flex;
    align-items: center;
    gap: 8px;

    .author {
      padding: 2px 8px;
      background: #f0f2f5;
      border-radius: 4px;
      font-weight: 500;
    }

    .category {
      color: #409eff;
      font-weight: 500;
      padding: 2px 8px;
      background: rgba(64, 158, 255, 0.1);
      border-radius: 4px;
    }
  }
}

.pdf-upload-section {
  margin-top: 16px;
  padding-top: 16px;

  .pdf-upload {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 12px;

    :deep(.el-upload) {
      width: 100%;
    }

    :deep(.el-button) {
      width: 100%;
    }
  }

  .uploaded-pdf-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f0f2f5;
    border-radius: 6px;
    font-size: 13px;
    color: #606266;

    .pdf-icon {
      color: #409eff;
      font-size: 16px;
    }

    .pdf-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .config-panel-wrapper {
    width: 90%;
    top: 50px; // 移动端 navigation 高度
    height: calc(100vh - 50px);
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  }

  .config-header {
    padding: 20px 16px 16px 16px;

    .config-title {
      font-size: 18px;
    }
  }

  .config-container {
    padding: 0 16px;
  }

  .config-section {
    padding: 16px;
    margin-bottom: 20px;
  }

  .config-footer {
    padding: 16px;
  }

  .config-panel {
    padding-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .config-panel-wrapper {
    width: 100%;
    top: 48px; // 超小屏幕 navigation 高度
    height: calc(100vh - 48px);
  }

  .config-header {
    padding: 16px;

    .config-title {
      font-size: 16px;
    }
  }

  .config-container {
    padding: 0 12px;
  }

  .config-section {
    padding: 12px;
    margin-bottom: 16px;
    border-radius: 8px;

    .section-title {
      font-size: 15px;
      margin-bottom: 16px;
    }
  }

  .config-footer {
    padding: 12px;
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}
</style>
