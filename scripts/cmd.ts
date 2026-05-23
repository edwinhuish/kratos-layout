/**
 * 命令执行工具模块
 * 提供命令执行和 Go 二进制安装的工具类
 */

import type { SpawnSyncOptions } from 'node:child_process';
import type { Logger } from './logger';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { BIN_DIR } from './const';

/** 默认 stdio 配置：静默 stdout，pipe stderr 以捕获错误信息 */
const DEFAULT_STDIO: SpawnSyncOptions['stdio'] = ['inherit', 'ignore', 'pipe'] as const;

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
   * 同步执行命令
   *
   * 默认静默执行（stdout 丢弃，stderr 捕获用于错误信息）。
   * 通过 `stdio` 选项控制输出行为：
   *
   * - `stdio: 'inherit'` — 输出实时流到控制台
   * - `stdio: ['inherit', process.stdout, 'pipe']` — stdout 写入自定义流
   * - `stdio: ['inherit', 'pipe', 'pipe']` — 捕获输出用于后续处理
   *
   * 命令失败时始终抛出异常。
   *
   * @example
   * // 默认静默
   * cmd.runSync('go', ['mod', 'tidy'])
   *
   * // 实时输出到控制台
   * cmd.runSync('go', ['test', '-v', './...'], { stdio: 'inherit' })
   *
   * // 通过 PassThrough 收集输出
   * const stream = new PassThrough()
   * let output = ''
   * stream.on('data', chunk => output += chunk)
   * cmd.runSync('go', ['version'], { stdio: ['inherit', stream, 'pipe'] })
   * stream.end()
   * console.log(output.trim())
   *
   * @param cmd - 要执行的命令
   * @param args - 命令参数
   * @param options - 执行选项，继承 SpawnSyncOptions
   */
  runSync(cmd: string, args: string[] = [], options: SpawnSyncOptions = {}): void {
    const { stdio = DEFAULT_STDIO, ...spawnOptions } = options;
    const envPath = options.env?.PATH || process.env.PATH;

    const result = spawnSync(cmd, args, {
      stdio,
      ...spawnOptions,
      env: { ...process.env, ...options.env, PATH: `${BIN_DIR}${path.delimiter}${envPath}` },
    });

    // 失败时从 stderr 构建错误信息
    if (result.status !== 0) {
      const stderr = result.stderr ? String(result.stderr).trim() : '';
      const detail = stderr || `exit code ${result.status}`;
      throw new Error(`Command ${cmd} failed: ${detail}`);
    }
  }

  /**
   * 安装 Go 二进制工具
   */
  async installGoBin(name: string, pkg: string, forceInstall = false): Promise<void> {
    if (name === '') {
      throw new Error(`Invalid package path: ${name}`);
    }

    if (isBinInstalled(name)) {
      if (!forceInstall) {
        return;
      }
      this.logger.warn(`  FORCE Installing ${name}...`);
    }
    else {
      this.logger.info(`  Installing ${name}...`);
    }

    this.runSync('go', ['install', pkg], { env: { GOBIN: BIN_DIR } });
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
