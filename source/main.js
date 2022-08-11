import { fetchParams, fetchById , getRecipe, queryApi} from "./service/api.js";
import { Router } from "./Router.js";
const recipes = []; // instead of using json files, we want recipes from the API
const recipeData = {}; // used to access the recipe data from Spoonacular

const numSearchResults = 12; //Number of query results retrieved at a time
const recipesDisplayed = 3; //Max number of recipes displayed at a time per carousel
const featuredRecipeID = 608725; //Current featured recipe to display; set manually by a site maintainer

const router = new Router(function () {
  document.querySelector(".section-recipes-expand").classList.remove("seen");
  document.querySelector(".section-recipes-display").classList.add("seen");
  document.querySelector(".featured").classList.add("seen");
  history.pushState(
    { page: "home" },
    "",
    window.location.origin + window.location.pathname
  );
});

window.addEventListener("DOMContentLoaded", init);

//On page load
async function init() {
  document.querySelector(".section-recipes-expand").classList.add("seen");
  console.log("initiating");

  //Initialize localStorage for use
  initLocalStorage();

  //Initialize variable keeping track of whether a recipe is to be edited
  initEditMode();

  //Fill featured recipe on home page with recipe info
  populateFeaturedRecipe(featuredRecipeID);

  //Bind search events to search bar
  bindSubPages();

  //Bind subpage functionality to dropdown menu
  bindSearchBars();

  //Display homepage by default
  homeCarousels(numSearchResults);

  bindEsc();
  router.onPopstate();
}

//If no recipes have been stored, creates an array to store them in
function initLocalStorage() {
  if (!localStorage.getItem("localRecipes")) {
    let emptyArr = [];
    localStorage.setItem("localRecipes", JSON.stringify(emptyArr));
  }

  //localStorage.clear();
}

function initEditMode() {
  if (!localStorage.getItem("inEditMode")) {
    localStorage.setItem("inEditMode", JSON.stringify(false));
  }
}

function bindSubPages() {
  document.getElementById("homePage").addEventListener("click", function () {
    homeCarousels(numSearchResults);

    //remove any subpage hero sections
    if (document.querySelector(".breakfast-hero")) {
      document.querySelector(".breakfast-hero").classList.remove("seen");
    }
    if (document.querySelector(".lunch-hero")) {
      document.querySelector(".lunch-hero").classList.remove("seen");
    }
    if (document.querySelector(".dinner-hero")) {
      document.querySelector(".dinner-hero").classList.remove("seen");
    }
    if (document.querySelector(".dessert-hero")) {
      document.querySelector(".dessert-hero").classList.remove("seen");
    }

    //add the home page sections
    document.querySelector(".hero").classList.add("seen");
    document.querySelector(".featured").classList.add("seen");
  });

  document
    .getElementById("breakfastPage")
    .addEventListener("click", function () {
      breakfastCarousels(numSearchResults);
      //remove main website sections
      //if these sections have the class "seen", then remove. if not dont do anything
      document.querySelector(".hero").classList.remove("seen");
      document.querySelector(".featured").classList.remove("seen");

      //remove lunch sections if redirecting from lunch page
      if (document.querySelector(".lunch-hero")) {
        document.querySelector(".lunch-hero").classList.remove("seen");
      }
      //remove dinner sections if redirecting from dinner page
      if (document.querySelector(".dinner-hero")) {
        document.querySelector(".dinner-hero").classList.remove("seen");
      }
      //remove dessert section if redirecting from dessert page
      if (document.querySelector(".dessert-hero")) {
        document.querySelector(".dessert-hero").classList.remove("seen");
      }

      //add breakfast section
      document.querySelector(".breakfast-hero").classList.add("seen");
    });

  document.getElementById("lunchPage").addEventListener("click", function () {
    lunchCarousels(numSearchResults);
    //remove main website sections
    //if these sections have the class "seen", then remove. if not dont do anything
    document.querySelector(".hero").classList.remove("seen");
    document.querySelector(".featured").classList.remove("seen");

    //remove breakfast sections if redirecting from lunch page
    if (document.querySelector(".breakfast-hero")) {
      document.querySelector(".breakfast-hero").classList.remove("seen");
    }
    //remove dinner sections if redirecting from dinner page
    if (document.querySelector(".dinner-hero")) {
      document.querySelector(".dinner-hero").classList.remove("seen");
    }
    //remove dessert section if redirecting from dessert page
    if (document.querySelector(".dessert-hero")) {
      document.querySelector(".dessert-hero").classList.remove("seen");
    }
    //add lunch section
    document.querySelector(".lunch-hero").classList.add("seen");
  });

  document.getElementById("dinnerPage").addEventListener("click", function () {
    dinnerCarousels(numSearchResults);
    //remove main website sections
    document.querySelector(".hero").classList.remove("seen");
    document.querySelector(".featured").classList.remove("seen");
    //remove breakfast sections if redirecting from lunch page
    if (document.querySelector(".breakfast-hero")) {
      document.querySelector(".breakfast-hero").classList.remove("seen");
    }
    //remove lunch sections if redirecting from dinner page
    if (document.querySelector(".lunch-hero")) {
      document.querySelector(".lunch-hero").classList.remove("seen");
    }
    //remove dessert section if redirecting from dessert page
    if (document.querySelector(".dessert-hero")) {
      document.querySelector(".dessert-hero").classList.remove("seen");
    }
    //add dinner section
    document.querySelector(".dinner-hero").classList.add("seen");
  });

  document.getElementById("dessertPage").addEventListener("click", function () {
    dessertCarousels(numSearchResults);
    //remove main website sections
    document.querySelector(".hero").classList.remove("seen");
    document.querySelector(".featured").classList.remove("seen");
    //remove breakfast sections if redirecting from lunch page
    if (document.querySelector(".breakfast-hero")) {
      document.querySelector(".breakfast-hero").classList.remove("seen");
    }
    //remove lunch section if redirecting from lunch page
    if (document.querySelector(".lunch-hero")) {
      document.querySelector(".lunch-hero").classList.remove("seen");
    }
    //remove dinner sections if redirecting from dinner page
    if (document.querySelector(".dinner-hero")) {
      document.querySelector(".dinner-hero").classList.remove("seen");
    }

    //add dessert section
    document.querySelector(".dessert-hero").classList.add("seen");
  });
}

