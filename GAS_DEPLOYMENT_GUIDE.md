# GAS 部署指南

## 1. 環境變數設定

### 1.1 NEW_BRIDGE 專案
```
SHEET_ID=1_ShBQpCCgzPUPB6glCa7gKEzLRfKQBNu7R6dtrc2utU
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
```

### 1.2 NEW_REPLY 專案
```
LINE_CHANNEL_ID=2007327902
LINE_CHANNEL_SECRET=ddd0d925d78bcf03722931d49ff27a75
LINE_ACCESS_TOKEN=Ldq2Q7r5XtI8wuNuKA+zBmthI2ytWHfHXofMsBWIXnFMRqPjFnFQTRVtr89G/l3+fvIjt4+qPTr9nUAbOLUhLz3pcxgTLZRUQ5v2C9zHEIvUgaQ81asWrepPs1JBcKAYYqrRVDwsHR3lZ/eE7vSi2AdB04t89/1O/w1cDnyilFU=
SHEET_ID=1_ShBQpCCgzPUPB6glCa7gKEzLRfKQBNu7R6dtrc2utU
LIFF_ID=2007327814-DGly5XNk
```

## 2. NEW_BRIDGE 專案程式碼

### 2.1 doGet.gs
```javascript
// 連結 google sheet 表單
var google_sheet_url = 'https://docs.google.com/spreadsheets/d/1_ShBQpCCgzPUPB6glCa7gKEzLRfKQBNu7R6dtrc2utU/edit?gid=0#gid=0';
var spreadsheet = SpreadsheetApp.openByUrl(google_sheet_url);
var sheet_line_card = spreadsheet.getSheetByName("line_card"); // line_card資料存放區
var sheet_card_json = spreadsheet.getSheetByName("card_json"); // card_json資料存放區

function doGet(e) {
  var msg = e.parameters;
  var status = msg.status;
  var userId = msg.userId;
  var data_card = msg.card;
  var data_data = msg.data;
  var data_userId = JSON.parse(sheet_line_card.getSheetValues(2, 10, 1, 1)[0][0])
  var reply, N

  try {
    if (status == "get") {
      // 取得活動宣傳卡片JSON
      var card_json = sheet_card_json.getSheetValues(3, 2, 1, 7)[0].filter(value => value !== '')
      // 第一次登入網頁(資料尚未在google sheet)
      if (!(userId in data_userId)) {
        reply = { status: "first", cardJson: card_json };
      }
      else {
        N = data_userId[userId]
        var sheet_data_card = sheet_line_card.getSheetValues(N + 2, 3, 1, 1)[0][0]
        var readCount = sheet_line_card.getSheetValues(N + 2, 4, 1, 1)[0][0] || 0
        reply = { status: "ok", card: sheet_data_card, readCount: readCount, cardJson: card_json };
      }
    }
    else if (status == "save") {
      if (data_userId.hasOwnProperty(userId)) { N = data_userId[userId] }
      else {
        N = find_vain_N()
        data_userId[userId] = N
        sheet_line_card.getRange(2, 10, 1, 1).setValue(JSON.stringify(data_userId))
      }
      data_card = JSON.parse(data_card)
      data_card.memberId = "00" + N
      sheet_line_card.getRange(N + 2, 2, 1, 1).setValue(userId)
      sheet_line_card.getRange(N + 2, 5, 1, 1).setValue(data_card.displayName)
      sheet_line_card.getRange(N + 2, 3, 1, 1).setValue(JSON.stringify(data_card))
      reply = { status: "ok" };
    }
    else if (status == "uploadGithub") {
      data_card = JSON.parse(data_card)
      var uploadOG_url = uploadGithub_OG_html(userId, data_card.card_img_url, data_card.mainTitle_1, data_card.mainTitle_2)
      reply = { status: "ok", uploadOG_url: uploadOG_url };
    }
    else if (status == "addReadCount") {
      N = data_userId[userId]
      var readCount = parseInt((sheet_line_card.getSheetValues(N + 2, 4, 1, 1)[0][0] || 0)) + 1
      sheet_line_card.getRange(N + 2, 4, 1, 1).setValue(readCount)
      reply = { status: "ok", readCount: readCount };
    }
    else {
      reply = { status: "error" };
    }
  }
  catch (e) {
    reply = { status: "error" };
  }

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(reply));
  return output;
}
```

