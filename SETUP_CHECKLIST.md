# ✅ Supabase 設置檢查清單

按照以下步驟完成 Supabase 數據庫設置：

## 📋 步驟檢查清單

### 步驟 1: 創建 Supabase 項目
- [ ] 前往 https://supabase.com
- [ ] 使用 GitHub 帳號登入
- [ ] 點擊 "New Project"
- [ ] 填寫項目名稱：`movie-rating-system`
- [ ] 設置數據庫密碼（記住它！）
- [ ] 選擇區域（推薦：Southeast Asia）
- [ ] 點擊 "Create new project"
- [ ] 等待項目創建完成（約 2-3 分鐘）

### 步驟 2: 獲取連接字符串
- [ ] 在 Supabase Dashboard 中點擊你的項目
- [ ] 點擊左側 "Settings" > "Database"
- [ ] 滾動到 "Connection string" 部分
- [ ] 選擇 "URI" 標籤
- [ ] 點擊 "Copy" 複製連接字符串
- [ ] ⚠️ **重要**: 將 `[YOUR-PASSWORD]` 替換為你設置的密碼
- [ ] 最終格式應該類似：
  ```
  postgresql://postgres:你的密碼@db.xxxxx.supabase.co:5432/postgres
  ```

### 步驟 3: 在 Vercel 設置環境變數
- [ ] 前往 https://vercel.com
- [ ] 登入 GitHub 帳號
- [ ] 找到 `movie-rating-system` 項目
- [ ] 點擊 "Settings" > "Environment Variables"
- [ ] 點擊 "Add New"
- [ ] Key: `DATABASE_URL`
- [ ] Value: 貼上 Supabase 連接字符串（已替換密碼）
- [ ] Environment: 選擇所有（Production、Preview、Development）
- [ ] 點擊 "Save"

### 步驟 4: 初始化數據庫結構

#### 選項 A: 使用本地連接（推薦）
- [ ] 在項目根目錄創建 `.env.local` 文件
- [ ] 添加 Supabase 連接字符串：
  ```
  DATABASE_URL="postgresql://postgres:你的密碼@db.xxxxx.supabase.co:5432/postgres"
  ```
- [ ] 運行：`npx prisma db push`
- [ ] （可選）運行：`npm run db:seed` 導入示例數據

#### 選項 B: 使用 Vercel CLI
- [ ] 安裝 Vercel CLI: `npm install -g vercel`
- [ ] 登入: `vercel login`
- [ ] 拉取環境變數: `vercel env pull .env.local`
- [ ] 運行：`npx prisma db push`
- [ ] （可選）運行：`npm run db:seed`

### 步驟 5: 重新部署
- [ ] 在 Vercel 項目頁面
- [ ] 進入 "Deployments" 標籤
- [ ] 點擊最新部署的 "..." 菜單
- [ ] 選擇 "Redeploy"
- [ ] 等待部署完成

### 步驟 6: 驗證
- [ ] 訪問 Vercel 提供的 URL
- [ ] 測試添加電影功能
- [ ] 測試評分功能
- [ ] 確認數據保存成功

## 🔍 驗證連接字符串格式

正確格式：
```
postgresql://postgres:密碼@db.xxxxx.supabase.co:5432/postgres
```

常見錯誤：
- ❌ `postgresql://postgres:[YOUR-PASSWORD]@...` （未替換密碼）
- ❌ `postgresql://postgres:password@localhost:5432/...` （使用 localhost）
- ✅ `postgresql://postgres:實際密碼@db.xxxxx.supabase.co:5432/postgres`

## 🆘 遇到問題？

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 中的故障排除部分。

常見問題：
1. **連接超時** → 檢查 Supabase 項目是否已完全創建
2. **認證失敗** → 確認密碼正確且已替換 `[YOUR-PASSWORD]`
3. **表不存在** → 運行 `npx prisma db push` 初始化數據庫

