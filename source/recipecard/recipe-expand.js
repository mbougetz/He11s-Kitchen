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
        const body = document.createElement('section');
        body.classList.add('body');
        const title = document.createElement('h1');
        title.classList.add('title');
        title.innerText = cardData.title

        const mainImg = document.createElement('img');
        mainImg.src = cardData.image;
        mainImg.setAttribute('id', 'recipe-img');
        mainImg.setAttribute('class', 'mainImg');

        const description = document.createElement('div');
        description.setAttribute('class', 'descriptionBox');
        description.innerHTML = cardData.summary;

        article.appendChild(title);
        article.appendChild(mainImg);
        article.appendChild(description);
        this.shadowRoot.append(style, article);
    }
} 
customElements.define('recipe-expand', RecipeExpand);