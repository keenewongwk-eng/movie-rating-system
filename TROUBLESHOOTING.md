# 🔧 Supabase 連接問題排查

## 當前連接字符串

```
postgresql://postgres:Linklamw0ng@db.krpejgpftveowxikhpvq.supabase.co:5432/postgres
```

## 排查步驟

### 步驟 1: 檢查 Supabase 項目狀態

1. **登入 Supabase Dashboard**

   - 前往 https://supabase.com/dashboard
   - 找到你的項目

2. **確認項目狀態**

   - 項目應該顯示為 **"Active"**（綠色）
   - 如果顯示 **"Paused"** 或 **"Creating"**，需要等待或恢復項目

3. **檢查數據庫服務**
   - 在 Dashboard 中，確認數據庫圖標顯示正常
   - 如果看到警告或錯誤，需要先解決

### 步驟 2: 嘗試使用連接池（推薦）

Supabase 推薦使用連接池進行連接，特別是對於 Prisma。

1. **進入 Database Settings**

   - Project Settings > Database
   - 滾動到 **"Connection pooling"** 部分

2. **獲取連接池連接字符串**

   - 選擇 **"Session mode"**（適合 Prisma）
   - 複製連接字符串
   - 格式通常是：
     ```
     postgresql://postgres.krpejgpftveowxikhpvq:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```

3. **使用連接池連接字符串**
   - 替換 `.env` 文件中的連接字符串
   - 端口通常是 `6543` 而不是 `5432`

### 步驟 3: 檢查網絡連接

1. **測試網絡連接**

   ```bash
   ping db.krpejgpftveowxikhpvq.supabase.co
   ```

2. **檢查防火牆**
   - 確認防火牆允許連接端口 5432 或 6543
   - 某些公司網絡可能阻止數據庫連接

### 步驟 4: 驗證密碼

1. **確認數據庫密碼正確**

   - 密碼是：`Linklamw0ng`
   - 如果忘記，可以在 Project Settings > Database 中重置

2. **重置密碼（如果需要）**
   - 點擊 "Reset database password"
   - 使用新密碼更新連接字符串

### 步驟 5: 檢查項目區域

1. **確認項目區域**
   - 在 Project Settings > General 中
   - 確認項目區域（例如：Southeast Asia）
   - 連接池 URL 中的區域應該匹配

## 常見解決方案

### 解決方案 1: 等待項目完全創建

如果項目剛創建，可能需要等待 5-10 分鐘讓數據庫完全初始化。

### 解決方案 2: 使用連接池（最推薦）

連接池更穩定，特別適合生產環境：

```
postgresql://postgres.krpejgpftveowxikhpvq:Linklamw0ng@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 解決方案 3: 檢查 Supabase 狀態頁面

1. 前往 https://status.supabase.com
2. 確認所有服務正常運行
3. 如果有服務中斷，等待恢復

### 解決方案 4: 重新創建項目

如果以上都不行，可以：

1. 刪除當前項目
2. 創建新項目
3. 記下新的 Reference ID 和密碼

## 測試連接的替代方法

### 使用 Supabase SQL Editor

1. 在 Supabase Dashboard 中
2. 點擊左側選單的 **"SQL Editor"**
3. 點擊 **"New query"**
4. 運行簡單查詢：
   ```sql
   SELECT version();
   ```
5. 如果成功，說明數據庫正常，問題可能在連接字符串

### 使用 psql（如果已安裝）

```bash
psql "postgresql://postgres:Linklamw0ng@db.krpejgpftveowxikhpvq.supabase.co:5432/postgres"
```

## 下一步

1. **檢查 Supabase Dashboard 中的項目狀態**
2. **嘗試使用連接池連接字符串**
3. **如果還是不行，聯繫 Supabase 支持**

告訴我你看到了什麼，我可以提供更具體的幫助！
