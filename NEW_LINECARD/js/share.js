// 初始化 LIFF
async function initLiff() {
  try {
    await liff.init({ liffId: '2007327814-DGly5XNk' });
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  } catch (error) {
    console.error('LIFF 初始化失敗:', error);
  }
}

// 分享卡片到 LINE
async function shareCard(cardId) {
  try {
    // 獲取卡片內容
    const response = await fetch(`/api/cards/share?cardId=${cardId}`);
    const { card } = await response.json();

    if (!card) {
      throw new Error('無法獲取卡片內容');
    }

    // 使用 shareTargetPicker 分享
    if (liff.isApiAvailable('shareTargetPicker')) {
      await liff.shareTargetPicker([
        {
          type: 'flex',
          altText: '會員卡',
          contents: card.content
        }
      ]);
    } else {
      // 如果 shareTargetPicker 不可用，使用 sendMessages
      await liff.sendMessages([
        {
          type: 'flex',
          altText: '會員卡',
          contents: card.content
        }
      ]);
    }
  } catch (error) {
    console.error('分享失敗:', error);
    alert('分享失敗，請稍後再試');
  }
}

// 複製分享連結
function copyShareLink(cardId) {
  const shareUrl = `${window.location.origin}/share/${cardId}`;
  navigator.clipboard.writeText(shareUrl)
    .then(() => {
      alert('分享連結已複製到剪貼簿');
    })
    .catch((error) => {
      console.error('複製失敗:', error);
      alert('複製失敗，請手動複製連結');
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initLiff();
}); 