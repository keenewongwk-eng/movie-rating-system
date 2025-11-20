# 🎬 電影評分系統

一個專為手機優化的電影評分系統，讓你和朋友一起評分電影！

## 功能特色

- ✅ 建立新電影或為現有電影評分
- ⭐ 1-5 星評分系統
- 💬 簡單評語功能
- 🏆 電影排名（按評分或日期排序）
- 👤 多用戶支持，每人可選擇專屬圖示
- 📱 專為手機和便攜設備優化

## 技術棧

- **前端**: Next.js 14 (App Router) + React + TypeScript
- **樣式**: Tailwind CSS
- **數據庫**: PostgreSQL + Prisma ORM
- **部署**: 支援 Vercel、Railway、Render 等平台

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設置數據庫

#### 本地開發（使用 localhost）

創建 `.env` 文件，填入本地數據庫連接字符串：

```bash
# 創建 .env 文件
echo 'DATABASE_URL="postgresql://postgres:p@ssw0rd@localhost:5433/movie_ratings"' > .env
```

或者手動創建 `.env` 文件：
```
DATABASE_URL="postgresql://postgres:p@ssw0rd@localhost:5433/movie_ratings"
```

#### 生產環境（使用 Supabase 或其他雲數據庫）

⚠️ **重要**: 如果要在 Vercel 部署，必須使用遠程數據庫（不能使用 localhost）

推薦使用 Supabase（免費）：
1. 前往 https://supabase.com 創建項目
2. 獲取數據庫連接字符串
3. 在 Vercel 環境變數中設置 `DATABASE_URL`

詳細步驟請查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 3. 初始化數據庫

```bash
# 生成 Prisma Client
npx prisma generate

# 推送數據庫結構
npx prisma db push

# (可選) 導入示例數據
npm run db:seed
```

### 4. 啟動開發服務器

```bash
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看應用。

## 部署

📖 **詳細部署指南**: 請查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 獲取完整的 Supabase 數據庫設置步驟。

### 方法 1: Vercel 部署（推薦）

1. **將代碼推送到 GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **在 Vercel 部署**

   - 前往 [Vercel](https://vercel.com)
   - 使用 GitHub 帳號登入
   - 點擊 "Add New Project"
   - 選擇 `keenewongwk-eng/movie-rating-system` 倉庫
   - 點擊 "Import"

3. **配置環境變數**

   - 在項目設置中添加環境變數：
     - `DATABASE_URL`: 你的 PostgreSQL 數據庫連接字符串
   - 點擊 "Deploy"

4. **數據庫初始化**
   部署完成後，在 Vercel 的項目設置中：

   - 進入 "Settings" > "Build & Development Settings"
   - 添加 Build Command: `prisma generate && next build`
   - 或者使用 Vercel CLI 運行：
     ```bash
     vercel env pull .env.local
     npx prisma db push
     npm run db:seed  # 可選
     ```

5. **完成！**
   Vercel 會自動為你提供一個 URL，例如：`https://movie-rating-system.vercel.app`

### 方法 2: Railway 部署

1. 在 [Railway](https://railway.app) 創建新項目
2. 添加 PostgreSQL 服務
3. 連接 GitHub 倉庫 `keenewongwk-eng/movie-rating-system`
4. 設置環境變數 `DATABASE_URL`（Railway 會自動提供）
5. 部署！

### 方法 3: GitHub Pages（僅靜態版本）

⚠️ **注意**: GitHub Pages 不支援 Next.js API 路由和服務器端功能。如果需要完整功能，請使用 Vercel 或 Railway。

如果需要靜態導出：

1. 修改 `next.config.js` 添加 `output: 'export'`
2. 移除所有 API 路由
3. 使用靜態數據或外部 API

## 項目結構

```
├── app/
│   ├── api/          # API 路由
│   ├── page.tsx      # 主頁面
│   └── layout.tsx    # 布局
├── components/       # React 組件
├── lib/             # 工具函數
├── prisma/          # 數據庫 schema
└── public/          # 靜態資源
```

## API 端點

- `GET /api/ratings` - 獲取所有評分
- `POST /api/ratings` - 創建新評分
- `PUT /api/ratings/[id]` - 更新評分
- `DELETE /api/ratings/[id]` - 刪除評分
- `GET /api/movies` - 獲取電影列表（含統計）

## 開發

```bash
# 開發模式
npm run dev

# 構建生產版本
npm run build

# 啟動生產服務器
npm start

# 數據庫管理界面
npm run db:studio
```

## 許可證

MIT
