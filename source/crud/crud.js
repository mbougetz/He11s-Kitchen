window.addEventListener("DOMContentLoaded", init);

var deleteOldRecipe;
var oldRecipeID;

//NOTE: This function runs on page load when the home page is loaded AND when crud.html is loaded
function init() {
  //If index.html is current source bind load to add recipe button
  if (document.getElementById("addRecipeBtn"))
    document
      .getElementById("addRecipeBtn")
      .addEventListener("click", function () {
        redirectToCRUD();
      });

  //Super janky way of detecting the page source has been changed to crud.html
  if (
    !document.getElementById("addRecipeBtn") &&
    document.getElementById("add")
  )
    crudPageInit();

  /**  document.getElementById("cancel").addEventListener("click", cancelRecipe);
  document.getElementById("edit").addEventListener("click", updateRecipe);
  document
    .getElementById("cancelEdit")
    .addEventListener("click", cancelEditRecipe); */
}



//Changes page source to crud.html; reruns init function because of how js works.
function redirectToCRUD() {
  window.location.href = "crud/crud.html";
}

//Change page source to editRecipe.html
function redirectToEdit(){
  window.location.href = "crud/editRecipe.html";
}

var numIngredient = 1;
//Runs once crud.html has been loaded
function crudPageInit() {
  numIngredient = 1; //Used for counting ingredients added
  deleteOldRecipe = false;

  //localStorage.clear(); //I literally just comment this line of code back in when I want to reset the localStorage

  //Bind add recipe button
  document.getElementById("add").addEventListener("click", function () {
    addRecipe();
  });

  //Bind cancel add recipe button
  document.getElementById("cancel").addEventListener("click", function () {
    redirectToIndex();
  });

  //Bind addIngredient button to add a new ingredient input box
  document.getElementById("addIngredient").addEventListener("click", function () {
    numIngredient++;
    let wrapper = document.getElementById("ingredientInputWrapper");

    let newInputBox = document.createElement("textarea");
    newInputBox.setAttribute("id", "ingredientInputField");
    newInputBox.setAttribute("class", "ingredientInput");
    newInputBox.setAttribute("placeholder", "Add Ingredient #" + numIngredient + ":");

    wrapper.appendChild(newInputBox);

  });

  //Bind delete ingredient button
  document.getElementById("delIngredient").addEventListener("click", function () {
    let allIngInputs = document.getElementsByClassName ("ingredientInput");
    let lastInput = allIngInputs[allIngInputs.length - 1];
    if(allIngInputs.length != 1) {
      document.getElementById("ingredientInputWrapper").removeChild(lastInput);
      numIngredient--;
    }
  });

  if(JSON.parse(localStorage.getItem("inEditMode"))) enterEditMode();
  

}

function enterEditMode(){
  //Mark that there's a recipe needing to be removed from localStorage when add recipe is clickes
  deleteOldRecipe = true;
  localStorage.setItem("inEditMode", JSON.stringify(false));

  let recipeData = JSON.parse(localStorage.getItem("recipeDataToEdit"));

  oldRecipeID = recipeData.id;

  fillInputFields(recipeData);


}

function delOldRecipe(){
  deleteOldRecipe = false;
  //Retrieve the array of local recipes from localstorage
  let localRecipes = JSON.parse(localStorage.getItem("localRecipes"));
  let stringifiedRecipies = [];

  //Parse each stored recipe from json format back into js-useable data
  //(localStorage only takes strings so anything stored locally has to be stored in json and then parsed back upon retrieval)
  for (let i = 0; i < localRecipes.length; i++) {
    stringifiedRecipies[i] = JSON.parse(localRecipes[i]);
    
  }

  //Get the index of the recipe in localstorage that needs to be removed
  let removeIndex = -1;
  for(let i = 0; i < stringifiedRecipies.length; i++){   
    
    if(stringifiedRecipies[i].data) {

      if(stringifiedRecipies[i].data.id == oldRecipeID) removeIndex = i;
    }
    else if(stringifiedRecipies[i].json) {

      if(stringifiedRecipies[i].json.id == oldRecipeID) removeIndex = i;
    }
  }

  //Remove old recipe from array
  if(removeIndex == 0 && stringifiedRecipies.length == 1) stringifiedRecipies = [];
  else if(removeIndex != -1)stringifiedRecipies.splice(removeIndex, 1);

  //Rebuild array
  let newLocalRecipeArr = [];
  for(let i = 0; i < stringifiedRecipies.length; i++){
    let newRecipeCard = document.createElement("recipe-card");
    if(stringifiedRecipies[i].data) newRecipeCard.data = stringifiedRecipies[i].data; //test
    else if(stringifiedRecipies[i].json)newRecipeCard.data = stringifiedRecipies[i].json;

    newLocalRecipeArr[i] = JSON.stringify(newRecipeCard);

  }

  //Push updated local recipe array back to localStorage
  localStorage.setItem("localRecipes", JSON.stringify(newLocalRecipeArr));

}

