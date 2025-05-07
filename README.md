# BARCURSOR 專案

## 專案結構

- `GAS/` - Google Apps Script 程式碼
  - `NEW_BRIDGE.gs` - 橋接服務，處理前端與後端的資料交換
  - `NEW_REPLY.gs` - 回覆服務，處理 LINE Webhook 回覆
- `NEW_LINECARD/` - LINE 卡片前端應用
  - `index.html` - 主頁面
  - `card/` - 卡片編輯頁面
  - `preview/` - 預覽頁面
  - `share/` - 分享頁面
  - `css/` - 樣式檔案
  - `js/` - JavaScript 檔案
  - `data/` - 資料檔案
- `api/` - Vercel API 路由
  - `upload.js` - 處理檔案上傳

## 系統架構

### 1. GAS 服務實現

#### NEW_BRIDGE 服務
- **功能**：
  - 提供 Web API 介面
  - 處理卡片資料的讀取和儲存
  - 管理使用者 ID 對應
  - 上傳 OG HTML 到 Vercel
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

### 3. Vercel API 實現

- **功能**：
  - 處理 OG HTML 檔案上傳
  - 提供靜態檔案服務
- **路由**：
  - `/api/upload`：處理檔案上傳
  - `/og_html/*`：提供 OG HTML 檔案訪問

## 部署資訊

### 1. GAS 部署
- NEW_BRIDGE
  - 部署ID: AKfycbwfy6NZbWcrhc9KSQtMC2bcAWaGI_T4ASU42d8h4Jk0qNLHktnFJAynGJxcNV5QaLTrYA
  - 網址: https://script.google.com/macros/s/AKfycbwfy6NZbWcrhc9KSQtMC2bcAWaGI_T4ASU42d8h4Jk0qNLHktnFJAynGJxcNV5QaLTrYA/exec

- NEW_REPLY
  - 部署ID: AKfycby-fQGSUcabNBTdpTeGeTUvJgz1DZjv-5BBXUoobDXK7HBZWgEFcisK47D5M4oP-0-L
  - 網址: https://script.google.com/macros/s/AKfycby-fQGSUcabNBTdpTeGeTUvJgz1DZjv-5BBXUoobDXK7HBZWgEFcisK47D5M4oP-0-L/exec

### 2. Vercel 部署
- 主網域: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app
- 部署路徑:
  - 主頁面: /
  - 卡片頁面: /card
  - 預覽頁面: /preview
  - 分享頁面: /share
  - OG HTML: /og_html

### 3. GitHub 備份
- 主倉庫: BARCURSOR
- 分支: master (default)
- 備份路徑:
  - 前端程式碼: /NEW_LINECARD
  - API 路由: /api
  - GAS 程式碼: /GAS

## LINE 設定資訊

### 1. LINE Bot 設定
- Channel ID: 2007327902
- Channel Secret: ddd0d925d78bcf03722931d49ff27a75
- Channel Access Token: Ldq2Q7r5XtI8wuNuKA+zBmthI2ytWHfHXofMsBWIXnFMRqPjFnFQTRVtr89G/l3+fvIjt4+qPTr9nUAbOLUhLz3pcxgTLZRUQ5v2C9zHEIvUgaQ81asWrepPs1JBcKAYYqrRVDwsHR3lZ/eE7vSi2AdB04t89/1O/w1cDnyilFU=
- Webhook URL: https://script.google.com/macros/s/AKfycby-fQGSUcabNBTdpTeGeTUvJgz1DZjv-5BBXUoobDXK7HBZWgEFcisK47D5M4oP-0-L/exec

### 2. LIFF 設定
- LIFF ID: 2007327814-DGly5XNk
- LIFF URL: https://liff.line.me/2007327814-DGly5XNk
- 端點 URL: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app

## 測試連結

### 1. 功能測試
- 主頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app
- 卡片頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/card
- 預覽頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/preview
- 分享頁面: https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app/share

### 2. API 測試
- NEW_BRIDGE API: https://script.google.com/macros/s/AKfycbwfy6NZbWcrhc9KSQtMC2bcAWaGI_T4ASU42d8h4Jk0qNLHktnFJAynGJxcNV5QaLTrYA/exec
- NEW_REPLY API: https://script.google.com/macros/s/AKfycby-fQGSUcabNBTdpTeGeTUvJgz1DZjv-5BBXUoobDXK7HBZWgEFcisK47D5M4oP-0-L/exec

## 維護與更新

### 1. GAS 更新
1. 使用 `clasp deploy` 更新服務
2. 確認環境變數設定
3. 測試 API 功能

### 2. Vercel 更新
1. 推送更改到 GitHub
2. Vercel 會自動部署
3. 確認部署狀態和功能

### 3. 資料維護
1. 定期備份資料
2. 檢查資料格式
3. 更新使用者對應表 