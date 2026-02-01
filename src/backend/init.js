let globalPrefix = "";

(async () => {
    globalPrefix = (await BrowserStorage.get("seunome")) ?? "";

    BrowserStorage.onChange("seunome", (change) => {
        globalPrefix = change.newValue ?? "";
    });

    window.wpp = new Whatsapp();
})();
