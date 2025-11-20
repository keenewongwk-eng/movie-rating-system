# ⚡ 快速修復 DATABASE_URL 問題

## 問題
環境變數在模塊加載時還沒有被 Next.js 載入。

## 解決方案

### 步驟 1: 確保文件存在且格式正確

檢查 `.env.local` 文件：
```bash
Get-Content .env.local
```

應該看到：
```
DATABASE_URL="postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

### 步驟 2: 清除緩存（已完成）

已經清除了 `.next` 目錄。

### 步驟 3: 重啟開發服務器

**必須重啟**，因為：
- Next.js 只在啟動時載入環境變數
- 緩存已清除，需要重新構建

```bash
npm run dev
```

### 步驟 4: 驗證

訪問：`http://localhost:3000/api/test-env`

應該看到：
```json
{
  "hasDatabaseUrl": true,
  "message": "✅ DATABASE_URL is loaded"
}
```

## 如果還是不行

### 臨時解決方案：使用 dotenv

如果 Next.js 仍然無法載入環境變數，可以使用 dotenv：

1. **安裝 dotenv**：
   ```bash
   npm install dotenv
   ```

2. **在 lib/prisma.ts 頂部添加**：
   ```typescript
   import dotenv from "dotenv";
   dotenv.config({ path: ".env.local" });
   ```

但這通常不需要，Next.js 應該自動處理。

## 檢查清單

- [ ] `.env.local` 文件存在
- [ ] 文件內容正確（有引號）
- [ ] `.next` 目錄已清除
- [ ] 開發服務器已重啟
- [ ] 訪問 `/api/test-env` 驗證

