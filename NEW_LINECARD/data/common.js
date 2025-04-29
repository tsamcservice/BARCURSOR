// google Apps Script 傳送訊息
async function sendRequest(status, userId, dataCard = "", isDebug = true) {
	const url = "https://script.google.com/macros/s/AKfycbyKj15B9UcOsOfD7TiltTHiMsW-5AwPW4dX72ayCsB_aouyZE3saliIiSFgTjLE5qAM/exec";
	const data = {
		status: status,
		userId: userId,
		dataCard: dataCard,
		isDebug: isDebug
	};

	if (!status || !userId) {
		alert("向google apps script寄送請求時\n有效參數不足");
		return;
	}

	try {
		const sendData = { status: status, userId: userId, card: dataCard };

		// 將資料轉換成查詢字串
		const queryString = new URLSearchParams(sendData).toString();

		const response = await fetch(`${url}?${queryString}`);
		const responseData = await response.json();

		console.log("Data sent:", sendData);
		console.log("Response:", responseData);
		if (responseData.status === 'first') { return responseData; }
		else if (responseData.status === 'ok') { return responseData; }
		else { alert("向google apps script寄送請求時\n回傳值非ok"); }
	} catch (error) {
		// 忽略 "TypeError: Failed to fetch" 錯誤
		if (!isDebug && error instanceof TypeError && error.message === "Failed to fetch") { return; }
		alert("向google apps script寄送請求時\n發生錯誤\n" + error);
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

	if (!document.getElementById(flex2htmlElementName)) {
		alert("未找到產生 flexJson 的元素")
	}
	document.getElementById(flex2htmlElementName).innerHTML = "";
	flex2html(flex2htmlElementName, flexJsonMessage);

	// 將 LySlider 關閉下方捲動軸
	var wrongLySliderElements = document.querySelectorAll(".LySlider");
	wrongLySliderElements.forEach(function (element) {
		element.style.webkitOverflowScrolling = "auto";
		// element.style.overflowX = "visible";
		element.style.overflow = "hidden";
	});

	// 將 chatbox 上方空白縮短
	var wrongChatboxElements = document.querySelectorAll(".chatbox");
	wrongChatboxElements.forEach(function (element) {
		element.style.paddingTop = "20px";
	});
}
