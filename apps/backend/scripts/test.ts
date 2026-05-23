/**
 * Test 脚本
 * 运行 backend 应用的测试
 */

import process from 'node:process';
import { Command } from '#/scripts/cmd';
import { Logger } from '#/scripts/logger';

const logger = new Logger('backend');
const cmd = new Command(logger);

const args = process.argv.slice(2);

logger.info('Running tests...');

try {
  cmd.runSync('go', ['test', '-v', ...args, './...']);
  logger.success('All tests passed');
}
catch (error) {
  logger.error(`Test 失败: ${(error as Error).message}`);
  process.exit(1);
}