//Enter the recipe data to edit into the crud input boxes
function fillInputFields(recipeData){
  document.getElementById("recipeTitle").setAttribute("value", recipeData.title);
  document.getElementById("time").setAttribute("value", recipeData.readyInMinutes);
  document.getElementById("instructions").innerText = recipeData.instructions;

  let ingredients = recipeData.extendedIngredients;

  console.log(recipeData.extendedIngredients);

  //Add the appropriate amount of ingredient boxes to page
  for(let i = 0; i < ingredients.length - 1; i++) document.getElementById("addIngredient").click();

  //Fill in each add ingredient input field with the relevant value from the retrieved recipe data
  let allIngInputs = document.getElementsByClassName ("ingredientInput");
  for(let i = 0; i < allIngInputs.length; i++){
    if(ingredients[i].originalString) allIngInputs[i].innerText = ingredients[i].originalString;
    else allIngInputs[i].innerText = ingredients[i];

  }

}


//Take user input and create a recipe and add it to localstorage
function addRecipe() {
  
  //First generate random id to use as a hash
  let hashID = "" + Math.round(Math.random()*10) + Math.round(Math.random()*10) + Math.round(Math.random()*10) + Math.round(Math.random()*10) + Math.round(Math.random()*10)
  hashID *= 1000000;

  //Get user input values from page
  //Free stock image for use as local recipe image
  let recipeImage  = "https://images.freeimages.com/images/large-previews/7f5/plate-1329634.jpg";
  let recipeTitle = document.getElementById("recipeTitle").value;
  let recipeTime = document.getElementById("time").value;
  let recipeInstructions = document.getElementById("instructions").value;

  let allRecipeIngredients = document.getElementsByClassName ("ingredientInput");

  let recipeIngredientArr = [];
  for(let i = 0; i < allRecipeIngredients.length; i++){
    recipeIngredientArr[i] = allRecipeIngredients[i].value;

  }

  //Create object to hold data
  let newRecipe = {
    id: hashID,
    title: recipeTitle,
    readyInMinutes: recipeTime,
    image: recipeImage,
    extendedIngredients: recipeIngredientArr,
    instructions: recipeInstructions, //used to be property directions
    isLocal: true, //Designates card created as being a local recipe, not one fetched from spoonacular
  };

  //Create a new recipe card, pass the data into it
  let newRecipeCard = document.createElement("recipe-card");
  newRecipeCard.data = newRecipe;

  if(deleteOldRecipe) delOldRecipe(); //If the recipe being added is an edited version of an already stored recipe, delete the old one

  //Get array of local recipes from localstorage
  let localRecipes = JSON.parse(localStorage.getItem("localRecipes"));
  if(localRecipes.length == 1 && localRecipes[0] == "{}") localRecipes = [];

  //Add the newly created recipe card to the retrieved array
  localRecipes.push(JSON.stringify(newRecipeCard));

  //Push the updated array back to localStorage
  localStorage.setItem("localRecipes", JSON.stringify(localRecipes));


  //alert("Successfully added recipe!");
  redirectToIndex();
}

function redirectToIndex() {
  deleteOldRecipe = false;
  window.location.href = "/source/index.html";
}

