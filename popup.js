try {
    chrome.storage.local.get('seunome', (data) => {
        const cacheSeunome = data.seunome;

        const seunomeInput = document.getElementById("seunome");

        if (seunomeInput && cacheSeunome) {
            seunomeInput.value = cacheSeunome;
        }
    });
} catch (error) {
    console.log("Chrome storage error", error);
}


// Salva valores
document.getElementById("btnSalvar").addEventListener("click", () => {
    const seunome = document.getElementById("seunome").value;

    chrome.storage.local.set({ seunome }, () => {
        console.log("Valores salvos no storage da extensão");
    });
});
