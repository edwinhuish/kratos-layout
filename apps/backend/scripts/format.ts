/**
 * Format 脚本
 * 使用 buf 工具格式化 protobuf 文件，使用 golangci-lint 格式化 Go 代码
 */

import process from 'node:process';
import { Command } from '#/scripts/cmd';
import { Logger } from '#/scripts/logger';

const logger = new Logger('backend');
const cmd = new Command(logger);

/**
 * 格式化 protobuf 文件
 */
export function formatProto(): void {
  logger.info('Formatting protobuf files...');
  try {
    cmd.runSync('buf', ['format', '-w']);
    logger.success('Protobuf files formatted');
  }
  catch (error) {
    logger.error(`buf format -w 执行失败: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * 格式化 Go 文件
 */
export function formatGo(): void {
  logger.info('Formatting Go files...');
  try {
    cmd.runSync('golangci-lint', ['fix', './...'], { stdio: 'inherit' });
    logger.success('Go files formatted');
  }
  catch (error) {
    logger.error(`golangci-lint fix 执行失败: ${(error as Error).message}`);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  formatProto();
  formatGo();
}
