/**
 * Help 脚本
 * 显示所有可用命令的帮助信息
 */

import { Logger } from '#/scripts/logger';

const logger = new Logger('backend');

/** 命令配置列表 */
const commands: Array<{ name: string; desc: string }> = [
  { name: 'lint', desc: '检查 protobuf 和 Go 代码（支持 --fix 自动修复）' },
  { name: 'format', desc: '格式化 protobuf 和 Go 代码' },
  { name: 'gen', desc: '生成代码（--proto/--service/--wire 可选）' },
  { name: 'clean', desc: '清理生成的代码文件' },
  { name: 'prepare', desc: '更新 buf 依赖并整理 Go 模块' },
  { name: 'update', desc: '更新 buf 依赖并升级 Go 模块到最新版本' },
  { name: 'dev', desc: '启动热重载开发服务器（使用 air）' },
  { name: 'build', desc: '编译 backend 应用为可执行文件' },
  { name: 'test', desc: '运行测试（支持传递 go test 参数）' },
  { name: 'help', desc: '显示帮助信息' },
];

/** 选项配置列表 */
const options: Array<{ name: string; desc: string }> = [
  { name: '--fix', desc: '自动修复格式问题（lint 命令）' },
  { name: '--proto', desc: '只处理 protobuf 相关（gen/lint 命令）' },
  { name: '--service', desc: '只处理 Go 代码（gen/lint 命令）' },
  { name: '--wire', desc: '只处理 Wire 代码（gen 命令）' },
];

logger.info('');
logger.info('📖 Kratos Backend 开发工具');
logger.info('');
logger.info('Usage: pnpm <command> [options]');
logger.info('');
logger.info('Commands:');
for (const cmd of commands) {
  logger.info(`  ${cmd.name.padEnd(12)} ${cmd.desc}`);
}
logger.info('');
logger.info('Options:');
for (const opt of options) {
  logger.info(`  ${opt.name.padEnd(12)} ${opt.desc}`);
}
logger.info('');
logger.info('Examples:');
logger.info('  pnpm lint           # 检查全部代码');
logger.info('  pnpm lint --fix    # 修复格式后检查');
logger.info('  pnpm gen --service # 只生成 service 文件');
logger.info('  pnpm dev           # 启动热重载开发服务器');
logger.info('  pnpm build         # 编译应用');
logger.info('  pnpm test          # 运行测试');
logger.info('  pnpm test -race    # 运行竞态检测测试');
logger.info('');
