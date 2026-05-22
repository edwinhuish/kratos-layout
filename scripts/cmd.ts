/**
 * 命令执行工具模块
 * 提供命令执行和 Go 二进制安装的工具类
 */

import { spawnSync, type SpawnSyncOptions } from "child_process";
import path from "path";
import fs from "fs";
import { Logger } from "./logger";
import { BIN_DIR } from "./const";

/**
 * 命令执行工具类
 * 提供同步命令执行和 Go 二进制安装功能
 */
class Command {
  /** 日志记录器实例 */
  private logger: Logger;

  /**
   * 创建命令执行工具实例
   */
  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * 同步执行命令并返回输出
   */
  runSync(cmd: string, args: string[] = [], options: SpawnSyncOptions = {}): string {
    const envPath = options.env?.PATH || process.env.PATH;

    const result = spawnSync(cmd, args, {
      stdio: ["inherit", "pipe", "pipe"],
      ...options,
      env: { ...process.env, ...options.env, PATH: `${BIN_DIR}:${envPath}` },
    });

    if (result.status !== 0) {
      const errorMsg = result.stderr ? String(result.stderr).trim() : "";
      throw new Error(
        `Command ${cmd} failed with exit code ${result.status}: ${errorMsg}`,
      );
    }
  
    return String((result.stderr || result.stdout || '')).trim();
  }

  /**
   * 安装 Go 二进制工具
   */
  async installGoBin(name: string, pkg: string, forceInstall = false): Promise<void> {
    if (name === "") {
      throw new Error(`Invalid package path: ${name}`);
    }

    if (isBinInstalled(name)) {
      if (!forceInstall) {
        return;
      }
      this.logger.warn(`  FORCE Installing ${name}...`);
    } else {
      this.logger.info(`  Installing ${name}...`);
    }

    this.runSync("go", ["install", pkg], { env: { GOBIN: BIN_DIR } });
  }
}

/**
 * 检查二进制工具是否已安装
 */
function isBinInstalled(toolName: string): boolean {
  const toolPath = path.join(BIN_DIR, toolName);
  return fs.existsSync(toolPath);
}

export { Command };
