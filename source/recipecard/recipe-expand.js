class CardExpand extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        const article = document.createElement('article');

        this.shadowRoot.append(style, article);
    }
}