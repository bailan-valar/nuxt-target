# Coding Agent 会话流程模板

本模板描述了 Coding Agent 在每次会话中应遵循的标准流程。

## 会话开始流程 (Session Start)

### 1. 确认工作目录

```bash
pwd
```

**目的**: 确认当前在正确的项目目录中。

### 2. 读取进度日志

```bash
# 读取最近 3 次会话的进度
tail -n 200 .claude/long-running/claude-progress.txt
```

**目的**: 了解最近的工作内容、遇到的问题、解决方案。

**关注点**:
- 上次会话完成了哪些功能?
- 是否有未完成的功能 (IN_PROGRESS)?
- 是否有遗留的问题需要解决?

### 3. 读取功能清单

```bash
# 读取功能清单
cat .claude/long-running/feature_list.json
```

**目的**: 查看所有待完成功能的状态。

**关注点**:
- 有多少功能处于 `status: "pending"`?
- 有多少功能处于 `status: "in_progress"`?
- 有多少功能处于 `status: "blocked"`?
- 优先级最高的待完成功能是什么?

### 4. 检查 Git 历史

```bash
# 查看最近 20 次提交
git log --oneline -20
```

**目的**: 了解最近的代码变更历史。

**关注点**:
- 最近提交的功能是什么?
- 提交信息是否清晰描述了变更内容?
- 是否有需要回退的提交?

### 5. 运行初始化脚本

```bash
# 运行环境初始化脚本
bash .claude/long-running/init.sh
```

**目的**: 检查环境、安装依赖、生成 Prisma Client。

**关注点**:
- 所有依赖是否已安装?
- Prisma Client 是否已生成?
- 端口 3000 是否可用?

### 6. 基础功能测试

**目的**: 确保应用未损坏,基础功能正常工作。

**测试步骤**:
1. 启动开发服务器 (在另一个终端): `npm run dev`
2. 访问 http://localhost:3000
3. 测试核心功能:
   - 用户登录
   - 创建一条测试数据 (账单/任务)
   - 查看数据列表
   - 编辑数据
   - 删除数据

**如果测试失败**:
- 优先修复问题,而非实现新功能
- 检查最近的 git commit,考虑回退
- 在 progress file 中详细记录问题和解决方案

---

## 工作流程 (Work Flow)

### 1. 选择功能

从 `feature_list.json` 中选择一个功能:

**选择标准**:
1. `status: "pending"` (待处理)
2. `priority` 最高 (5 > 4 > 3 > 2 > 1)
3. 没有未完成的 `dependencies` (依赖功能已完成)
4. 不是 `status: "blocked"` (被阻塞)

**如果有 `status: "in_progress"` 的功能**:
- 优先继续完成该功能
- 从 `notes` 中查看上次停止的位置

### 2. 实现功能

按照功能的 `steps` 逐步实现:

**对于每个步骤**:
1. 阅读 `description` 了解要做什么
2. 查看 `files_to_modify` 了解需要修改哪些文件
3. 实现该步骤
4. 运行 `test_command` 验证
5. 检查 `expected_result` 是否达成

**注意事项**:
- 每次会话只处理一个功能
- 不要跳过步骤
- 不要同时修改多个功能
- 保持代码整洁,添加必要的注释

### 3. 端到端测试

**目的**: 验证功能完整可用,而非仅仅代码编译通过。

**测试方法**:
- 手动测试: 像真实用户一样操作应用
- 单元测试: 运行 `npm run test`
- 集成测试: 测试 API 端点
- E2E 测试: 使用 Playwright (如果已配置)

**测试通过标准**:
- 所有步骤的 `expected_result` 都达成
- 没有控制台错误
- 没有 TypeScript 类型错误
- 没有 Linting 错误
- Build 成功: `npm run build`

### 4. 更新功能状态

**如果功能完成**:

编辑 `feature_list.json`:
```json
{
  "id": "feat-xxx",
  "status": "completed",
  "passes": 1,
  "last_tested": "2026-02-14T16:30:00+08:00",
  "last_session": "session-008",
  "actual_time": "3.5h"
}
```

**如果功能未完成**:

编辑 `feature_list.json`:
```json
{
  "id": "feat-xxx",
  "status": "in_progress",
  "last_session": "session-008",
  "notes": [
    "已完成步骤 1-3",
    "步骤 4 遇到问题: XXX",
    "下次继续: 解决 XXX 问题后完成步骤 4-5"
  ]
}
```

### 5. Git 提交

