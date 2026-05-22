/**
 * Lint 脚本
 * 使用 buf 工具检查 protobuf 文件，使用 golangci-lint 检查 Go 代码
 * 支持 --fix 参数自动修复格式问题
 */

import { Command } from "#/scripts/cmd";
import { Logger } from "#/scripts/logger";
import { formatProto, formatGo } from "./format";

const logger = new Logger("backend");
const cmd = new Command(logger);

const args = process.argv.slice(2);
const runAll = !args.includes("--proto") && !args.includes("--service") && !args.includes("--wire");
const runProto = runAll || args.includes("--proto");
const runGo = !args.includes("--proto") || args.includes("--service") || args.includes("--wire");
const fixMode = args.includes("--fix") || args.includes("-f");

/**
 * 检查 protobuf 文件
 */
function lintProto(): void {
  logger.info("Linting protobuf files...");
  try {
    cmd.runSync("buf", ["lint"]);
    logger.success("Protobuf lint passed");
  } catch (error) {
    logger.error(`buf lint 执行失败: ${(error as Error).message}`);
    process.exit(1);
  }
}

/**
 * 检查 Go 代码
 */
function lintGo(): void {
  logger.info("Linting Go files...");
  try {
    cmd.runSync("golangci-lint", ["run", "./..."]);
    logger.success("Go lint passed");
  } catch (error) {
    logger.error(`golangci-lint run 执行失败: ${(error as Error).message}`);
    process.exit(1);
  }
}

if (fixMode) {
  logger.info("Fix mode enabled, running format first...");
  try {
    if (runProto) {
      formatProto();
    }
    if (runGo) {
      formatGo();
    }
  } catch {
    process.exit(1);
  }
}

if (runProto) {
  lintProto();
}

if (runGo) {
  lintGo();
}
