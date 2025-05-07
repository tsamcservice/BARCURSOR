// 編輯器功能初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeEditor();
});

function initializeEditor() {
    const jsonEditor = document.getElementById('jsonEditor');
    const mainTitle = document.getElementById('mainTitle');
    const subTitle = document.getElementById('subTitle');
    const textColor = document.getElementById('textColor');
    const buttonText = document.getElementById('buttonText');
    const buttonUrl = document.getElementById('buttonUrl');
    const saveBtn = document.getElementById('saveBtn');
    const shareBtn = document.getElementById('shareBtn');

    // 從 JSON 編輯器更新快速編輯欄位
    jsonEditor.addEventListener('input', () => {
        try {
            const jsonData = JSON.parse(jsonEditor.value);
            updateQuickEditFields(jsonData);
        } catch (error) {
            console.error('JSON 解析錯誤:', error);
        }
    });

    // 快速編輯欄位變更時更新 JSON
    [mainTitle, subTitle, textColor, buttonText, buttonUrl].forEach(field => {
        field.addEventListener('input', () => {
            updateJsonFromQuickEdit();
        });
    });

    // 儲存按鈕點擊事件
    saveBtn.addEventListener('click', () => {
        try {
            const jsonData = JSON.parse(jsonEditor.value);
            saveCard(jsonData);
        } catch (error) {
            alert('儲存失敗：' + error.message);
        }
    });

    // 分享按鈕點擊事件
    shareBtn.addEventListener('click', () => {
        try {
            const jsonData = JSON.parse(jsonEditor.value);
            shareCard(jsonData);
        } catch (error) {
            alert('分享失敗：' + error.message);
        }
    });
}

// 更新快速編輯欄位
function updateQuickEditFields(jsonData) {
    const mainTitle = document.getElementById('mainTitle');
    const subTitle = document.getElementById('subTitle');
    const textColor = document.getElementById('textColor');
    const buttonText = document.getElementById('buttonText');
    const buttonUrl = document.getElementById('buttonUrl');

    // 尋找主標題
    const mainTitleContent = findContentByType(jsonData, 'text', content => 
        content.size === '20px' && content.weight === 'bold'
    );
    if (mainTitleContent) {
        mainTitle.value = mainTitleContent.text;
        textColor.value = mainTitleContent.color || '#000000';
    }

    // 尋找副標題
    const subTitleContent = findContentByType(jsonData, 'text', content => 
        content.size === '16px' && !content.weight
    );
    if (subTitleContent) {
        subTitle.value = subTitleContent.text;
    }

    // 尋找按鈕
    const buttonContent = findContentByType(jsonData, 'button');
    if (buttonContent) {
        buttonText.value = buttonContent.label;
        buttonUrl.value = buttonContent.uri;
    }
}

// 從快速編輯欄位更新 JSON
function updateJsonFromQuickEdit() {
    try {
        const jsonData = JSON.parse(document.getElementById('jsonEditor').value);
        const mainTitle = document.getElementById('mainTitle').value;
        const subTitle = document.getElementById('subTitle').value;
        const textColor = document.getElementById('textColor').value;
        const buttonText = document.getElementById('buttonText').value;
        const buttonUrl = document.getElementById('buttonUrl').value;

        // 更新主標題
        const mainTitleContent = findContentByType(jsonData, 'text', content => 
            content.size === '20px' && content.weight === 'bold'
        );
        if (mainTitleContent) {
            mainTitleContent.text = mainTitle;
            mainTitleContent.color = textColor;
        }

        // 更新副標題
        const subTitleContent = findContentByType(jsonData, 'text', content => 
            content.size === '16px' && !content.weight
        );
        if (subTitleContent) {
            subTitleContent.text = subTitle;
            subTitleContent.color = textColor;
        }

        // 更新按鈕
        const buttonContent = findContentByType(jsonData, 'button');
        if (buttonContent) {
            buttonContent.label = buttonText;
            buttonContent.uri = buttonUrl;
        }

        // 更新 JSON 編輯器
        document.getElementById('jsonEditor').value = JSON.stringify(jsonData, null, 2);
    } catch (error) {
        console.error('更新 JSON 失敗:', error);
    }
}

// 尋找特定類型的內容
function findContentByType(jsonData, type, condition = () => true) {
    if (!jsonData.body || !jsonData.body.contents) return null;

    function searchContents(contents) {
        for (const content of contents) {
            if (content.type === type && condition(content)) {
                return content;
            }
            if (content.contents) {
                const found = searchContents(content.contents);
                if (found) return found;
            }
        }
        return null;
    }

    return searchContents(jsonData.body.contents);
}

// 儲存卡片
async function saveCard(jsonData) {
    try {
        // 這裡需要實作與後端的儲存邏輯
        const response = await fetch('/api/save-card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        if (!response.ok) {
            throw new Error('儲存失敗');
        }

        alert('卡片儲存成功！');
    } catch (error) {
        alert('儲存失敗：' + error.message);
    }
}

// 分享卡片
async function shareCard(jsonData) {
    try {
        if (!liff.isLoggedIn()) {
            await liff.login();
        }

        // 這裡需要實作與 LINE 的分享邏輯
        const response = await fetch('/api/share-card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        if (!response.ok) {
            throw new Error('分享失敗');
        }

        alert('卡片分享成功！');
    } catch (error) {
        alert('分享失敗：' + error.message);
    }
} 