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
        body, main {
            padding: 1mm;
            padding-top: 0.5mm;
          }
          /* the entire page (put a grid around it)  */
        .wrapper-exp {
            display: grid;
            /* border-radius: 25px; */
        }
        /* set padding and background color for each section in page */
        .wrapper-exp > section{
            background-color: #eee;
            padding: 1em;
            /* border-radius: 25px; */
        }
        
        /* the image/description section */
        .recipe-desc-exp{
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 1em;
            row-gap: 1em;
            /* border-radius: 25px; */
        }
        /* the content inside the image/description section */
        .recipe-desc-exp > div{
            background-color: #ddd;
            padding: 1em;
            border-radius: 25px;
        }
        
        /* the add to fav subsection */
        .recipe-desc-exp > div:nth-child(3){
            background-color: #eee;
            height: 30px;
        }
        
        /* the description subsection */
        .descriptionBox{
            padding: 1em;
            font-size: 2.5vw;
            border-radius: 25px;
        }
        
        /* the main recipe img subsection */
        #recipe-img{
            object-fit: cover;
            width: 100%;
            max-height: 100%;
            border-radius: 25px;
        }
        
        /* the add to fav star img*/
        #star-img{
            height: 25px;
            width: 25px;
        }
        
        /* the rating star img */
        #starRate{
            height: 25px;
            width: 100px;
        }
        
        /* the box containing the ingredient content(the checkbox stuff)*/
        .ingredients-desc-exp > div:nth-child(2){
            background-color: #ddd;
            padding: 1px;
            text-align: center;
            font-size: 2.5vw;
            border-radius: 25px;
        }
        
        /* when checkbox is clicked, strikethrough the text */
        .ingredientsBox:checked + span{
            text-decoration: line-through;
        }
        
        /* the box containing the tutorial content*/
        .tutorial-desc-exp > div:nth-child(2){
            background-color: #ddd;
            padding: 1px;
            font-size: 2.5vw;
            border-radius: 25px;
            padding-left: 1em;
        }
        
        /* the box containing the nutional content*/
        .nutrition-desc-exp > div:nth-child(2){
            display: flex;
            column-gap: 1em;
            background-color: #ddd;
            padding: 1px;
            text-align:center;
            font-size: 2.5vw;
            left: 10em;
            padding-left: 7.5em;
            border-radius: 25px;
        }
      `
        const title = document.createElement('h1');
        title.classList.add('title-exp');
        title.innerText = cardData.title

        const desc = document.createElement('section');
        desc.setAttribute('class', 'recipe-desc-exp');

        const description = document.createElement('ul');
        description.classList.add('descriptionBox', 'description');
        const prepTime = document.createElement('li');
        prepTime.innerText = `Prep time: ${cardData.readyInMinutes}`;
        const dietary = document.createElement('li');
        dietary.innerText = `Dietary restrictions: ${cardData.vagan == true ? 'vagan' : 'not vagan'}`

        ingredients.innerText = ingredientsList
        description.appendChild(prepTime);
        description.appendChild(dietary);


        const mainImg = document.createElement('img');
        mainImg.src = cardData.image;
        mainImg.setAttribute('id', 'recipe-img');
        mainImg.setAttribute('class', 'mainImg');

        const ingredients = document.createElement('li');
        var ingredientsList = '';
        for (let i = 0; i < cardData.extendedIngredients.length; i++) {
            ingredientsList += cardData.extendedIngredients[i].name;
            if (i != cardData.extendedIngredients.length - 1) {
                ingredientsList += ', '
            }
        }        
        // const description = document.createElement('div');
        // description.setAttribute('class', 'descriptionBox description');
        // description.innerHTML = cardData.summary;

        desc.appendChild(mainImg);
        desc.appendChild(description)

        article.appendChild(desc);
        this.shadowRoot.append(style, article);
    }
}
customElements.define('recipe-expand', RecipeExpand);