/**
 * Dev 脚本
 * 使用 air 工具启动热重载开发服务器
 */

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { Command } from '#/scripts/cmd';
import { Logger } from '#/scripts/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_DIR = path.dirname(__dirname);

const logger = new Logger('backend');
const cmd = new Command(logger);

logger.info('Starting development server with hot reload...');
try {
  cmd.runSync('air', [], { cwd: APP_DIR, stdio: 'inherit' });
}
catch (error) {
  logger.error(`air 启动失败: ${(error as Error).message}`);
  process.exit(1);
}