**提交信息格式**:
```
<type>: <description>

<optional body>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**示例**:
```bash
git add .
git commit -m "$(cat <<'EOF'
feat: 实现账单批量导入功能

- 创建 BaseFileUploader 组件
- 实现 CSV 解析逻辑 (papaparse)
- 创建字段映射界面
- 实现批量导入 API
- 端到端测试通过

Closes feat-001

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

### 6. 更新进度日志

追加到 `claude-progress.txt`:

```bash
cat >> .claude/long-running/claude-progress.txt <<'EOF'

================================================================================
SESSION: 008 | DATE: 2026-02-14T16:30:00+08:00
================================================================================

## 会话目标
完成账单批量导入功能 (feat-001)

## 完成的工作
- [COMPLETED] feat-001: 账单批量导入功能
  - 修改文件:
    - app/components/base/FileUploader.vue (新建)
    - app/composables/useCsvParser.ts (新建)
    - app/components/bills/ImportMappingDialog.vue (新建)
    - server/api/yimu-bills/import.post.ts (修改)
  - 测试结果: PASS (5/5 步骤完成)
  - 提交哈希: a1b2c3d4
  - 耗时: 3.5h (预估 4h)

## 遇到的问题
1. papaparse 类型定义不完整
   - 解决方案: 安装 @types/papaparse
   - 参考资料: https://www.npmjs.com/package/@types/papaparse

## 测试结果
- 单元测试: 12/12 passed
- 集成测试: 3/3 passed
- E2E 测试: 未实施
- 手动测试: 上传 100 条账单 CSV → 成功导入 100 条

## 代码质量
- Linting: PASS
- Type checking: PASS
- Build: PASS

## 下次会话计划
1. feat-002: 优化 CRDT 冲突解决逻辑

## 备注
- FileUploader 组件可复用于其他导入场景

================================================================================
END OF SESSION 008
================================================================================

EOF
```

---

## 严格约束 (Critical Constraints)

### ⚠️ 必须遵守的规则

1. **每次会话只处理一个功能**
   - 不要同时实现多个功能
   - 不要在完成当前功能前开始新功能

2. **必须端到端测试**
   - 不要仅仅检查代码编译通过
   - 必须像真实用户一样测试功能
   - 测试通过才能标记 `status: "completed"`

3. **严禁修改 feature_list.json 的结构**
   - 只能修改功能的 `status`, `passes`, `last_tested`, `last_session`, `actual_time`, `notes`
   - 不能删除功能
   - 不能修改功能的 `steps`
   - 不能修改 `locked: true` 的功能

4. **会话结束时代码必须可合并**
   - 没有 bug
   - 没有编译错误
   - 没有 linting 错误
   - 有必要的注释和文档

5. **必须更新进度日志**
   - 每次会话结束时追加到 `claude-progress.txt`
   - 记录完成的工作、遇到的问题、解决方案

---

## 错误恢复机制

### 如果发现应用损坏

1. **停止实现新功能**
2. **检查最近的 git commit**:
   ```bash
   git log --oneline -10
   git diff HEAD~1
   ```
3. **考虑回退有问题的提交**:
   ```bash
   git revert <commit_hash>
   ```
4. **修复问题**
5. **重新测试基础功能**
6. **在 progress file 中详细记录问题和解决方案**

### 如果遇到阻塞问题

1. **更新功能状态为 `blocked`**:
   ```json
   {
     "id": "feat-xxx",
     "status": "blocked",
     "notes": [
       "BLOCKED: 需要 XXX 才能继续",
       "临时方案: YYY"
     ]
   }
   ```
2. **在 progress file 中记录阻塞原因**
3. **选择另一个功能继续工作**

---

## 会话结束检查清单

在结束会话前,确认以下事项:

- [ ] 功能已实现并测试通过
- [ ] `feature_list.json` 已更新
- [ ] Git commit 已创建 (描述性提交信息)
- [ ] `claude-progress.txt` 已更新
- [ ] 代码质量检查通过 (linting, type check, build)
- [ ] 没有遗留的 console.log 或调试代码
- [ ] 没有未提交的文件
- [ ] 应用处于可运行状态

---

## 下次会话准备

在结束当前会话时,为下次会话做好准备:

1. **在 progress file 中记录下次会话计划**
2. **如果有未完成的功能,在 notes 中说明下次继续的位置**
3. **如果有阻塞问题,说明需要什么才能解除阻塞**

这样下次会话开始时,可以快速了解应该做什么。
