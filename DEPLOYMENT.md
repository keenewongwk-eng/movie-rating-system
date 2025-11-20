# 🚀 部署指南 - Supabase 數據庫設置

## 步驟 1: 創建 Supabase 項目

1. **註冊 Supabase 帳號**
   - 前往 https://supabase.com
   - 點擊 "Start your project"
   - 使用 GitHub 帳號登入（推薦）

2. **創建新項目**
   - 點擊 "New Project"
   - 填寫項目信息：
     - **Name**: `movie-rating-system`（或任何你喜歡的名稱）
     - **Database Password**: 設置一個強密碼（記住它！）
     - **Region**: 選擇離你最近的區域（例如：Southeast Asia (Singapore)）
   - 點擊 "Create new project"
   - 等待數據庫創建完成（約 2-3 分鐘）

## 步驟 2: 獲取數據庫連接字符串

### 方法 A: 從設置頁面複製（如果可用）

1. **進入項目設置**
   - 在 Supabase Dashboard 中，點擊你的項目
   - 點擊左側選單的 "Settings"（齒輪圖標 ⚙️）
   - 選擇 "Database"

2. **查找連接字符串**
   - 滾動頁面查找 "Connection string"、"Connection info" 或 "Database URL"
   - 選擇 "URI" 格式
   - 點擊 "Copy" 複製
   - ⚠️ **重要**: 將 `[YOUR-PASSWORD]` 替換為你創建項目時設置的密碼

### 方法 B: 手動構建連接字符串（推薦，最可靠）

如果在設置中找不到連接字符串，可以手動構建：

1. **獲取 Reference ID**
   - 在 Supabase Dashboard
   - 點擊 **"Project Settings"** > **"General"**
   - 找到 **"Reference ID"**（例如：`abcdefghijklmnop`）
   - 複製這個 ID

2. **記住你的數據庫密碼**
   - 這是創建項目時設置的密碼

3. **構建連接字符串**
   使用以下格式：
   ```
   postgresql://postgres:你的密碼@db.你的ReferenceID.supabase.co:5432/postgres
   ```
   
   **示例：**
   - Reference ID: `abcdefghijklmnop`
   - 密碼: `MyPassword123`
   - 連接字符串: `postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres`

4. **驗證格式**
   - 確保沒有空格
   - 確保密碼正確（區分大小寫）
   - 確保 Reference ID 正確

📖 **詳細說明**: 如果還是不清楚，請查看 [SUPABASE_CONNECTION.md](./SUPABASE_CONNECTION.md)

## 步驟 3: 在 Vercel 中設置環境變數

1. **登入 Vercel**
   - 前往 https://vercel.com
   - 登入你的 GitHub 帳號

2. **進入項目設置**
   - 找到 `movie-rating-system` 項目
   - 點擊項目名稱進入項目頁面
   - 點擊頂部的 "Settings" 標籤

3. **添加環境變數**
   - 在左側選單選擇 "Environment Variables"
   - 點擊 "Add New"
   - 填寫：
     - **Key**: `DATABASE_URL`
     - **Value**: 貼上從 Supabase 複製的連接字符串（已替換密碼）
     - **Environment**: 選擇所有環境（Production、Preview、Development）
   - 點擊 "Save"

## 步驟 4: 初始化數據庫結構

部署完成後，需要初始化數據庫：

### 方法 A: 使用 Vercel CLI（推薦）

```bash
# 安裝 Vercel CLI（如果還沒安裝）
npm install -g vercel

# 登入 Vercel
vercel login

# 拉取環境變數到本地
vercel env pull .env.local

# 初始化數據庫結構
npx prisma db push

# （可選）導入示例數據
npm run db:seed
```

### 方法 B: 直接在 Supabase SQL Editor 運行

1. 在 Supabase Dashboard 中，點擊左側選單的 "SQL Editor"
2. 點擊 "New query"
3. 複製 `prisma/schema.prisma` 中的 SQL 語句（或使用 Prisma Migrate 生成）
4. 運行 SQL 語句創建表結構

### 方法 C: 使用 Supabase 連接（本地）

1. 在本地創建 `.env.local` 文件：
   ```env
   DATABASE_URL="你的 Supabase 連接字符串"
   ```

2. 運行：
   ```bash
   npx prisma db push
   npm run db:seed
   ```

## 步驟 5: 重新部署

1. **觸發重新部署**
   - 在 Vercel 項目頁面
   - 進入 "Deployments" 標籤
   - 點擊最新部署右側的 "..." 菜單
   - 選擇 "Redeploy"
   - 確認環境變數已更新

2. **驗證部署**
   - 等待部署完成
   - 訪問你的 Vercel URL
   - 測試應用功能

## 步驟 6: 配置本地開發環境

為了同時支持本地和遠程數據庫，建議創建兩個環境變數文件：

### `.env.local`（本地開發，使用 localhost）
```env
DATABASE_URL="postgresql://postgres:p@ssw0rd@localhost:5433/movie_ratings"
```

### `.env.production`（生產環境，使用 Supabase）
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

⚠️ **注意**: `.env.local` 和 `.env.production` 應該添加到 `.gitignore`（已經包含）

## 故障排除

### 問題 1: 連接超時
- 檢查 Supabase 項目是否已完全創建
- 確認連接字符串中的密碼已正確替換
- 檢查網絡連接

### 問題 2: 認證失敗
- 確認數據庫密碼正確
- 檢查連接字符串格式
- 確認 Supabase 項目狀態為 "Active"

### 問題 3: 表不存在
- 運行 `npx prisma db push` 初始化數據庫結構
- 檢查 Prisma schema 是否正確

### 問題 4: 環境變數未生效
- 確認在 Vercel 中已保存環境變數
- 重新部署項目
- 檢查部署日誌確認環境變數已載入

## 其他免費數據庫選項

如果 Supabase 不適合，可以考慮：

1. **Neon** (https://neon.tech)
   - 完全免費的 PostgreSQL
   - 簡單易用

2. **Railway** (https://railway.app)
   - 免費額度充足
   - 自動提供連接字符串

3. **Render** (https://render.com)
   - 免費 PostgreSQL 數據庫
   - 簡單設置

## 安全提示

- ✅ 永遠不要在代碼中硬編碼數據庫密碼
- ✅ 使用環境變數存儲敏感信息
- ✅ 定期更新數據庫密碼
- ✅ 不要將 `.env` 文件提交到 Git

