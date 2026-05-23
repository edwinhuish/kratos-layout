/**
 * Generate 脚本
 * 使用 buf 工具从 protobuf 文件生成代码，并生成 Wire 依赖注入代码
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { Command } from '#/scripts/cmd';
import { ROOT_DIR } from '#/scripts/const';
import { Logger } from '#/scripts/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_DIR = path.resolve(__dirname, '..');

const logger = new Logger('backend');
const cmd = new Command(logger);

const args = process.argv.slice(2);
const runAll = !args.includes('--proto') && !args.includes('--service') && !args.includes('--wire');
const runProto = runAll || args.includes('--proto');
const runService = runAll || args.includes('--service');
const runWire = runAll || args.includes('--wire');

/**
 * 查找指定目录下的所有 .proto 文件
 */
function findProtoFiles(dir: string): string[] {
  const protoFiles: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      protoFiles.push(...findProtoFiles(fullPath));
    }
    else if (entry.name.endsWith('.proto')) {
      protoFiles.push(fullPath);
    }
  }
  return protoFiles;
}

/**
 * 生成 protobuf 代码
 */
function genProto(): void {
  logger.info('Generating protobuf code...');

  try {
    cmd.runSync('buf', ['generate']);
    logger.success('Protobuf code generated');
  }
  catch (error) {
    logger.error(`buf generate 执行失败: ${(error as Error).message}`);
    process.exit(1);
  }
}

/**
 * 从 API 项目生成 Backend 服务文件
 */
function genService(): void {
  logger.info('Generating Backend services...');

  const apiDir = path.join(ROOT_DIR, 'apps', 'api');
  if (!fs.existsSync(apiDir)) {
    logger.error(`API directory not found: ${apiDir}`);
    process.exit(1);
  }

  const serviceDir = path.join(APP_DIR, 'internal', 'service');
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  const protoFiles = findProtoFiles(apiDir);

  for (const protoFile of protoFiles) {
    const fileDir = path.dirname(protoFile);
    const fileName = path.basename(protoFile);
    const version = path.basename(fileDir);
    const serviceName = fileName.replace('.proto', '');

    if (version && serviceName) {
      const serviceFile = path.join(APP_DIR, 'internal', 'service', `s_${serviceName}.go`);

      logger.info(`Processing proto file: ${protoFile}`);

      if (!fs.existsSync(serviceFile)) {
        logger.info(`Generating service file: s_${serviceName}.go (Version: ${version})`);

        try {
          cmd.runSync('kratos', ['proto', 'server', protoFile, '-t', serviceDir], { cwd: APP_DIR, stdio: 'inherit' });
        }
        catch (error) {
          logger.error(`Failed to generate service for ${protoFile}: ${(error as Error).message}`);
          continue;
        }

        const generatedFileName = `${serviceName.replace(/_/g, '')}service.go`;
        const generatedFile = path.join(APP_DIR, 'internal', 'service', generatedFileName);

        if (fs.existsSync(generatedFile)) {
          fs.renameSync(generatedFile, serviceFile);
        }
      }
    }
  }

  logger.success('Service generated');
}

/**
 * 生成 Wire 依赖注入代码
 */
function genWire(): void {
  logger.info('Generating Wire dependency injection code...');

  try {
    cmd.runSync('wire', [], { cwd: path.join(APP_DIR, 'cmd', 'server') });
  }
  catch (error) {
    logger.error(`Failed to generate wire code: ${(error as Error).message}`);
    process.exit(1);
  }

  logger.success('Wire code generated');
}

if (runProto) {
  genProto();
}

if (runService) {
  genService();
}

if (runWire) {
  genWire();
}
