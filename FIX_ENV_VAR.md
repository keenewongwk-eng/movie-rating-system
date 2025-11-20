# 🔧 修復 DATABASE_URL 環境變數問題

## 問題診斷

錯誤日誌顯示：
```
error: Environment variable not found: DATABASE_URL.
```

但 `.env` 文件存在且包含正確的 `DATABASE_URL`。

## 解決方案

### 方案 1: 重啟開發服務器（最常見）

Next.js 需要在啟動時載入環境變數。如果環境變數是在服務器運行後添加的，需要重啟：

1. **停止當前服務器**
   - 在終端按 `Ctrl+C`

2. **重新啟動**
   ```bash
   npm run dev
   ```

### 方案 2: 檢查環境變數格式

確保 `.env` 文件格式正確：

```env
DATABASE_URL="postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

注意：
- ✅ 使用雙引號包裹整個連接字符串
- ✅ 沒有多餘的空格
- ✅ 沒有註釋符號 `#` 在行首

### 方案 3: 使用 .env.local（推薦）

Next.js 優先載入 `.env.local`：

1. 確保 `.env.local` 存在
2. 包含 `DATABASE_URL`
3. 重啟服務器

### 方案 4: 驗證環境變數已載入

創建一個測試 API 路由來檢查：

```typescript
// app/api/test-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
  });
}
```

訪問 `http://localhost:3000/api/test-env` 檢查環境變數是否載入。

### 方案 5: 檢查 .gitignore

確保 `.env` 和 `.env.local` 在 `.gitignore` 中（它們應該被忽略，但文件應該存在於本地）。

## 驗證步驟

1. **檢查文件是否存在**：
   ```bash
   Test-Path .env
   Test-Path .env.local
   ```

2. **檢查文件內容**：
   ```bash
   Get-Content .env
   ```

3. **重啟服務器**：
   ```bash
   npm run dev
   ```

4. **檢查 Prisma 連接**：
   ```bash
   npx prisma db push
   ```

## 如果還是不行

1. **刪除 .next 目錄**（清除緩存）：
   ```bash
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

2. **重新生成 Prisma Client**：
   ```bash
   npx prisma generate
   ```

3. **檢查環境變數在運行時**：
   在 API 路由中添加：
   ```typescript
   console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Found" : "Not found");
   ```

