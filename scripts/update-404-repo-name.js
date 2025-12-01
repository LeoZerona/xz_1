import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// 从 package.json 或环境变量获取仓库名
// 默认使用 xz_1，你可以修改这里
const REPO_NAME = process.env.REPO_NAME || 'xz_1';

const filePath = join(process.cwd(), '404.html');
let content = readFileSync(filePath, 'utf-8');

// 替换仓库名
content = content.replace(/\/xz_1\//g, `/${REPO_NAME}/`);

writeFileSync(filePath, content, 'utf-8');
console.log(`✓ 已更新 404.html 中的仓库名为: ${REPO_NAME}`);

