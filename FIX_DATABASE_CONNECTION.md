# 🚨 緊急修復：數據庫連接錯誤

## 錯誤信息

```
Can't reach database server at `aws-1-ap-southeast-2.pooler.supabase.com:5432`
```

## 🔍 立即檢查（按順序）

### 1️⃣ 檢查 Supabase 項目狀態（最重要！）

1. **登入 Supabase Dashboard**

   - https://supabase.com/dashboard

2. **找到你的項目**

   - Reference ID: `krpejgpftveowxikhpvq`

3. **檢查項目狀態**
   - ✅ **Active**（綠色）= 正常，繼續下一步
   - ❌ **Paused**（灰色）= **需要恢復！**
     - 點擊 **"Restore"** 或 **"Resume"** 按鈕
     - 等待 2-5 分鐘讓項目啟動
     - 這是**最常見的原因**

### 2️⃣ 獲取正確的連接字符串

1. **進入 Database Settings**

   - Supabase Dashboard > **Project Settings** > **Database**

2. **找到 Connection Pooling 部分**

   - 滾動到頁面下方
   - 找到 **"Connection pooling"** 區塊

3. **選擇 Session mode**

   - 點擊 **"Session mode"** 標籤
   - 點擊 **"Copy"** 按鈕複製連接字符串

4. **確認格式**
   應該類似：

   ```
   postgresql://postgres.krpejgpftveowxikhpvq:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
   ```

   **重要檢查點：**

   - ✅ 用戶名：`postgres.krpejgpftveowxikhpvq`（包含 Reference ID）
   - ✅ 端口：`5432`（Session mode）
   - ✅ 主機：`aws-1-ap-southeast-2.pooler.supabase.com`

### 3️⃣ 更新 Vercel 環境變量

1. **登入 Vercel Dashboard**

   - https://vercel.com/dashboard

2. **進入項目設置**

   - 找到 `movie-rating-system` 項目
   - 點擊 **Settings** > **Environment Variables**

3. **更新 DATABASE_URL**

   - 找到 `DATABASE_URL`
   - 點擊 **Edit**
   - 貼上從 Supabase 複製的完整連接字符串
   - **確保密碼正確**
   - 選擇所有環境：✅ Production ✅ Preview ✅ Development
   - 點擊 **Save**

4. **重新部署**
   - 前往 **Deployments** 標籤
   - 點擊最新部署的 **"..."** 菜單
   - 選擇 **"Redeploy"**
   - 等待部署完成（約 1-2 分鐘）

### 4️⃣ 驗證修復

部署完成後，訪問：

```
https://你的域名/api/health
```

**成功應該看到：**

```json
{
  "status": "healthy",
  "checks": {
    "databaseUrl": { "status": "ok", "message": "Database URL is set" },
    "databaseConnection": {
      "status": "ok",
      "message": "Database connection successful"
    },
    "prismaClient": {
      "status": "ok",
      "message": "Prisma Client working, found X movies"
    }
  }
}
```

**如果仍然失敗，檢查：**

- Vercel Function Logs 中的詳細錯誤信息
- Supabase Dashboard 中的項目狀態

## 🔧 常見問題解決

### ❌ 問題 1: 項目被暫停

**症狀**：項目顯示 "Paused"

**解決**：

1. 在 Supabase Dashboard 中點擊 **"Restore"**
2. 等待項目啟動（2-5 分鐘）
3. 確認狀態變為 "Active"
4. 重新測試連接

### ❌ 問題 2: 連接字符串格式錯誤

**錯誤示例：**

```
postgresql://postgres:password@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

（用戶名缺少 Reference ID）

**正確格式：**

```
postgresql://postgres.krpejgpftveowxikhpvq:password@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

（用戶名包含 Reference ID）

### ❌ 問題 3: 使用了錯誤的端口

**Session mode**（推薦用於 Prisma）：

- 端口：`5432`
- 用戶名：`postgres.krpejgpftveowxikhpvq`

**Transaction mode**（不推薦用於 Prisma）：

- 端口：`6543`
- 用戶名：`postgres.krpejgpftveowxikhpvq`

**解決**：使用 Session mode（端口 5432）

### ❌ 問題 4: 環境變量未正確設置

**檢查清單：**

- [ ] Vercel 中已設置 `DATABASE_URL`
- [ ] 值正確（沒有多餘空格或引號）
- [ ] 已選擇所有環境（Production、Preview、Development）
- [ ] 已重新部署應用

## 📋 快速檢查清單

完成以下所有步驟：

- [ ] Supabase 項目狀態為 "Active"
- [ ] 從 Supabase Dashboard 複製了 Session mode 連接字符串
- [ ] 連接字符串格式正確（用戶名包含 Reference ID）
- [ ] Vercel 環境變量 `DATABASE_URL` 已更新
- [ ] 已重新部署 Vercel 應用
- [ ] 訪問 `/api/health` 返回 "healthy"

## 🆘 如果問題仍然存在

1. **查看 Vercel 日誌**

   - Vercel Dashboard > 你的項目 > **Functions** 標籤
   - 查看最新的錯誤日誌

2. **測試本地連接**

   ```bash
   # 更新 config.json 使用相同的連接字符串
   # 然後測試
   npm run db:test
   ```

3. **聯繫支持**
   - Supabase Support: https://supabase.com/support
   - 提供項目 Reference ID: `krpejgpftveowxikhpvq`

## 💡 提示

- **最常見的原因**：Supabase 項目被暫停
- **最快的解決方法**：恢復項目並重新部署
- **預防措施**：定期檢查 Supabase 項目狀態
