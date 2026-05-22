/**
 * Update 脚本
 * 更新 buf 的依赖项（buf.lock），功能同 prepare 脚本
 */

import { Command } from "#/scripts/cmd";
import { Logger } from "#/scripts/logger";

const logger = new Logger("api");
const cmd = new Command(logger);

try {
  cmd.runSync("buf", ["dep", "update"]);
} catch (error) {
  logger.error(`buf dep update 执行失败: ${(error as Error).message}`);
  process.exit(1);
}