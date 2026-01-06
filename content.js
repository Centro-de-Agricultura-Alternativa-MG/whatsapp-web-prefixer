window.addEventListener("load", (event) => {
  messageSend.atualizarElemento();
});

let line = ``;
var ZapZap = ZapZap || {};

ZapZap.MessageSend = (function () {
  function MessageSend() {
    this.textearea = document.querySelectorAll('div[contenteditable="true"]');
  }

  MessageSend.prototype.limparTextarea = function () {
    if (this.textearea[1]) {
      this.textearea[1].innerHTML = "";
      this.textearea[1].dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  MessageSend.prototype.atualizarElemento = function (scriptText) {
    this.textearea = document.querySelectorAll('div[contenteditable="true"]');
    if (
      this.textearea.length > 1 &&
      !this.textearea[1].textContent.includes(scriptText)
    ) {
      this.spans = this.textearea[1].querySelectorAll("p.copyable-text span");
      this.br = this.textearea[1].querySelector("p.copyable-text br");
    }
  };

  MessageSend.prototype.simularBackspace = function () {
    const event = new KeyboardEvent("keydown", {
      key: "Backspace",
      code: "Backspace",
      keyCode: 8,
      charCode: 0,
      bubbles: true,
      cancelable: true,
    });

    this.textearea[1].dispatchEvent(event);
    this.textearea[1].innerHTML = this.textearea[1].innerHTML.slice(0, -1);
    this.textearea[1].dispatchEvent(new Event("input", { bubbles: true }));
  };

  MessageSend.prototype.iniciar = function (scriptText) {
    this.atualizarElemento(scriptText);
    if (this.textearea.length > 1 && !this.br) {
      this.atualizarElemento(scriptText);
      if (!this.textearea[1].innerHTML.includes(scriptText)) {
        line = `*${scriptText}:* ${this.spans[0].innerHTML}`;
        this.textearea[1].focus();
        this.simularBackspace();
        document.execCommand("insertText", false, line);
        this.textearea[1].dispatchEvent(new Event("change", { bubbles: true }));
        this.limparTextarea();
      }
    }
  };

  return MessageSend;
})();

let seunome = "";

function carregarSeuNome() {
  chrome.storage.local.get("seunome", (data) => {
    seunome = data.seunome || "";
  });
}

carregarSeuNome();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.seunome) {
    seunome = changes.seunome.newValue || "";
  }
});

const messageSend = new ZapZap.MessageSend();

let timeout = null;
const observer = new MutationObserver(() => {
  if (!seunome) return;

    messageSend.iniciar(seunome);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});