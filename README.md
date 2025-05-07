# BARCURSOR 專案

## 專案結構

- `GAS/` - Google Apps Script 程式碼
  - `NEW_BRIDGE.gs` - 橋接服務，處理前端與後端的資料交換
  - `NEW_REPLY.gs` - 回覆服務，處理 LINE Webhook 回覆
- `NEW_LINECARD/` - LINE 卡片前端應用
  - `index.html` - 網頁主頁
  - `card/` - 卡片編輯主頁面
  - `preview/` - 預覽頁面
  - `share/` - 分享頁面
  - `test/` - 測試頁面
  - `admin/` - 後台管理頁面
  - `css/` - 樣式檔案
  - `js/` - JavaScript 檔案
  - `data/` - 資料檔案
  - `api/` - API 路由
    - `auth/` - 認證相關 API
    - `cards/` - 卡片相關 API
    - `admin/` - 後台管理 API
- `OG_HTML/` - Open Graph HTML 卡片
  - `og_html/` - 存放動態生成的 Open Graph HTML 檔案

## 系統架構

### 1. GAS 服務實現

#### NEW_BRIDGE 服務
- **功能**：
  - 提供 Web API 介面
  - 處理卡片資料的讀取和儲存
  - 管理使用者 ID 對應
  - 上傳 OG HTML 到 Vercel
  - 備份資料到 Google Sheets
- **主要 API 端點**：
  - `doGet`：處理 GET 請求
    - `status=get`：取得卡片資料
    - `status=save`：儲存卡片資料
    - `status=uploadGithub`：上傳 OG HTML
    - `status=addReadCount`：增加閱讀次數

#### NEW_REPLY 服務
- **功能**：
  - 處理 LINE Webhook 請求
  - 生成 Flex Message
  - 管理群組訊息

### 2. NEW_LINECARD 前端實現

- **結構**：
  - 使用純 HTML/CSS/JavaScript
  - 整合 LIFF SDK
  - 支援卡片編輯和預覽
- **主要檔案**：
  - `index.html`：主頁面，包含重定向邏輯
  - `card/index.html`：卡片編輯頁面
  - `data/data.js`：卡片資料和預設值
  - `data/common.js`：共用函數和 API 呼叫

### 3. OG_HTML 實現

- **功能**：
  - 動態生成 Open Graph HTML
  - 提供靜態 URL 供分享
- **生成方式**：
  - 由 NEW_BRIDGE 服務動態生成
  - 上傳到 Vercel
  - 提供靜態訪問 URL

### 4. 資料備份

- **Google Sheets**：
  - 存放使用者資料
  - 備份卡片資訊
  - 記錄閱讀次數
- **Vercel**：
  - 部署前端應用
  - 提供 API 服務
  - 存放 OG HTML 檔案

## 部署資訊

### 1. Vercel 部署
- 主網域: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app
- 部署路徑:
  - 主頁面: /
  - 卡片頁面: /card
  - 預覽頁面: /preview
  - 分享頁面: /share
  - 測試頁面: /test
  - 後台管理: /admin

### 2. 環境變數設定
```
SUPABASE_URL=您的 Supabase URL
SUPABASE_KEY=您的 Supabase Key
LIFF_ID=2007327814-DGly5XNk
```

### 3. LINE 設定
- LIFF ID: 2007327814-DGly5XNk
- LIFF URL: https://liff.line.me/2007327814-DGly5XNk
- 端點 URL: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app

## 測試連結

### 1. 功能測試
- 主頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app
- 卡片頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/card
- 預覽頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/preview
- 分享頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/share
- 測試頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/test
- 後台管理: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/admin

### 2. API 端點
- 認證 API: 
  ```
  POST https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/api/auth/verify
  ```

- 卡片 API: 
  ```
  POST https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/api/cards/save
  GET https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/api/cards/list
  DELETE https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/api/cards/delete
  GET https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/api/cards/share
  ```

- 後台 API:
  ```
  GET https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/api/admin/users/search
  GET https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/api/admin/cards/search
  DELETE https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/api/admin/cards/delete
  ```

### 3. 管理員資訊
- 帳號: admin
- 密碼: admin55688

## 部署步驟

1. 在 Vercel 上建立新專案：
   - 連接到您的 GitHub 倉庫
   - 選擇 `NEW_LINECARD` 目錄
   - 設定環境變數：
     ```
     SUPABASE_URL=您的 Supabase URL
     SUPABASE_KEY=您的 Supabase Key
     LIFF_ID=2007327814-DGly5XNk
     ```

2. 在 LINE Developers Console 設定 LIFF：
   - 新增 LIFF 應用
   - 設定 Endpoint URL 為您的 Vercel 部署網址
   - 設定 Scope：
     - `profile`
     - `chat_message.write`
     - `share_target_picker`

3. 部署後測試：
   - 使用測試頁面進行基本功能測試
   - 確認後台管理功能
   - 測試卡片編輯和預覽功能

## 常見問題與解法
- LIFF 無法登入：請確認 Vercel 網域已加入 LINE Developers LIFF 設定
- API 錯誤：檢查環境變數設定
- 資料庫連線問題：確認 Supabase 連線設定
- 重定向問題：確認 common.js 中的重定向邏輯

## 維護與更新

### 1. GAS 更新
1. 使用 `clasp deploy` 更新服務
2. 確認環境變數設定
3. 測試 API 功能

### 2. Vercel 更新
1. 在本機端使用 Vercel CLI 部署
2. 確認部署狀態和功能
3. 檢查 API 路由是否正常

### 3. 資料維護
1. 定期備份資料到 Google Sheets
2. 檢查資料格式
3. 更新使用者對應表

## 近期修正與維護日誌

### 2024/06/XX
- 修正 Vercel 路徑設定，確保 /data、/css、/js 等靜態資源能正確載入。
- 強化 LIFF 初始化流程，確保 LINE 登入與 userId、displayName 正確取得。
- 修正卡片資料讀寫流程，確保能正確與 Google Sheet 互動。
- 加強「查看卡片」與宣傳卡片預覽的日誌與錯誤提示。
- 補充 OG 產生與讀取數流程的日誌。
- 新增 CHANGELOG.md 記錄每次重大修正。

### 常見問題與解法
- LIFF 無法登入：請確認 Vercel 網域已加入 LINE Developers LIFF 設定。
- 靜態資源未載入：請檢查 vercel.json 的 rewrites 規則。
- 卡片資料無法讀寫：請檢查 GAS API 部署網址與 Sheet 權限。
- OG 未產生：請檢查 GAS uploadOG_html 函數與 Vercel /og_html 路徑。

---

## 日誌說明
- 重大修正、部署、測試紀錄請見 CHANGELOG.md 