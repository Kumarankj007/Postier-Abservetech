module.exports = {
  apps: [
    {
      name: "Postier Frontend",
      namespace: "postier",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      cwd: "./", // Replace with your app's root directory if different
      max_memory_restart: "450M", // Restarts if memory usage exceeds 2GB
      instances: 1, // Single instance
      exec_mode: "cluster", // Run in cluster mode
      out_file: "./logs/postier/app-out.log",
      error_file: "./logs/postier/app-error.log",
      log_file: "./logs/postier/app-log.log",
    },
  ],
};
