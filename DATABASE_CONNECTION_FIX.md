# 🔧 修復 Supabase 數據庫連接問題

## 錯誤信息

```
Can't reach database server at `aws-1-ap-southeast-2.pooler.supabase.com:5432`
```

## 立即檢查清單

### ✅ 步驟 1: 檢查 Supabase 項目狀態

1. **前往 Supabase Dashboard**
   - https://supabase.com/dashboard
   - 登入你的帳號

2. **檢查項目狀態**
   - 找到你的項目（Reference ID: `krpejgpftveowxikhpvq`）
   - **如果顯示 "Paused"**：
     - 點擊 **"Restore"** 或 **"Resume"** 按鈕
     - 等待 2-3 分鐘讓項目啟動
   - **如果顯示 "Active"**：繼續下一步

### ✅ 步驟 2: 獲取正確的連接字符串

1. **進入 Database Settings**
   - 在 Supabase Dashboard 中
   - 點擊 **"Project Settings"** > **"Database"**

2. **查找 Connection Pooling**
   - 滾動到 **"Connection pooling"** 部分
   - 選擇 **"Session mode"**（不是 Transaction mode）
   - 點擊 **"Copy"** 複製連接字符串

3. **確認連接字符串格式**
   ```
   postgresql://postgres.krpejgpftveowxikhpvq:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
   ```
   
   **重要**：
   - ✅ 用戶名格式：`postgres.krpejgpftveowxikhpvq`（注意中間的點）
   - ✅ Port: `5432`（Session mode）
   - ✅ Host: `aws-1-ap-southeast-2.pooler.supabase.com`

### ✅ 步驟 3: 更新 Vercel 環境變數

1. **前往 Vercel Dashboard**
   - https://vercel.com/dashboard
   - 登入你的帳號

2. **進入項目設置**
   - 找到 `movie-rating-system` 項目
   - 點擊 **"Settings"** 標籤
   - 點擊左側選單的 **"Environment Variables"**

3. **更新 DATABASE_URL**
   - 找到 `DATABASE_URL` 環境變數
   - 點擊編輯（或創建新的）
   - 貼上從 Supabase 複製的連接字符串
   - **確保**：
     - 值正確（沒有多餘空格）
     - 密碼正確
     - 選擇了所有環境（Production、Preview、Development）
   - 點擊 **"Save"**

4. **重新部署**
   - 前往 **"Deployments"** 標籤
   - 點擊最新部署右側的 **"..."** 菜單
   - 選擇 **"Redeploy"**
   - 確認重新部署

### ✅ 步驟 4: 驗證連接

部署完成後，訪問：
```
https://movie-rating-system-gamma.vercel.app/api/health
```

應該看到：
```json
{
  "status": "healthy",
  "checks": {
    "databaseUrl": { "status": "ok" },
    "databaseConnection": { "status": "ok" },
    "prismaClient": { "status": "ok" }
  }
}
```

## 常見問題

### ❌ 問題 1: Supabase 項目被暫停

**症狀**：無法連接，項目顯示 "Paused"

**解決**：
1. 在 Supabase Dashboard 中恢復項目
2. 等待 2-3 分鐘
3. 重新測試連接

### ❌ 問題 2: 連接字符串格式錯誤

**錯誤格式**：
```
postgresql://postgres:password@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

**正確格式**（注意用戶名中的點）：
```
postgresql://postgres.krpejgpftveowxikhpvq:password@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

### ❌ 問題 3: 使用了 Transaction mode

**錯誤**：使用 port `6543`（Transaction mode）

**解決**：使用 port `5432`（Session mode）

### ❌ 問題 4: 環境變數未更新

**症狀**：本地可以連接，但 Vercel 不行

**解決**：
1. 確認 Vercel 中設置了 `DATABASE_URL`
2. 確認值正確
3. 重新部署

## 快速測試

### 測試 1: 健康檢查

訪問：
```
https://movie-rating-system-gamma.vercel.app/api/health
```

### 測試 2: 直接訪問 API

訪問：
```
https://movie-rating-system-gamma.vercel.app/api/movies
```

應該返回 JSON 數組（即使是空數組）。

## 如果還是不行

1. **檢查 Supabase 項目**
   - 確認項目是 Active
   - 確認數據庫服務正常

2. **檢查連接字符串**
   - 從 Supabase Dashboard 重新複製
   - 確認格式正確

3. **檢查 Vercel 環境變數**
   - 確認 `DATABASE_URL` 已設置
   - 確認值正確

4. **查看 Vercel 日誌**
   - 在 Vercel Dashboard 中查看 Function Logs
   - 查找詳細錯誤信息

5. **聯繫支持**
   - Supabase: https://supabase.com/support
   - Vercel: https://vercel.com/support
