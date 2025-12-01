import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 诊断部署配置...\n');

// 1. 检查 vite.config.ts
const viteConfigPath = join(process.cwd(), 'vite.config.ts');
if (existsSync(viteConfigPath)) {
  const viteConfig = readFileSync(viteConfigPath, 'utf-8');
  if (viteConfig.includes('base:')) {
    console.log('✓ vite.config.ts 包含 base 配置');
  } else {
    console.log('✗ vite.config.ts 缺少 base 配置');
  }
} else {
  console.log('✗ vite.config.ts 不存在');
}

// 2. 检查路由配置
const routesPath = join(process.cwd(), 'src/routes/index.ts');
if (existsSync(routesPath)) {
  const routes = readFileSync(routesPath, 'utf-8');
  if (routes.includes('BASE_URL') || routes.includes('base')) {
    console.log('✓ 路由配置包含 base 路径');
  } else {
    console.log('⚠ 路由配置可能缺少 base 路径');
  }
}

// 3. 检查 404.html
const notFoundPath = join(process.cwd(), '404.html');
if (existsSync(notFoundPath)) {
  console.log('✓ 404.html 存在');
  const notFound = readFileSync(notFoundPath, 'utf-8');
  if (notFound.includes('/xz_1/')) {
    console.log('  ⚠ 404.html 中的仓库名是 /xz_1/，如果仓库名不同请修改');
  }
} else {
  console.log('✗ 404.html 不存在');
}

// 4. 检查构建输出
const distPath = join(process.cwd(), 'dist');
if (existsSync(distPath)) {
  const distIndexPath = join(distPath, 'index.html');
  if (existsSync(distIndexPath)) {
    console.log('✓ dist/index.html 存在');
    const distIndex = readFileSync(distIndexPath, 'utf-8');
    
    // 检查资源路径
    const absolutePaths = distIndex.match(/(href|src)="\/[^/]/g);
    if (absolutePaths && absolutePaths.length > 0) {
      console.log('  ⚠ 发现绝对路径，如果部署到子路径可能失败');
      console.log('     示例:', absolutePaths[0]);
    } else {
      console.log('  ✓ 资源路径看起来正确');
    }
  } else {
    console.log('✗ dist/index.html 不存在，请先运行构建');
  }
} else {
  console.log('⚠ dist 目录不存在，请先运行构建');
}

// 5. 检查 package.json 脚本
const packagePath = join(process.cwd(), 'package.json');
if (existsSync(packagePath)) {
  const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
  if (pkg.scripts && pkg.scripts['build:gh-pages']) {
    console.log('✓ build:gh-pages 脚本存在');
    if (pkg.scripts['build:gh-pages'].includes('/xz_1/')) {
      console.log('  ⚠ 脚本中的仓库名是 /xz_1/，如果仓库名不同请修改');
    }
  }
}

console.log('\n💡 提示：');
console.log('  - 如果部署到 GitHub Pages 子路径，使用: npm run build:gh-pages');
console.log('  - 如果部署到自定义域名，使用: npm run build');
console.log('  - 如果仓库名不是 xz_1，需要修改相关配置文件');

