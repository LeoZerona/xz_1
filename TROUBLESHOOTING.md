# 故障排除指南

## 404 错误

### 问题：资源加载 404

**症状：**
- 浏览器控制台显示资源 404 错误
- 页面空白或样式丢失
- JavaScript 文件无法加载

**原因：**
- base 路径配置不正确
- 静态资源路径使用了绝对路径

**解决方案：**

1. **检查 base 路径配置**

   确保 `vite.config.ts` 中的 base 路径正确：
   ```typescript
   base: process.env.NODE_ENV === 'production' 
     ? (process.env.VITE_BASE_PATH || '/') 
     : '/',
   ```

2. **检查构建命令**

   对于 GitHub Pages（子路径）：
   ```bash
   npm run build:gh-pages
   ```

   对于自定义域名（根路径）：
   ```bash
   npm run build
   ```

3. **检查构建后的文件**

   构建后检查 `dist/index.html`，确保资源路径正确：
   - 如果部署到子路径 `/xz_1/`，路径应该是 `/xz_1/assets/...`
   - 如果部署到根路径，路径应该是 `/assets/...`

4. **清除缓存重新构建**

   ```bash
   rm -rf dist node_modules/.vite
   npm run build:gh-pages
   ```

### 问题：路由 404

**症状：**
- 直接访问子路由返回 404
- 刷新页面后 404

**原因：**
GitHub Pages 是静态托管，不支持服务端路由。

**解决方案：**

1. **使用 404.html 重定向**（已配置）
   - 确保 `404.html` 在 `dist` 目录中
   - 检查 `404.html` 中的仓库名是否正确

2. **使用 hash 路由模式**（可选）

   修改 `src/routes/index.ts`：
   ```typescript
   import { createWebHashHistory } from 'vue-router';
   
   const router = createRouter({
     history: createWebHashHistory(), // 改为 hash 模式
     routes,
   });
   ```

## 构建错误

### 问题：构建失败

**检查清单：**
1. Node.js 版本 >= 18
2. 清除 `node_modules` 和 `dist` 后重新安装
3. 检查 TypeScript 类型错误
4. 检查控制台错误信息

**解决步骤：**
```bash
# 清除缓存
rm -rf node_modules dist

# 重新安装
npm install

# 重新构建
npm run build:gh-pages
```

## 部署问题

### 问题：GitHub Actions 部署失败

**检查清单：**
1. 仓库设置中已启用 Pages
2. 工作流文件语法正确
3. 权限配置正确

**查看日志：**
- 进入仓库的 `Actions` 标签
- 查看失败的 workflow
- 检查错误信息

### 问题：手动部署后页面不更新

**解决方案：**
1. 清除浏览器缓存
2. 检查 `gh-pages` 分支是否更新
3. 等待 GitHub Pages 缓存刷新（可能需要几分钟）

## 开发环境问题

### 问题：开发服务器资源 404

**原因：**
- base 路径配置错误
- 端口冲突

**解决方案：**
```bash
# 确保使用开发命令
npm run dev

# 如果端口被占用，指定其他端口
npm run dev -- --port 3001
```

## 常见错误信息

### `Failed to load resource: the server responded with a status of 404`

**可能原因：**
1. base 路径配置错误
2. 资源文件不存在
3. 路径拼写错误

**解决步骤：**
1. 检查浏览器 Network 标签，查看失败的资源路径
2. 确认路径是否正确
3. 检查 `dist` 目录中是否存在该资源
4. 重新构建项目

### `Cannot GET /xxx`

**原因：** 路由配置问题

**解决：** 使用 hash 路由或配置 404 重定向

## 获取帮助

如果以上方法都无法解决问题：

1. 检查浏览器控制台的完整错误信息
2. 检查构建日志
3. 查看 GitHub Actions 日志（如果使用自动部署）
4. 确认所有配置文件正确

## 验证清单

部署前请确认：

- [ ] `vite.config.ts` 中 base 路径正确
- [ ] `package.json` 中构建脚本正确
- [ ] `404.html` 存在且仓库名正确
- [ ] GitHub Actions 工作流配置正确（如果使用）
- [ ] 所有静态资源路径正确
- [ ] 路由配置正确

