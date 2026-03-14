# Long-Running Agent System

基于 Anthropic 文章 ["Effective harnesses for long-running agents"](https://www.anthropic.com/research/effective-harnesses) 实现的长时间运行机制,使 Claude Code 能够跨多个会话持续工作。

## 快速开始

### 首次使用 (Initializer Agent)

1. **阅读 Initializer Agent Prompt**
   ```bash
   cat .claude/prompts/initializer-agent.md
   ```

2. **与 Claude 对话,收集项目需求**
   - 项目类型和核心功能
   - 技术栈和架构
   - 用户角色和权限
   - 非功能需求

3. **生成功能清单**
   - Claude 会生成 200+ 条细粒度功能
   - 保存到 `feature_list.json`

4. **创建初始文件**
   - `feature_list.json` - 功能清单
   - `claude-progress.txt` - 进度日志
   - `init.sh` - 环境初始化脚本

### 后续会话 (Coding Agent)

1. **运行会话开始脚本**
   ```bash
   bash .claude/scripts/start-session.sh
   ```

2. **阅读 Coding Agent Prompt**
   ```bash
   cat .claude/prompts/coding-agent.md
   ```

3. **按照标准流程工作**
   - 确认工作目录: `pwd`
   - 读取进度日志: `tail -n 200 .claude/long-running/claude-progress.txt`
   - 读取功能清单: `cat .claude/long-running/feature_list.json`
   - 检查 Git 历史: `git log --oneline -20`
   - 运行初始化脚本: `bash .claude/long-running/init.sh`
   - 测试基础功能

4. **增量式实现功能**
   - 选择一个 `status: "pending"` 的功能
   - 按照 `steps` 逐步实现
   - 端到端测试
   - 更新 `feature_list.json`
   - Git 提交
   - 更新 `claude-progress.txt`

5. **运行会话结束脚本**
   ```bash
   bash .claude/scripts/end-session.sh
   ```

## 文件结构

```
.claude/
├── long-running/
│   ├── feature_list.json          # 功能清单 (核心)
│   ├── claude-progress.txt        # 进度日志 (核心)
│   ├── init.sh                    # 环境初始化脚本
│   ├── session-template.md        # 会话流程模板
│   └── feature_list.example.json  # 示例功能清单
├── prompts/
│   ├── initializer-agent.md       # Initializer Agent 提示词
│   └── coding-agent.md            # Coding Agent 提示词
└── scripts/
    ├── start-session.sh           # 会话开始脚本
    ├── end-session.sh             # 会话结束脚本
    └── check-progress.sh          # 进度检查脚本
```

## 核心概念

### 1. Feature List (功能清单)

**文件**: `.claude/long-running/feature_list.json`

结构化的功能清单,包含 200+ 条细粒度功能。

**功能状态**:
- `pending` - 待处理
- `in_progress` - 进行中
- `completed` - 已完成
- `blocked` - 已阻塞

**关键字段**:
```json
{
  "id": "feat-001",
  "title": "账单批量导入功能",
  "status": "pending",
  "priority": 4,
  "steps": [
    {
      "step_number": 1,
      "description": "创建文件上传组件",
      "files_to_modify": ["app/components/base/FileUploader.vue"],
      "test_command": "npm run dev",
      "expected_result": "组件可以选择并预览文件"
    }
  ],
  "estimated_time": "4h",
  "actual_time": null
}
```

**⚠️ 严格约束**:
- ✅ 可以修改: `status`, `passes`, `last_tested`, `last_session`, `actual_time`, `notes`
- ❌ 不能修改: `id`, `title`, `description`, `steps`, `dependencies`, `estimated_time`
- ❌ 不能删除功能
- ❌ 不能修改 `locked: true` 的功能

### 2. Progress File (进度日志)

**文件**: `.claude/long-running/claude-progress.txt`

纯文本格式的进度日志,记录每次会话的工作内容。

**格式**:
```
================================================================================
SESSION: 001 | DATE: 2026-02-14T16:30:00+08:00
================================================================================

## 会话目标
完成账单批量导入功能 (feat-001)

## 完成的工作
- [COMPLETED] feat-001: 账单批量导入功能
  - 修改文件: app/components/base/FileUploader.vue, ...
  - 测试结果: PASS
  - 提交哈希: a1b2c3d4
  - 耗时: 3.5h

## 遇到的问题
1. papaparse 类型定义不完整
   - 解决方案: 安装 @types/papaparse

## 测试结果
- 单元测试: 12/12 passed
- 手动测试: 上传 100 条账单 CSV → 成功导入

## 代码质量
- Linting: PASS
- Type checking: PASS
- Build: PASS

## 下次会话计划
1. feat-002: 优化 CRDT 冲突解决逻辑

================================================================================
END OF SESSION 001
================================================================================
```

### 3. Init Script (初始化脚本)

**文件**: `.claude/long-running/init.sh`

环境初始化脚本,在每次会话开始时运行。

**功能**:
- 检查 Node.js, npm, PostgreSQL
- 安装依赖 (如果需要)
- 生成 Prisma Client
- 检查端口 3000 占用情况
- 显示环境信息摘要

### 4. Session Template (会话模板)

**文件**: `.claude/long-running/session-template.md`

标准会话流程模板,描述 Coding Agent 应遵循的流程。

**流程**:
1. 会话开始流程 (6 步)
2. 工作流程 (6 步)
3. 严格约束
4. 错误恢复机制
5. 会话结束检查清单

## 辅助脚本

### start-session.sh

显示当前进度摘要,帮助快速了解项目状态。

**输出**:
- 会话编号
- 功能完成统计
- 最近会话摘要
- 下一个待处理功能
- 最近 Git 提交
- 下一步提示

**使用**:
```bash
bash .claude/scripts/start-session.sh
```

### end-session.sh

提示完成会话结束流程。

**输出**:
- 会话结束检查清单
- 代码质量检查
- 本次会话统计
- Git commit 模板
- Progress file 模板

**使用**:
```bash
bash .claude/scripts/end-session.sh
```

### check-progress.sh

显示详细的进度统计。

**输出**:
- 总体进度
- 分类统计
- 时间统计
- 最近会话
- 最近 Git 提交
- 进行中的功能
- 已阻塞的功能
- 下一个待处理功能

**使用**:
```bash
bash .claude/scripts/check-progress.sh
```

**依赖**: 需要安装 `jq` (JSON 解析工具)
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Windows (Git Bash)
# 下载 jq.exe 并放到 PATH 中
# https://stedolan.github.io/jq/download/
```

## 工作流程

### 完整的会话示例

```bash
# 1. 会话开始
bash .claude/scripts/start-session.sh

# 2. 确认工作目录
pwd

# 3. 读取进度日志
tail -n 200 .claude/long-running/claude-progress.txt

# 4. 读取功能清单
cat .claude/long-running/feature_list.json

# 5. 检查 Git 历史
git log --oneline -20

# 6. 运行初始化脚本
bash .claude/long-running/init.sh

# 7. 启动开发服务器 (在新终端)
npm run dev

# 8. 测试基础功能
# 访问 http://localhost:3000
# 测试登录、创建数据、查看列表等

# 9. 选择功能并实现
# 从 feature_list.json 选择 status=pending 的功能
# 按照 steps 逐步实现

# 10. 端到端测试
npm run test
npm run lint
npx tsc --noEmit
npm run build

# 11. 更新功能状态
# 编辑 feature_list.json

# 12. Git 提交
git add .
git commit -m "feat: 实现账单批量导入功能

Closes feat-001

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 13. 更新进度日志
# 追加到 claude-progress.txt

# 14. 会话结束
bash .claude/scripts/end-session.sh
```

## 最佳实践

### 1. 增量式工作

- ✅ 每次会话只处理一个功能
- ✅ 按照 steps 逐步实现
- ❌ 不要同时实现多个功能
- ❌ 不要跳过步骤

### 2. 端到端测试

- ✅ 像真实用户一样测试功能
- ✅ 测试所有步骤的 expected_result
- ✅ 测试边缘情况
- ❌ 不要仅仅检查代码编译通过

### 3. 清晰记录

- ✅ 每次会话结束时更新 feature_list.json
- ✅ 追加到 claude-progress.txt
- ✅ 创建描述性的 git commit
- ❌ 不要忘记记录遇到的问题和解决方案

### 4. 代码质量

- ✅ 运行 linting, type check, build
- ✅ 保持代码整洁,添加必要的注释
- ✅ 遵循项目的编码规范
- ❌ 不要留下 console.log 或调试代码

## 故障排除

### 应用损坏

如果发现应用损坏:
1. 停止实现新功能
2. 检查最近的 git commit: `git log --oneline -10`
3. 考虑回退有问题的提交: `git revert <commit_hash>`
4. 修复问题
5. 重新测试基础功能
6. 在 progress file 中详细记录问题和解决方案

### 功能被阻塞

如果遇到阻塞问题:
1. 更新功能状态为 `blocked`
2. 在 notes 中说明阻塞原因
3. 在 progress file 中记录阻塞原因
4. 选择另一个功能继续工作

### 上下文窗口即将耗尽

如果上下文窗口即将耗尽:
1. 立即停止当前工作
2. 更新功能状态为 `in_progress`
3. 在 notes 中详细说明当前进度和下次继续的位置
4. 提交当前代码 (即使功能未完成)
5. 更新 progress file

## 参考资料

- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses)
- [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Autonomous Coding Quickstart](https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request!

---

**祝编码愉快! 🚀**
