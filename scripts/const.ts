/**
 * 环境配置模块
 * 定义项目常量和环境初始化函数
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

/** 项目根目录路径 */
export const ROOT_DIR: string = __dirname;

/** 二进制文件目录路径（用于存放 go install 安装的工具） */
export const BIN_DIR: string = path.join(ROOT_DIR, 'bin');
