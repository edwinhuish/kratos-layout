/**
 * Prepare 脚本
 * 更新 buf 的依赖项（buf.lock）
 */

import process from 'node:process';
import { Command } from '#/scripts/cmd';
import { initEnv } from '#/scripts/env';
import { Logger } from '#/scripts/logger';

(async () => {
  const logger = new Logger('api');
  const cmd = new Command(logger);

  await initEnv(logger);

  try {
    cmd.runSync('buf', ['dep', 'update']);
  }
  catch (error) {
    logger.error(`buf dep update 执行失败: ${(error as Error).message}`);
    process.exit(1);
  }
})();
