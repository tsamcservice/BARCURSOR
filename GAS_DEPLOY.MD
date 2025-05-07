# GAS 部署說明

## 工作流程說明

### 1. 程式碼管理
- 所有 GAS 程式碼的修改都應該在 `GAS_DEPLOY.MD` 中進行
- 本機端的 `.json` 檔案僅用於版本控制，不應直接修改
- 程式碼分為兩個主要服務：
  - NEW_BRIDGE：4 個主要函數
  - NEW_REPLY：8 個主要函數

### 2. 部署流程
1. 在 `GAS_DEPLOY.MD` 中修改程式碼
2. 複製修改後的程式碼到 GAS 編輯器
3. 手動部署到 GAS
4. 將修改推送到 GitHub 進行版本控制

### 3. 注意事項
- 保持主架構不變，僅修改必要的連結部分
- 確保程式碼格式正確，便於複製到 GAS
- 每次修改後都要測試功能是否正常

## NEW_BRIDGE 服務部署

### 完整程式碼
####doget.gs ##NEW_BRIDGE_1

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
      var uploadOG_url = uploadOG_html(userId, data_card.card_img_url, data_card.mainTitle_1, data_card.mainTitle_2)
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

####other_function().gs ##NEW_BRIDGE_2
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


####uploadOG_html().gs ##NEW_BRIDGE_3
```javascript
// 把 OG html 檔案上傳到 Github 並檢查是否可以連上後回傳 URL
function uploadOG_html(userId, card_img_url = "", mainTitle_1 = "", mainTitle_2 = "") {
  // 獲取當前時間戳
  const timestamp = Date.now();
  // 上傳github的accessToken
  const accessToken = 'YOUR_GITHUB_TOKEN';
  // 上傳github的各參數
  const owner = 'tsamcservice';
  const repo = 'og_html';
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

  function checkWebPageAccessibility(url) {
    while (true) {
      try {
        const response = UrlFetchApp.fetch(url);
        const statusCode = response.getResponseCode();

        if (statusCode === 200) {
          return url;
        }
      } catch (e) { }
      Utilities.sleep(30000);
    }
  }
  function uploadFileToGitHub() {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      };
      const payload = {
        message: 'html for OG',
        committer: {
          name: 'tsamcservice',
          email: 'tsamcservice@gmail.com'
        },
        content: encodeFileContentToBase64(fileContent)
      };

      const options = {
        method: 'PUT',
        headers: headers,
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      console.log(response)
      const responseData = JSON.parse(response.getContentText());
      // 請求成功後的響應數據
      console.log(responseData)
      // 回傳網址
      return "/BARCURSOR/NEW_LINECARD/og_html/og_html/" + userId + "_" + timestamp + ".html";

    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  function encodeFileContentToBase64(fileContent) {
    // 將字串轉換為 Blob
    const blob = Utilities.newBlob(fileContent);
    // 將 Blob 進行 Base64 編碼
    const base64EncodedData = Utilities.base64Encode(blob.getBytes());
    return base64EncodedData
  }

  return checkWebPageAccessibility(uploadFileToGitHub());
}
```

####test.gs ##NEW_BRIDGE_4 
```javascript
// 這裡是開發人員測試的地方
function test() {
  parameters={}
  parameters["D"] = 1
  console.log(   parameters["PromotionalCard"])
}
```

### 部署步驟
1. 創建新的 GAS 專案
2. 複製上述程式碼
3. 設定環境變數
4. 部署為網頁應用程式
5. 部署 ID: AKfycbytOQjUDPdHvPwn9CAtsNc9VyB356gakqEEBDVsA0J90J21fKcbsMX_FrihdjqJ8KyY
6. 部署 URL: https://script.google.com/macros/s/AKfycbytOQjUDPdHvPwn9CAtsNc9VyB356gakqEEBDVsA0J90J21fKcbsMX_FrihdjqJ8KyY/exec

## NEW_REPLY 服務部署

