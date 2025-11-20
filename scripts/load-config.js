// 在運行 Prisma 命令前載入 config.json
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const configPath = path.join(__dirname, "..", "config.json");

if (!fs.existsSync(configPath)) {
  console.error("❌ config.json not found!");
  console.error(
    "Please copy config.json.example to config.json and update the values."
  );
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

if (!config.database || !config.database.url) {
  console.error("❌ config.json must contain database.url");
  process.exit(1);
}

// 設置環境變數供 Prisma 使用
process.env.DATABASE_URL = config.database.url;

// 獲取要執行的命令（從命令行參數）
const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
  console.error("Usage: node scripts/load-config.js <command> [args...]");
  process.exit(1);
}

// 執行命令並傳遞環境變數
const child = spawn(command, args, {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    DATABASE_URL: config.database.url,
  },
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
