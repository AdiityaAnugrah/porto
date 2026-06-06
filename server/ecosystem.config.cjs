const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "aditya-api",
      script: path.join(__dirname, "api-server.mjs"),
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
