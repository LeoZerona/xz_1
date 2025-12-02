# 对照阅读模块扩展方案文档

## 一、模块概述

### 1.1 当前功能
对照阅读模块是一个用于展示双层文字对照的组件，主要特性包括：
- **双层显示**：上层显示楷体，下层显示小篆
- **响应式布局**：根据容器宽度自动计算每行字数
- **智能复制**：避免复制时出现重复文字
- **交互式选择**：小篆默认透明，选中时显示
- **田字格样式**：每个字符显示在独立的田字格中

### 1.2 技术架构
- **框架**：Vue 3 + TypeScript
- **数据源**：从 `/article.txt` 文件加载文本内容
- **布局方式**：Flexbox 响应式布局
- **字体支持**：楷体（KT）、小篆（FangZhengXiaoZhuan）

---

## 二、扩展方向分析

### 2.1 数据源扩展

#### 2.1.1 多文件支持
**需求**：支持加载多个文本文件，用户可以切换不同的文章

**实现方案**：
```typescript
// 扩展数据结构
interface Article {
  id: string;
  title: string;
  author?: string;
  source: string; // 文件路径或URL
  category?: string; // 分类：古诗文、现代文等
}

// 文章列表管理
const articles = ref<Article[]>([
  { id: '1', title: '滕王阁序', source: '/articles/tengwangge.txt' },
  { id: '2', title: '静夜思', source: '/articles/jingyesi.txt' },
  // ...
]);
```

**扩展点**：
- 添加文章选择器组件
- 支持文章分类和搜索
- 支持文章收藏和历史记录

#### 2.1.2 API 数据源
**需求**：从后端API获取文本内容

**实现方案**：
```typescript
// API服务封装
class ArticleService {
  async getArticle(id: string): Promise<string> {
    const response = await fetch(`/api/articles/${id}`);
    return await response.text();
  }
  
  async getArticleList(): Promise<Article[]> {
    const response = await fetch('/api/articles');
    return await response.json();
  }
}
```

#### 2.1.3 用户输入支持
**需求**：允许用户直接输入或粘贴文本

**实现方案**：
- 添加文本输入框
- 支持从剪贴板粘贴
- 支持文本编辑器（富文本/纯文本）

---

### 2.2 显示模式扩展

#### 2.2.1 字体组合扩展
**需求**：支持更多字体组合，不仅仅是楷体+小篆

**实现方案**：
```typescript
interface FontConfig {
  upper: {
    fontFamily: string;
    label: string; // 显示名称
  };
  lower: {
    fontFamily: string;
    label: string;
    defaultVisible: boolean; // 默认是否可见
  };
}

const fontPresets: FontConfig[] = [
  {
    upper: { fontFamily: 'KT', label: '楷体' },
    lower: { fontFamily: 'FangZhengXiaoZhuan', label: '小篆', defaultVisible: false }
  },
  {
    upper: { fontFamily: 'HanYiKaiTiFan', label: '繁体' },
    lower: { fontFamily: 'FangZhengXiaoZhuan', label: '小篆', defaultVisible: false }
  },
  // 可以添加更多组合
];
```

#### 2.2.2 显示方向扩展
**需求**：支持横向和纵向两种显示方式

**实现方案**：
```typescript
type DisplayDirection = 'horizontal' | 'vertical';

// 横向：左右对照
// 纵向：上下对照（当前实现）
```

#### 2.2.3 字体大小调节
**需求**：允许用户调整字体大小

**实现方案**：
- 添加字体大小滑块控件
- 支持预设大小（小、中、大、超大）
- 支持快捷键调整

---

### 2.3 交互功能扩展

#### 2.3.1 文字标注功能
**需求**：允许用户对特定文字进行标注和笔记

**实现方案**：
```typescript
interface Annotation {
  id: string;
  charIndex: number; // 字符索引
  type: 'note' | 'highlight' | 'bookmark';
  content?: string; // 笔记内容
  color?: string; // 高亮颜色
}

// 点击文字时显示标注面板
const showAnnotationPanel = (charIndex: number) => {
  // 显示标注编辑界面
};
```

