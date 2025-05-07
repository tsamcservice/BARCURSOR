# BARCURSOR 專案

## 專案結構

- `GAS/` - Google Apps Script 程式碼
  - `NEW_BRIDGE.json` - 橋接服務，處理前端與後端的資料交換
  - `NEW_REPLY.json` - 回覆服務，處理 LINE Webhook 回覆
  - `NEW_line_card.xlsx` - 試算表服務（備用）
- `NEW_LINECARD/` - LINE 卡片前端應用
  - `index.html` - 主頁面
  - `css/` - 樣式檔案
  - `js/` - JavaScript 檔案
  - `data/` - 資料檔案
  - `preview/` - 預覽頁面
  - `share/` - 分享頁面
- `OG_HTML/` - Open Graph HTML 卡片
  - `og_html/` - 存放動態生成的 Open Graph HTML 檔案
- `BACKUP/` - 備用檔案區

## 系統架構與實際實現差異

### 1. GAS 服務實現

#### NEW_BRIDGE 服務
- **實際功能**：
  - 提供 Web API 介面
  - 處理卡片資料的讀取和儲存
  - 管理使用者 ID 對應
  - 上傳 OG HTML 到 GitHub
- **主要 API 端點**：
  - `doGet`：處理 GET 請求
    - `status=get`：取得卡片資料
    - `status=save`：儲存卡片資料
    - `status=uploadGithub`：上傳 OG HTML
    - `status=addReadCount`：增加閱讀次數

#### NEW_REPLY 服務
- **實際功能**：
  - 處理 LINE Webhook 請求
  - 生成 Flex Message
  - 管理群組訊息
- **主要功能**：
  - `doPost`：處理 LINE Webhook
  - `create_flexJson`：生成 Flex Message
  - `push_message_userid`：推播訊息給使用者
  - `push_message_group`：推播訊息給群組

### 2. NEW_LINECARD 前端實現

- **實際結構**：
  - 使用 Hexo 框架
  - 包含完整的部落格功能
  - 重定向到卡片頁面
- **主要檔案**：
  - `index.html`：主頁面，包含重定向邏輯
  - `css/style.css`：樣式檔案
  - `js/script.js`：JavaScript 功能

### 3. OG_HTML 實現

- **實際功能**：
  - 動態生成 Open Graph HTML
  - 提供靜態 URL 供分享
- **生成方式**：
  - 由 NEW_BRIDGE 服務動態生成
  - 上傳到 GitHub 倉庫
  - 提供靜態訪問 URL

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

### 3. GitHub 備份
- 主倉庫: BARCURSOR
- 分支: master (default)
- 備份路徑:
  - 前端程式碼: /NEW_LINECARD
  - OG HTML: /OG_HTML
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
- NEW_BRIDGE API: https://script.google.com/macros/s/AKfycbyWlV6JwSl2Jzwrc6NLvCplTYylN6fhn-_rwKg4gBKiZ3QUIDP8OGmEgJJzJWVxCwiB7w/exec
- NEW_REPLY API: https://script.google.com/macros/s/AKfycby-fQGSUcabNBTdpTeGeTUvJgz1DZjv-5BBXUoobDXK7HBZWgEFcisK47D5M4oP-0-L/exec

### 3. LINE Bot 測試
- 掃描 QR Code 加入好友
- 輸入「顯示名片」測試功能
- 分享名片給其他使用者

## 敏感資訊管理

### 1. 環境變數
以下敏感資訊建議使用環境變數管理：
- LINE Channel Access Token
- GitHub Access Token
- Google Sheet ID

### 2. 安全建議
1. 使用環境變數或安全的配置管理系統
2. 定期更換 Access Token
3. 限制 API 訪問權限
4. 實施適當的錯誤處理機制

## 維護與更新

### 1. GAS 更新
1. 使用 `clasp deploy` 更新服務
2. 確認環境變數設定
3. 測試 API 功能

### 2. GitHub 更新
1. 更新前端應用
2. 更新 OG HTML 模板
3. 確認 GitHub Pages 部署

### 3. 試算表維護
1. 定期備份資料
2. 檢查資料格式
3. 更新使用者對應表 