//Bind search functionality to the search bars/buttons
function bindSearchBars() {
  document
    .getElementById("topSearchButton")
    .addEventListener("click", function () {
      searchCarousels(false);
    });

  document
    .getElementById("topSearch")
    .addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.key === "Enter") {
        document.getElementById("topSearchButton").click();
      }
    });

  let allHeroSearchBars = document.querySelectorAll('[id="heroSearchBar"]');
  for (let i = 0; i < allHeroSearchBars.length; i++) {
    allHeroSearchBars[i].addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.key === "Enter") {
        document
          .getElementById("topSearch")
          .setAttribute("value", allHeroSearchBars[i].value);
        document.getElementById("topSearchButton").click();
      }
    });
  }

  let allHeroSearchButtons = document.querySelectorAll(
    '[id="heroSearchButton"]'
  );
  for (let i = 0; i < allHeroSearchButtons.length; i++) {
    allHeroSearchButtons[i].addEventListener("click", function (event) {
      event.preventDefault(); //Test
      document
        .getElementById("topSearch")
        .setAttribute("value", allHeroSearchBars[i].value);

      document.getElementById("topSearchButton").click();
    });
  }
}

//Deletes all currently displayed carousels from the page
function clearCarousels() {
  //First clear recipe-wrapper
  var currCarousels = document.querySelectorAll("[class=carousel]");

  document.querySelector(".section-recipes-expand").classList.remove("seen");
  document.querySelector(".section-recipes-display").classList.add("seen");

  if (currCarousels) {
    for (let i = 0; i < currCarousels.length; i++) {
      currCarousels[i].remove();
    }
  }

  var currCarouselTitles = document.querySelectorAll("[id=carousel-title]");
  if (currCarouselTitles) {
    for (let i = 0; i < currCarouselTitles.length; i++) {
      currCarouselTitles[i].remove();
    }
  }
}

