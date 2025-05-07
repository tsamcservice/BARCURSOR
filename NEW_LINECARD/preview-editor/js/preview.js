// 初始化 LIFF
liff.init({ liffId: "2007327814-BdWpj70m" })
    .then(() => {
        console.log("LIFF 初始化成功");
        initializePreview();
    })
    .catch(err => {
        console.error("LIFF 初始化失敗:", err);
    });

// 預覽功能初始化
function initializePreview() {
    const jsonEditor = document.getElementById('jsonEditor');
    const previewBtn = document.getElementById('previewBtn');
    const previewContainer = document.getElementById('previewContainer');

    // 載入預設的 JSON
    const defaultJson = {
        "type": "bubble",
        "size": "mega",
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "image",
                    "size": "full",
                    "aspectRatio": "1:1",
                    "aspectMode": "cover",
                    "url": "https://cdn.smore.com/u/thumbs/acd5/thumb-4e4ed7988eab7114ae54df8501d45ba0.png"
                },
                {
                    "type": "text",
                    "text": "主標題",
                    "size": "20px",
                    "align": "center",
                    "color": "#000000",
                    "weight": "bold",
                    "margin": "md"
                },
                {
                    "type": "text",
                    "text": "副標題",
                    "wrap": true,
                    "size": "16px",
                    "margin": "sm",
                    "color": "#000000"
                }
            ],
            "backgroundColor": "#E1E6E0",
            "paddingAll": "10px"
        }
    };

    jsonEditor.value = JSON.stringify(defaultJson, null, 2);

    // 預覽按鈕點擊事件
    previewBtn.addEventListener('click', () => {
        try {
            const jsonData = JSON.parse(jsonEditor.value);
            renderPreview(jsonData);
        } catch (error) {
            alert('JSON 格式錯誤：' + error.message);
        }
    });

    // 初始預覽
    renderPreview(defaultJson);
}

// 渲染預覽
function renderPreview(jsonData) {
    const previewContainer = document.getElementById('previewContainer');
    
    // 清空預覽容器
    previewContainer.innerHTML = '';

    // 建立預覽元素
    const previewElement = document.createElement('div');
    previewElement.className = 'flex-message-preview';
    
    // 根據 JSON 資料建立預覽內容
    if (jsonData.type === 'bubble') {
        const bubble = createBubblePreview(jsonData);
        previewElement.appendChild(bubble);
    }

    previewContainer.appendChild(previewElement);
}

// 建立氣泡預覽
function createBubblePreview(bubbleData) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble-preview';
    
    // 設定背景顏色
    if (bubbleData.body && bubbleData.body.backgroundColor) {
        bubble.style.backgroundColor = bubbleData.body.backgroundColor;
    }

    // 處理內容
    if (bubbleData.body && bubbleData.body.contents) {
        bubbleData.body.contents.forEach(content => {
            const element = createContentElement(content);
            if (element) {
                bubble.appendChild(element);
            }
        });
    }

    return bubble;
}

// 建立內容元素
function createContentElement(content) {
    let element;

    switch (content.type) {
        case 'text':
            element = document.createElement('p');
            element.textContent = content.text;
            if (content.size) element.style.fontSize = content.size;
            if (content.color) element.style.color = content.color;
            if (content.weight === 'bold') element.style.fontWeight = 'bold';
            if (content.align) element.style.textAlign = content.align;
            break;

        case 'image':
            element = document.createElement('img');
            element.src = content.url;
            if (content.aspectMode === 'cover') {
                element.style.objectFit = 'cover';
            }
            if (content.size === 'full') {
                element.style.width = '100%';
                element.style.height = 'auto';
            }
            break;

        case 'box':
            element = document.createElement('div');
            if (content.layout === 'vertical') {
                element.style.display = 'flex';
                element.style.flexDirection = 'column';
            }
            if (content.contents) {
                content.contents.forEach(subContent => {
                    const subElement = createContentElement(subContent);
                    if (subElement) {
                        element.appendChild(subElement);
                    }
                });
            }
            break;
    }

    return element;
} 