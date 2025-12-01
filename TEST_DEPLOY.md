# 测试部署步骤指南

## 📋 完整测试流程

### 步骤 1: 本地验证构建

在部署到 GitHub 之前，先在本地验证构建是否正确：

```bash
# 1. 清除旧的构建文件
rm -rf dist

# 2. 构建项目（GitHub Pages 子路径）
npm run build:gh-pages

# 3. 验证构建结果
npm run verify
```

**预期结果：**
- ✅ 所有检查通过
- ✅ `dist` 目录包含所有必需文件
- ✅ 资源路径包含 `/xz_1/` 前缀

### 步骤 2: 本地预览（可选）

```bash
# 启动预览服务器
npm run preview
```

在浏览器中打开显示的 URL（通常是 `http://localhost:4173`），检查：
- ✅ 页面正常显示
- ✅ 样式正常加载
- ✅ JavaScript 功能正常
- ✅ 没有控制台错误

### 步骤 3: 提交代码到 GitHub

```bash
# 1. 检查当前状态
git status

# 2. 添加所有更改
git add .

# 3. 提交更改
git commit -m "配置 GitHub Pages 部署"

# 4. 推送到 GitHub
git push origin main
```

### 步骤 4: 启用 GitHub Pages

1. **打开 GitHub 仓库**
   - 访问你的仓库页面：`https://github.com/你的用户名/xz_1`

2. **进入设置**
   - 点击仓库顶部的 `Settings`（设置）标签

3. **配置 Pages**
   - 在左侧菜单找到 `Pages`
   - 在 `Source` 部分，选择 `GitHub Actions`
   - 保存设置

### 步骤 5: 查看部署状态

1. **查看 Actions**
   - 在仓库页面，点击 `Actions` 标签
   - 你应该能看到 "Deploy to GitHub Pages" 工作流正在运行

2. **等待部署完成**
   - 通常需要 2-5 分钟
   - 工作流状态会显示为绿色 ✅ 表示成功
   - 如果失败，点击查看详细日志

### 步骤 6: 测试网站

部署完成后，访问你的网站：

```
https://你的用户名.github.io/xz_1/
```

例如：`https://leozerona.github.io/xz_1/`

### 步骤 7: 全面测试

#### ✅ 基础功能测试

1. **页面加载**
   - [ ] 主页能正常打开
   - [ ] 没有空白页面
   - [ ] 控制台没有 404 错误

2. **资源加载**
   - [ ] 打开浏览器开发者工具（F12）
   - [ ] 切换到 `Network`（网络）标签
   - [ ] 刷新页面
   - [ ] 检查所有资源都成功加载（状态码 200）
   - [ ] 没有 404 错误

3. **样式测试**
   - [ ] 页面样式正常显示
   - [ ] 字体加载正常
   - [ ] 布局正确

4. **功能测试**
   - [ ] 导航菜单可以点击
   - [ ] 页面路由切换正常
   - [ ] 交互功能正常

#### ✅ 路由测试

测试各个页面：

- [ ] 主页：`https://你的用户名.github.io/xz_1/`
- [ ] 题库页：`https://你的用户名.github.io/xz_1/topic_bank`
- [ ] 学习页：`https://你的用户名.github.io/xz_1/unit_learn`
- [ ] 对照阅读：`https://你的用户名.github.io/xz_1/reference_read`

**注意：** 如果直接访问子路由出现 404，这是正常的（GitHub Pages 限制）。应该：
- 从主页导航进入
- 或使用 `404.html` 重定向

#### ✅ 移动端测试

1. **响应式测试**
   - [ ] 在手机浏览器中打开网站
   - [ ] 检查移动端布局是否正确
   - [ ] 测试触摸交互

2. **不同设备**
   - [ ] 平板设备
   - [ ] 不同屏幕尺寸

### 步骤 8: 检查常见问题

#### 🔍 如果页面空白

1. **检查控制台错误**
   ```javascript
   // 打开浏览器控制台（F12），查看错误信息
   ```

2. **检查资源路径**
   - 在 Network 标签中查看失败的资源
   - 确认路径包含 `/xz_1/` 前缀

3. **清除缓存**
   - 按 `Ctrl + Shift + R`（Windows）或 `Cmd + Shift + R`（Mac）强制刷新
   - 或在浏览器设置中清除缓存

#### 🔍 如果资源 404

1. **检查构建配置**
   ```bash
   npm run diagnose
   ```

2. **重新构建**
   ```bash
   rm -rf dist
   npm run build:gh-pages
   npm run verify
   ```

3. **检查 GitHub Actions 日志**
   - 在 Actions 标签中查看构建日志
   - 确认构建成功

#### 🔍 如果路由 404

1. **测试 404.html**
   - 直接访问：`https://你的用户名.github.io/xz_1/404.html`
   - 应该能重定向到主页

2. **考虑使用 hash 路由**
   - 如果问题持续，可以修改为 hash 路由模式
   - 修改 `src/routes/index.ts`

## 🎯 快速测试清单

部署后，快速检查这些项目：

- [ ] 网站可以访问
- [ ] 主页正常显示
- [ ] 没有控制台错误
- [ ] 所有资源加载成功（Network 标签）
- [ ] 导航功能正常
- [ ] 移动端显示正常

## 📞 获取帮助

如果遇到问题：

1. **查看日志**
   - GitHub Actions 日志
   - 浏览器控制台
   - Network 标签

2. **运行诊断**
   ```bash
   npm run diagnose
   npm run verify
   ```

3. **查看文档**
   - `TROUBLESHOOTING.md` - 故障排除
   - `FIX_DEPLOY.md` - 修复指南

## ✅ 成功标志

如果以下所有项都正常，说明部署成功：

1. ✅ 网站可以访问
2. ✅ 页面正常显示，没有空白
3. ✅ 浏览器控制台没有错误
4. ✅ Network 标签中所有资源状态码为 200
5. ✅ 所有功能正常工作
6. ✅ 移动端显示正常

恭喜！🎉 你的网站已成功部署到 GitHub Pages！

