class RecipeExpand extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(cardData) {
    // to reset the html
    if (!cardData) return;
    // clean up the expand page
    if (this.shadowRoot.querySelector("article")) {
      this.shadowRoot.querySelector("article").remove();
    }
    this.json = cardData;
    const style = document.createElement("style");
    const article = document.createElement("article");
    this.shadowRoot.append(style, article);
    style.innerHTML = `
        article {
            background-color: white;
            box-shadow: 0 0 10px rgb(0 0 0 / 15%);
            margin: 30px auto;
            padding: 25px;
            width: 80%;
            border-radius: 25px
          }
        .title-exp {
            justify-self: center;
            font-size: 5vh;
            border-radius: 25px;
        }
          /* the entire page (put a grid around it)  */
        .wrapper-exp {
            display: grid;
            padding: 1mm;
            padding-top: 0.5mm;
            border-radius: 25px;
            background-color: #eee;
        }
        .fav-exp {
            font-size: 16px;
            width: 180px;
            height: 30px;
        }

        .fav-exp p {
            margin-left: 10px;
            display: inline-block;
        }

        .fav-exp:hover{
            transform: scale(1.05);
            transition: all 0.2s ease-out;
            cursor: pointer;
            color: #7a4026;
        }
        .list-element {
            vertical-align: middle;
            padding: 0.5em;
        }
        /* set padding and background color for each section in page */
        .wrapper-exp > section{
            background-color: #eee;
            padding: 1em;
        }
        
        /* the image/description section */
        .recipe-desc-exp{
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 1em;
            row-gap: 1em;
        }
        /* the content inside the image/description section */
        .recipe-desc-exp > div{
            background-color: #eee;
            padding: 1em;
        }
        
        /* the add to fav subsection */
        .recipe-desc-exp > div:nth-child(3){
            background-color: #eee;
            height: 30px;
        }
        
        /* the description subsection */
        .descriptionBox{
            padding: 1em;
            font-size: 1vw;
        }
        
        /* the main recipe img subsection */
        #recipe-img{
            object-fit: cover;
            width: 100%;
            max-height: 100%;
            border-radius: 25px;
        }
        
        /* the add to fav star img*/
        #star-img, #edit-img, #delete-img{
            height: 35px;
            width: 35x;
        }
        
        /* the rating star img */
        #starRate{
            height: 25px;
            width: 100px;
            vertical-align: inherit;
        }

        #editButton {
            background-color: #eee;
            height: 30px;
            width: 135px;
            font-size: 16px;
            align-items: center;
            margin-right: 8px;
            text-align: center;
        }

        #deleteButton {
            background-color: #eee;
            height: 30px;
            width: 135px;
            font-size: 16px;;
            align-items: center;
            margin-right: 20px;
            text-align: center;
        }
        #editButton:hover{
            transform: scale(1.05);
            transition: all 0.2s ease-out;
            cursor: pointer;
            color: #7a4026;
        }
        #deleteButton:hover{
            transform: scale(1.05);
            transition: all 0.2s ease-out;
            cursor: pointer;
            color: #7a4026;
        }
        
        .expandButtons {
            justify-content: center;
            display: flex;
            align-content: space-between;
        }

        /* the box containing the ingredient content(the checkbox stuff)*/
        .ingredients-desc-exp{
            background-color: #ddd;
            padding: 1px;
            // text-align: center;
            font-size: 1vw;
        }
        
        /* when checkbox is clicked, strikethrough the text */
        .ingredientsBox:checked + span{
            text-decoration: line-through;
        }
        
        /* the box containing the tutorial content*/
        .tutorial-desc-exp {
            background-color: #ddd;
            padding: 1px;
            font-size: 1vw;
            padding-left: 1em;
        }
        
        /* the box containing the nutional content*/
        .nutrition-desc-exp {
            column-gap: 1em;
            background-color: #ddd;
            padding: 1px;
            // text-align:center;
            font-size: 1vw;
            left: 10em;
            padding-left: 7.5em;
        }

        .star-light-up {
          
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

    let time = cardData.readyInMinutes;

    if (time > 60) {
      let hours = Math.floor(time / 60);
      let minutes = time - 60 * hours;

      if (hours == 1) time = hours + " hour and " + minutes + " minutes";
      else time = hours + " hours and " + minutes + " minutes";
    } else time += " minutes";

    prepTime.innerText = `Prep time: ${time}`; //TODO: convert to "x hours y minutes" format if over 59 minutes

    const dietary = document.createElement("li");
    dietary.innerText = `Dietary restrictions: ${
      cardData.vegan == true ? "vegan" : "not vegan"
    }`;
    dietary.classList.add("list-element");
    const rating = document.createElement("li");
    rating.classList.add("list-element");
    rating.setAttribute("id", "ratingBox");
    let numStars = 5;
    if (cardData.spoonacularScore)
      numStars = Math.round(cardData.spoonacularScore / 20);

    rating.innerHTML = `Rating: <img src="./images/${numStars}star.png" id="starRate">`;
    const allergens = document.createElement("li");

    var allergensList = "Allergens: ";
    for (let i = 0; i < cardData.extendedIngredients.length; i++) {
      if (cardData.extendedIngredients[i].name)
        allergensList += cardData.extendedIngredients[i].name;
      else allergensList += cardData.extendedIngredients[i];
      if (i != cardData.extendedIngredients.length - 1) {
        allergensList += ", ";
      }
    }
    allergens.innerText = allergensList;
    allergens.classList.add("list-element");

    let summary = "";
    if (!cardData.isLocal) {
      summary = document.createElement("li");
      summary.innerHTML = "Summary: " + cardData.summary;
      summary.classList.add("list-element");
    }

    description.appendChild(prepTime);
    description.appendChild(dietary);
    if (!cardData.isLocal) description.appendChild(rating);
    description.appendChild(allergens);
    if (!cardData.isLocal) description.appendChild(summary);

    const favIcon = document.createElement("img");
    favIcon.src = "./images/favoriteStar.png";
    favIcon.style = "float: left";
    favIcon.id = "star-img";
    const favBut = document.createElement("p");
    var stored = false;
    favBut.innerText = "Favorite"; //Add to favorite button
    const fav = document.createElement("div");
    fav.addEventListener('click', (e) => {
        favIcon.classList.toggle('star-light-up');
        stored = true;
    })
    fav.classList.add("fav-exp");
    fav.appendChild(favIcon);
    fav.appendChild(favBut);

    const editIcon = document.createElement("img");
    editIcon.src = "./images/recipe-edit.png";
    editIcon.style = "float: left";
    editIcon.id = "edit-img";
    const editBut = document.createElement("p");
    editBut.innerText = "Edit Recipe"; //Add to favorite button
    const edit = document.createElement("div");
    edit.setAttribute("id", "editButton");
    edit.classList.add("edit-exp");
    edit.appendChild(editIcon);
    edit.appendChild(editBut);

    //On clicking edit button
    edit.addEventListener("click", function () {
      //Let crud page know to replace the old data in localStorage
      localStorage.setItem("inEditMode", JSON.stringify(true));

      //Store the data to pass into the crud page
      localStorage.setItem("recipeDataToEdit", JSON.stringify(cardData));

      //Navigate to the crud page
      window.location.href = "crud.html"; //redirect to crud
    });

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "./images/recipe-delete.png";
    deleteIcon.style = "float: left";
    deleteIcon.id = "delete-img";
    const deleteBut = document.createElement("p");
    deleteBut.innerText = "Delete Recipe"; //Add to favorite button
    const del = document.createElement("div");
    del.setAttribute("id", "deleteButton");
    del.classList.add("del-exp");
    del.appendChild(deleteIcon);
    del.appendChild(deleteBut);

    del.addEventListener("click", function () {
      //Retrieve the array of local recipes from localstorage
      let localRecipes = JSON.parse(localStorage.getItem("localRecipes"));
      let stringifiedRecipies = [];

      console.log(localRecipes);

      //Parse each stored recipe from json format back into js-useable data
      //(localStorage only takes strings so anything stored locally has to be stored in json and then parsed back upon retrieval)
      for (let i = 0; i < localRecipes.length; i++) {
        stringifiedRecipies[i] = JSON.parse(localRecipes[i]);
        console.log(stringifiedRecipies[i]);
        console.log(localRecipes[i]);
      }

      console.log(stringifiedRecipies);

      //Get the index of the old recipe data to remove in the locally stored array
      let removeIndex = -1;
      for (let i = 0; i < stringifiedRecipies.length; i++) {
        console.log(stringifiedRecipies[i]);
        if (stringifiedRecipies[i].data) {
          if (stringifiedRecipies[i].data.id == cardData.id) removeIndex = i;
          console.log(stringifiedRecipies[i].data.id);
        } else if (stringifiedRecipies[i].json) {
          if (stringifiedRecipies[i].json.id == cardData.id) removeIndex = i;
          console.log(stringifiedRecipies[i].json.id);
        }
      }

      //Remove old recipe from array
      //if(removeIndex != -1)stringifiedRecipies.splice(removeIndex, 1);
      if (removeIndex != -1) localRecipes.splice(removeIndex, 1);
      if (removeIndex == -1) alert("ID not found! Expected ID: " + cardData.id);

      //Push updated local recipe array back to localStorage
      localStorage.setItem("localRecipes", JSON.stringify(localRecipes));

      //exit expand view upon deletion
      location.reload();
    });

    recipeDesc.appendChild(mainImg);
    recipeDesc.appendChild(description);
    const buttonSection = document.createElement("section");
    buttonSection.setAttribute("class", "expandButtons");

    if (cardData.isLocal) {
      buttonSection.appendChild(edit);
      buttonSection.appendChild(del);
    }

    buttonSection.appendChild(fav);
    recipeDesc.appendChild(buttonSection);

    //#endregion
    //#region
    const ingredientDesc = document.createElement("section");
    ingredientDesc.classList.add("ingredients-desc-exp");
    const ingredTitle = document.createElement("div");
    ingredTitle.innerHTML = `<h2> Ingredients </h2>`;

    const ingredientsTable = document.createElement("ingredients-table-exp");

    for (let i = 0; i < cardData.extendedIngredients.length; i++) {
      const ingredient = document.createElement("li");
      if (cardData.extendedIngredients[i].originalString)
        ingredient.innerHTML = `<input type="checkbox" class="ingredientsBox"/><span>${cardData.extendedIngredients[i].originalString}</span>`;
      else
        ingredient.innerHTML = `<input type="checkbox" class="ingredientsBox"/><span>${cardData.extendedIngredients[i]}</span>`;
      ingredientsTable.appendChild(ingredient);
    }

    ingredientDesc.appendChild(ingredTitle);
    ingredientDesc.appendChild(ingredientsTable);
    //#endregion
    //#region
    const tutorialDesc = document.createElement("section");
    tutorialDesc.classList.add("tutorial-desc-exp");
    const instructionTable = document.createElement("div");
    instructionTable.innerHTML = `<h2> Directions </h2>`;
    instructionTable.innerHTML += cardData.instructions;
    // avoid showing null in the instruction section when the instructions is undefined
    if (cardData.instructions == null) {
      instructionTable.innerHTML = ``;
    }
    tutorialDesc.appendChild(instructionTable);
    //#endregion
    //#region

    //Testing- don't load if data dne
    const nutrientDesc = document.createElement("section");
    if (cardData.nutrition && cardData.nutrition.nutrients) {
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
    }

    //#endregion
    wrapper.appendChild(title);
    wrapper.appendChild(recipeDesc);
    wrapper.appendChild(ingredientDesc);
    wrapper.appendChild(tutorialDesc);
    //if(cardData.nutrition && cardData.nutrition.nutrients) wrapper.appendChild(nutrientDesc);
    wrapper.appendChild(nutrientDesc);

    // const description = document.createElement('div');
    // description.setAttribute('class', 'descriptionBox description');
    // description.innerHTML = cardData.summary;

    article.appendChild(wrapper);
  }
  get data() {
    return this.json;
  }
}
customElements.define("recipe-expand", RecipeExpand);
