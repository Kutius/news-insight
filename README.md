# News Insight

News Insight 是一个基于 Cloudflare Workers 构建的自动化新闻资讯服务。它会定期从指定新闻源（当前为 36kr.com）获取最新资讯，利用 AI (Google Gemini) 对新闻内容进行总结和分析，并将生成的报告通过邮件发送给订阅用户。

## ✨ 功能特性

- **自动新闻获取**：从指定 RSS Feed (36kr.com) 拉取最新新闻。
- **AI 智能分析**：使用 Google Gemini 模型对新闻内容进行摘要和分析。
- **邮件报告发送**：通过 Resend 服务将分析报告以 HTML 格式邮件发送给用户。
- **定时任务**：基于 Cloudflare Workers Cron Triggers 实现定时执行。
- **Hono 框架**：使用轻量级的 Hono 框架处理 HTTP 请求 (虽然当前主要通过定时任务触发)。

## 🛠️ 技术栈

- **Cloudflare Workers**: 服务运行环境
- **Hono**: Web 框架
- **Google Gemini**: AI 内容分析
- **Resend**: 邮件发送服务
- **Ky**: HTTP 请求库
- **MarkdownIt**: Markdown 到 HTML 转换
- **TypeScript**: 主要编程语言
- **Wrangler**: Cloudflare Workers CLI

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

项目依赖以下环境变量，请在 Cloudflare Workers 的配置中或本地开发时通过 `.dev.vars` (Wrangler 自动创建) 文件进行设置：

- `RESEND_KEY`: Resend API 密钥。
- `OPENAI_KEY`: Google AI Studio API 密钥 (用于 Gemini)。
- `EMAIL_LIST`: 接收邮件报告的邮箱列表，多个邮箱用逗号分隔。

### 3. 本地开发

```bash
npm run dev
```

这将启动一个本地开发服务器。

### 4. 生成 Cloudflare 绑定类型 (可选)

为了在 TypeScript 中获得更好的类型提示，特别是对于环境变量等绑定，可以运行：

```bash
npm run cf-typegen
```

然后，在 `src/index.ts` 中，可以像这样将 `CloudflareBindings` 作为泛型传递给 `Hono`：

```ts
// src/index.ts
import { Hono } from 'hono'

const app = new Hono<{ Bindings: CloudflareBindings }>()
```

### 5. 部署到 Cloudflare Workers

```bash
npm run deploy
```

## ⚙️ 主要脚本命令

- `npm run dev`: 启动本地开发服务器。
- `npm run deploy`: 将应用部署到 Cloudflare Workers。
- `npm run cf-typegen`: 生成 Cloudflare 绑定的 TypeScript 类型定义。

## 📁 项目结构

```
.
├── src/
│   └── index.ts       # 主要的应用逻辑和 Cloudflare Worker 入口
├── .gitignore
├── README.md          # 本文档
├── eslint.config.mjs  # ESLint 配置文件
├── package.json       # 项目依赖和脚本
├── tsconfig.json      # TypeScript 配置文件
└── wrangler.jsonc     # Wrangler 配置文件
```

## 🤝 贡献

欢迎提交 Pull Requests 或 Issues。

## License

[MIT](./LICENSE) License © [Kutius](https://github.com/kutius)