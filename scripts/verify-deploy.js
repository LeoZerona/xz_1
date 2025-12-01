import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

console.log('🔍 验证部署配置...\n');

const distPath = join(process.cwd(), 'dist');
const errors = [];
const warnings = [];

// 1. 检查 dist 目录
if (!existsSync(distPath)) {
  errors.push('dist 目录不存在，请先运行构建');
  console.error('✗', errors[errors.length - 1]);
  process.exit(1);
}

// 2. 检查必需文件
const requiredFiles = ['index.html', '404.html'];
requiredFiles.forEach(file => {
  const filePath = join(distPath, file);
  if (existsSync(filePath)) {
    console.log(`✓ ${file} 存在`);
  } else {
    errors.push(`${file} 不存在`);
    console.error(`✗ ${file} 不存在`);
  }
});

// 3. 检查 index.html 中的路径
const indexPath = join(distPath, 'index.html');
if (existsSync(indexPath)) {
  const indexContent = readFileSync(indexPath, 'utf-8');
  
  // 检查是否包含 base 路径
  const basePath = '/xz_1/';
  const hasBasePath = indexContent.includes(basePath);
  
  if (hasBasePath) {
    console.log(`✓ index.html 包含正确的 base 路径: ${basePath}`);
    
    // 检查资源文件是否存在
    const assetMatches = indexContent.matchAll(/(href|src)="([^"]+)"/g);
    for (const match of assetMatches) {
      const fullPath = match[2];
      if (fullPath.startsWith(basePath)) {
        const relativePath = fullPath.replace(basePath, '');
        const filePath = join(distPath, relativePath);
        
        if (existsSync(filePath)) {
          console.log(`  ✓ ${relativePath} 存在`);
        } else {
          errors.push(`资源文件不存在: ${relativePath}`);
          console.error(`  ✗ ${relativePath} 不存在`);
        }
      }
    }
  } else {
    warnings.push('index.html 中可能缺少 base 路径');
    console.warn('⚠ index.html 中可能缺少 base 路径');
  }
}

// 4. 检查 assets 目录
const assetsPath = join(distPath, 'assets');
if (existsSync(assetsPath)) {
  const assets = statSync(assetsPath);
  if (assets.isDirectory()) {
    console.log('✓ assets 目录存在');
  }
} else {
  warnings.push('assets 目录不存在');
  console.warn('⚠ assets 目录不存在');
}

// 5. 检查 404.html
const notFoundPath = join(distPath, '404.html');
if (existsSync(notFoundPath)) {
  const notFoundContent = readFileSync(notFoundPath, 'utf-8');
  if (notFoundContent.includes('/xz_1/')) {
    console.log('✓ 404.html 包含正确的仓库路径');
  } else {
    warnings.push('404.html 中可能缺少正确的仓库路径');
    console.warn('⚠ 404.html 中可能缺少正确的仓库路径');
  }
}

// 总结
console.log('\n📊 验证结果:');
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ 所有检查通过！');
  console.log('\n💡 部署说明:');
  console.log('  - 使用 GitHub Actions: 文件会自动部署到正确位置');
  console.log('  - 使用 gh-pages 包: dist 目录内容会推送到 gh-pages 分支根目录');
  console.log('  - GitHub Pages URL: https://你的用户名.github.io/xz_1/');
} else {
  if (errors.length > 0) {
    console.error('\n❌ 发现错误:');
    errors.forEach(err => console.error(`  - ${err}`));
  }
  if (warnings.length > 0) {
    console.warn('\n⚠️  警告:');
    warnings.forEach(warn => console.warn(`  - ${warn}`));
  }
  process.exit(errors.length > 0 ? 1 : 0);
}

