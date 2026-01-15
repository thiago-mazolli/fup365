module.exports = {
  apps: [
    {
      name: 'api-fup365',
      script: './dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: true,
      wait_ready: true,
      listen_timeout: 10000,
      max_memory_restart: '1G',
      ignore_watch: ['public', 'temp'],
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
