# 修复 CI/CD 问题指南

## 问题：Install dependencies 步骤失败

### 已修复的问题

1. **移除了不必要的依赖**
   - 移除了 `yarn`（包管理器，不应在 dependencies 中）
   - 移除了 `cors` 和 `express`（后端依赖，前端项目不需要）

2. **添加了 .npmrc 配置**
   - 创建了 `.npmrc` 文件，设置 `legacy-peer-deps=true`
   - 这可以解决 peer dependencies 冲突问题

3. **优化了工作流配置**
   - 改进了依赖安装步骤，兼容有/无 package-lock.json 的情况

### 下一步操作

1. **更新本地依赖**

   ```bash
   # 删除 node_modules 和 package-lock.json
   rm -rf node_modules package-lock.json
   
   # 重新安装依赖
   npm install
   
   # 提交更新的 package-lock.json
   git add package-lock.json package.json .npmrc
   git commit -m "修复依赖配置"
   git push origin main
   ```

2. **验证本地构建**

   ```bash
   # 测试构建
   npm run build:gh-pages
   
   # 如果构建成功，说明依赖配置正确
   ```

3. **重新触发 CI**

   - 推送代码后，GitHub Actions 会自动运行
   - 或在 GitHub 仓库的 Actions 标签中手动触发

### 如果仍然失败

#### 检查 1: 查看详细错误信息

在 GitHub Actions 日志中查看具体的错误信息：
- 进入仓库的 `Actions` 标签
- 点击失败的 workflow
- 展开 "Install dependencies" 步骤
- 查看错误详情

#### 检查 2: 常见错误及解决方案

**错误：peer dependency conflict**

解决方案：
- `.npmrc` 文件已创建，应该能解决大部分问题
- 如果仍有问题，可能需要更新某些包的版本

**错误：package-lock.json 不同步**

解决方案：
```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "更新 package-lock.json"
git push
```

**错误：网络问题或包下载失败**

解决方案：
- 这通常是临时的，重试即可
- 可以在工作流中添加重试逻辑

**错误：Node.js 版本不兼容**

解决方案：
- 检查本地 Node.js 版本：`node --version`
- 确保工作流中的 Node.js 版本兼容（当前设置为 20）

### 验证修复

修复后，检查以下内容：

1. **本地安装成功**
   ```bash
   npm install
   # 应该没有错误
   ```

2. **本地构建成功**
   ```bash
   npm run build:gh-pages
   # 应该成功构建
   ```

3. **CI 通过**
   - GitHub Actions 的 "Install dependencies" 步骤应该成功
   - 整个 workflow 应该能完成

### 如果问题持续

1. **查看完整日志**
   - 在 GitHub Actions 中查看完整的错误堆栈

2. **尝试降级 Node.js 版本**
   - 修改 `.github/workflows/deploy.yml` 中的 `node-version`
   - 尝试 `'18'` 或 `'lts/*'`

3. **使用 yarn 替代**
   - 如果 npm 持续有问题，可以改用 yarn
   - 需要修改工作流配置

### 预防措施

1. **保持 package-lock.json 更新**
   - 每次修改 package.json 后运行 `npm install`
   - 提交 package-lock.json

2. **定期更新依赖**
   ```bash
   npm outdated
   npm update
   ```

3. **测试 CI 配置**
   - 在本地模拟 CI 环境测试
   - 使用 Docker 或 GitHub Codespaces

