# 🔧 環境變數問題排查指南

## 當前問題

`DATABASE_URL` 環境變數沒有被 Next.js 載入。

## 解決方案

### 方案 1: 確保使用 .env.local（推薦）

Next.js 優先載入 `.env.local`。確保文件存在且格式正確：

1. **檢查文件是否存在**：
   ```bash
   Test-Path .env.local
   ```

2. **確保文件內容正確**：
   ```env
   DATABASE_URL="postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
   ```

3. **重啟開發服務器**：
   ```bash
   # 停止服務器 (Ctrl+C)
   npm run dev
   ```

### 方案 2: 清除緩存並重啟

Next.js 可能緩存了舊的環境變數：

```bash
# 刪除 .next 目錄
Remove-Item -Recurse -Force .next

# 重新啟動
npm run dev
```

### 方案 3: 檢查文件格式

確保 `.env.local` 文件：
- ✅ 使用 UTF-8 編碼
- ✅ 沒有 BOM（字節順序標記）
- ✅ 每行一個變數
- ✅ 使用雙引號包裹值
- ✅ 沒有多餘的空格

### 方案 4: 使用 dotenv-cli（臨時解決方案）

如果以上都不行，可以使用 dotenv-cli：

```bash
# 安裝
npm install -g dotenv-cli

# 運行
dotenv -e .env.local -- npm run dev
```

### 方案 5: 在 next.config.js 中明確指定

已經更新了 `next.config.js` 來明確載入環境變數。確保重啟服務器。

## 驗證步驟

1. **訪問測試端點**：
   ```
   http://localhost:3000/api/test-env
   ```

2. **檢查診斷信息**：
   查看返回的 `diagnostics` 對象，確認：
   - `envFileExists`: true
   - `envLocalFileExists`: true
   - `envFileHasDatabaseUrl`: true
   - `envLocalFileHasDatabaseUrl`: true

3. **檢查終端輸出**：
   重啟服務器時，應該看到：
   ```
   Environment variables loaded from .env.local
   ```

## 常見問題

### Q: 為什麼 .env 文件存在但變數沒有載入？

A: Next.js 只在啟動時載入環境變數。如果文件是在服務器運行後創建的，需要重啟。

### Q: .env 和 .env.local 的優先級？

A: `.env.local` 優先於 `.env`。建議使用 `.env.local` 進行本地開發。

### Q: 環境變數在客戶端可用嗎？

A: 默認情況下，只有以 `NEXT_PUBLIC_` 開頭的環境變數會在客戶端可用。`DATABASE_URL` 應該只在服務器端使用。

## 如果還是不行

1. **檢查文件編碼**：
   ```bash
   [System.IO.File]::ReadAllText(".env.local", [System.Text.Encoding]::UTF8)
   ```

2. **手動設置環境變數**（臨時）：
   ```powershell
   $env:DATABASE_URL="postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
   npm run dev
   ```

3. **檢查 Next.js 版本**：
   ```bash
   npm list next
   ```
   確保使用 Next.js 14.0.4 或更高版本。

