# 修复部署问题指南

## 问题：404 错误和文件夹结构不对

### 问题分析

当部署到 GitHub Pages 子路径时，可能出现以下问题：

1. **资源路径不正确**：静态资源（JS、CSS、图片等）无法加载
2. **文件结构不匹配**：部署后的文件结构与预期不符

### 解决方案

#### 方案 1：使用 GitHub Actions 自动部署（推荐）

GitHub Actions 会自动处理文件结构，确保文件部署到正确位置。

**步骤：**

1. **确保工作流配置正确**

   检查 `.github/workflows/deploy.yml`：
   ```yaml
   - name: Build
     run: npm run build:gh-pages
     env:
       VITE_BASE_PATH: /xz_1/
   
   - name: Upload artifact
     uses: actions/upload-pages-artifact@v3
     with:
       path: './dist'  # 确保是 dist 目录
   ```

2. **启用 GitHub Pages**

   - 进入仓库 `Settings` -> `Pages`
   - `Source` 选择 `GitHub Actions`

3. **推送代码触发部署**

   ```bash
   git add .
   git commit -m "修复部署配置"
   git push origin main
   ```

#### 方案 2：使用 gh-pages 包手动部署

如果使用 `gh-pages` 包，它会将 `dist` 目录的内容推送到 `gh-pages` 分支的根目录。

**步骤：**

1. **构建项目**

   ```bash
   npm run build:gh-pages
   ```

2. **验证构建结果**

   ```bash
   npm run diagnose
   ```

   或手动检查：
   - `dist/index.html` 中的资源路径应该是 `/xz_1/assets/...`
   - `dist/404.html` 存在且包含正确的仓库路径
   - `dist/assets/` 目录包含所有资源文件

3. **部署**

   ```bash
   npm run deploy
   ```

4. **在 GitHub 中配置**

   - 进入仓库 `Settings` -> `Pages`
   - `Source` 选择 `gh-pages` 分支
   - `Directory` 选择 `/ (root)`

### 验证部署

部署后，访问以下 URL 检查：

1. **主页**：`https://你的用户名.github.io/xz_1/`
2. **检查资源**：打开浏览器开发者工具，查看 Network 标签
3. **检查控制台**：查看是否有 404 错误

### 常见问题

#### Q: 资源文件 404

**原因：** base 路径配置不正确

**解决：**
1. 确保构建时使用了正确的 base 路径：`npm run build:gh-pages`
2. 检查 `dist/index.html` 中的资源路径是否包含 `/xz_1/`
3. 清除浏览器缓存后重新访问

#### Q: 页面空白

**原因：** JavaScript 文件无法加载

**解决：**
1. 检查浏览器控制台的错误信息
2. 确认资源文件路径正确
3. 检查 GitHub Pages 设置是否正确

#### Q: 路由 404

**原因：** GitHub Pages 不支持服务端路由

**解决：**
1. 确保 `404.html` 存在且配置正确
2. 或考虑使用 hash 路由模式

### 文件结构说明

**正确的部署结构：**

```
gh-pages 分支根目录（或 GitHub Pages 根目录）
├── index.html          # 主页面
├── 404.html            # 404 重定向页面
├── vite.svg            # 图标文件
├── article.txt         # 其他静态文件
└── assets/             # 资源目录
    ├── index-xxx.js    # JavaScript 文件
    ├── index-xxx.css   # CSS 文件
    └── ...             # 其他资源
```

**GitHub Pages URL 映射：**

- 仓库名：`xz_1`
- GitHub Pages URL：`https://username.github.io/xz_1/`
- 文件访问路径：`https://username.github.io/xz_1/index.html`
- 资源访问路径：`https://username.github.io/xz_1/assets/xxx.js`

### 调试技巧

1. **本地预览构建结果**

   ```bash
   npm run build:gh-pages
   npm run preview
   ```

   访问显示的 URL，检查是否正常。

2. **检查构建后的文件**

   ```bash
   # 查看 dist/index.html
   cat dist/index.html
   
   # 查看资源路径
   grep -r "href=\|src=" dist/index.html
   ```

3. **使用诊断工具**

   ```bash
   npm run diagnose
   npm run verify-deploy  # 如果添加了验证脚本
   ```

### 如果问题仍然存在

1. **清除所有缓存**

   ```bash
   rm -rf dist node_modules/.vite
   npm install
   npm run build:gh-pages
   ```

2. **检查 GitHub Actions 日志**

   - 进入仓库的 `Actions` 标签
   - 查看最新的部署工作流
   - 检查构建和部署步骤的日志

3. **手动验证文件**

   - 访问 `https://你的用户名.github.io/xz_1/index.html`
   - 检查浏览器 Network 标签，查看哪些资源失败
   - 根据失败的资源路径调整配置

