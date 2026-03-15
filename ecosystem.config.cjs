// 加载环境变量
require('dotenv').config()

module.exports = {
  apps: [{
    name: 'nuxt-target',
    script: './.output/server/index.mjs',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3333,
      DATABASE_URL: process.env.DATABASE_URL
    }
  }]
}
