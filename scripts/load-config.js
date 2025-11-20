// 在運行 Prisma 命令前載入 config.json
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "config.json");

if (!fs.existsSync(configPath)) {
  console.error("❌ config.json not found!");
  console.error("Please copy config.json.example to config.json and update the values.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

if (!config.database || !config.database.url) {
  console.error("❌ config.json must contain database.url");
  process.exit(1);
}

// 設置環境變數供 Prisma 使用
process.env.DATABASE_URL = config.database.url;

