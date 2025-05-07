# LINE Flex Message 即時編輯器 (barv2)

這是一個獨立的 LINE Flex Message 即時編輯器專案，提供卡片編輯、預覽和管理功能。

## 專案結構

- `frontend/` - 前端應用
  - `index.html` - 編輯器主頁面
  - `preview/` - 預覽頁面
  - `admin/` - 後台管理頁面
  - `css/` - 樣式檔案
  - `js/` - JavaScript 檔案
- `backend/` - 後端 API
  - `api/` - API 路由
    - `cards/` - 卡片相關 API
    - `admin/` - 後台管理 API

## 功能特點

1. 即時編輯
   - 支援多種元件（box、text、image、button）
   - 即時預覽
   - 自動儲存

2. 預覽功能
   - 即時預覽
   - 分享到 LINE
   - 複製分享連結

3. 後台管理
   - 使用者管理
   - 卡片管理
   - 搜尋功能

## 部署資訊

### 1. Vercel 部署
- 主網域: https://barv2-xxxx.vercel.app
- 部署路徑:
  - 編輯器: /
  - 預覽頁面: /preview
  - 後台管理: /admin

### 2. 環境變數設定
```
SUPABASE_URL=您的 Supabase URL
SUPABASE_KEY=您的 Supabase Key
LIFF_ID=2007327814-BdWpj70m
```

### 3. LINE 設定
- LIFF ID: 2007327814-BdWpj70m
- LIFF URL: https://liff.line.me/2007327814-BdWpj70m
- 端點 URL: 您的 Vercel 部署網址

## API 端點

### 卡片 API
```
POST /api/cards/save - 儲存卡片
GET /api/cards/list - 取得卡片列表
DELETE /api/cards/delete - 刪除卡片
```

### 後台 API
```
GET /api/admin/users/search - 搜尋使用者
GET /api/admin/cards/search - 搜尋卡片
DELETE /api/admin/cards/delete - 刪除卡片
```

## 管理員資訊
- 帳號: admin
- 密碼: admin55688

## 部署步驟

1. 在 Vercel 上建立新專案：
   - 連接到您的 GitHub 倉庫
   - 選擇專案根目錄
   - 設定環境變數

2. 在 LINE Developers Console 設定 LIFF：
   - 新增 LIFF 應用
   - 設定 Endpoint URL
   - 設定必要的 Scope

3. 部署後測試：
   - 測試編輯器功能
   - 確認預覽功能
   - 測試後台管理

## 常見問題與解法
- LIFF 無法登入：確認 Vercel 網域設定
- API 錯誤：檢查環境變數
- 資料庫連線問題：確認 Supabase 設定 