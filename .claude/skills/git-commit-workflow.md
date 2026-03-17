# Git Commit Workflow Skill

## 描述
自动化git提交流程,确保每次任务执行后都按照规范格式提交代码。

## 提交流程

### 步骤
1. 执行任务(代码修改、功能开发、bug修复等)
2. 记录任务开始时间和结束时间
3. 计算执行时长
4. 按照标准格式提交

### 提交格式
```
[类型]提交信息-执行时长
```

### 提交类型
- `feat` - 新功能
- `fix` - Bug修复
- `refactor` - 代码重构
- `docs` - 文档更新
- `test` - 测试相关
- `chore` - 构建/工具相关
- `perf` - 性能优化
- `ci` - CI/CD相关

### 示例
- `[feat]添加目标管理功能-15min`
- `[fix]修复登录验证错误-2min`
- `[refactor]优化文件夹层级结构-8min`
- `[docs]更新API文档-3min`
- `[test]添加用户认证测试-12min`

## 执行时机

**自动触发条件:**
- ✅ 任何代码修改完成
- ✅ 功能开发完成
- ✅ Bug修复完成
- ✅ 重构完成
- ✅ 测试编写完成

**例外情况(不需要提交):**
- ❌ 代码读取操作
- ❌ 仅分析未修改
- ❌ 用户明确要求不提交

## 时长计算

### 时间单位
- `<1min` - 小于1分钟
- `Xmin` - X分钟(1-59分钟)
- `XhYmin` - X小时Y分钟(60分钟以上)

### 计算方法
```typescript
const startTime = Date.now()
// ... 执行任务 ...
const endTime = Date.now()
const duration = endTime - startTime
const durationFormatted = formatDuration(duration)
```

## 集成方式

### PostToolUse Hook
在每次Edit、Write工具使用后自动检查并提交:

```json
{
  "postToolUse": [
    {
      "pattern": "git-auto-commit",
      "command": "检查修改文件并按格式提交",
      "condition": "代码已修改"
    }
  ]
}
```

## 最佳实践

1. **原子性提交** - 一个任务一个提交,不要混入多个不相关的修改
2. **描述清晰** - 提交信息应该清楚说明做了什么
3. **时长准确** - 记录实际执行时间,不夸大不缩小
4. **类型正确** - 选择最合适的提交类型
5. **及时提交** - 任务完成后立即提交,不要延迟

## 安全检查

提交前必须确认:
- [ ] 代码已通过类型检查(TypeScript)
- [ ] 没有console.log调试语句
- [ ] 没有硬编码的敏感信息
- [ ] 代码格式化完成
- [ ] 符合项目编码规范

## 触发命令

```
/skill git-commit-workflow
```

或者配置为自动触发:
```json
{
  "hooks": {
    "postToolUse": {
      "enabled": true,
      "pattern": "git-commit-workflow"
    }
  }
}
```
