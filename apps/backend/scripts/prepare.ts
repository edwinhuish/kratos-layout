/**
 * Prepare 脚本
 * 更新 buf 的依赖项（buf.lock），并整理 Go 模块依赖
 */

import { Command } from "#/scripts/cmd";
import { Logger } from "#/scripts/logger";
import { initEnv } from "#/scripts/env";

(async () => {

  const logger = new Logger("backend");
  const cmd = new Command(logger);

  await initEnv(logger);

  logger.info("Updating buf dependencies...");
  try {
    cmd.runSync("buf", ["dep", "update"]);
    logger.success("Buf dependencies updated");
  } catch (error) {
    logger.error(`buf dep update 执行失败: ${(error as Error).message}`);
    process.exit(1);
  }

  logger.info("Tidying Go modules...");
  try {
    cmd.runSync("go", ["mod", "tidy"]);
    logger.success("Go modules tidied");
  } catch (error) {
    logger.error(`go mod tidy 执行失败: ${(error as Error).message}`);
    process.exit(1);
  }

})();