//Fill the featured recipe element on the home page with retrieved data
async function populateFeaturedRecipe(recipeID){
  //await fetchById(recipeID).then(function(res){
    await getRecipe(recipeID).then(function(res){

    let featImgWrapper = document.getElementsByClassName("featured-flex-item");
    let featImg = document.createElement("img");
    featImg.setAttribute("src", res.image);
    featImg.setAttribute("alt", "featured-recipe"
    );
    featImgWrapper[0].appendChild(featImg);

    let featTextWrapper = document.getElementsByClassName("featured-flex-item featured-text");

    let featTitle = document.createElement("h2");
    featTitle.innerText = res.title;
    let featBreak = document.createElement("br");
    let featDesc = document.createElement("p");
    featDesc.innerText = `Whip up this perfect ` + res.title + ` for ` + res.dishTypes[0] + `! It's 
    surprisingly easy and oh so delicious with a prep time of only ` + res.readyInMinutes + ` minutes!`;

    featTextWrapper[0].appendChild(featTitle);
    featTextWrapper[0].appendChild(featBreak);
    featTextWrapper[0].appendChild(featDesc);

    //Bind the click function of the featured section to act identically
    //To the click function for recipe cards
    let recipeCard = document.createElement("recipe-card");
    recipeCard.data = res;
    bindRecipeExpand(recipeCard, function () {
      //fetchById(recipeID).then(function (res) {
        getRecipe(recipeID).then(function (res) {
        recipeCard.data.isLocal = false; //Mark as not a local recipe
        document
          .querySelector(".section-recipes-expand")
          .classList.add("seen");
        document
          .querySelector(".section-recipes-display")
          .classList.remove("seen");
        document.querySelector(".featured").classList.remove("seen"); //test
        document.querySelector("recipe-expand").data = res;
      });
    });


    document.getElementsByClassName("featured-flex-container")[0].addEventListener("click", function(){
      recipeCard.click();

    });

  });

}

//The specific carousels to load on the home page
async function homeCarousels(numResults) {
  clearCarousels();

  

  //Load local recipe carousel if any local recipes are stored; else load a pasta carousel
  let localRecipes = JSON.parse(localStorage.getItem("localRecipes"));
  if (localRecipes && localRecipes.length != 0 && localRecipes[0] != "{}")
    newLoadLocalRecipes();
  else
    await createCarousel(
      "sandwich",
      numResults,
      "Top Sandwich Recipes",
      recipesDisplayed
    );

  await createCarousel(
    "burger",
    numResults,
    "Top Burger Recipes",
    recipesDisplayed
  );
  await createCarousel(
    "pasta",
    numResults,
    "Top Pasta Recipes",
    recipesDisplayed
  );
}

//The specific carousels to load on the breakfast page
async function breakfastCarousels(numResults) {
  clearCarousels();

  //load carousel of local recipes

  await createCarousel(
    "breakfast",
    numResults,
    "Top Breakfast Recipes",
    recipesDisplayed
  );
  await createCarousel(
    "pancakes",
    numResults,
    "Best Pancakes Around",
    recipesDisplayed
  );
  await createCarousel("eggs", numResults, "Top Egg Recipes", recipesDisplayed);
}

//The specific carousels to load on the lunch page
async function lunchCarousels(numResults) {
  clearCarousels();

  //load carousel of local recipes

  await createCarousel(
    "lunch",
    numResults,
    "Top Lunch Recipes",
    recipesDisplayed
  );
  await createCarousel(
    "sandwich",
    numResults,
    "Our Best Sandwiches",
    recipesDisplayed
  );
  await createCarousel("salad", numResults, "Leafy Greens", recipesDisplayed);
}

//The specific carousels to load on the dinner page
async function dinnerCarousels(numResults) {
  clearCarousels();

  //load carousel of local recipes

  await createCarousel(
    "dinner",
    numResults,
    "Top Dinner Recipes",
    recipesDisplayed
  );
  await createCarousel(
    "pasta",
    numResults,
    "Top Pasta Recipes",
    recipesDisplayed
  );
  await createCarousel(
    "noodles",
    numResults,
    "Delicious Noodles",
    recipesDisplayed
  );
}
/**
 * 
 * @param {*} numResults 
 */
//The specific carousels to load on the dessert page
async function dessertCarousels(numResults) {
  clearCarousels();

  //load carousel of local recipes

  await createCarousel(
    "dessert",
    numResults,
    "Top Dessert Recipes",
    recipesDisplayed
  );
  await createCarousel(
    "ice cream",
    numResults,
    "The Best of Ice Cream",
    recipesDisplayed
  );
  await createCarousel(
    "cookies",
    numResults,
    "Amazing Cookies",
    recipesDisplayed
  );
}

