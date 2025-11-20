# 📝 Vercel 環境中的日誌記錄

## 重要說明

在 Vercel 無服務器環境中，**本地文件系統不可用**，因此 `logs/error.log` 文件不會被創建或更新。

## 錯誤日誌在哪裡？

### ✅ Vercel Function Logs（正確位置）

所有錯誤日誌都在 **Vercel Dashboard** 中：

1. **訪問 Vercel Dashboard**
   - https://vercel.com/dashboard
   - 登入你的帳號

2. **查看項目日誌**
   - 進入 `movie-rating-system` 項目
   - 點擊 **"Deployments"** 標籤
   - 點擊最新的部署
   - 查看 **"Function Logs"** 或 **"Runtime Logs"**

3. **實時查看日誌**
   - 在部署詳情頁面，點擊 **"View Function Logs"**
   - 可以看到實時的錯誤和日誌輸出

### 📋 日誌格式

在 Vercel 中，錯誤日誌會顯示為：

```
[ERROR] [GET] /api/movies - 500 Error
Error details: { ... }
Stack trace: ...
```

## 本地開發 vs 生產環境

### 本地開發
- ✅ 日誌寫入 `logs/error.log` 文件
- ✅ 同時輸出到控制台
- ✅ 可以查看本地文件

### Vercel 生產環境
- ✅ 日誌輸出到 Vercel 控制台（Function Logs）
- ❌ **不會**寫入本地文件（文件系統不可用）
- ✅ 所有 `console.error()` 和 `logger.error()` 都會被 Vercel 捕獲

## 如何查看生產環境錯誤

### 方法 1: Vercel Dashboard（推薦）

1. 前往 https://vercel.com/dashboard
2. 選擇項目
3. 點擊 **Deployments** > 最新部署
4. 查看 **Function Logs**

### 方法 2: Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 查看日誌
vercel logs movie-rating-system
```

### 方法 3: 健康檢查端點

訪問：
```
https://movie-rating-system-gamma.vercel.app/api/health
```

這會顯示系統狀態和任何錯誤。

## 調試生產環境錯誤

### 步驟 1: 檢查 Vercel 日誌

1. 訪問 Vercel Dashboard
2. 查看 Function Logs
3. 查找 `[ERROR]` 標記的日誌

### 步驟 2: 檢查環境變數

1. **Settings** > **Environment Variables**
2. 確認 `DATABASE_URL` 已設置
3. 確認值正確

### 步驟 3: 測試 API 端點

直接訪問：
```
https://movie-rating-system-gamma.vercel.app/api/movies
```

查看返回的錯誤信息。

### 步驟 4: 使用健康檢查

訪問：
```
https://movie-rating-system-gamma.vercel.app/api/health
```

查看系統狀態。

## 常見問題

### Q: 為什麼本地 logs/error.log 沒有更新？

A: 因為你在訪問生產環境（Vercel），而不是本地環境。生產環境的日誌在 Vercel Dashboard 中。

### Q: 如何在本地查看生產環境的錯誤？

A: 使用 Vercel Dashboard 或 Vercel CLI。本地文件只記錄本地開發時的錯誤。

### Q: 錯誤日誌會保存多久？

A: Vercel 免費計劃保存 30 天的日誌。付費計劃保存更長時間。

## 總結

- ✅ **本地開發**：查看 `logs/error.log`
- ✅ **生產環境（Vercel）**：查看 Vercel Dashboard > Function Logs
- ✅ 所有錯誤都會被記錄，只是位置不同

