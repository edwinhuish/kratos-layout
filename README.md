# Kratos Layout

基于 [Go-Kratos](https://github.com/go-kratos/kratos) 微服务框架的 monorepo 模板项目，采用 pnpm workspace + Go workspace 双工作区架构，统一管理 API 定义和后端服务。

## 项目结构

```
kratos-layout/
├── apps/
│   ├── api/                  # API 定义层 (Protobuf)
│   └── backend/              # 后端服务 (Go/Kratos)
├── bin/                      # 预编译的 Go 工具链
├── scripts/                  # 全局共享脚本工具库 (TypeScript)
├── buf.work.yaml             # Buf 工作区配置
├── go.work                   # Go 工作区配置
├── package.json              # pnpm 根配置
├── pnpm-workspace.yaml       # pnpm 工作区配置
└── tsconfig.json             # 全局 TypeScript 配置
```

### apps/api — API 定义层

集中管理所有 Protobuf API 定义，并生成多语言客户端代码。

| 目录/文件 | 说明 |
|-----------|------|
| `proto/helloworld/v1/` | Protobuf 服务定义（含 HTTP 注解） |
| `buf.yaml` | Buf 模块配置，依赖 `googleapis` 和 `protovalidate` |
| `buf.gen.yaml` | 代码生成配置（6 个插件） |

**代码生成插件：**

| 插件 | 输出目录 | 说明 |
|------|---------|------|
| `protoc-gen-go` | `gen/go/` | Go protobuf 消息代码 |
| `protoc-gen-go-grpc` | `gen/go/` | Go gRPC 服务端/客户端代码 |
| `protoc-gen-go-http` | `gen/go/` | Kratos HTTP 服务端代码 |
| `protoc-gen-go-errors` | `gen/go/` | Kratos 错误枚举代码 |
| `protoc-gen-openapi` | `gen/openapi/` | OpenAPI 3.0 规范 |
| `protoc-gen-typescript-http` | `gen/ts/` | TypeScript HTTP 客户端代码 |

### apps/backend — 后端服务

Kratos 微服务实现，遵循经典的 Kratos 分层架构：

```
apps/backend/
├── cmd/server/               # 入口 + Wire 依赖注入
│   ├── main.go               # 程序入口
│   ├── wire.go               # Wire 注入声明
│   └── wire_gen.go           # Wire 自动生成
├── configs/
│   └── config.yaml           # 服务配置
├── internal/
│   ├── conf/                 # 配置结构定义 (Protobuf)
│   ├── data/                 # 数据访问层（Repository 实现）
│   ├── biz/                  # 业务逻辑层（UseCase）
│   ├── service/              # 服务层（Protobuf 服务实现）
│   └── server/               # 传输层（HTTP/gRPC）
├── Dockerfile
└── .air.toml                 # Air 热重载配置
```

**依赖注入链（Wire）：**

```
conf.Server + conf.Data + log.Logger
  → data.NewData → data.NewGreeterRepo
    → biz.NewGreeterUsecase
      → service.NewGreeterService
        → server.NewGRPCServer + server.NewHTTPServer
          → newApp (kratos.App)
```

## 环境要求

- **Go** 1.24+
- **Node.js** 20+
- **pnpm** 10.33.0+

无需手动安装 Go 工具链（kratos、buf、wire、air 等），所有工具预编译到 `bin/` 目录，脚本自动将其加入 `PATH`。

## 快速开始

```bash
# 安装 Node.js 依赖
pnpm install

# 初始化环境（安装 Go 工具到 bin/ + buf dep update + go mod tidy）
pnpm prepare
```

## 常用命令

所有命令通过 pnpm 在根目录递归执行到各子应用：

```bash
pnpm lint       # 代码检查（buf lint + golangci-lint）
pnpm format     # 代码格式化（buf format + golangci-lint fix）
pnpm gen        # 代码生成（proto + service + wire）
pnpm clean      # 清理生成文件
pnpm prepare    # 初始化环境
pnpm update     # 更新依赖
pnpm dev        # 启动热重载开发服务
pnpm build      # 编译项目
pnpm test       # 运行测试
pnpm help       # 查看帮助
```

也可以在子应用目录下单独执行：

```bash
cd apps/api && pnpm gen      # 仅生成 API 代码
cd apps/backend && pnpm dev  # 启动后端热重载
```

### 后端子命令

`apps/backend` 的 `gen` 命令支持分项执行：

```bash
cd apps/backend
pnpm gen --proto      # 仅生成 proto 代码
pnpm gen --service    # 仅生成 service 文件
pnpm gen --wire       # 仅生成 wire 代码
```

`apps/backend` 的 `lint` 命令支持分项执行：

```bash
cd apps/backend
pnpm lint --proto     # 仅检查 proto
pnpm lint --service   # 仅检查 Go 服务代码
pnpm lint --wire      # 仅检查 wire 相关
```

## 运行服务

### 热重载开发

```bash
cd apps/backend && pnpm dev
```

服务启动后：
- HTTP: `http://localhost:8000`
- gRPC: `localhost:9000`

### 手动编译运行

```bash
cd apps/backend
pnpm build
./bin/server -conf ./configs
```

### Docker

```bash
cd apps/backend
docker build -t kratos-backend .
docker run --rm -p 8000:8000 -p 9000:9000 -v $(pwd)/configs:/data/conf kratos-backend
```

## API 开发流程

1. 在 `apps/api/proto/` 下定义或修改 Protobuf 文件
2. 执行 `pnpm gen` 生成代码（Go、TypeScript、OpenAPI）
3. 后端通过 Go Workspace 直接引用 `api/gen/go/` 下的生成代码
4. 在 `apps/backend/internal/service/` 中实现服务逻辑

## 添加前端项目

所有应用统一放在 `apps/*` 下，`pnpm-workspace.yaml` 已配置 `apps/*` 路径，新增的前端项目会自动被 pnpm 识别。

### 1. 初始化前端应用

在 `apps/` 目录下使用脚手架创建前端项目：

**Vite + React：**

```bash
cd apps
pnpm create vite web --template react-ts
cd web
pnpm install
```

**Vite + Vue：**

```bash
cd apps
pnpm create vite web --template vue-ts
cd web
pnpm install
```

**Next.js：**

```bash
cd apps
pnpm create next-app@latest web --ts --app --src-dir --no-tailwind --import-alias "@/*"
cd web
pnpm install
```

创建完成后，确认 `package.json` 中的 `name` 字段使用 workspace 范围名（如 `@kratos/web`），便于内部引用：

```json
{
  "name": "@kratos/web"
}
```

### 2. 配置项目间内部依赖

使用 pnpm 的 `workspace:*` 协议引用 workspace 内部的其他项目：

```bash
# 在前端应用中添加对 API 项目的依赖
cd apps/web
pnpm add @kratos/api@workspace:*
```

这会在 `apps/web/package.json` 中生成：

```json
{
  "dependencies": {
    "@kratos/api": "workspace:*"
  }
}
```

pnpm 会自动软链接到本地项目，修改被依赖项目的代码后前端应用实时生效。

### 3. 引用 API 生成的 TypeScript 客户端

`apps/api` 生成的 TypeScript HTTP 客户端（`gen/ts/`）可被前端项目直接引用。确保 `apps/api/package.json` 中配置了正确的 `exports`：

```json
{
  "name": "@kratos/api",
  "exports": {
    "./ts/*": "./gen/ts/*"
  }
}
```

使用方式：

```tsx
import { createGreeterClient } from '@kratos/api/ts/helloworld/v1';

const client = createGreeterClient('http://localhost:8000');
const res = await client.sayHello({ name: 'World' });
```

### 4. 安装依赖与验证

```bash
# 回到项目根目录，安装所有工作区依赖
pnpm install

# 启动前端开发服务
cd apps/web && pnpm dev

# 构建前端项目
cd apps/web && pnpm build

# 构建全部
pnpm -r build
```

## 工具链

所有 Go 工具预编译到 `bin/` 目录，由 `scripts/env.ts` 统一管理：

| 工具 | 用途 |
|------|------|
| `kratos` | 项目脚手架和 proto 代码生成 |
| `buf` | Protobuf 管理和代码生成 |
| `air` | 热重载开发 |
| `wire` | 编译期依赖注入代码生成 |
| `protoc-gen-go` | Go protobuf 代码生成 |
| `protoc-gen-go-grpc` | Go gRPC 代码生成 |
| `protoc-gen-go-http` | Kratos HTTP 代码生成 |
| `protoc-gen-go-errors` | Kratos 错误码生成 |
| `protoc-gen-openapi` | OpenAPI 文档生成 |
| `protoc-gen-typescript-http` | TypeScript HTTP 客户端生成 |
| `golangci-lint` | Go 代码检查 |

环境初始化使用原子锁文件（`bin/.env.lock`）防止多进程并发安装。

## CI

项目使用 GitHub Actions（`.github/workflows/go.yml`），在 push/PR 到 main 分支时自动执行：

1. 安装 Go 和 Node.js
2. `pnpm install --frozen-lockfile`
3. `pnpm prepare`
4. `go build -v ./...`
5. `go test -v ./...`

## 工作区配置

- **pnpm workspace**（`pnpm-workspace.yaml`）：`apps/*` 下所有子应用（后端、API、前端等）
- **Go workspace**（`go.work`）：`./apps/api` + `./apps/backend`，backend 可直接 import api 生成的 Go 代码
- **Buf workspace**（`buf.work.yaml`）：统一管理两个 buf 模块

## 许可证

[MIT](./LICENSE)
