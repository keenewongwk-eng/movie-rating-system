import fs from "fs";
import path from "path";

interface Config {
  database: {
    url: string;
  };
}

let config: Config | null = null;

function loadConfig(): Config {
  if (config) {
    return config;
  }

  // 優先使用環境變數（Vercel 部署時）
  if (process.env.DATABASE_URL) {
    config = {
      database: {
        url: process.env.DATABASE_URL,
      },
    };
    return config;
  }

  // 本地開發時使用 config.json
  const configPath = path.join(process.cwd(), "config.json");
  const examplePath = path.join(process.cwd(), "config.json.example");

  // 檢查配置文件是否存在
  if (!fs.existsSync(configPath)) {
    if (fs.existsSync(examplePath)) {
      throw new Error(
        `❌ config.json not found!\n` +
          `Please copy config.json.example to config.json and update the values.\n` +
          `Example: cp config.json.example config.json`
      );
    } else {
      throw new Error(
        `❌ config.json not found and DATABASE_URL environment variable is not set!\n` +
          `Please either:\n` +
          `1. Create config.json with your database configuration, or\n` +
          `2. Set DATABASE_URL environment variable`
      );
    }
  }

  try {
    const configFile = fs.readFileSync(configPath, "utf8");
    const parsedConfig = JSON.parse(configFile) as Config;

    // 驗證配置
    if (!parsedConfig.database || !parsedConfig.database.url) {
      throw new Error("config.json must contain database.url");
    }

    config = parsedConfig;
    return config;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error(`❌ Invalid JSON in config.json: ${error.message}`);
    }
    throw error;
  }
}

export function getConfig(): Config {
  return loadConfig();
}

export function getDatabaseUrl(): string {
  const config = getConfig();
  return config.database.url;
}
