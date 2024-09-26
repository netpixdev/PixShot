let canvas, ctx, seciliRenk = '#000000';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "duzenle") {
    canvas = document.getElementById('goruntu');
    ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = request.imageData;
  }
});

document.getElementById('yaziEkle').addEventListener('click', function() {
  const yazi = prompt('Eklemek istediğiniz yazıyı girin:');
  if (yazi) {
    ctx.font = '20px Arial';
    ctx.fillStyle = seciliRenk;
    ctx.fillText(yazi, 50, 50);
  }
});

document.getElementById('sekilEkle').addEventListener('click', function() {
  ctx.beginPath();
  ctx.arc(100, 100, 50, 0, 2 * Math.PI);
  ctx.strokeStyle = seciliRenk;
  ctx.stroke();
});

document.getElementById('renkSec').addEventListener('change', function(e) {
  seciliRenk = e.target.value;
});

document.getElementById('kaydet').addEventListener('click', function() {
  const link = document.createElement('a');
  link.download = 'ekran_goruntusu.png';
  link.href = canvas.toDataURL();
  link.click();
});