// pick the extension API safely
const ext = typeof browser !== "undefined"
  ? browser
  : typeof chrome !== "undefined"
    ? chrome
    : null;

// 🔹 Executa SOMENTE quando a extensão é instalada
ext?.runtime?.onInstalled?.addListener(async (details) => {
  if (details.reason !== "install") return;

  // Storage cross-browser
  await BrowserStorage.set("primeiraInstalacao", true);

  // Query WhatsApp Web tabs
  const queryTabs = ext.tabs.query.length === 1
    ? ext.tabs.query({ url: "https://web.whatsapp.com/*" }) // Promise-based (Firefox)
    : new Promise((resolve) =>
        ext.tabs.query({ url: "https://web.whatsapp.com/*" }, resolve) // Callback-based (Chrome)
      );

  const tabs = await queryTabs;

  // Reload tabs
  tabs.forEach((tab) => {
    if (tab.id != null) {
      ext.tabs.reload(tab.id);
    }
  });
});
