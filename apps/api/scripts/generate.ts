/**
 * Generate 脚本
 * 使用 buf 工具从 protobuf 文件生成代码
 */

import process from 'node:process';
import { Command } from '#/scripts/cmd';
import { Logger } from '#/scripts/logger';

const logger = new Logger('api');
const cmd = new Command(logger);

try {
  cmd.runSync('buf', ['generate']);
}
catch (error) {
  logger.error(`buf generate 执行失败: ${(error as Error).message}`);
  process.exit(1);
}
