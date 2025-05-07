// 圖片上傳功能初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeUpload();
});

function initializeUpload() {
    const vipImage = document.getElementById('vipImage');
    const publicImage = document.getElementById('publicImage');
    const userImage = document.getElementById('userImage');

    // 初始化上傳事件
    [vipImage, publicImage, userImage].forEach(input => {
        input.addEventListener('change', handleImageUpload);
    });
}

// 處理圖片上傳
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
        alert('請上傳圖片檔案');
        return;
    }

    // 檢查檔案大小（限制為 5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('圖片大小不能超過 5MB');
        return;
    }

    try {
        // 建立預覽
        const previewUrl = await createImagePreview(file);
        const previewId = event.target.id.replace('Image', 'Preview');
        const previewElement = document.getElementById(previewId);
        previewElement.innerHTML = `<img src="${previewUrl}" alt="預覽圖片">`;

        // 上傳圖片
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', event.target.id.replace('Image', ''));

        const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('上傳失敗');
        }

        const result = await response.json();
        
        // 更新 JSON 編輯器中的圖片 URL
        updateImageUrl(event.target.id, result.url);

        alert('圖片上傳成功！');
    } catch (error) {
        alert('上傳失敗：' + error.message);
    }
}

// 建立圖片預覽
function createImagePreview(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 更新 JSON 中的圖片 URL
function updateImageUrl(inputId, newUrl) {
    try {
        const jsonEditor = document.getElementById('jsonEditor');
        const jsonData = JSON.parse(jsonEditor.value);

        // 根據上傳類型更新對應的圖片 URL
        switch (inputId) {
            case 'vipImage':
                updateImageUrlInJson(jsonData, 'vip');
                break;
            case 'publicImage':
                updateImageUrlInJson(jsonData, 'public');
                break;
            case 'userImage':
                updateImageUrlInJson(jsonData, 'user');
                break;
        }

        // 更新 JSON 編輯器
        jsonEditor.value = JSON.stringify(jsonData, null, 2);
    } catch (error) {
        console.error('更新圖片 URL 失敗:', error);
    }
}

// 在 JSON 中更新圖片 URL
function updateImageUrlInJson(jsonData, type) {
    if (!jsonData.body || !jsonData.body.contents) return;

    function updateContents(contents) {
        for (const content of contents) {
            if (content.type === 'image') {
                // 根據類型更新對應的圖片
                if (type === 'vip' && content.url.includes('/vip/')) {
                    content.url = newUrl;
                } else if (type === 'public' && content.url.includes('/public/')) {
                    content.url = newUrl;
                } else if (type === 'user' && content.url.includes('/user/')) {
                    content.url = newUrl;
                }
            }
            if (content.contents) {
                updateContents(content.contents);
            }
        }
    }

    updateContents(jsonData.body.contents);
}

// 從 LINE 獲取用戶頭像
async function getLineProfileImage() {
    try {
        if (!liff.isLoggedIn()) {
            await liff.login();
        }

        const profile = await liff.getProfile();
        const userId = profile.userId;

        // 下載頭像
        const response = await fetch(profile.pictureUrl);
        const blob = await response.blob();
        const file = new File([blob], `${userId}.jpg`, { type: 'image/jpeg' });

        // 上傳頭像
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'user');
        formData.append('userId', userId);

        const uploadResponse = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error('上傳頭像失敗');
        }

        const result = await uploadResponse.json();
        return result.url;
    } catch (error) {
        console.error('獲取頭像失敗:', error);
        throw error;
    }
} 