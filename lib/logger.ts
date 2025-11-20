import fs from "fs";
import path from "path";

// 檢查是否在 Vercel 或其他無服務器環境
const IS_VERCEL = !!process.env.VERCEL;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_SERVERLESS = IS_VERCEL || IS_PRODUCTION;

const LOG_DIR = path.join(process.cwd(), "logs");
const ERROR_LOG_FILE = path.join(LOG_DIR, "error.log");
const INFO_LOG_FILE = path.join(LOG_DIR, "info.log");

// 只在本地開發環境中創建日誌目錄
if (!IS_SERVERLESS) {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  } catch (err) {
    // 如果無法創建目錄，只輸出警告，不影響運行
    console.warn("Failed to create logs directory:", err);
  }
}

// 格式化時間戳
function getTimestamp(): string {
  return new Date().toISOString();
}

// 格式化日誌消息
function formatLogMessage(level: string, message: string, error?: any): string {
  const timestamp = getTimestamp();
  let logMessage = `[${timestamp}] [${level}] ${message}`;

  if (error) {
    if (error instanceof Error) {
      logMessage += `\nError: ${error.message}`;
      if (error.stack) {
        logMessage += `\nStack: ${error.stack}`;
      }
    } else {
      logMessage += `\nError: ${JSON.stringify(error, null, 2)}`;
    }
  }

  return logMessage + "\n";
}

// 寫入日誌文件（僅在本地文件系統可用時）
function writeLog(filePath: string, message: string) {
  // 在無服務器環境中，跳過文件寫入
  if (IS_SERVERLESS) {
    return;
  }
  
  try {
    // 本地開發環境：寫入文件
    if (fs.existsSync(LOG_DIR)) {
      fs.appendFileSync(filePath, message, "utf8");
    }
  } catch (err) {
    // 如果寫入失敗，靜默處理（不會影響應用運行）
    // 錯誤已經輸出到控制台了
  }
}

// 日誌工具對象
export const logger = {
  // 記錄錯誤
  error: (message: string, error?: any) => {
    const logMessage = formatLogMessage("ERROR", message, error);
    
    // 在無服務器環境中，詳細輸出到控制台（會被 Vercel 捕獲）
    if (IS_SERVERLESS) {
      console.error("=".repeat(80));
      console.error("[ERROR]", message);
      if (error) {
        console.error("Error details:", error);
        if (error instanceof Error && error.stack) {
          console.error("Stack trace:", error.stack);
        } else if (typeof error === "object") {
          console.error("Error object:", JSON.stringify(error, null, 2));
        }
      }
      console.error("=".repeat(80));
    } else {
      // 本地環境：寫入文件並輸出到控制台
      writeLog(ERROR_LOG_FILE, logMessage);
      console.error(logMessage.trim());
    }
  },

  // 記錄信息
  info: (message: string, data?: any) => {
    const logMessage = formatLogMessage(
      "INFO",
      message,
      data ? JSON.stringify(data, null, 2) : undefined
    );
    
    if (IS_SERVERLESS) {
      console.log("[INFO]", message, data ? JSON.stringify(data, null, 2) : "");
    } else {
      writeLog(INFO_LOG_FILE, logMessage);
      console.log(logMessage.trim());
    }
  },

  // 記錄警告
  warn: (message: string, data?: any) => {
    const logMessage = formatLogMessage(
      "WARN",
      message,
      data ? JSON.stringify(data, null, 2) : undefined
    );

    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      console.warn(
        "[WARN]",
        message,
        data ? JSON.stringify(data, null, 2) : ""
      );
    } else {
      writeLog(ERROR_LOG_FILE, logMessage);
      console.warn(logMessage.trim());
    }
  },

  // 記錄調試信息（只在開發環境）
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      const logMessage = formatLogMessage(
        "DEBUG",
        message,
        data ? JSON.stringify(data, null, 2) : undefined
      );
      writeLog(INFO_LOG_FILE, logMessage);
      console.log(logMessage.trim());
    }
  },
};

// 清理舊日誌文件（可選，用於生產環境）
export function cleanupOldLogs(daysToKeep: number = 7) {
  try {
    const files = fs.readdirSync(LOG_DIR);
    const now = Date.now();
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

    files.forEach((file) => {
      const filePath = path.join(LOG_DIR, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > maxAge) {
        fs.unlinkSync(filePath);
        logger.info(`Deleted old log file: ${file}`);
      }
    });
  } catch (error) {
    logger.error("Failed to cleanup old logs", error);
  }
}
