# 🔧 Vercel 數據庫連接修復指南

## 錯誤信息

```
Can't reach database server at `aws-1-ap-southeast-2.pooler.supabase.com:5432`
```

## 問題診斷

錯誤顯示你正在使用連接池地址，但**端口錯誤**：

- ❌ 當前使用：端口 `5432`（直接連接端口）
- ✅ 應該使用：端口 `6543`（連接池端口）

## 解決步驟

### 步驟 1: 檢查 Supabase 項目狀態

1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 找到你的項目
3. **確認項目狀態為 "Active"**（綠色）
   - 如果顯示 "Paused"，點擊 "Resume" 恢復項目

### 步驟 2: 獲取正確的連接池連接字符串

1. 在 Supabase Dashboard 中
2. 進入 **Project Settings** > **Database**
3. 滾動到 **"Connection pooling"** 部分
4. 選擇 **"Session mode"**（適合 Prisma）
5. 複製連接字符串

**正確格式應該是：**

```
postgresql://postgres.krpejgpftveowxikhpvq:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
```

**注意：**

- ✅ 端口是 `6543`（不是 `5432`）
- ✅ 用戶名格式：`postgres.krpejgpftveowxikhpvq`（包含 Reference ID）
- ✅ 主機：`aws-1-ap-southeast-2.pooler.supabase.com`

### 步驟 3: 更新 Vercel 環境變量

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇你的項目
3. 進入 **Settings** > **Environment Variables**
4. 找到 `DATABASE_URL` 環境變量
5. 點擊編輯，更新為正確的連接字符串
6. **確保端口是 `6543`**

**示例（替換 `[PASSWORD]` 為你的實際密碼）：**

```
postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
```

### 步驟 4: 重新部署

更新環境變量後：

1. 在 Vercel Dashboard 中
2. 進入 **Deployments** 標籤
3. 點擊最新部署右側的 **"..."** 菜單
4. 選擇 **"Redeploy"**
5. 或者推送新的代碼更改觸發自動部署

### 步驟 5: 驗證修復

部署完成後，訪問健康檢查端點：

```
https://你的域名/api/health
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

### Q: 為什麼要用連接池？

A: Supabase 推薦使用連接池（特別是 Session mode）用於 Prisma，因為：

- 更好的連接管理
- 避免連接數限制
- 更適合 serverless 環境（如 Vercel）

### Q: 如何確認我的項目區域？

A:

1. 進入 Supabase Dashboard
2. **Project Settings** > **General**
3. 查看 **Region** 字段
4. 你的區域是：`ap-southeast-2`（從錯誤信息中可以看出）

### Q: 如果項目被暫停了怎麼辦？

A:

1. 進入 Supabase Dashboard
2. 找到你的項目
3. 如果顯示 "Paused"，點擊 **"Resume"** 按鈕
4. 等待幾分鐘讓項目恢復
5. 然後重新測試連接

### Q: 如何重置數據庫密碼？

A:

1. 進入 Supabase Dashboard
2. **Project Settings** > **Database**
3. 滾動到底部
4. 點擊 **"Reset database password"**
5. 設置新密碼
6. 更新 Vercel 環境變量中的 `DATABASE_URL`

## 快速檢查清單

- [ ] Supabase 項目狀態為 "Active"
- [ ] 使用連接池連接字符串（Session mode）
- [ ] 端口是 `6543`（不是 `5432`）
- [ ] 用戶名格式正確：`postgres.krpejgpftveowxikhpvq`
- [ ] Vercel 環境變量已更新
- [ ] 已重新部署應用
- [ ] 健康檢查端點返回 "healthy"

## 如果問題仍然存在

1. **檢查 Vercel 函數日誌**

   - Vercel Dashboard > 你的項目 > **Functions** 標籤
   - 查看最新的錯誤日誌

2. **測試本地連接**

   - 使用相同的連接字符串在本地測試
   - 運行：`npx prisma db push`

3. **聯繫 Supabase 支持**
   - 在 Supabase Dashboard 中查找 "Support"
   - 提供項目 Reference ID：`krpejgpftveowxikhpvq`
