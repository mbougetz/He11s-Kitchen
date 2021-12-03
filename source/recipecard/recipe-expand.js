class RecipeExpand extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(cardData) {
    console.log(cardData);
    const style = document.createElement("style");
    const article = document.createElement("article");

    style.innerHTML = `
                    body,
            main {
            padding: 1mm;
            padding-top: 0.5mm;
            font-family: "Century Gothic", "Candara", "serif";
            }
            /* the entire page (put a grid around it)  */
            .wrapper-exp {
            display: grid;
            /* border-radius: 25px; */
            }
            /* set padding and background color for each section in page */
            .wrapper-exp > section {
            background-color: #eee;
            padding: 1em;
            /* border-radius: 25px; */
            }

            /* the image/description section */
            .recipe-desc-exp {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 1em;
            row-gap: 1em;
            /* border-radius: 25px; */
            }
            /* the content inside the image/description section */
            .recipe-desc-exp > div {
            background-color: #ddd;
            padding: 1em;
            border-radius: 25px;
            }

            /* the add to fav subsection */
            .recipe-desc-exp > div:nth-child(3) {
            background-color: #eee;
            height: 30px;
            }

            /* the description subsection */
            .descriptionBox {
            padding: 1em;
            font-size: 2.5vw;
            border-radius: 25px;
            }

            /* the main recipe img subsection */
            #recipe-img {
            object-fit: cover;
            width: 100%;
            max-height: 100%;
            border-radius: 25px;
            }

            /* the add to fav star img*/
            #star-img {
            height: 25px;
            width: 25px;
            }

            /* the rating star img */
            #starRate {
            height: 25px;
            width: 100px;
            }

            /* the box containing the ingredient content(the checkbox stuff)*/
            .ingredients-desc-exp > div:nth-child(2) {
            background-color: #ddd;
            padding: 1px;
            text-align: center;
            font-size: 2vw;
            border-radius: 25px;
            }

            /* when checkbox is clicked, strikethrough the text */
            .ingredientsBox:checked + span {
            text-decoration: line-through;
            }

            /* the box containing the tutorial content*/
            .tutorial-desc-exp > div:nth-child(2) {
            background-color: #ddd;
            padding: 1px;
            font-size: 1.7vw;
            border-radius: 25px;
            padding-left: 1em;
            }

            /* the box containing the nutritional content*/
            .nutrition-desc-exp > div:nth-child(2) {
            display: flex;
            column-gap: 1em;
            background-color: #ddd;
            padding: 1px;
            text-align: center;
            font-size: 2vw;
            left: 10em;
            padding-left: 7.5em;
            border-radius: 25px;
            }

            h1 {
            font-size: 2.8vw;
            color: #402a26;
            text-decoration: 3px underline red;
            }
            h2 {
            font-size: 2vw;
            color: #402a26;
            text-decoration: 3px underline #ffcb3d;
            }
      `;
    const wrapper = document.createElement("section");
    wrapper.classList.add("wrapper-exp");
    const title = document.createElement("h1");
    title.classList.add("title-exp");
    title.innerText = cardData.title;

    //#region

    const recipeDesc = document.createElement("section");
    recipeDesc.classList.add("recipe-desc-exp");

    const mainImg = document.createElement("img");
    mainImg.src = cardData.image;
    mainImg.setAttribute("id", "recipe-img");
    mainImg.classList.add("mainImg");

    const description = document.createElement("ul");
    description.classList.add("descriptionBox", "description");
    description.stlye = "list-style:none";
    const prepTime = document.createElement("li");
    prepTime.classList.add("list-element");
    prepTime.innerText = `Prep time: ${cardData.readyInMinutes}`;
    const dietary = document.createElement("li");
    dietary.innerText = `Dietary restrictions: ${
      cardData.vagan == true ? "vagan" : "not vagan"
    }`;
    dietary.classList.add("list-element");
    const rating = document.createElement("li");
    rating.classList.add("list-element");
    rating.innerHTML = `Rating: <img src="./images/5-stars-red.jpeg" id="starRate">`;
    const allergens = document.createElement("li");
    var allergensList = "Allergens: ";
    for (let i = 0; i < cardData.extendedIngredients.length; i++) {
      allergensList += cardData.extendedIngredients[i].name;
      if (i != cardData.extendedIngredients.length - 1) {
        allergensList += ", ";
      }
    }
    allergens.innerText = allergensList;
    allergens.classList.add("list-element");
    const summary = document.createElement("li");
    summary.innerHTML = "Summary: " + cardData.summary;
    summary.classList.add("list-element");

    description.appendChild(prepTime);
    description.appendChild(dietary);
    description.appendChild(rating);
    description.appendChild(allergens);
    description.appendChild(summary);

    const favIcon = document.createElement("img");
    favIcon.src = "./images/favoriteStar.png";
    favIcon.style = "float: left";
    favIcon.id = "star-img";
    const favBut = document.createElement("p");
    favBut.innerText = "Add to Favorite";
    const fav = document.createElement("div");
    fav.classList.add("fav-exp");
    fav.appendChild(favIcon);
    fav.appendChild(favBut);

    recipeDesc.appendChild(mainImg);
    recipeDesc.appendChild(description);
    recipeDesc.appendChild(fav);
    //#endregion
    //#region
    const ingredientDesc = document.createElement("section");
    ingredientDesc.classList.add("ingredients-desc-exp");
    const ingredTitle = document.createElement("div");
    ingredTitle.innerHTML = `<h2> Ingredients <h2><p>U.S/metric</p>`;

    const ingredientsTable = document.createElement("ingredients-table-exp");
    for (let i = 0; i < cardData.extendedIngredients.length; i++) {
      const ingredient = document.createElement("li");
      ingredient.innerHTML = `<input type="checkbox" class="ingredientsBox"/><span>${cardData.extendedIngredients[i].originalString}</span>`;
      ingredientsTable.appendChild(ingredient);
    }

    ingredientDesc.appendChild(ingredTitle);
    ingredientDesc.appendChild(ingredientsTable);
    //#endregion
    //#region
    const tutorialDesc = document.createElement("section");
    tutorialDesc.classList.add("tutorial-desc-exp");
    const instructionTable = document.createElement("div");
    instructionTable.innerHTML = cardData.instructions;
    tutorialDesc.appendChild(instructionTable);
    //#endregion
    //#region
    const nutrientDesc = document.createElement("section");
    nutrientDesc.classList.add("nutrition-desc-exp");
    const nutTitle = document.createElement("h2");
    nutTitle.innerText = "Nutritional Information";
    const nutrientTable = document.createElement("ul");
    for (let i = 0; i < cardData.nutrition.nutrients.length; i++) {
      const nutrient = document.createElement("li");
      const tmp = cardData.nutrition.nutrients[i];
      nutrient.innerText = `${tmp.name}: ${tmp.amount} ${tmp.unit}`;
      nutrientTable.appendChild(nutrient);
    }
    nutrientDesc.appendChild(nutTitle);
    nutrientDesc.appendChild(nutrientTable);
    //#endregion
    wrapper.appendChild(title);
    wrapper.appendChild(recipeDesc);
    wrapper.appendChild(ingredientDesc);
    wrapper.appendChild(tutorialDesc);
    wrapper.appendChild(nutrientDesc);

    // const description = document.createElement('div');
    // description.setAttribute('class', 'descriptionBox description');
    // description.innerHTML = cardData.summary;

    article.appendChild(wrapper);
    this.shadowRoot.append(style, article);
  }
}
customElements.define("recipe-expand", RecipeExpand);
