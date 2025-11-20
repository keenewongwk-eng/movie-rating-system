# 🔍 錯誤日誌查看指南

## 1. 瀏覽器控制台（客戶端錯誤）

### 如何打開：
- **Chrome/Edge**: 按 `F12` 或 `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: 按 `F12` 或 `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- **Safari**: 按 `Cmd+Option+I` (需要先在設置中啟用開發者工具)

### 查看位置：
1. 打開開發者工具後，點擊 **"Console"** 標籤
2. 查看紅色錯誤信息
3. 點擊錯誤可以查看詳細堆棧跟踪

### 常見錯誤：
- React 組件錯誤
- API 調用失敗
- JavaScript 運行時錯誤

## 2. 終端/命令行（服務器端錯誤）

### 本地開發：
當你運行 `npm run dev` 時，錯誤會直接顯示在終端中：

```bash
npm run dev
```

### 查看位置：
- 終端窗口會顯示：
  - API 路由錯誤
  - Prisma 數據庫錯誤
  - 服務器端渲染錯誤

### 示例輸出：
```
Error: P1001: Can't reach database server
    at PrismaClient.query
    at GET (app/api/movies/route.ts:6:25)
```

## 3. Next.js 錯誤頁面

### 開發模式：
Next.js 會在瀏覽器中顯示詳細的錯誤頁面，包括：
- 錯誤堆棧
- 錯誤發生的文件位置
- 相關代碼片段

### 生產模式：
生產環境中，錯誤頁面會更簡潔，但可以在終端查看詳細錯誤。

## 4. Vercel 部署日誌（如果已部署）

### 查看方法：
1. 登入 https://vercel.com
2. 選擇你的項目 `movie-rating-system`
3. 點擊 **"Deployments"** 標籤
4. 點擊最新的部署
5. 查看 **"Build Logs"** 和 **"Function Logs"**

### 實時日誌：
- 點擊部署右側的 **"..."** 菜單
- 選擇 **"View Function Logs"**
- 可以查看實時 API 請求日誌

## 5. Supabase 日誌（數據庫錯誤）

### 查看方法：
1. 登入 https://supabase.com/dashboard
2. 選擇你的項目
3. 點擊左側選單的 **"Logs"**
4. 選擇 **"Postgres Logs"** 或 **"API Logs"**

### 查看內容：
- 數據庫查詢錯誤
- 連接問題
- SQL 語法錯誤

## 6. 應用內錯誤日誌

### 檢查代碼中的 console.log：
在代碼中查找 `console.error` 或 `console.log`：

```typescript
// 在 API 路由中
console.error("Error fetching movies:", error);

// 在組件中
console.error("Error fetching movies:", error);
```

這些會顯示在：
- 瀏覽器控制台（客戶端）
- 終端（服務器端）

## 7. 網絡請求錯誤

### 在瀏覽器開發者工具中：
1. 打開開發者工具 (`F12`)
2. 點擊 **"Network"** 標籤
3. 刷新頁面
4. 查看失敗的請求（紅色）
5. 點擊請求查看：
   - 請求 URL
   - 響應狀態碼
   - 響應內容
   - 錯誤信息

## 8. Prisma 錯誤

### 查看 Prisma 錯誤：
Prisma 錯誤通常會顯示在：
- 終端（運行 `npx prisma` 命令時）
- API 路由的錯誤處理中
- 瀏覽器控制台（如果錯誤傳遞到客戶端）

### 常見 Prisma 錯誤：
- `P1001`: 無法連接到數據庫服務器
- `P2002`: 唯一約束違反
- `P2025`: 記錄不存在

## 快速排查步驟

1. **檢查瀏覽器控制台** (`F12` > Console)
   - 查看客戶端錯誤

2. **檢查終端**（運行 `npm run dev` 的窗口）
   - 查看服務器端錯誤

3. **檢查網絡請求** (`F12` > Network)
   - 查看 API 請求是否成功

4. **檢查 Vercel 日誌**（如果已部署）
   - 查看生產環境錯誤

5. **檢查 Supabase 日誌**（如果使用 Supabase）
   - 查看數據庫錯誤

## 啟用詳細日誌

### 在開發環境中：
Next.js 默認會顯示詳細錯誤信息。

### 在生產環境中：
可以在代碼中添加更詳細的日誌：

```typescript
// 在 API 路由中
if (process.env.NODE_ENV === 'development') {
  console.log('Detailed error:', error);
}
```

## 常見錯誤位置

| 錯誤類型 | 查看位置 |
|---------|---------|
| React 組件錯誤 | 瀏覽器控制台 |
| API 路由錯誤 | 終端 + 瀏覽器 Network 標籤 |
| 數據庫錯誤 | 終端 + Supabase 日誌 |
| 構建錯誤 | 終端（`npm run build`） |
| 部署錯誤 | Vercel 部署日誌 |
| 網絡錯誤 | 瀏覽器 Network 標籤 |

## 需要幫助？

如果找不到錯誤日誌，請告訴我：
1. 你在哪裡看到錯誤？（瀏覽器/終端）
2. 錯誤信息是什麼？
3. 你在運行什麼操作時出現錯誤？

我可以幫你定位具體的錯誤位置！

