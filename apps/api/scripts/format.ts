/**
 * Format 脚本
 * 使用 buf 工具格式化 protobuf 文件，统一代码风格
 */

import process from 'node:process';
import { Command } from '#/scripts/cmd';
import { Logger } from '#/scripts/logger';

const logger = new Logger('api');
const cmd = new Command(logger);

try {
  cmd.runSync('buf', ['format', '-w']);
}
catch (error) {
  logger.error(`buf format -w 执行失败: ${(error as Error).message}`);
  process.exit(1);
}
