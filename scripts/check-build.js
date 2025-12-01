import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// 检查构建后的 index.html 是否正确
const distIndexPath = join(process.cwd(), 'dist', 'index.html');

if (!existsSync(distIndexPath)) {
  console.error('✗ dist/index.html 不存在，构建可能失败');
  process.exit(1);
}

const content = readFileSync(distIndexPath, 'utf-8');

// 检查资源路径是否正确
const hasAbsolutePath = /href="\/[^/]|src="\/[^/]/.test(content);

if (hasAbsolutePath) {
  console.warn('⚠ 警告：发现绝对路径，可能在某些部署环境中失败');
  console.warn('   如果部署到 GitHub Pages 子路径，请确保使用相对路径或正确的 base 路径');
} else {
  console.log('✓ 构建文件检查通过');
}

