# 小篆在线学习网站

基于 Vue 3 + TypeScript + Vite 构建的小篆学习平台。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 组件库
- **Pinia** - Vue 状态管理
- **Vue Router** - 官方路由管理器
- **ECharts** - 数据可视化

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 部署到 GitHub Pages

本项目已配置 GitHub Pages 自动部署。详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)。

### 快速部署步骤

1. **启用 GitHub Pages**
   - 进入仓库 `Settings` -> `Pages`
   - 在 `Source` 中选择 `GitHub Actions`

2. **推送代码**
   ```bash
   git add .
   git commit -m "配置部署"
   git push origin main
   ```

3. **等待自动部署**
   - GitHub Actions 会自动构建并部署
   - 访问地址：`https://你的用户名.github.io/xz_1/`

### 手动部署

```bash
# 部署到 GitHub Pages（子路径）
npm run deploy

# 部署到自定义域名（根路径）
npm run deploy:custom
```

## 项目结构

```
xz_1/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   ├── view/           # 页面视图
│   ├── routes/          # 路由配置
│   ├── store/           # 状态管理
│   └── request/         # API 请求
├── public/              # 公共资源
└── .github/             # GitHub Actions 配置
```

## 开发环境要求

- Node.js >= 18
- npm >= 8 或 yarn >= 1.22

## IDE 推荐配置

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## 许可证

MIT
