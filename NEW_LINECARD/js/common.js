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

// 頁面重定向
function redirectToCard() {
  const currentPath = window.location.pathname;
  
  // 檢查是否為特定頁面
  const specialPages = ['/admin', '/test', '/preview', '/share', '/card'];
  const isSpecialPage = specialPages.some(page => currentPath.startsWith(page));
  
  // 如果不是特定頁面，且不是根路徑，則重定向到卡片頁面
  if (!isSpecialPage && currentPath !== '/' && currentPath !== '/index.html') {
    window.location.href = '/card';
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initLiff();
  redirectToCard();
}); 