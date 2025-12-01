import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

// 复制 404.html 到 dist 目录
const source = join(process.cwd(), '404.html');
const dest = join(process.cwd(), 'dist', '404.html');

if (existsSync(source)) {
  try {
    copyFileSync(source, dest);
    console.log('✓ 404.html 已复制到 dist 目录');
  } catch (error) {
    console.error('✗ 复制 404.html 失败:', error);
    process.exit(1);
  }
} else {
  console.warn('⚠ 404.html 文件不存在，跳过复制');
}