//Search spoonacular for the value currently in the search bar
//Param: searchingFromHero is true if search is clicked from the hero search bar, false if from the top search bar
async function searchCarousels(searchingFromHero) {
  let query = "";

  if (!searchingFromHero) query = document.getElementById("topSearch").value;
  else query = document.getElementById("heroSearchBar").value;

    router.setExpand("search#" + query, async function(){
      clearCarousels();
      await createCarousel(
        query,
        numSearchResults * 3,
        "Top Results",
        recipesDisplayed
      );

    });

    router.navigate("search#" + query, false);

}

/* @function the function creates a carousel and attach the carousel to the main page
   @param input a filter word to select recipes for the carousel
   @return return an array of recipes that contained in the carousel*/
async function createCarousel(selector, numRecipes, title, numRecipesShown) {
  if (!numRecipes) numRecipes = numSearchResults;
  if (!numRecipesShown) numRecipesShown = 5;

  //used to store fetched recipe that stored in local base
  const localRecipe = [];
  //await fetchParams(`query=${selector}&addRecipeNutrition=true&number=${numRecipes}`)
  await queryApi(selector, numRecipes
  ).then(function (res) {
    const carousel = document.createElement("div");
    // set the div's carousel
    carousel.setAttribute("class", "carousel");

    //Create banner message for new carousel
    if (title) {
      let cardTitle = document.createElement("h2");
      cardTitle.innerText = title;
      cardTitle.setAttribute("id", "carousel-title");
      cardTitle.innerHTML =
        cardTitle.innerText + '<i class="fa fa-long-arrow-right"></i>';
      document.querySelector(".recipes-wrapper").appendChild(cardTitle);
    }

    for (let i = 0; i < res.results.length; i++) {
      recipeData[res.results[i].title] = res.results[i].id;
      // create recipe card
      let recipeCard = document.createElement("recipe-card");
      recipeCard.data = res.results[i];
      bindRecipeExpand(recipeCard, function () {
        //fetchById(recipeCard.data.id).then(function (res) {
          getRecipe(recipeCard.data.id).then(function (res) {
          recipeCard.data.isLocal = false; //Mark as not a local recipe
          document
            .querySelector(".section-recipes-expand")
            .classList.add("seen");
          document
            .querySelector(".section-recipes-display")
            .classList.remove("seen");
          document.querySelector(".featured").classList.remove("seen"); //test
          document.querySelector("recipe-expand").data = res;
        });
      });

      localRecipe[i] = recipeCard;

      //Ensure the correct amount of cards per carousel display
      if (i < numRecipesShown) carousel.appendChild(recipeCard);
      
    }

    // append showMore button to the carousel.
    const showMore = document.createElement("a");
    showMore.setAttribute("class", "forward");
    showMore.innerHTML = "&#10095";
    carousel.appendChild(showMore);
    const showLess = document.createElement("a");
    bindShowMore(showMore, carousel, localRecipe, numRecipesShown);
    showLess.setAttribute("class", "back");
    showLess.innerHTML = "&#10094";
    carousel.prepend(showLess);
    bindShowLess(showLess, carousel, localRecipe, numRecipesShown);
    document.querySelector(".recipes-wrapper").appendChild(carousel);
  });
  return localRecipe;
}

