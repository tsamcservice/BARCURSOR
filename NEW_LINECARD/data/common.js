// google Apps Script 傳送訊息
async function sendRequest(status, userId, dataCard = "", isDebug = true) {
	const url = "https://script.google.com/macros/s/AKfycbyGQFtVNh6W1n9HpBasraQSp2A7VNsuy_68eRkGzpBXEjXIZNpzGAr3FT8clgp3sPzM3g/exec";
	
	if (!status || !userId) {
		console.error("向google apps script寄送請求時\n有效參數不足");
		return;
	}

	try {
		const sendData = { 
			status: status, 
			userId: userId, 
			card: dataCard,
			isDebug: isDebug 
		};

		// 將資料轉換成查詢字串
		const queryString = new URLSearchParams(sendData).toString();

		console.log("Debug - Sending request to GAS:", url);
		console.log("Debug - Request data:", sendData);
		
		const response = await fetch(`${url}?${queryString}`);
		const responseData = await response.json();

		console.log("Debug - Full response data:", responseData);
		
		if (responseData.status === 'first') {
			console.log("Debug - First time user");
			return responseData;
		} else if (responseData.status === 'ok') {
			console.log("Debug - Request successful");
			return responseData;
		} else {
			console.error("向google apps script寄送請求時\n回傳值非ok");
			return responseData;
		}
	} catch (error) {
		console.error("Debug - Error details:", error);
		if (!isDebug && error instanceof TypeError && error.message === "Failed to fetch") {
			return;
		}
		return { status: 'error', message: error.message };
	}
}

// 自己的 flex2html (處理 原flex2html 錯誤)
function my_flexToHtml(flex2htmlElementName, flexJsonList) {
	flexJsonMessage = {
		type: "flex",
		altText: "呈璽精彩活動推薦!!",
		contents: {
			type: "carousel",
			contents: [...flexJsonList]
		}
	}

	const element = document.getElementById(flex2htmlElementName);
	if (!element) {
		console.error("未找到產生 flexJson 的元素");
		return;
	}
	
	element.innerHTML = "";
	try {
		flex2html(flex2htmlElementName, flexJsonMessage);
	} catch (e) {
		console.error('[my_flexToHtml] flex2html 解析失敗', e, flexJsonMessage);
		document.getElementById('test') && (document.getElementById('test').innerText = '[flex2html解析失敗]\n' + e + '\n' + JSON.stringify(flexJsonMessage, null, 2));
	}

	// 將 LySlider 關閉下方捲動軸
	const wrongLySliderElements = document.querySelectorAll(".LySlider");
	wrongLySliderElements.forEach(function (element) {
		element.style.webkitOverflowScrolling = "auto";
		element.style.overflow = "hidden";
	});

	// 將 chatbox 上方空白縮短
	const wrongChatboxElements = document.querySelectorAll(".chatbox");
	wrongChatboxElements.forEach(function (element) {
		element.style.paddingTop = "20px";
	});
}