**功能点**：
- 点击文字添加标注
- 显示/隐藏所有标注
- 导出标注数据
- 标注的导入导出

#### 2.3.2 搜索功能
**需求**：在文本中搜索特定字符或词语

**实现方案**：
- 添加搜索输入框
- 高亮显示搜索结果
- 支持上一个/下一个导航
- 支持正则表达式搜索

#### 2.3.3 生词本功能
**需求**：将不认识的字符添加到生词本

**实现方案**：
```typescript
interface Vocabulary {
  char: string;
  upperFont: string; // 楷体
  lowerFont: string; // 小篆
  addedAt: Date;
  reviewCount: number;
  mastery: number; // 掌握程度 0-100
}

// 右键菜单添加生词
const addToVocabulary = (char: string) => {
  vocabularyStore.add(char);
};
```

---

### 2.4 学习功能扩展

#### 2.4.1 阅读进度跟踪
**需求**：记录用户阅读进度

**实现方案**：
```typescript
interface ReadingProgress {
  articleId: string;
  currentPosition: number; // 当前阅读位置
  readPercentage: number; // 阅读百分比
  lastReadTime: Date;
  readingTime: number; // 总阅读时长（秒）
}
```

#### 2.4.2 阅读模式
**需求**：提供不同的阅读模式

**实现方案**：
- **学习模式**：显示所有标注和提示
- **阅读模式**：简化显示，专注阅读
- **测试模式**：隐藏下层文字，测试记忆
- **对比模式**：同时显示多种字体

#### 2.4.3 朗读功能
**需求**：支持文本朗读

**实现方案**：
- 集成 Web Speech API
- 支持选择朗读范围
- 支持语速调节
- 支持暂停/继续

---

### 2.5 导出和分享功能

#### 2.5.1 图片导出
**需求**：将当前显示内容导出为图片

**实现方案**：
```typescript
// 使用 html2canvas 或类似库
import html2canvas from 'html2canvas';

const exportAsImage = async () => {
  const canvas = await html2canvas(containerRef.value);
  const url = canvas.toDataURL('image/png');
  // 下载图片
  downloadImage(url, 'reference-read.png');
};
```

#### 2.5.2 PDF 导出
**需求**：导出为PDF格式

**实现方案**：
- 使用 jsPDF 库
- 支持分页
- 支持自定义样式

#### 2.5.3 分享功能
**需求**：分享当前阅读内容

**实现方案**：
- 生成分享链接
- 支持社交媒体分享
- 支持二维码分享

---

### 2.6 性能优化扩展

#### 2.6.1 虚拟滚动
**需求**：处理超长文本时的性能问题

**实现方案**：
```typescript
// 使用虚拟滚动库，只渲染可见区域
import { useVirtualList } from '@tanstack/vue-virtual';

const virtualList = useVirtualList({
  count: textArr.value.length,
  getScrollElement: () => containerRef.value,
  estimateSize: () => cellSize + gap,
});
```

#### 2.6.2 懒加载
**需求**：按需加载文本内容

**实现方案**：
- 分块加载文本
- 预加载下一部分内容
- 使用 Web Worker 处理文本解析

#### 2.6.3 缓存机制
**需求**：缓存已加载的文章

**实现方案**：
```typescript
// 使用 IndexedDB 或 localStorage
class ArticleCache {
  async get(articleId: string): Promise<string | null> {
    return localStorage.getItem(`article_${articleId}`);
  }
  
  async set(articleId: string, content: string): Promise<void> {
    localStorage.setItem(`article_${articleId}`, content);
  }
}
```

---

### 2.7 移动端优化扩展

#### 2.7.1 触摸手势
**需求**：支持手势操作

**实现方案**：
- 双指缩放调整字体大小
- 滑动切换文章
- 长按显示菜单

#### 2.7.2 横竖屏适配
**需求**：优化横竖屏显示

**实现方案**：
- 检测屏幕方向变化
- 自动调整布局
- 保存用户偏好

---

### 2.8 可访问性扩展

