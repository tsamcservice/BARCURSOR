// LIFF 初始化
async function initLiff() {
  try {
    await liff.init({ liffId: '2007327814-BdWpj70m' });
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  } catch (error) {
    console.error('LIFF 初始化失敗:', error);
  }
}

// 檢查用戶權限
async function checkAdminAuth() {
  const username = prompt('請輸入管理員帳號');
  const password = prompt('請輸入管理員密碼');
  
  if (username === 'admin' && password === 'admin55688') {
    return true;
  }
  return false;
}

// 頁面重定向 - 只處理 preview-editor 相關頁面
function handleRedirect() {
  const currentPath = window.location.pathname;
  
  // 檢查是否為 preview-editor 相關頁面
  if (!currentPath.includes('/preview-editor/')) {
    return;
  }

  // 定義允許的頁面
  const allowedPages = [
    '/preview-editor/',
    '/preview-editor/preview/',
    '/preview-editor/admin/'
  ];

  // 如果當前路徑不在允許列表中，重定向到預覽編輯器主頁
  if (!allowedPages.some(page => currentPath === page)) {
    window.location.href = '/preview-editor/';
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  handleRedirect();
}); 