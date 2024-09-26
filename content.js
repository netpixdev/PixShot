console.log("content.js yüklendi");

let isSelecting = false;
let startX, startY, endX, endY;
let selectionBox;
let overlay;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Content script: Mesaj alındı:", request);
  if (request.action === "basla") {
    console.log("Content script: Alan seçimi başlatılıyor");
    baslaAlanSecimi();
    sendResponse({status: "başlatıldı"});
  }
  return true;
});

function baslaAlanSecimi() {
  console.log("baslaAlanSecimi fonksiyonu çağrıldı");
  isSelecting = true;
  
  overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  overlay.style.zIndex = '2147483647';
  overlay.style.cursor = 'crosshair';
  document.body.appendChild(overlay);
  
  selectionBox = document.createElement('div');
  selectionBox.style.position = 'fixed';
  selectionBox.style.border = '2px solid #ff0000';
  selectionBox.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  selectionBox.style.pointerEvents = 'none';
  selectionBox.style.zIndex = '2147483647';
  selectionBox.style.display = 'none';
  overlay.appendChild(selectionBox);

  overlay.addEventListener('mousedown', baslaSec);
  overlay.addEventListener('mousemove', guncelleSec);
  overlay.addEventListener('mouseup', bitirSec);
}

function baslaSec(e) {
  startX = e.clientX;
  startY = e.clientY;
  selectionBox.style.display = 'block';
  selectionBox.style.left = startX + 'px';
  selectionBox.style.top = startY + 'px';
}

function guncelleSec(e) {
  if (!selectionBox.style.display || selectionBox.style.display === 'none') return;
  
  endX = e.clientX;
  endY = e.clientY;
  
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  selectionBox.style.left = left + 'px';
  selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px';
  selectionBox.style.height = height + 'px';
}

function bitirSec(e) {
  if (!isSelecting) return;
  isSelecting = false;
  
  endX = e.clientX;
  endY = e.clientY;
  
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  // Overlay'i geçici olarak kaldır
  document.body.removeChild(overlay);

  // Ekran görüntüsünü al
  setTimeout(() => {
    ekranGoruntusuAl(left, top, width, height);
  }, 50);
}

function ekranGoruntusuAl(left, top, width, height) {
  console.log("Content script: ekranGoruntusuAl fonksiyonu çağrıldı");
  
  chrome.runtime.sendMessage({
    action: "captureTab",
    area: {left, top, width, height}
  }, function(response) {
    if (chrome.runtime.lastError) {
      console.error("Hata:", chrome.runtime.lastError.message);
    } else {
      console.log("Ekran görüntüsü alma isteği gönderildi, yanıt:", response);
    }
  });
}

console.log("Content script: Mesaj dinleyici eklendi");