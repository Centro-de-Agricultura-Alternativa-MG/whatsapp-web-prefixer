function removeAllAttributesFromHTML(html) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const walk = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            // remove all attributes
            [...node.attributes].forEach(attr => {
                node.removeAttribute(attr.name);
            });
        }

        // recurse
        node.childNodes.forEach(walk);
    };

    wrapper.childNodes.forEach(walk);

    return wrapper.innerHTML;
}
