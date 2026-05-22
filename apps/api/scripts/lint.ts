/**
 * Lint 脚本
 * 使用 buf 工具检查 protobuf 文件的语法和风格规范
 */

import { Command } from "#/scripts/cmd";
import { Logger } from "#/scripts/logger";

const logger = new Logger("api");
const cmd = new Command(logger);

const fixMode = process.argv.includes("--fix") || process.argv.includes("-f");

if (fixMode) {
  logger.info("Fix mode enabled, running format first...");
  try {
    cmd.runSync("buf", ["format", "-w"]);
    logger.success("Format completed");
  } catch (error) {
    logger.error(`buf format -w 执行失败: ${(error as Error).message}`);
    process.exit(1);
  }
}

try {
  cmd.runSync("buf", ["lint"]);
} catch (error) {
  logger.error(`buf lint 执行失败: ${(error as Error).message}`);
  process.exit(1);
}