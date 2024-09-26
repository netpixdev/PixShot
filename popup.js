console.log("popup.js yüklendi");

document.addEventListener('DOMContentLoaded', function() {
  console.log("popup.js yüklendi");
  var captureBtn = document.getElementById('captureBtn');
  captureBtn.addEventListener('click', function() {
    console.log("Ekran görüntüsü al butonuna tıklandı");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("Aktif sekme bulundu:", tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, {action: "basla"}, function(response) {
        if (chrome.runtime.lastError) {
          console.error("Hata:", chrome.runtime.lastError.message);
        } else {
          console.log("Mesaj gönderildi, yanıt:", response);
        }
        window.close(); // Popup'ı kapat
      });
    });
  });

  // Kısayol bilgisini göster
  chrome.commands.getAll(function(commands) {
    var shortcutCommand = commands.find(function(command) {
      return command.name === "_execute_browser_action";
    });
    if (shortcutCommand && shortcutCommand.shortcut) {
      document.getElementById('currentShortcut').textContent = shortcutCommand.shortcut;
    }
  });
});