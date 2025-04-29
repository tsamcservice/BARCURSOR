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
  - 部署ID: AKfycbytOQjUDPdHvPwn9CAtsNc9VyB356gakqEEBDVsA0J90J21fKcbsMX_FrihdjqJ8KyY
  - 網址: https://script.google.com/macros/s/AKfycbytOQjUDPdHvPwn9CAtsNc9VyB356gakqEEBDVsA0J90J21fKcbsMX_FrihdjqJ8KyY/exec

- NEW_REPLY
  - 部署ID: AKfycbwZIJQ7toOMi4-IzStW6VW5WhRrWLPlbEgIc2t-waWgxoHD-wHBEi-1OmqV7YpU5cSW
  - 網址: https://script.google.com/macros/s/AKfycbwZIJQ7toOMi4-IzStW6VW5WhRrWLPlbEgIc2t-waWgxoHD-wHBEi-1OmqV7YpU5cSW/exec

### 2. GitHub 部署
- 主倉庫: BARCURSOR
- 分支: master (default)
- 部署路徑:
  - NEW_LINECARD: https://tsamcservice.github.io/BARCURSOR/NEW_LINECARD/
  - OG_HTML: https://tsamcservice.github.io/BARCURSOR/OG_HTML/

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