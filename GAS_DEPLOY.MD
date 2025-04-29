# GAS 部署說明

## NEW_BRIDGE 服務部署

### 環境變數設定
```javascript
SHEET_ID = "1_ShBQpCCgzPUPB6glCa7gKEzLRfKQBNu7R6dtrc2utU"
GITHUB_TOKEN = "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"
```

### 完整程式碼
```javascript
function doGet(e) {
  var status = e.parameter.status;
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  
  if (status == "get") {
    var id = e.parameter.id;
    var data = sheet.getDataRange().getValues();
    var result = {};
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        result = {
          id: data[i][0],
          title: data[i][1],
          description: data[i][2],
          image: data[i][3]
        };
        break;
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (status == "save") {
    var id = e.parameter.id;
    var title = e.parameter.title;
    var description = e.parameter.description;
    var image = e.parameter.image;
    
    sheet.appendRow([id, title, description, image]);
    return ContentService.createTextOutput("success");
  }
  
  if (status == "uploadGithub") {
    var id = e.parameter.id;
    var title = e.parameter.title;
    var description = e.parameter.description;
    var image = e.parameter.image;
    
    var template = HtmlService.createTemplateFromFile("OG_HTML/template");
    template.title = title;
    template.description = description;
    template.image = image;
    template.id = id;
    
    var html = template.evaluate().getContent();
    
    var options = {
      method: "put",
      headers: {
        Authorization: "token " + GITHUB_TOKEN,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({
        message: "Update OG HTML",
        content: Utilities.base64Encode(html),
        branch: "master"
      })
    };
    
    var url = "https://api.github.com/repos/tsamcservice/BARCURSOR/contents/OG_HTML/" + id + ".html";
    UrlFetchApp.fetch(url, options);
    
    return ContentService.createTextOutput("success");
  }
  
  if (status == "addReadCount") {
    var id = e.parameter.id;
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        var count = data[i][4] || 0;
        sheet.getRange(i + 1, 5).setValue(count + 1);
        break;
      }
    }
    
    return ContentService.createTextOutput("success");
  }
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

### 環境變數設定
```javascript
LINE_CHANNEL_ID = "2007327902"
LINE_CHANNEL_SECRET = "ddd0d925d78bcf03722931d49ff27a75"
LINE_ACCESS_TOKEN = "Ldq2Q7r5XtI8wuNuKA+zBmthI2ytWHfHXofMsBWIXnFMRqPjFnFQTRVtr89G/l3+fvIjt4+qPTr9nUAbOLUhLz3pcxgTLZRUQ5v2C9zHEIvUgaQ81asWrepPs1JBcKAYYqrRVDwsHR3lZ/eE7vSi2AdB04t89/1O/w1cDnyilFU="
SHEET_ID = "1_ShBQpCCgzPUPB6glCa7gKEzLRfKQBNu7R6dtrc2utU"
LIFF_ID = "2007327814-DGly5XNk"
```

### 完整程式碼
```javascript
function doPost(e) {
  var events = JSON.parse(e.postData.contents).events[0];
  var replyToken = events.replyToken;
  var userId = events.source.userId;
  
  if (events.type == "message" && events.message.type == "text") {
    var message = events.message.text;
    
    if (message == "顯示名片") {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      var data = sheet.getDataRange().getValues();
      var userData = {};
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == userId) {
          userData = {
            id: data[i][0],
            title: data[i][1],
            description: data[i][2],
            image: data[i][3]
          };
          break;
        }
      }
      
      var flexMessage = {
        type: "flex",
        altText: "名片",
        contents: {
          type: "bubble",
          hero: {
            type: "image",
            url: "https://tsamcservice.github.io/BARCURSOR/NEW_LINECARD/data/images/" + userData.image,
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover"
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: userData.title,
                weight: "bold",
                size: "xl"
              },
              {
                type: "text",
                text: userData.description,
                wrap: true
              }
            ]
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "分享名片",
                  uri: "https://liff.line.me/" + LIFF_ID + "?id=" + userId
                }
              }
            ]
          }
        }
      };
      
      var url = "https://api.line.me/v2/bot/message/reply";
      var options = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + LINE_ACCESS_TOKEN
        },
        payload: JSON.stringify({
          replyToken: replyToken,
          messages: [flexMessage]
        })
      };
      
      UrlFetchApp.fetch(url, options);
    }
  }
}
```

### 部署步驟
1. 創建新的 GAS 專案
2. 複製上述程式碼
3. 設定環境變數
4. 部署為網頁應用程式
5. 部署 ID: AKfycbwZIJQ7toOMi4-IzStW6VW5WhRrWLPlbEgIc2t-waWgxoHD-wHBEi-1OmqV7YpU5cSW
6. 部署 URL: https://script.google.com/macros/s/AKfycbwZIJQ7toOMi4-IzStW6VW5WhRrWLPlbEgIc2t-waWgxoHD-wHBEi-1OmqV7YpU5cSW/exec

## 注意事項
1. 確保所有環境變數正確設定
2. 部署時選擇「以我身分執行」
3. 部署後測試 API 功能
4. 確認 LINE Bot 設定正確 