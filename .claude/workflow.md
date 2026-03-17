# 项目工作流程配置

## Git 提交规范

本项目遵循严格的git提交流程,每次代码修改后必须按以下格式提交:

```
[类型]提交信息-执行时长
```

### 提交类型映射表

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `[feat]添加用户登录功能-15min` |
| `fix` | Bug修复 | `[fix]修复导航栏显示问题-2min` |
| `refactor` | 代码重构 | `[refactor]优化数据获取逻辑-8min` |
| `docs` | 文档更新 | `[docs]更新README安装说明-3min` |
| `test` | 测试相关 | `[test]添加登录单元测试-12min` |
| `chore` | 构建/工具 | `[chore]升级依赖版本-5min` |
| `perf` | 性能优化 | `[perf]优化页面加载速度-10min` |
| `ci` | CI/CD | `[ci]配置GitHub Actions-6min` |

### 时间格式规则

- 小于1分钟: `<1min`
- 1-59分钟: `Xmin` (如: `2min`, `15min`, `45min`)
- 60分钟以上: `XhYmin` (如: `1h15min`, `2h30min`)

### 自动化检查清单

每次提交前自动检查:
- [x] TypeScript类型检查通过
- [x] 无console.log调试语句
- [x] 无硬编码敏感信息
- [x] 代码已格式化
- [x] 符合项目编码规范

### Claude Code 工作流程

1. **接收任务** → 记录开始时间
2. **执行任务** → 代码修改/功能开发
3. **质量检查** → 类型检查、代码审查
4. **提交代码** → 按规范格式提交
5. **记录时长** → 计算并附加到提交信息

### 示例完整流程

```bash
# 1. Claude接收任务
# 任务: 修复登录验证错误

# 2. 执行代码修改
# Edit: pages/auth/login.vue
# 修复验证逻辑错误

# 3. 自动检查
# ✅ TypeScript检查通过
# ✅ 无console.log
# ✅ 代码已格式化

# 4. 提交
git add .
git commit -m "[fix]修复登录验证错误-2min"

# 5. 推送(如果需要)
git push
```

### 配置文件位置

- **技能定义**: `.claude/skills/git-commit-workflow.md`
- **工作流程**: `.claude/workflow.md` (本文件)
- **全局规则**: `.claude/rules/git-workflow.md`

### 相关命令

```bash
# 查看最近提交
git log --oneline -10

# 查看特定类型的提交
git log --grep="\\[feat\\]" --oneline

# 统计各类型提交数量
git log --all --format='%s' | grep -oP '(?<=\[)[a-z]+' | sort | uniq -c
```

### 注意事项

1. **原子性**: 每次提交只包含一个逻辑修改
2. **及时性**: 任务完成后立即提交,不要积累多个修改
3. **准确性**: 时长记录要真实,反映实际工作量
4. **清晰性**: 提交信息要简洁明了,说明做了什么

### 违规处理

如果发现不符合规范的提交:
1. 使用 `git commit --amend` 修改最近提交
2. 或使用 `git rebase -i` 修改历史提交
3. 确保所有提交都符合规范格式
