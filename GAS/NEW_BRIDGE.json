function uploadGithub_OG_html(userId, card_img_url = "", mainTitle_1 = "", mainTitle_2 = "") {
  // 獲取當前時間戳
  const timestamp = Date.now();
  // 上傳到 Vercel 的檔案路徑
  const filePath = 'og_html/' + userId + "_" + timestamp + ".html";
  const fileContent =
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta property="og:image" content="`+ card_img_url + `">
        <meta property="og:title" content="`+ mainTitle_1 + `">
        <meta property="og:description" content="`+ mainTitle_2 + `">
      </head>
      <body>
        <script>
          window.location.href = "/preview/?userId=` + encodeURIComponent(userId) + `";	
        </script>
      </body>
    </html>`;

  // 上傳到 Vercel
  const vercelUrl = 'https://barcursor-kt0y1qoip-tsamcservices-projects.vercel.app';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      path: filePath,
      content: fileContent
    })
  };

  try {
    const response = UrlFetchApp.fetch(vercelUrl + '/api/upload', options);
    const result = JSON.parse(response.getContentText());
    return result.url;
  } catch (error) {
    console.error('上傳到 Vercel 失敗:', error);
    throw error;
  }
} 