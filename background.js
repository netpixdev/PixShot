console.log("Background script yüklendi");

chrome.runtime.onInstalled.addListener(function() {
  console.log("Eklenti yüklendi");
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Background: Mesaj alındı", request);
  if (request.action === "captureTab") {
    console.log("Ekran görüntüsü alma işlemi başlatılıyor", request.area);
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
      if (chrome.runtime.lastError) {
        console.error("Ekran görüntüsü alınamadı:", chrome.runtime.lastError);
        sendResponse({status: "hata", message: chrome.runtime.lastError.message});
      } else {
        console.log("Ekran görüntüsü alındı, kırpma işlemi başlatılıyor");
        kirpVeIndir(dataUrl, request.area);
        sendResponse({status: "başarılı"});
      }
    });
    return true;
  }
});

function kirpVeIndir(dataUrl, area) {
  console.log("Kırpma işlemi başlatılıyor", area);
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = area.width;
    canvas.height = area.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, area.left, area.top, area.width, area.height, 0, 0, area.width, area.height);
    
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      indirEkranGoruntusu(url);
    }, 'image/png');
  };
  img.src = dataUrl;
}

function indirEkranGoruntusu(url) {
  var date = new Date();
  var filename = 'ekran_goruntusu_' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '.png';

  console.log("İndirme işlemi başlatılıyor, dosya adı:", filename);
  
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: false
  }, function(downloadId) {
    if (chrome.runtime.lastError) {
      console.error("İndirme başlatılamadı:", chrome.runtime.lastError);
    } else {
      console.log("İndirme başlatıldı, ID:", downloadId);
    }
    URL.revokeObjectURL(url);
  });
}