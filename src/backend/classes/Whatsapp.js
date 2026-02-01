class Whatsapp {
    constructor() {
        this.updateElements();
        this.observe();
    }


    updateElements() {

        this.chatInput = document.querySelectorAll('div[contenteditable="true"]')[1];
        const chatInput = this.chatInput;
        if (!chatInput) return;

        this.span = chatInput.querySelector("p.copyable-text span");
        this.br = chatInput.querySelector("p.copyable-text br");

    }

    observe() {
        this.observer = new MutationObserver(() => {

            this.destroy();

            this.updateElements();
            this.addPrefix();

            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    limparTextarea() {
        if (this.chatInput) {
            this.chatInput.innerHTML = "";
            this.chatInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    simularBackspace() {
        const chatInput = this.chatInput;
        if (!chatInput) return;

        const event = new KeyboardEvent("keydown", {
            key: "Backspace",
            code: "Backspace",
            keyCode: 8,
            bubbles: true,
            cancelable: true,
        });

        chatInput.dispatchEvent(event);
        chatInput.innerHTML = chatInput.innerHTML.slice(0, -1);
        chatInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    addPrefix() {

        const chatInput = this.chatInput;
        if (!chatInput) return;

        const cleanChatInputInner = removeAllAttributesFromHTML(this.chatInput.innerHTML);


        if (!this.br && !cleanChatInputInner.includes(globalPrefix)) {

            const line = `*${globalPrefix}:* ${this.span?.innerHTML || ""}`;

            this.chatInput.focus();
            this.simularBackspace();
            document.execCommand("insertText", false, line);
            this.chatInput.dispatchEvent(new Event("change", { bubbles: true }));
            this.limparTextarea();
        }

    }

    destroy() {
        this.observer?.disconnect();
    }
}