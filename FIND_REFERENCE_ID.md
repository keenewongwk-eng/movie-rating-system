# 🔍 如何找到 Supabase Reference ID

如果只看到 Project ID，請嘗試以下方法：

## 方法 1: 檢查瀏覽器 URL

Supabase Dashboard 的 URL 通常包含 Reference ID：

1. **查看瀏覽器地址欄**
   - URL 格式通常是：`https://supabase.com/dashboard/project/[REFERENCE-ID]`
   - 例如：`https://supabase.com/dashboard/project/abcdefghijklmnop`
   - 中間的 `abcdefghijklmnop` 就是 Reference ID

2. **複製 Reference ID**
   - 從 URL 中複製這個 ID
   - 這就是你需要的 Reference ID

## 方法 2: 檢查 API Settings

1. **進入 API Settings**
   - 點擊左側選單的 **"Project Settings"** > **"API"**
   - 或者直接點擊 **"API"** 選單項

2. **查找項目 URL**
   - 在 API Settings 頁面
   - 查找 **"Project URL"** 或 **"API URL"**
   - URL 格式通常是：`https://[REFERENCE-ID].supabase.co`
   - 例如：`https://abcdefghijklmnop.supabase.co`
   - `abcdefghijklmnop` 就是 Reference ID

## 方法 3: 檢查 Database Settings 的其他位置

1. **進入 Database Settings**
   - 點擊 **"Project Settings"** > **"Database"**

2. **查找以下信息**
   - **Host**: 可能顯示為 `db.[REFERENCE-ID].supabase.co`
   - **Connection pooling**: 可能包含 Reference ID
   - **任何包含 `.supabase.co` 的 URL**

3. **從 Host 提取 Reference ID**
   - 如果看到 Host: `db.abcdefghijklmnop.supabase.co`
   - 那麼 `abcdefghijklmnop` 就是 Reference ID

## 方法 4: 使用 Project ID 嘗試（不推薦，但可以試試）

雖然通常不工作，但可以嘗試：

```
postgresql://postgres:你的密碼@db.[PROJECT-ID].supabase.co:5432/postgres
```

如果這個不工作，說明必須使用 Reference ID。

## 方法 5: 檢查連接池設置

1. **進入 Database Settings**
   - 點擊 **"Project Settings"** > **"Database"**

2. **查找 Connection Pooling**
   - 滾動到 "Connection Pooling" 部分
   - 可能顯示連接字符串或 Host 信息
   - Host 格式：`db.[REFERENCE-ID].supabase.co`

## 方法 6: 使用 Supabase CLI（如果已安裝）

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入
supabase login

# 列出項目（會顯示 Reference ID）
supabase projects list
```

## 方法 7: 檢查項目概覽頁面

1. **回到項目主頁面**
   - 點擊左側選單的 **"Home"** 或項目名稱

2. **查看頁面信息**
   - 有時 Reference ID 會顯示在頁面頂部或側邊欄
   - 查找任何包含 `.supabase.co` 的 URL

## 最可靠的方法：從 URL 獲取

**最簡單的方法：**

1. 在 Supabase Dashboard 中，查看瀏覽器地址欄
2. URL 格式：`https://supabase.com/dashboard/project/[這裡就是Reference-ID]`
3. 複製這個 ID

**示例：**
- 如果 URL 是：`https://supabase.com/dashboard/project/abcdefghijklmnop`
- 那麼 Reference ID 就是：`abcdefghijklmnop`

## 構建連接字符串

獲取 Reference ID 後：

```
postgresql://postgres:你的密碼@db.你的ReferenceID.supabase.co:5432/postgres
```

## 如果還是找不到

如果以上方法都不行，可以：

1. **檢查瀏覽器控制台**
   - 按 F12 打開開發者工具
   - 查看 Network 標籤
   - 查找包含 `supabase.co` 的請求
   - URL 中可能包含 Reference ID

2. **聯繫 Supabase 支持**
   - 在 Supabase Dashboard 中查找 "Support" 或 "Help"
   - 詢問如何獲取 Reference ID

3. **重新創建項目**
   - 如果項目剛創建，可以刪除並重新創建
   - 這次記下 Reference ID

## 驗證連接字符串

獲取連接字符串後，測試連接：

```bash
# 創建 .env.local 文件
echo 'DATABASE_URL="你的連接字符串"' > .env.local

# 測試連接
npx prisma db push
```

如果成功，說明連接字符串正確！

