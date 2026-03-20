# 实施计划：从 PostgreSQL 迁移到 Cloudflare D1 (SQLite)

## 概述

将 Nuxt Target 项目从 PostgreSQL + PrismaPg 迁移到 Cloudflare D1 + @prisma/adapter-d1。

## 关键变更

| 组件 | 从 | 到 |
|-----|---|---|
| 数据库 | PostgreSQL | Cloudflare D1 (SQLite) |
| Prisma 适配器 | PrismaPg | @prisma/adapter-d1 |
| 连接方式 | DATABASE_URL | D1 Binding |
| 数组类型 | String[] (原生) | String (JSON) |

## 实施阶段

### 阶段 1：依赖和环境准备
1. 安装 @prisma/adapter-d1 和 wrangler
2. 创建 wrangler.toml 配置
3. 更新 .gitignore

### 阶段 2：Prisma Schema 修改
1. 将 datasource 从 postgresql 改为 sqlite
2. 将 Note.tags 从 String[] 改为 String（存储 JSON）
3. 重新生成 Prisma 客户端

### 阶段 3：数据库客户端重构
1. 重写 lib/main-prisma-client.ts 使用 D1 适配器
2. 添加环境检测逻辑（开发/生产）

### 阶段 4：API 适配
1. 创建 server/utils/tags.ts 工具函数
2. 修改笔记创建/更新 API（序列化 tags）
3. 修改笔记查询 API（反序列化 tags）
4. 创建 Prisma 扩展自动处理（可选）

### 阶段 5：Nuxt 配置更新
1. 更新 nuxt.config.ts 添加 Cloudflare 支持

### 阶段 6：数据库迁移
1. 生成本地 SQLite 迁移
2. 创建 D1 数据库
3. 执行 D1 迁移
4. 数据迁移脚本（如需要）

### 阶段 7：测试
1. 单元测试（tags 工具函数）
2. 集成测试（API 端点）
3. 端到端测试

### 阶段 8：部署
1. 配置 Cloudflare Pages
2. 环境变量配置

## 风险与缓解

| 风险 | 缓解措施 |
|-----|---------|
| SQLite 不支持数组类型 | 使用 JSON 字符串 + 工具函数 |
| D1 binding 获取方式不同 | 环境检测逻辑 |
| 数据迁移失败 | 测试环境验证 + 备份 |

## 成功标准

- [ ] Prisma schema 切换到 sqlite
- [ ] tags 字段正确序列化/反序列化
- [ ] 所有 API 测试通过
- [ ] 前端组件无需修改
- [ ] 本地开发环境正常
- [ ] D1 数据库配置成功
- [ ] 部署到 Cloudflare Pages

详细步骤和代码示例请参考 planner agent 的完整输出。
