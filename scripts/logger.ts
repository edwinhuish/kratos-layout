/**
 * 日志工具模块
 * 提供带颜色输出的日志记录器，支持多种日志级别
 */

const isCI = process.env.CI === "true";

/**
 * 预定义颜色常量
 * CI 环境下颜色为空字符串，避免乱码
 */
const COLORS = {
  GREEN: isCI ? "" : "\x1b[1;32m",
  RED: isCI ? "" : "\x1b[1;31m",
  YELLOW: isCI ? "" : "\x1b[1;33m",
  CYAN: isCI ? "" : "\x1b[1;36m",
  PURPLE: isCI ? "" : "\x1b[1;35m",
  RESET: isCI ? "" : "\x1b[0m",
};

/**
 * 日志记录器类
 * 支持多种日志级别：success, error, warn, info, debug
 * 自动添加命名空间前缀，支持彩色输出
 */
class Logger {
  /** 日志前缀（命名空间） */
  prefix: string;

  /**
   * 创建日志记录器实例
   */
  constructor(ns?: string) {
    this.prefix = ns ? `[${ns}] ` : "";
  }

  /**
   * 输出成功消息（绿色）
   */
  success(message: string): void {
    console.log(
      `${this.prefix}${COLORS.GREEN}[SUCCESS]${COLORS.RESET} ${message}`,
    );
  }

  /**
   * 输出错误消息（红色）
   */
  error(message: string | Error): void {
    const msg = message instanceof Error ? message.message : message;
    console.error(`${this.prefix}${COLORS.RED}[ERROR]${COLORS.RESET} ${msg}`);
  }

  /**
   * 输出警告消息（黄色）
   */
  warn(message: string): void {
    console.warn(
      `${this.prefix}${COLORS.YELLOW}[WARN]${COLORS.RESET} ${message}`,
    );
  }

  /**
   * 输出信息消息（青色）
   */
  info(message: string): void {
    console.log(`${this.prefix}${COLORS.CYAN}[INFO]${COLORS.RESET} ${message}`);
  }

  /**
   * 输出调试消息（紫色）
   */
  debug(message: string): void {
    console.log(
      `${this.prefix}${COLORS.PURPLE}[DEBUG]${COLORS.RESET} ${message}`,
    );
  }
}

export { Logger };
