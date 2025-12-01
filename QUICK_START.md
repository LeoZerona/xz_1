# 快速部署指南

## 🚀 一键部署到 GitHub Pages

### 前提条件

1. 确保你的代码已推送到 GitHub 仓库
2. 仓库名是 `xz_1`（如果不是，需要修改配置）

### 步骤 1: 启用 GitHub Pages

1. 打开你的 GitHub 仓库
2. 点击 `Settings`（设置）
3. 在左侧菜单找到 `Pages`
4. 在 `Source` 部分，选择 `GitHub Actions`
5. 保存设置

### 步骤 2: 推送代码触发部署

```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "配置 GitHub Pages 部署"

# 推送到 GitHub
git push origin main
```

### 步骤 3: 查看部署状态

1. 在 GitHub 仓库页面，点击 `Actions` 标签
2. 查看部署工作流的状态
3. 等待部署完成（通常需要 2-5 分钟）

### 步骤 4: 访问网站

部署完成后，访问：
```
https://你的用户名.github.io/xz_1/
```

例如：`https://leozerona.github.io/xz_1/`

## 📝 如果仓库名不是 xz_1

如果你的仓库名不同，需要修改以下文件：

### 1. 修改 `.github/workflows/deploy.yml`

找到这一行：
```yaml
VITE_BASE_PATH: /xz_1/
```

改为你的仓库名：
```yaml
VITE_BASE_PATH: /你的仓库名/
```

### 2. 修改 `package.json`

找到 `build:gh-pages` 脚本：
```json
"build:gh-pages": "vite build --base=/xz_1/ && node scripts/copy-404.js"
```

改为：
```json
"build:gh-pages": "vite build --base=/你的仓库名/ && node scripts/copy-404.js"
```

### 3. 修改 `404.html`

找到这一行：
```javascript
const repoName = '/xz_1/';
```

改为：
```javascript
const repoName = '/你的仓库名/';
```

## 🔧 手动部署（如果自动部署失败）

```bash
# 1. 安装依赖
npm install

# 2. 构建项目（GitHub Pages 子路径）
npm run build:gh-pages

# 3. 部署到 gh-pages 分支
npm run deploy
```

然后在 GitHub 仓库设置中：
- `Settings` -> `Pages`
- `Source` 选择 `gh-pages` 分支
- `Directory` 选择 `/ (root)`

## ❓ 常见问题

### Q: 页面显示空白？
A: 检查浏览器控制台，可能是 base 路径配置错误。

### Q: 路由 404？
A: GitHub Pages 不支持服务端路由，直接访问子路由会 404。这是正常的，通过首页导航可以正常访问。

### Q: 如何查看部署日志？
A: 在 GitHub 仓库的 `Actions` 标签页查看。

### Q: 部署失败？
A: 检查：
- Node.js 版本是否 >= 18
- 是否有构建错误
- GitHub Actions 权限是否正确

## 📚 更多信息

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