### 完整程式碼
####doPost.gs ##NEW_REPLY_1
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

####other_function().gs ##NEW_REPLY_2
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

####create_flexJson().gs ##NEW_REPLY_3
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

####push_message_userid().gs ##NEW_REPLY_4
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

####push_txt_userid().gs ##NEW_REPLY_5
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

####push_message_group().gs ##NEW_REPLY_6
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

####reply_message().gs ##NEW_REPLY_7
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

####test.gs ##NEW_REPLY_8
```javascript
// 這裡是開發人員測試的地方
function test() {
  push_txt_userid("1")
}
```

### 部署步驟
1. 創建新的 GAS 專案
2. 複製上述程式碼
3. 設定環境變數
4. 部署為網頁應用程式
5. 部署 ID: AKfycbwZIJQ7toOMi4-IzStW6VW5WhRrWLPlbEgIc2t-waWgxoHD-wHBEi-1OmqV7YpU5cSW
6. 部署 URL: https://script.google.com/macros/s/AKfycbwZIJQ7toOMi4-IzStW6VW5WhRrWLPlbEgIc2t-waWgxoHD-wHBEi-1OmqV7YpU5cSW/exec

## 環境變數設定

### 1. NEW_BRIDGE 環境變數
```javascript
SHEET_ID = "1_ShBQpCCgzPUPB6glCa7gKEzLRfKQBNu7R6dtrc2utU"
GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
```

### 2. NEW_REPLY 環境變數
```javascript
LINE_CHANNEL_ID = "2007327902"
LINE_CHANNEL_SECRET = "ddd0d925d78bcf03722931d49ff27a75"
LINE_ACCESS_TOKEN = "Ldq2Q7r5XtI8wuNuKA+zBmthI2ytWHfHXofMsBWIXnFMRqPjFnFQTRVtr89G/l3+fvIjt4+qPTr9nUAbOLUhLz3pcxgTLZRUQ5v2C9zHEIvUgaQ81asWrepPs1JBcKAYYqrRVDwsHR3lZ/eE7vSi2AdB04t89/1O/w1cDnyilFU="
SHEET_ID = "1_ShBQpCCgzPUPB6glCa7gKEzLRfKQBNu7R6dtrc2utU"
LIFF_ID = "2007327814-DGly5XNk"
```

## 部署步驟

### 1. NEW_BRIDGE 部署
1. 創建新的 GAS 專案
2. 複製 `GAS_DEPLOY.MD` 中的 NEW_BRIDGE 程式碼
3. 設定環境變數
4. 部署為網頁應用程式
5. 部署 ID: AKfycbytOQjUDPdHvPwn9CAtsNc9VyB356gakqEEBDVsA0J90J21fKcbsMX_FrihdjqJ8KyY
6. 部署 URL: https://script.google.com/macros/s/AKfycbytOQjUDPdHvPwn9CAtsNc9VyB356gakqEEBDVsA0J90J21fKcbsMX_FrihdjqJ8KyY/exec

### 2. NEW_REPLY 部署
1. 創建新的 GAS 專案
2. 複製 `GAS_DEPLOY.MD` 中的 NEW_REPLY 程式碼
3. 設定環境變數
4. 部署為網頁應用程式
5. 部署 ID: AKfycbwZIJQ7toOMi4-IzStW6VW5WhRrWLPlbEgIc2t-waWgxoHD-wHBEi-1OmqV7YpU5cSW
6. 部署 URL: https://script.google.com/macros/s/AKfycbwZIJQ7toOMi4-IzStW6VW5WhRrWLPlbEgIc2t-waWgxoHD-wHBEi-1OmqV7YpU5cSW/exec

## 注意事項
1. 確保所有環境變數正確設定
2. 部署時選擇「以我身分執行」
3. 部署後測試 API 功能
4. 確認 LINE Bot 設定正確
5. 每次修改程式碼後，都要重新部署並測試
6. 保持程式碼格式，便於複製到 GAS 編輯器 