### 2.2 other_function.gs
```javascript
// 找出 google sheet 表單內空的格子
function find_vain_N() {
  var N
  var data_userId = JSON.parse(sheet_line_card.getSheetValues(2, 10, 1, 1)[0][0])
  const values = Object.values(data_userId).sort((a, b) => a - b);
  var N_Max = values.length > 0 ? Math.max(...values) : -1;
  const all_numberArr = Array.from({ length: N_Max }, (_, i) => i);
  const vain_N_Arr = all_numberArr.filter(num => !values.includes(num));
  for (N of vain_N_Arr) {
    var sheet_userId = sheet_line_card.getSheetValues(N + 2, 2, 1, 1)[0][0]
    if (sheet_userId == "") { return N }
  }
  N = N_Max
  while (true) {
    N++
    var sheet_userId = sheet_line_card.getSheetValues(N + 2, 2, 1, 1)[0][0]
    if (sheet_userId == "") {
      return N
    }
  }
}
```

### 2.3 uploadGithub_OG_html.gs
```javascript
// 把 OG html 檔案上傳到 Vercel 並回傳 URL
function uploadGithub_OG_html(userId, card_img_url = "", mainTitle_1 = "", mainTitle_2 = "") {
  // 獲取當前時間戳
  const timestamp = Date.now();
  // 上傳到 Vercel 的檔案路徑
  const filePath = 'og_html/' + userId + "_" + timestamp + ".html";
  const fileContent =
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta property="og:image" content="`+ card_img_url + `">
        <meta property="og:title" content="`+ mainTitle_1 + `">
        <meta property="og:description" content="`+ mainTitle_2 + `">
      </head>
      <body>
        <script>
          window.location.href = "/preview/?userId=` + encodeURIComponent(userId) + `";	
        </script>
      </body>
    </html>`;

  // 上傳到 Vercel
  const vercelUrl = 'https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      path: filePath,
      content: fileContent
    })
  };

  try {
    const response = UrlFetchApp.fetch(vercelUrl + '/api/upload', options);
    const result = JSON.parse(response.getContentText());
    return result.url;
  } catch (error) {
    console.error('上傳到 Vercel 失敗:', error);
    throw error;
  }
}
```

### 2.4 test.gs
```javascript
// 這裡是開發人員測試的地方
function test() {
  parameters={}
  parameters["D"] = 1
  console.log(   parameters["PromotionalCard"])
}
```

## 3. NEW_REPLY 專案程式碼

### 3.1 doPost.gs
```javascript
//認證身份 channel_access_token
var CHANNEL_ACCESS_TOKEN = 'YOUR_LINE_CHANNEL_ACCESS_TOKEN'

//連結google試算表
var google_sheet_url = 'https://docs.google.com/spreadsheets/d/1_ShBQpCCgzPUPB6glCa7gKEzLRfKQBNu7R6dtrc2utU/edit?gid=0#gid=0';
var spreadsheet = SpreadsheetApp.openByUrl(google_sheet_url);
var sheet_line_card = spreadsheet.getSheetByName("line_card"); // line_card資料存放區
var sheet_card_json = spreadsheet.getSheetByName("card_json"); // card_json資料存放區

var today = new Date(); //取得日期與時間

