module.exports = {
  apps: [{
    name: 'nuxt-target',
    script: './.output/server/index.mjs',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3333
    }
  }]
}
