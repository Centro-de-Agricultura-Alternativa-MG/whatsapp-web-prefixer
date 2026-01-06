// 🔹 Executa SOMENTE quando a extensão é instalada
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.local.set({ primeiraInstalacao: true });

    // Recarrega apenas o WhatsApp Web
    chrome.tabs.query(
      { url: "https://web.whatsapp.com/*" },
      (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.reload(tab.id);
          }
        });
      }
    );
  }
});

// 🔹 Clique no ícone → reinjeta o content.js manualmente
chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});