function doPost(e) {
  //接收使用者在 line bot 上所動作的觸發資訊
  var msg = JSON.parse(e.postData.contents);
  //從接收到的訊息中取出 replyToken 和發送的訊息文字資訊 
  var replyToken = msg.events[0].replyToken;
  var type = msg.events[0].type;
  var userid = msg.events[0].source.userId;
  var groupid = msg.events[0].source.groupId;
  var data_userId = JSON.parse(sheet_line_card.getSheetValues(2, 10, 1, 1)[0][0])

  //判斷訊息格式
  if (type == 'join') { }
  else if (type == 'leave') { }
  else if (type == "follow") { }
  else if (type == 'postback') { }
  else if (type == 'message' && msg.events[0].message.text != null) {
    var userMessage = msg.events[0].message.text;
    if (userMessage == "顯示名片") { userMessage = userid }
    if (userMessage in data_userId && userid in data_userId) {
      N = data_userId[userMessage]
      var sheet_data_card = sheet_line_card.getSheetValues(N + 2, 3, 1, 1)[0][0]
      var flexJson = create_flexJson(JSON.parse(sheet_data_card), userMessage)
      reply_message(replyToken, flexJson)
    }
  }
  else { }
}
```

### 3.2 other_function.gs
```javascript
// 找出 google sheet 表單內空的格子
function find_vain_N() {
  var N
  var data_userId = JSON.parse(sheet_line_card.getSheetValues(2, 10, 1, 1)[0][0])
  const values = Object.values(data_userId).sort((a, b) => a - b);
  var N_Max = values.length > 0 ? Math.max(...values) : -1;
  const all_numberArr = Array.from({ length: N_Max }, (_, i) => i);
  const vain_N_Arr = all_numberArr.filter(num => !values.includes(num));
  for (N of vain_N_Arr) {
    var sheet_userId = sheet_line_card.getSheetValues(N + 2, 2, 1, 1)[0][0]
    if (sheet_userId == "") { return N }
  }
  N = N_Max
  while (true) {
    N++
    var sheet_userId = sheet_line_card.getSheetValues(N + 2, 2, 1, 1)[0][0]
    if (sheet_userId == "") {
      return N
    }
  }
}
```

### 3.3 create_flexJson.gs
```javascript
//把參數帶入到flexJson訊息中並回傳flexJson
function create_flexJson(sheet_data_card, userId) {
  //flexJson訊息回覆的參數
  var textContent_1_url = sheet_data_card.textContent_1_url || "https://raw.githubusercontent.com/tsamcservice/NEWCURSOR/data/images/ts.jpg"
  var textContent_2_url = sheet_data_card.textContent_2_url || "https://donate.ls-love.org/"
  var textColor = sheet_data_card.textColor || "#000000"
  var mainTitle_1 = sheet_data_card.mainTitle_1 || "呈璽理財藝術共享空間"
  var mainTitle_2 = sheet_data_card.mainTitle_2 || "我在呈璽，欣賞美好幸福 我在呈璽，喝茶喝咖啡很悠閒 我不在呈璽，就是在前往呈璽的路上"
  var memberId = sheet_data_card.memberId || "000"
  var subTitle_2 = sheet_data_card.subTitle_2 || "青藝盟盟主"
  var textContent_1 = sheet_data_card.textContent_1 || "05/06(六)09:50~12:00"
  var textContent_2 = sheet_data_card.textContent_2 || "呈璽LINE@"
  var displayName = sheet_data_card.displayName || ""

  var flexJsonList = sheet_card_json.getSheetValues(3, 2, 1, 7)[0].filter(value => value !== '')[0]
  flexJsonList = flexJsonList.replace(/mainTitle_1/g, mainTitle_1);
  flexJsonList = flexJsonList.replace(/mainTitle_2/g, mainTitle_2);
  flexJsonList = flexJsonList.replace(/memberId/g, memberId);
  // flexJsonList = flexJsonList.replace(/subTitle_2/g, '"' + subTitle_2 + '"');
  flexJsonList = flexJsonList.replace(/textContent_1_url/g, textContent_1_url);
  // flexJsonList = flexJsonList.replace(/textContent_1/g, '"' + textContent_1 + '"');
  flexJsonList = flexJsonList.replace(/textContent_2_url/g, textContent_2_url);
  flexJsonList = flexJsonList.replace(/textContent_2/g, textContent_2);
  flexJsonList = flexJsonList.replace(/displayName/g, displayName);
  flexJsonList = flexJsonList.replace(/textColor/g, textColor);
  flexJsonList = flexJsonList.replace(/S{3,}/g, "https://liff.line.me/" + "2007327814-DGly5XNk" + "/?userId=" + encodeURIComponent(userId));

  return [{
    type: "flex",
    altText: "Flex Message",
    contents: {
      type: "carousel",
      contents: [JSON.parse(flexJsonList)]
    }
  }]
}
```

### 3.4 push_message_userid.gs
```javascript
//推波給使用者的訊息程式(任何訊息格式)
function push_message_userid(reply, userid = "U48f2fd0b385a571e2ea9e355eab78ce7") {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/multicast', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': [userid],
      'messages': reply
    }),
  })
}
```

### 3.5 push_txt_userid.gs
```javascript
//推波給使用者的訊息程式(只限文字格式)
function push_txt_userid(reply, userid = "U48f2fd0b385a571e2ea9e355eab78ce7") {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/multicast', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': [userid],
      'messages': [{ 'type': 'text', 'text': reply }]
    }),
  });
}
```

### 3.6 push_message_group.gs
```javascript
//推波群組訊息(任何訊息格式)
function push_message_group(groupId, reply) {
  var url = 'https://api.line.me/v2/bot/message/push'
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': groupId,
      'messages': reply
    }),
  });
} 
```

### 3.7 reply_message.gs
```javascript
// 對於訊息回覆的程式碼
function reply_message(replyToken, reply, url = 'https://api.line.me/v2/bot/message/reply') {
  UrlFetchApp.fetch(url, {
    'headers': { //JavaScript的headers
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN, //帶入LINE BOT的channel_access_token
    },
    'method': 'post', //使用POST的方式回傳
    'payload': JSON.stringify({ //將訊息轉為JSON格式，JavaScript常用JSON傳輸資料
      'replyToken': replyToken,  //每個reply事件專屬的replyToken
      'messages': reply //回傳文字訊息，內容為reply也就是userMessage
    }),
  });
}
```

### 3.8 test.gs
```javascript
// 這裡是開發人員測試的地方
function test() {
  push_txt_userid("1")
}
```

## 4. 部署步驟

### 4.1 NEW_BRIDGE 部署
1. 前往 [Google Apps Script](https://script.google.com/)
2. 點擊 "新增專案"
3. 命名為 "NEW_BRIDGE"
4. 複製上述 NEW_BRIDGE 相關程式碼到對應的檔案中
5. 設定環境變數
6. 部署為網頁應用程式：
   - 執行身份：以執行此應用程式的使用者身份
   - 存取權限：任何人
7. 部署 ID: AKfycbwfy6NZbWcrhc9KSQtMC2bcAWaGI_T4ASU42d8h4Jk0qNLHktnFJAynGJxcNV5QaLTrYA
8. 部署 URL: https://script.google.com/macros/s/AKfycbwfy6NZbWcrhc9KSQtMC2bcAWaGI_T4ASU42d8h4Jk0qNLHktnFJAynGJxcNV5QaLTrYA/exec

### 4.2 NEW_REPLY 部署
1. 前往 [Google Apps Script](https://script.google.com/)
2. 點擊 "新增專案"
3. 命名為 "NEW_REPLY"
4. 複製上述 NEW_REPLY 相關程式碼到對應的檔案中
5. 設定環境變數
6. 部署為網頁應用程式：
   - 執行身份：以執行此應用程式的使用者身份
   - 存取權限：任何人
7. 部署 ID: AKfycby-fQGSUcabNBTdpTeGeTUvJgz1DZjv-5BBXUoobDXK7HBZWgEFcisK47D5M4oP-0-L
8. 部署 URL: https://script.google.com/macros/s/AKfycby-fQGSUcabNBTdpTeGeTUvJgz1DZjv-5BBXUoobDXK7HBZWgEFcisK47D5M4oP-0-L/exec

## 5. 注意事項

### 5.1 權限設定
1. 確保 Google Sheet 的存取權限正確
2. 確認 GitHub Token 的權限設定
3. 檢查 LINE Bot 的 Webhook 設定

### 5.2 路徑設定
1. 所有 LIFF 相關路徑必須指向正確的 Vercel 部署網址
2. 避免使用舊的路徑和連結
3. 確保所有分享連結使用正確的 LIFF ID

### 5.3 錯誤處理
1. 定期檢查 GAS 執行日誌
2. 監控 Sheet 資料的完整性
3. 確保 API 呼叫的正確性 