function newLoadLocalRecipes() {
  //Retrieve the array of local recipes from localstorage
  let localRecipes = JSON.parse(localStorage.getItem("localRecipes"));
  let stringifiedRecipies = [];


  //Parse each stored recipe from json format back into js-useable data
  //(localStorage only takes strings so anything stored locally has to be stored in json and then parsed back upon retrieval)
  for (let i = 0; i < localRecipes.length; i++) {
    stringifiedRecipies[i] = JSON.parse(localRecipes[i]);
  }

  const carousel = document.createElement("div");
  // set the div's carousel
  carousel.setAttribute("class", "carousel");

  //Create an array of all recipe data
  let newCardsArray = [];
  for (let i = 0; i < stringifiedRecipies.length; i++) {
    let newCard = document.createElement("recipe-card");
    if (stringifiedRecipies[i].data) newCard.data = stringifiedRecipies[i].data;
    else newCard.data = stringifiedRecipies[i].json;
    newCardsArray[i] = newCard;

    bindRecipeExpand(newCard, function () {
      document.querySelector(".section-recipes-expand").classList.add("seen"); //swap add and remove
      document
        .querySelector(".section-recipes-display")
        .classList.remove("seen");
      document.querySelector(".featured").classList.remove("seen");
      document.querySelector("recipe-expand").data = newCard.data;
    });

    if (i < recipesDisplayed) {
      //Only load numRecipesShown per carousel
      carousel.appendChild(newCard);
    }
  }

  //Create banner message for new carousel
  let cardTitle = document.createElement("h2");
  cardTitle.innerText = "Locally Created Recipes";
  cardTitle.setAttribute("id", "carousel-title");
  cardTitle.innerHTML =
    cardTitle.innerText + '<i class="fa fa-long-arrow-right"></i>';
  document.querySelector(".recipes-wrapper").appendChild(cardTitle);

  // append showMore button to the carousel.
  const showMore = document.createElement("a");
  showMore.setAttribute("class", "forward");
  showMore.innerHTML = "&#10095";
  carousel.appendChild(showMore);
  const showLess = document.createElement("a");
  bindShowMore(showMore, carousel, newCardsArray, recipesDisplayed);
  showLess.setAttribute("class", "back");
  showLess.innerHTML = "&#10094";
  carousel.prepend(showLess);
  bindShowLess(showLess, carousel, newCardsArray, recipesDisplayed);
  document.querySelector(".recipes-wrapper").appendChild(carousel);
}

function bindRecipeExpand(recipeCard, recipeExpand) {
  router.setExpand(recipeCard.data.id, recipeExpand);
  recipeCard.addEventListener("click", (e) => {
    router.navigate(recipeCard.data.id, false);
  });
}

/* the function add an eventlistener to the showMore button in the carousel. By clicking the button, 3 more recipe will be shown. */
function bindShowMore(btn, carousel, localRecipe, numRecipesInCarousel) {
  if (!numRecipesInCarousel) numRecipesInCarousel = 5;

  let curPtr = 0;
  btn.addEventListener("click", async () => {
    //check the index of current recipes
    for (let i = 0; i < localRecipe.length / numRecipesInCarousel; i++) {
      if (
        carousel.querySelector("recipe-card").data.title ==
        localRecipe[i * numRecipesInCarousel].data.title
      ) {
        //changed from 3
        curPtr = (i + 1) * numRecipesInCarousel;
        break;
      }
    }
    // if current pointer is at the end of the array, there is no more recipe to be shown
    if (curPtr >= localRecipe.length) {
      //window.alert('no more recipe to show');
      return;
    }
    for (let i = 0; i < numRecipesInCarousel; i++) {
      carousel.removeChild(carousel.querySelector("recipe-card"));
    }
    for (let i = 0; i < numRecipesInCarousel; i++) {
      if (i + curPtr >= localRecipe.length) {
        break;
      }
      carousel.insertBefore(localRecipe[i + curPtr], btn);
    }
  });
}

/* the function bind an eventlistener to the prev button in the carousel. By clicking the button, previous 3 recipes will be shown */
function bindShowLess(btn, carousel, localRecipe, numRecipesInCarousel) {
  if (!numRecipesInCarousel) numRecipesInCarousel = 5;

  let curPtr = 0;
  btn.addEventListener("click", () => {
    //check the index of current recipes
    for (let i = 0; i < localRecipe.length / numRecipesInCarousel; i++) {
      if (
        carousel.querySelector("recipe-card").data.title ==
        localRecipe[i * numRecipesInCarousel].data.title
      ) {
        curPtr = (i - 1) * numRecipesInCarousel;
        break;
      }
    }
    // if current pointer is at the end of the array, there is no more recipe to be shown
    if (curPtr < 0) {
      //window.alert('no more recipe to show');
      return;
    }

    for (let i = 0; i < numRecipesInCarousel; i++) {
      if (carousel.querySelector("recipe-card") == null) {
        break;
      }
      carousel.removeChild(carousel.querySelector("recipe-card"));
    }
    for (let i = 0; i < numRecipesInCarousel; i++) {
      if (localRecipe[i + curPtr])
        carousel.insertBefore(
          localRecipe[i + curPtr],
          carousel.querySelector(".forward")
        );
    }
  });
}

function bindEsc() {
  document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
      router.navigate("home", false);
    }
  });
}
