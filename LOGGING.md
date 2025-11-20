# 📝 日誌系統使用指南

## 日誌文件位置

所有日誌文件都保存在 `logs/` 目錄中：

- `logs/error.log` - 錯誤和警告日誌
- `logs/info.log` - 信息和調試日誌

## 日誌格式

每條日誌包含：
- 時間戳（ISO 格式）
- 日誌級別（ERROR, INFO, WARN, DEBUG）
- 消息內容
- 錯誤堆棧（如果是錯誤）

示例：
```
[2025-11-20T12:30:45.123Z] [ERROR] Error fetching movies
Error: Connection timeout
Stack: Error: Connection timeout
    at fetchMovies (app/api/movies/route.ts:54:25)
    ...
```

## 使用日誌工具

### 在 API 路由中使用

```typescript
import { logger } from "@/lib/logger";

// 記錄錯誤
try {
  // ... 你的代碼
} catch (error) {
  logger.error("Error fetching movies", error);
}

// 記錄信息
logger.info("Movies fetched successfully", { count: movies.length });

// 記錄警告
logger.warn("Movie already exists", { title: "F1" });

// 記錄調試信息（只在開發環境）
logger.debug("Processing request", { userId: "123" });
```

## 日誌級別

### ERROR
用於記錄錯誤和異常：
```typescript
logger.error("Database connection failed", error);
```

### WARN
用於記錄警告信息：
```typescript
logger.warn("User already exists", { name: "John" });
```

### INFO
用於記錄一般信息：
```typescript
logger.info("User created successfully", { userId: "123" });
```

### DEBUG
只在開發環境記錄：
```typescript
logger.debug("Request details", { headers, body });
```

## 查看日誌

### 本地開發

1. **查看錯誤日誌**：
   ```bash
   # Windows PowerShell
   Get-Content logs/error.log -Tail 50
   
   # Windows CMD
   type logs\error.log
   
   # Linux/Mac
   tail -f logs/error.log
   ```

2. **查看信息日誌**：
   ```bash
   Get-Content logs/info.log -Tail 50
   ```

3. **實時監控日誌**：
   ```bash
   # Windows PowerShell
   Get-Content logs/error.log -Wait -Tail 20
   
   # Linux/Mac
   tail -f logs/error.log
   ```

### 在編輯器中查看

直接打開 `logs/error.log` 或 `logs/info.log` 文件查看。

## 日誌文件管理

### 自動清理（可選）

日誌文件會持續增長，可以手動清理或設置自動清理：

```typescript
import { cleanupOldLogs } from "@/lib/logger";

// 清理 7 天前的日誌
cleanupOldLogs(7);
```

### 手動清理

```bash
# 清空錯誤日誌
echo "" > logs/error.log

# 清空信息日誌
echo "" > logs/info.log

# 刪除所有日誌文件
Remove-Item logs/*.log
```

## 日誌文件大小

- 日誌文件會持續追加，不會自動輪轉
- 建議定期清理或使用日誌輪轉工具
- 生產環境建議使用專業日誌服務（如 Vercel Logs）

## 在 Vercel 上

Vercel 有自己的日誌系統：
1. 進入 Vercel Dashboard
2. 選擇項目
3. 點擊 "Deployments"
4. 查看 "Function Logs"

本地日誌文件不會上傳到 Vercel，只在本地開發時使用。

## 注意事項

- ✅ 日誌文件已添加到 `.gitignore`，不會提交到 Git
- ✅ 敏感信息（如密碼）不會記錄到日誌
- ✅ 生產環境建議使用專業日誌服務
- ⚠️ 日誌文件可能包含敏感數據，請妥善保管

## 故障排查

如果日誌沒有寫入：

1. **檢查 logs 目錄是否存在**：
   ```bash
   Test-Path logs
   ```

2. **檢查文件權限**：
   確保應用有寫入權限

3. **檢查控制台輸出**：
   日誌也會輸出到控制台，檢查終端輸出

4. **檢查錯誤**：
   如果寫入失敗，錯誤會輸出到控制台

## 示例

查看最近的錯誤：
```bash
Get-Content logs/error.log -Tail 20
```

搜索特定錯誤：
```bash
Select-String -Path logs/error.log -Pattern "database"
```

統計錯誤數量：
```bash
(Get-Content logs/error.log | Select-String "ERROR").Count
```

