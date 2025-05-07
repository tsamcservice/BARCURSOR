// LIFF ID 設定
const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbzQ4AwFFgmqoTgvfrBIBDv6ocIhM8huxOoix6OaguYjHGIlgoo6IEL_KxBonk5QP38jvw/exec";
const shareLIFFid = "2007327814-DGly5XNk";

// 這張會員卡片的 URL
var card_img_url;
// 需要跨 function 的參數
var userId, displayName, flexJsonStatic, flexJsonList, flexJsonMessage, cardJsonPromotional
// cardJson 裡面參數預設值
var mainTitle_1 = "呈璽理財藝術共享空間";
var mainTitle_2 = "我在呈璽，欣賞美好幸福 我在呈璽，喝茶喝咖啡很悠閒 我不在呈璽，就是在前往呈璽的路上";
var memberId = "000";
var subTitle_2 = "https://www.leishan.com.tw/";
var textContent_1 = "/data/images/8c2a0367cf3d71a0.png";
var textContent_1_url = "/data/images/TS.jpg";
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
	flexJsonList = flexJsonStatic
	// 除錯：檢查 flexJsonStatic 的內容
	console.log("Debug - flexJsonStatic:", flexJsonStatic);
	console.log("Debug - flexJsonStatic type:", typeof flexJsonStatic);
	if (typeof flexJsonStatic === 'string') {
		console.log("Debug - Initial LIFF ID check:", flexJsonStatic.match(/2000001236-On1R22VW|2007327814-DGly5XNk/g));
	}
	
	flexJsonList = flexJsonList.replace(/mainTitle_1/g, mainTitle_1);
	flexJsonList = flexJsonList.replace(/mainTitle_2/g, mainTitle_2);
	flexJsonList = flexJsonList.replace(/memberId/g, memberId);
	flexJsonList = flexJsonList.replace(/subTitle_2/g, subTitle_2);
	flexJsonList = flexJsonList.replace(/textContent_1_url/g, textContent_1_url);
	flexJsonList = flexJsonList.replace(/textContent_1/g, textContent_1);
	flexJsonList = flexJsonList.replace(/textContent_2_url/g, textContent_2_url);
	flexJsonList = flexJsonList.replace(/textContent_2/g, textContent_2);
	flexJsonList = flexJsonList.replace(/displayName/g, displayName);
	flexJsonList = flexJsonList.replace(/textColor/g, textColor);
	
	// 除錯：檢查替換前的 URL
	console.log("Debug - Before URL replacement:", flexJsonList.match(/S{3,}/g));
	console.log("Debug - Current LIFF ID:", shareLIFFid);
	
	// 檢查是否存在舊的 LIFF ID
	const oldLiffIdMatch = flexJsonList.match(/2000001236-On1R22VW/g);
	if (oldLiffIdMatch) {
		console.warn("Debug - Warning: Found old LIFF ID in flexJsonList:", oldLiffIdMatch);
	}
	
	flexJsonList = flexJsonList.replace(/S{3,}/g, "https://liff.line.me/" + shareLIFFid + "/?userId=" + encodeURIComponent(userId));
	
	// 除錯：檢查最終的 flexJsonList
	console.log("Debug - Final flexJsonList:", flexJsonList);
	console.log("Debug - Final LIFF ID check:", flexJsonList.match(/2000001236-On1R22VW|2007327814-DGly5XNk/g));
	
	return [JSON.parse(flexJsonList)]
}





