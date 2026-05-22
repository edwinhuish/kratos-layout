/**
 * Build 脚本
 * 编译 backend 应用为可执行文件
 */

import { Command } from "#/scripts/cmd";
import { Logger } from "#/scripts/logger";

const logger = new Logger("backend");
const cmd = new Command(logger);

const OUTPUT_DIR = "./bin";

logger.info("Building backend application...");

try {
  cmd.runSync("go", ["build", "-o", OUTPUT_DIR, "./cmd/trader"]);
  logger.success(`Backend built successfully: ${OUTPUT_DIR}/trader`);
} catch (error) {
  logger.error(`Build 失败: ${(error as Error).message}`);
  process.exit(1);
}