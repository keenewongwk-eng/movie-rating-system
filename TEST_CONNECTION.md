# 🔧 Supabase 連接測試指南

## 你的連接字符串格式

你的連接字符串格式看起來正確：
```
postgresql://postgres:Linklamw0ng@db.krpejgpftveowxikhpvq.supabase.co:5432/postgres
```

## 可能的问题和解決方案

### 問題 1: Supabase 項目尚未完全創建

**解決方案：**
1. 回到 Supabase Dashboard
2. 確認項目狀態顯示為 "Active"（不是 "Paused" 或 "Creating"）
3. 等待幾分鐘讓數據庫完全初始化

### 問題 2: 需要使用連接池端口

Supabase 有時需要使用連接池端口 `6543` 而不是 `5432`。

**嘗試這個連接字符串：**
```
postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

或者從 Supabase Dashboard 獲取連接池連接字符串：
1. 進入 **Project Settings** > **Database**
2. 查找 **"Connection pooling"** 部分
3. 選擇 **"Session mode"** 或 **"Transaction mode"**
4. 複製連接字符串

### 問題 3: 數據庫名稱

你使用的數據庫名是 `movie-rating-system`，但 Supabase 默認數據庫名通常是 `postgres`。

**嘗試以下連接字符串：**

**選項 A（使用 postgres 數據庫）：**
```
postgresql://postgres:Linklamw0ng@db.krpejgpftveowxikhpvq.supabase.co:5432/postgres
```

**選項 B（使用你指定的數據庫名）：**
```
postgresql://postgres:Linklamw0ng@db.krpejgpftveowxikhpvq.supabase.co:5432/movie-rating-system
```

### 問題 4: 檢查 Supabase 項目設置

1. **確認項目狀態**
   - 在 Supabase Dashboard 中
   - 確認項目沒有被暫停
   - 確認數據庫服務正常運行

2. **檢查數據庫密碼**
   - 確認密碼 `Linklamw0ng` 正確
   - 如果忘記，可以在 Project Settings > Database 中重置

3. **檢查網絡連接**
   - 確認你的網絡可以訪問 Supabase
   - 檢查防火牆設置

## 推薦的測試步驟

### 步驟 1: 從 Supabase Dashboard 獲取官方連接字符串

1. 進入 Supabase Dashboard
2. 點擊 **Project Settings** > **Database**
3. 滾動到 **"Connection string"** 部分
4. 選擇 **"URI"** 格式
5. 複製連接字符串（應該已經包含正確的密碼）

### 步驟 2: 使用連接池（推薦用於生產環境）

1. 在 Database Settings 中
2. 查找 **"Connection pooling"** 部分
3. 選擇 **"Session mode"**（用於 Prisma）
4. 複製連接字符串

### 步驟 3: 測試連接

創建 `.env.local` 文件：
```env
DATABASE_URL="你的連接字符串"
```

然後測試：
```bash
npx prisma db push
```

## 如果還是不行

1. **檢查 Supabase 項目**
   - 確認項目已完全創建
   - 確認數據庫服務正常

2. **嘗試重置數據庫密碼**
   - Project Settings > Database
   - 點擊 "Reset database password"
   - 使用新密碼更新連接字符串

3. **聯繫 Supabase 支持**
   - 在 Dashboard 中查找 "Support" 或 "Help"
   - 提供你的項目 Reference ID: `krpejgpftveowxikhpvq`

## 正確的連接字符串格式

根據 Supabase 文檔，連接字符串應該是：

**直接連接（開發用）：**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**連接池（生產用，推薦）：**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

你的情況：
- Reference ID: `krpejgpftveowxikhpvq`
- 密碼: `Linklamw0ng`
- 區域: 需要從 Supabase Dashboard 確認

