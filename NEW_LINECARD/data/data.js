// LIFF ID 設定
const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbyGQFtVNh6W1n9HpBasraQSp2A7VNsuy_68eRkGzpBXEjXIZNpzG3FT8clgp3sPzM3g/exec";
const shareLIFFid = "2007327814-DGly5XNk";
const ABS_BASE = "https://barcursor-k6u2mwjvu-tsamcservices-projects.vercel.app";

// 這張會員卡片的 URL
var card_img_url;
// 需要跨 function 的參數
var userId, displayName, flexJsonStatic, flexJsonList, flexJsonMessage, cardJsonPromotional;

// 初始化 flexJsonStatic
flexJsonStatic = {
  "type": "bubble",
  "size": "mega",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "image",
        "url": "textContent_1_url",
        "size": "full",
        "aspectRatio": "1:1",
        "aspectMode": "cover"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "mainTitle_1",
            "size": "xl",
            "weight": "bold",
            "color": "textColor"
          },
          {
            "type": "text",
            "text": "mainTitle_2",
            "wrap": true,
            "color": "textColor",
            "margin": "md"
          }
        ],
        "paddingAll": "20px"
      }
    ],
    "backgroundColor": "#ffffff"
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "button",
        "action": {
          "type": "uri",
          "label": "textContent_2",
          "uri": "textContent_2_url"
        },
        "style": "primary",
        "color": "#A4924A"
      }
    ]
  }
};

// cardJson 裡面參數預設值（全部改為絕對網址）
var mainTitle_1 = "呈璽理財藝術共享空間";
var mainTitle_2 = "我在呈璽，欣賞美好幸福 我在呈璽，喝茶喝咖啡很悠閒 我不在呈璽，就是在前往呈璽的路上";
var memberId = "000";
var subTitle_2 = "https://www.leishan.com.tw/";
var textContent_1 = ABS_BASE + "/data/images/8c2a0367cf3d71a0.png";
var textContent_1_url = ABS_BASE + "/data/images/TS.jpg";
var textContent_2 = "呈璽LINE@";
var textContent_2_url = "https://donate.ls-love.org/";
var textColor = "#000000";

// 卡片製作標籤裡面參數預設值
function writeElementDefaultValues() {
	document.getElementById("mainTitle_1").placeholder = mainTitle_1;
	document.getElementById("mainTitle_2").placeholder = mainTitle_2;
	document.getElementById("memberId").placeholder = memberId;
	document.getElementById("subTitle_2").placeholder = subTitle_2;
	document.getElementById("textContent_1").placeholder = textContent_1;
	document.getElementById("upload_text").textContent = textContent_1_url; // 參數 textContent_1_url 對應 upload_text 元素
	document.getElementById("textContent_2").placeholder = textContent_2;
	document.getElementById("textContent_2_url").placeholder = textContent_2_url;
	// document.getElementById("displayName").placeholder = displayName;
	document.getElementById("textColor").textContent = textColor;
}

// flexJson_main 的框 (list可再加入cardJsonPromotional)
function createFlexJsonList() {
	let flexJsonList = [];
	if (!flexJsonStatic) {
		console.error('[createFlexJsonList] flexJsonStatic 未初始化');
		return flexJsonList;
	}
	let mainCardJson = typeof flexJsonStatic === 'string' ? flexJsonStatic : JSON.stringify(flexJsonStatic);
	console.log('[createFlexJsonList] 來源 mainCardJson:', mainCardJson);
	mainCardJson = mainCardJson.replace(/mainTitle_1/g, mainTitle_1);
	mainCardJson = mainCardJson.replace(/mainTitle_2/g, mainTitle_2);
	mainCardJson = mainCardJson.replace(/memberId/g, memberId);
	mainCardJson = mainCardJson.replace(/subTitle_2/g, subTitle_2);
	mainCardJson = mainCardJson.replace(/textContent_1_url/g, textContent_1_url);
	mainCardJson = mainCardJson.replace(/textContent_1/g, textContent_1);
	mainCardJson = mainCardJson.replace(/textContent_2_url/g, textContent_2_url);
	mainCardJson = mainCardJson.replace(/textContent_2/g, textContent_2);
	mainCardJson = mainCardJson.replace(/displayName/g, displayName);
	mainCardJson = mainCardJson.replace(/textColor/g, textColor);
	mainCardJson = mainCardJson.replace(/S{3,}/g, "https://liff.line.me/" + shareLIFFid + "/?userId=" + encodeURIComponent(userId));
	console.log('[createFlexJsonList] 替換後 mainCardJson:', mainCardJson);
	// 顯示在畫面上方便人工比對
	try {
		document.getElementById('test') && (document.getElementById('test').innerText = mainCardJson);
	} catch (e) {}
	try {
		flexJsonList.push(JSON.parse(mainCardJson));
	} catch (e) {
		console.error('[createFlexJsonList] 解析 mainCardJson 失敗', e, mainCardJson);
		document.getElementById('test') && (document.getElementById('test').innerText = '[JSON解析失敗]\n' + e + '\n' + mainCardJson);
	}
	// 宣傳卡片（如果有選擇）
	if (cardJsonPromotional) {
		try {
			let promoJson = typeof cardJsonPromotional === 'string' ? cardJsonPromotional : JSON.stringify(cardJsonPromotional);
			console.log('[createFlexJsonList] cardJsonPromotional:', promoJson);
			flexJsonList.push(JSON.parse(promoJson));
		} catch (e) {
			console.error('[createFlexJsonList] 宣傳卡片 JSON 解析失敗', e, cardJsonPromotional);
		}
	}
	console.log('[createFlexJsonList] flexJsonList for preview:', flexJsonList);
	return flexJsonList;
}

// 宣傳卡片列表
let promotionalCards = [];

// 載入宣傳卡片
async function loadPromotionalCards() {
  try {
    const response = await sendRequest("get", userId);
    if (response.status === "ok" && response.cardJson) {
      promotionalCards = response.cardJson;
      updatePromotionalCardsDisplay();
    }
  } catch (error) {
    console.error("載入宣傳卡片失敗：", error);
  }
}

// 更新宣傳卡片顯示
function updatePromotionalCardsDisplay() {
  const slider = document.getElementById("slider");
  slider.innerHTML = "";
  
  promotionalCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "promotional-card";
    cardElement.innerHTML = `
      <div class="card-content">
        <h3>${card.title || "宣傳卡片 " + (index + 1)}</h3>
        <p>${card.description || ""}</p>
      </div>
      <button onclick="selectPromotionalCard(${index})">選擇</button>
    `;
    slider.appendChild(cardElement);
  });
}

// 選擇宣傳卡片
function selectPromotionalCard(index) {
  const selectedCard = promotionalCards[index];
  if (selectedCard) {
    cardJsonPromotional = selectedCard;
    updateCardPreview();
    document.getElementById("loadPromotionalCard").style.display = "none";
  }
}

// 更新卡片預覽
function updateCardPreview() {
  const flexJsonList = createFlexJsonList();
  my_flexToHtml("flex2html_main", flexJsonList);
}

// 初始化時載入宣傳卡片
window.addEventListener("load", () => {
  if (liff.isLoggedIn()) {
    loadPromotionalCards();
  }
});





