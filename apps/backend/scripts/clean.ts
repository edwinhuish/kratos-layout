/**
 * Clean 脚本
 * 清理所有生成的代码文件（bin/ 目录）
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Logger } from "#/scripts/logger";

const logger = new Logger("backend");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_DIR = path.resolve(__dirname, "..");

const binDir = path.join(APP_DIR, "bin");

if (fs.existsSync(binDir)) {
  fs.rmSync(binDir, { recursive: true, force: true });
  logger.success(`Removed ${binDir}`);
} else {
  logger.info(`${binDir} does not exist, nothing to clean`);
}