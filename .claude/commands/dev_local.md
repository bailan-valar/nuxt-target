# Dev Local - 本地开发部署

执行以下步骤来构建并启动应用：

1. 运行 `npm run build` 构建生产版本
2. 等待构建完成
3. 运行 `pm2 start ecosystem.config.cjs` 启动应用
4. 显示 PM2 进程状态
5. 启动成功后，调用以下 curl 命令发送通知：
   ```
    curl -X POST -H "Content-Type: application/json; charset=utf-8" -d "{\"appToken\":\"AT_8E7zfaUNlizh3cwP6J1TdKiGjbD7WMEK\", \"content\":\"APP local test deployed\", \"uids\":[\"UID_S10SiMGozgLM7veRAJMDaaaFFI4V\"]}" https://wxpusher.zjiecode.com/api/send/message
   ```

请按顺序执行这些命令，并在每个步骤完成后报告结果。
