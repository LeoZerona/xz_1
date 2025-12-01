# 项目结构说明

## 项目重构总结

本次重构主要完成了以下工作：

### 1. 修复问题
- ✅ 修复目录名拼写错误：`rouotes` → `routes`
- ✅ 更新路由配置文件的引用路径
- ✅ 优化 Vite 配置中的代理设置注释

### 2. 组件提取与重构

#### 新增通用组件 (`src/components/common/`)

1. **CharacterDisplay.vue** - 字符显示组件
   - 统一显示小篆、繁体、简体字符
   - 支持多种尺寸和自定义样式
   - 可配置显示哪些字体类型

2. **DictionarySearch.vue** - 字典查询卡片组件
   - 用于学习页面中的字典查询
   - 支持自定义位置和样式

3. **DictionaryDrawer.vue** - 字典查询抽屉组件
   - 用于题库页面中的字典查询
   - 基于 name-slot-drawer 封装

4. **LearningProgress.vue** - 学习进度条组件
   - 封装 Element Plus 进度条
   - 支持自定义颜色和格式

5. **AnswerTip.vue** - 答题提示组件
   - 显示答题结果（正确/错误）
   - 包含参考答案展示

6. **QuestionCard.vue** - 题目卡片组件
   - 支持选择题和填空题两种模式
   - 统一的交互逻辑

#### 优化的组件

1. **learnCard.vue** - 学习卡片组件
   - 重构为使用新提取的通用组件
   - 代码更简洁，维护性更好

2. **UnitCard.vue** (原 unit.vue) - 单元卡片组件
   - 优化样式和交互
   - 改进提示信息显示

3. **part.vue** - 部分展示组件
   - 更新为使用新的 UnitCard 组件
   - 改进类型定义

4. **learnEndDialog.vue** - 学习结束弹窗
   - 使用 CharacterDisplay 组件统一字符显示

5. **topicBank.vue** - 题库页面
   - 使用 DictionaryDrawer 组件
   - 简化代码结构

### 3. 项目结构优化

```
src/
├── components/
│   ├── common/              # 通用组件目录（新增）
│   │   ├── CharacterDisplay.vue
│   │   ├── DictionarySearch.vue
│   │   ├── DictionaryDrawer.vue
│   │   ├── LearningProgress.vue
│   │   ├── AnswerTip.vue
│   │   ├── QuestionCard.vue
│   │   └── index.ts          # 组件导出索引
│   ├── learn/                # 学习相关组件
│   ├── topicBank/            # 题库相关组件
│   │   └── UnitCard.vue      # 优化后的单元卡片
│   └── ...
├── routes/                   # 路由配置（修复拼写）
│   └── index.ts
└── ...
```

### 4. 组件设计原则

1. **单一职责**：每个组件只负责一个功能
2. **可复用性**：通用组件可在多个场景使用
3. **类型安全**：使用 TypeScript 定义清晰的接口
4. **可配置性**：通过 props 支持多种使用场景
5. **一致性**：统一的样式和交互模式

### 5. 使用示例

#### CharacterDisplay 组件
```vue
<character-display
  :character="'篆'"
  :show-xz="true"
  :show-ft="true"
  :show-jt="true"
  size="large"
/>
```

#### DictionarySearch 组件
```vue
<dictionary-search
  :visible="searchVisible"
  title="字典查询"
  @close="handleClose"
/>
```

#### LearningProgress 组件
```vue
<learning-progress
  :current="currentIndex"
  :total="totalCount"
/>
```

### 6. 后续优化建议

1. 添加单元测试
2. 完善组件文档
3. 优化性能（虚拟滚动等）
4. 添加错误边界处理
5. 统一错误处理机制

## 注意事项

- 所有组件都使用 TypeScript 编写
- 遵循 Vue 3 Composition API 最佳实践
- 使用 `<script setup>` 语法
- 组件命名采用 PascalCase
- 样式使用 SCSS 并采用 scoped

