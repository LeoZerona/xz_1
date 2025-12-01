# 部署指南

本项目支持部署到 GitHub Pages。有两种部署方式：

## 方式一：使用 GitHub Actions 自动部署（推荐）

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 `Settings` -> `Pages`
3. 在 `Source` 中选择 `GitHub Actions`

### 2. 配置仓库名（如果不同）

如果你的仓库名不是 `xz_1`，需要修改以下文件：

- `.github/workflows/deploy.yml` 中的 `VITE_BASE_PATH: /xz_1/` 改为你的仓库名
- `vite.config.ts` 中的 base 路径
- `package.json` 中的 `build:gh-pages` 脚本

### 3. 推送代码

```bash
git add .
git commit -m "配置 GitHub Pages 部署"
git push origin main
```

GitHub Actions 会自动构建并部署到 GitHub Pages。

## 方式二：手动部署

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

如果部署到 GitHub Pages 子路径（仓库名）：
```bash
npm run build:gh-pages
```

如果使用自定义域名（根路径）：
```bash
npm run build
```

### 3. 部署到 gh-pages 分支

```bash
npm run deploy
```

或者使用自定义域名：
```bash
npm run deploy:custom
```

### 4. 在 GitHub 中启用 Pages

1. 进入仓库的 `Settings` -> `Pages`
2. 在 `Source` 中选择 `gh-pages` 分支
3. 选择 `/ (root)` 目录
4. 点击 `Save`

## 自定义域名

如果你有自定义域名：

1. 在仓库根目录创建 `CNAME` 文件，内容为你的域名（如：`example.com`）
2. 修改 `vite.config.ts` 中的 `base: '/'`
3. 修改 `src/routes/index.ts` 中的 `base: '/'`
4. 重新构建和部署

## 访问地址

- 如果使用 GitHub Pages 默认地址：`https://你的用户名.github.io/xz_1/`
- 如果使用自定义域名：`https://你的域名/`

## 注意事项

1. **路由模式**：项目使用 `history` 模式，GitHub Pages 不支持服务端路由。如果直接访问子路由会 404。
   - 解决方案：使用 `hash` 模式（修改 `src/routes/index.ts` 中的 `createWebHistory` 为 `createWebHashHistory`）
   - 或者配置 404 重定向到 `index.html`

2. **静态资源路径**：确保所有静态资源使用相对路径或配置正确的 base 路径。

3. **API 请求**：如果项目中有 API 请求，需要配置 CORS 或使用代理服务。

## 故障排除

### 页面空白

- 检查浏览器控制台的错误信息
- 确认 base 路径配置正确
- 检查静态资源路径是否正确

### 路由 404

- 考虑使用 hash 路由模式
- 或配置 404.html 重定向

### 构建失败

- 检查 Node.js 版本（推荐 18+）
- 清除 `node_modules` 和 `dist` 后重新安装依赖
- 检查 TypeScript 类型错误

