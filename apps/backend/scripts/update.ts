/**
 * Update 脚本
 * 更新 buf 的依赖项（buf.lock），并更新 Go 模块依赖到最新版本
 */

import { Command } from "#/scripts/cmd";
import { Logger } from "#/scripts/logger";

const logger = new Logger("backend");
const cmd = new Command(logger);

logger.info("Updating buf dependencies...");
try {
  cmd.runSync("buf", ["dep", "update"]);
  logger.success("Buf dependencies updated");
} catch (error) {
  logger.error(`buf dep update 执行失败: ${(error as Error).message}`);
  process.exit(1);
}

logger.info("Updating Go modules to latest versions...");
try {
  cmd.runSync("go", ["get", "-u", "./..."]);
  logger.success("Go modules updated to latest versions");
} catch (error) {
  logger.error(`go get -u 执行失败: ${(error as Error).message}`);
  process.exit(1);
}