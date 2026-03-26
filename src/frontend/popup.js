(async () => {
  try {
    const cacheSeunome = await BrowserStorage.get('seunome');
    const seunomeInput = document.getElementById("seunome");

    if (seunomeInput && cacheSeunome) {
      seunomeInput.value = cacheSeunome;
    }
  } catch (error) {
    console.log("Browser storage error", error);
  }
})();


document.getElementById("btnSalvar").addEventListener("click", async () => {
    const seunome = document.getElementById("seunome").value;

    BrowserStorage.set('seunome', seunome);
});

document.getElementById("btnSalvar").addEventListener("click", () => {
    let salvarMsg = document.querySelector('#salvarMsg');

    if (salvarMsg) {
        salvarMsg.innerText = 'Salvo com sucesso!'
    }

});


document.getElementById("seunome").addEventListener("input", () => {
    let salvarMsg = document.querySelector('#salvarMsg');
    salvarMsg.innerText = ''
});
