const path = require("node:path");

const appRoot = "/var/www/mycloud.adityaanugrah.me/backend";

module.exports = {
  apps: [
    {
      name: "mycloud-9drive",
      script: path.join(appRoot, "dist/server.js"),
      cwd: appRoot,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
