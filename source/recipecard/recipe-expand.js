class RecipeExpand extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }


    set data(cardData) {
        console.log(cardData);
        const style = document.createElement('style');
        const article = document.createElement('article');
        
        style.innerHTML = `
        .body {
            width: 85 vh
        }
      `
        const title = document.createElement('h1');
        title.classList.add('title-exp');
        title.innerText = cardData.title

        const desc = document.createElement('section');
        desc.setAttribute('class', 'recipe-desc-exp');

        const mainImg = document.createElement('img');
        mainImg.src = cardData.image;
        mainImg.setAttribute('id', 'recipe-img');
        mainImg.setAttribute('class', 'mainImg');

        const description = document.createElement('div');
        description.setAttribute('class', 'descriptionBox description');
        description.innerHTML = cardData.summary;

        desc.appendChild(mainImg);
        desc.appendChild(description)

        this.shadowRoot.append(style, article);
    }
} 
customElements.define('recipe-expand', RecipeExpand);