#### 2.8.1 键盘导航
**需求**：支持键盘操作

**实现方案**：
- 方向键导航
- Tab 键切换焦点
- Enter 键选择
- Esc 键关闭

#### 2.8.2 屏幕阅读器支持
**需求**：支持屏幕阅读器

**实现方案**：
- 添加 ARIA 标签
- 提供文字描述
- 支持语音提示

---

## 三、推荐扩展优先级

### 高优先级（核心功能）
1. **多文件支持** - 提升内容丰富度
2. **字体大小调节** - 提升用户体验
3. **搜索功能** - 提升查找效率
4. **阅读进度跟踪** - 提升学习连续性

### 中优先级（增强功能）
5. **文字标注功能** - 提升学习效果
6. **生词本功能** - 提升学习价值
7. **图片导出** - 提升分享便利性
8. **API数据源** - 提升数据管理

### 低优先级（锦上添花）
9. **朗读功能** - 提升学习方式
10. **PDF导出** - 提升导出格式
11. **虚拟滚动** - 性能优化
12. **触摸手势** - 移动端优化

---

## 四、技术实现建议

### 4.1 组件化重构
建议将对照阅读模块拆分为多个子组件：

```
ReferenceRead/
├── ReferenceReadContainer.vue    # 主容器
├── ArticleSelector.vue            # 文章选择器
├── FontConfigPanel.vue            # 字体配置面板
├── TextGrid.vue                   # 文字网格（当前核心功能）
├── AnnotationPanel.vue            # 标注面板
├── SearchPanel.vue                # 搜索面板
├── ProgressBar.vue                # 进度条
└── Toolbar.vue                    # 工具栏
```

### 4.2 状态管理
使用 Pinia 管理全局状态：

```typescript
// stores/referenceRead.ts
export const useReferenceReadStore = defineStore('referenceRead', {
  state: () => ({
    currentArticle: null as Article | null,
    articles: [] as Article[],
    fontConfig: defaultFontConfig,
    annotations: [] as Annotation[],
    readingProgress: {} as Record<string, ReadingProgress>,
  }),
  actions: {
    async loadArticle(id: string) { /* ... */ },
    addAnnotation(annotation: Annotation) { /* ... */ },
    updateProgress(progress: ReadingProgress) { /* ... */ },
  }
});
```

### 4.3 配置系统
支持用户配置持久化：

```typescript
interface UserConfig {
  fontSize: number;
  fontPreset: string;
  displayDirection: DisplayDirection;
  showGrid: boolean;
  autoSave: boolean;
  // ...
}

// 保存到 localStorage
const saveConfig = (config: UserConfig) => {
  localStorage.setItem('referenceReadConfig', JSON.stringify(config));
};
```

---

## 五、扩展实施步骤

### 第一阶段：基础扩展（1-2周）
1. 实现多文件支持
2. 添加字体大小调节
3. 实现搜索功能
4. 添加阅读进度跟踪

### 第二阶段：功能增强（2-3周）
5. 实现文字标注功能
6. 添加生词本功能
7. 实现图片导出
8. 集成API数据源

### 第三阶段：优化完善（1-2周）
9. 性能优化（虚拟滚动）
10. 移动端优化
11. 可访问性增强
12. 测试和文档完善

---

## 六、注意事项

### 6.1 兼容性
- 确保新功能不影响现有功能
- 保持向后兼容
- 渐进式增强

### 6.2 性能
- 注意大量文字渲染的性能
- 优化DOM操作
- 使用防抖和节流

### 6.3 用户体验
- 保持界面简洁
- 提供清晰的操作反馈
- 支持撤销/重做

### 6.4 数据安全
- 用户标注数据本地存储
- 支持数据导出备份
- 注意隐私保护

---

## 七、总结

对照阅读模块具有良好的扩展性，可以从数据源、显示模式、交互功能、学习功能等多个维度进行扩展。建议按照优先级逐步实施，确保每个功能都经过充分测试和优化。

通过模块化设计和组件化重构，可以保持代码的可维护性和可扩展性，为未来的功能迭代打下良好基础。

