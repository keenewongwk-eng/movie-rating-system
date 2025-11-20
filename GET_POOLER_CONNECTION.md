# 🔗 獲取 Supabase 連接池連接字符串

你的項目狀態是 Active，這很好！現在我們需要獲取連接池的連接字符串。

## 步驟：找到連接池連接字符串

### 方法 1: 從 Database Settings 獲取（最簡單）

1. **進入 Database Settings**
   - 在 Supabase Dashboard 中
   - 點擊 **Project Settings** > **Database**

2. **查找連接字符串部分**
   - 滾動頁面，查找以下部分：
     - **"Connection string"** 或
     - **"Connection info"** 或
     - **"Connection pooling"** 下的連接字符串

3. **選擇 Session mode**
   - 在連接字符串部分，應該有兩個選項：
     - **Session mode**（適合 Prisma，推薦）
     - **Transaction mode**
   - 選擇 **Session mode**
   - 點擊 **"Copy"** 複製連接字符串

4. **連接字符串格式**
   應該類似：
   ```
   postgresql://postgres.krpejgpftveowxikhpvq:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### 方法 2: 手動構建連接池連接字符串

如果找不到現成的連接字符串，可以手動構建：

1. **獲取項目信息**
   - Reference ID: `krpejgpftveowxikhpvq`（你已經有了）
   - 密碼: `Linklamw0ng`（你已經有了）
   - 區域: 需要確認（通常在 Project Settings > General 中）

2. **確認項目區域**
   - 進入 **Project Settings** > **General**
   - 查找 **Region** 或 **Location**
   - 常見區域：
     - `ap-southeast-1`（Southeast Asia - Singapore）
     - `us-east-1`（US East）
     - `eu-west-1`（Europe West）
     - 等等

3. **構建連接字符串**
   ```
   postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   
   例如，如果區域是 `ap-southeast-1`：
   ```
   postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

### 方法 3: 檢查 API Settings

有時連接信息也在 API Settings 中：

1. 進入 **Project Settings** > **API**
2. 查找 **"Connection string"** 或 **"Database URL"**
3. 可能包含連接池信息

## 重要區別：直接連接 vs 連接池

### 直接連接（你之前用的）
```
postgresql://postgres:Linklamw0ng@db.krpejgpftveowxikhpvq.supabase.co:5432/postgres
```
- 端口: `5432`
- 主機: `db.krpejgpftveowxikhpvq.supabase.co`
- 用戶名: `postgres`

### 連接池（推薦用於 Prisma）
```
postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-0-[REGION].pooler.supabase.com:6543/postgres
```
- 端口: `6543`
- 主機: `aws-0-[REGION].pooler.supabase.com`
- 用戶名: `postgres.krpejgpftveowxikhpvq`（包含 Reference ID）

## 測試連接

獲取連接字符串後，測試連接：

```bash
# 更新 .env 文件
echo 'DATABASE_URL="你的連接池連接字符串"' > .env

# 測試連接
npx prisma db push
```

## 如果還是找不到

請告訴我：
1. 在 Database Settings 頁面，你能看到哪些部分？
2. 你能看到 "Connection string" 或 "Connection info" 嗎？
3. 你的項目區域是什麼？（在 General Settings 中）

我可以根據你的具體情況提供更詳細的指導。

