/**
 * Clean 脚本
 * 清理所有生成的代码文件（gen/ 目录）
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '#/scripts/logger';

const logger = new Logger('api');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_DIR = path.resolve(__dirname, '..');

const genDir = path.join(APP_DIR, 'gen');

if (fs.existsSync(genDir)) {
  fs.rmSync(genDir, { recursive: true, force: true });
  logger.success(`Removed ${genDir}`);
}
else {
  logger.info(`${genDir} does not exist, nothing to clean`);
}
