# 🔗 Supabase 連接字符串獲取指南

如果在 Settings 中找不到 Connection string，請嘗試以下方法：

## 方法 1: 通過 Database Settings（推薦）

1. **進入項目 Dashboard**

   - 登入 https://supabase.com
   - 點擊你的項目

2. **打開 Database 設置**

   - 點擊左側選單的 **"Project Settings"**（齒輪圖標 ⚙️）
   - 或者直接點擊左側選單的 **"Settings"**
   - 然後選擇 **"Database"**

3. **查找連接信息**

   - 在 Database 設置頁面中，查找以下部分：
     - **"Connection string"** 或
     - **"Connection pooling"** 或
     - **"Connection info"**
   - 如果看到多個選項，選擇 **"URI"** 格式

4. **如果還是找不到**
   - 嘗試滾動頁面，連接字符串通常在頁面下方
   - 或者查看 **"Connection pooling"** 部分

## 方法 2: 通過 Connection Pooling

1. 在 Settings > Database 頁面
2. 查找 **"Connection pooling"** 部分
3. 點擊 **"Connection string"** 或 **"URI"**
4. 複製連接字符串

## 方法 3: 手動構建連接字符串

如果找不到連接字符串，可以手動構建：

1. **獲取項目信息**

   - 在 Supabase Dashboard 中
   - 點擊左側選單的 **"Project Settings"** > **"General"**
   - 找到以下信息：
     - **Reference ID**: 例如 `abcdefghijklmnop`
     - **Database Password**: 你創建項目時設置的密碼

2. **構建連接字符串**

   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[REFERENCE-ID].supabase.co:5432/postgres
   ```

   例如，如果：

   - Reference ID 是 `abcdefghijklmnop`
   - 密碼是 `MyPassword123`

   連接字符串就是：

   ```
   postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```

## 方法 4: 通過 SQL Editor（查看連接信息）

1. 點擊左側選單的 **"SQL Editor"**
2. 點擊 **"New query"**
3. 運行以下 SQL 查詢來查看連接信息：
   ```sql
   SELECT current_database(), current_user;
   ```
4. 雖然這不會直接顯示連接字符串，但可以確認數據庫連接正常

## 方法 5: 檢查不同位置的設置

Supabase 界面可能因版本而異，嘗試以下位置：

1. **Project Settings > Database**

   - 查找 "Connection string"、"Connection info" 或 "Database URL"

2. **Project Settings > API**

   - 有時連接信息也在這裡

3. **直接搜索**
   - 在設置頁面使用瀏覽器的搜索功能（Ctrl+F）
   - 搜索 "connection" 或 "database"

## 方法 6: 使用 Supabase CLI（高級）

如果安裝了 Supabase CLI：

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入
supabase login

# 鏈接項目
supabase link --project-ref your-project-ref

# 獲取連接字符串
supabase status
```

## 最簡單的方法：手動構建

**步驟：**

1. **獲取 Reference ID**

   - 在 Supabase Dashboard
   - 點擊 **"Project Settings"** > **"General"**
   - 找到 **"Reference ID"**（通常是一串字母和數字）

2. **記住你的數據庫密碼**

   - 這是創建項目時設置的密碼

3. **構建連接字符串**
   ```
   postgresql://postgres:你的密碼@db.你的ReferenceID.supabase.co:5432/postgres
   ```

**示例：**

- Reference ID: `abcdefghijklmnop`
- 密碼: `MyPassword123`
- 連接字符串: `postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres`

## 驗證連接字符串

獲取連接字符串後，可以在本地測試：

1. **創建 `.env.local` 文件**

   ```env
   DATABASE_URL="你的連接字符串"
   ```

2. **測試連接**
   ```bash
   npx prisma db push
   ```

如果成功，說明連接字符串正確！

## 需要幫助？

如果以上方法都不行，請告訴我：

1. 你在 Supabase Dashboard 中看到了什麼？
2. 你能找到 "Project Settings" > "General" 嗎？
3. 你能看到 Reference ID 嗎？

我可以根據你的具體情況提供更詳細的指導。
