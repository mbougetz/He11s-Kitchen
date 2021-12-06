import { fetchParams, fetchById } from "./service/api.js";
import { Router } from "./Router.js";
const recipes = []; // instead of using json files, we want recipes from the API
const recipeData = {}; // used to access the recipe data from Spoonacular

const router = new Router(
  function () {
    document.querySelector('.section-recipes-expand').classList.remove('seen');
    document.querySelector('.section-recipes-display').classList.add('seen');
    document.querySelector('.featured').classList.add('seen')
  }
);

window.addEventListener("DOMContentLoaded", init);

async function init() {
  document.querySelector('.section-recipes-expand').classList.add('hide');
  console.log("initiating");


 
  //Initialize localStorage for use
  initLocalStorage();

  //Bind search events to search bar
  bindSubPages();

  //Bind subpage functionality to dropdown menu
  bindSearchBars();

  //Display homepage by default
  homeCarousels(6);

  bindEsc();
  router.onPopstate();

}

//If no recipes have been stored, creates an array to store them in
function initLocalStorage() {
  if (!localStorage.getItem("localRecipes")) {
    let emptyArr = [];
    localStorage.setItem("localRecipes", JSON.stringify(emptyArr));
  }
}

function bindSubPages() {
  document.getElementById("homePage").addEventListener("click", function () {
    homeCarousels(6);

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
      breakfastCarousels(6);
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
    lunchCarousels(6);
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
    dinnerCarousels(6);
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
    dessertCarousels(6);
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

//Enable search functionality
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

  document
    .getElementById("heroSearchButton")
    .addEventListener("click", function () {
      searchCarousels(true);
    });

  document
    .getElementById("heroSearch")
    .addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.key === "Enter") {
        document.getElementById("heroSearchButton").click();
      }
    });
}

//Deletes all currently displayed carousels from the page
function clearCarousels() {
  //First clear recipe-wrapper
  var currCarousels = document.querySelectorAll("card-carousel");

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

  //Resets carouselNum
  carouselNum = 0;
}

//The specific carousels to load on the home page
async function homeCarousels(numResults) {
  clearCarousels();

  //Load local recipe carousel if any local recipes are stored; else load a pasta carousel
  let localRecipes = JSON.parse(localStorage.getItem("localRecipes"));
  //if (localRecipes && localRecipes.length != 0) newLoadLocalRecipes();
  //else await createCarousel("sandwich", numResults);


  //else await addCarouselsToPage("pasta", numResults, "Top Results for Pasta");

  await createCarousel("burger", numResults);
  await createCarousel("pasta", numResults);

  /*await addCarouselsToPage("burger", numResults, "Top Burger Recipes");
  await addCarouselsToPage(
    "thanksgiving",
    numResults,
    "Top Thanksgiving Recipes"
  );*/


}

//Loads the locally stored recipes and adds to carousel and then appends carousel to page
function loadLocalRecipes() {
  //Retrieve the array of local recipes from localstorage
  let localRecipes = JSON.parse(localStorage.getItem("localRecipes"));

  let stringifiedRecipies = [];

  //Parse each stored recipe from json format back into js-useable data
  //(localStorage only takes strings so anything stored locally has to be stored in json and then parsed back upon retrieval)
  for (let i = 0; i < localRecipes.length; i++) {
    //stringifiedRecipies[i] = JSON.parse(localRecipes[i]).json;
    stringifiedRecipies[i] = JSON.parse(localRecipes[i]);
  }

  //Create an empty carousel
  let newCarousel = document.createElement("card-carousel");

  //Create an array of all recipe data
  let newCardsArray = [];
  for (let i = 0; i < stringifiedRecipies.length; i++) {
    let newCard = document.createElement("recipe-card");
    newCard.data = stringifiedRecipies[i].data;
    newCardsArray[i] = newCard;
  }

  //Add all recipe cards to the carousel
  newCarousel.createCardCarousel(newCardsArray);

  //Create banner message for new carousel
  let cardTitle = document.createElement("h2");
  cardTitle.innerText = "Locally Created Recipes";
  cardTitle.setAttribute("id", "carousel-title");
  cardTitle.innerHTML =
    cardTitle.innerText + '<i class="fa fa-long-arrow-right"></i>';
  document
    .querySelectorAll(".recipes-wrapper")
    [carouselNum].appendChild(cardTitle);

  //Appends the newly created and populated carousel to the class recipes-wrapper in the document
  document
    .querySelectorAll(".recipes-wrapper")
    [carouselNum].appendChild(newCarousel);

  //Bind the back and forwards buttons to the carousel
  document
    .querySelectorAll(".back")
    [carouselNum].addEventListener("click", () => {
      newCarousel.prevCards();
    });

  document
    .querySelectorAll(".forward")
    [carouselNum].addEventListener("click", () => {
      newCarousel.nextCards();
    });

  carouselNum++;
}

//The specific carousels to load on the breakfast page
async function breakfastCarousels(numResults) {
  clearCarousels();

  //load carousel of local recipes

  await addCarouselsToPage("breakfast", numResults, "Top Breakfast Recipes");
  await addCarouselsToPage("pancake", numResults, "Best Pancakes Around");
  await addCarouselsToPage(
    "breakfast",
    numResults,
    "Vegan Breakfast Options",
    "vegan"
  );
}

//The specific carousels to load on the lunch page
async function lunchCarousels(numResults) {
  clearCarousels();

  //load carousel of local recipes

  await addCarouselsToPage("lunch", numResults, "Top Lunch Recipes");
  await addCarouselsToPage("sandwich", numResults, "Our Best Sandwiches");
  await addCarouselsToPage("lunch", numResults, "A Vegan Lunch", "vegan");
}

//The specific carousels to load on the dinner page
async function dinnerCarousels(numResults) {
  clearCarousels();

  //load carousel of local recipes

  await addCarouselsToPage("dinner", numResults, "Top Dinner Recipes");
  await addCarouselsToPage("pasta", numResults, "Top Pasta Recipes");
  await addCarouselsToPage(
    "dinner",
    numResults,
    "Vegan Dinner Options",
    "vegan"
  );
}

//The specific carousels to load on the dessert page
async function dessertCarousels(numResults) {
  clearCarousels();

  //load carousel of local recipes

  await addCarouselsToPage("dessert", numResults, "Top Dessert Recipes");
  await addCarouselsToPage("ice cream", numResults, "The Best of Ice Cream");
  await addCarouselsToPage(
    "dessert",
    numResults,
    "Vegan Dessert Options",
    "vegan"
  );
}

//Search spoonacular for the value currently in the search bar
//Param: searchingFromHero is true if search is clicked from the hero search bar, false if from the top search bar
async function searchCarousels(searchingFromHero) {
  clearCarousels();

  let query = "";

  if (!searchingFromHero) query = document.getElementById("topSearch").value;
  else query = document.getElementById("heroSearch").value;

  await addCarouselsToPage(query, 6, "Top Results");
  await addCarouselsToPage(query, 6, "Vegetarian Options", "vegetarian");
  await addCarouselsToPage(query, 6, "Vegan Options", "vegan");
}

//Returns json data of resultant API search
//query = search term i.e. "pasta", numResults = number of recipes to return from search results
async function queryApi(query, numResults, diet) {
  let response = "";

  if (!diet) {
    response = await fetch(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?query=" +
        query +
        "&number=" +
        numResults,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key":
            "e26569aaabmsh3816991676f73b4p175a23jsn09f144d9bffb",
        },
      }
    );
  } else {
    //alert("max time: " + maxTime);
    response = await fetch(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?query=" +
        query +
        "&diet=" +
        diet +
        "&number=" +
        numResults,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key":
            "e26569aaabmsh3816991676f73b4p175a23jsn09f144d9bffb",
        },
      }
    );
  }

  return response.json();
}

//Returns json data of recipe with id specified in parameter 'id'

async function getRecipe(id) {
  //Query API by specific recipe id
  const response = await fetch(
    "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" +
      id +
      "/information",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "x-rapidapi-key": "e26569aaabmsh3816991676f73b4p175a23jsn09f144d9bffb",
      },
    }
  );

  //Return data in json format
  return response.json();
}

//Search API for numResults number of recipes matching the query parameter;
//Returns an array of recipe ids matching the search parameters
async function getRecipeList(query, numResults, maxTime) {
  var recipeResults = [];

  //Query api
  await queryApi(query, numResults, maxTime).then((value) => {
    //console.log(value.results);

    //Parse json, put ids of returned recipes into recipeResults
    for (let i = 0; i < numResults; i++) {
      //TODO: error checking in case less than numResults results are actually returned
      recipeResults[i] = value.results[i].id;
    }

    //console.log(recipeResults)
  });

  return recipeResults;
}

//Global variable keeping track of carousels
var carouselNum = 0;
//Create carousel, add to page
async function addCarouselsToPage(searchQuery, numRecipes, title, diet) {
  // Makes a new empty carousel
  let newCarousel = document.createElement("card-carousel");

  //To be filled with all relevant recipe cards
  var carouselCards = [];

  //Queries api, stores all recipe ids matching search parameters in recipeList, an array of ids
  var recipeList;
  await getRecipeList(searchQuery, numRecipes, diet).then((value) => {
    recipeList = value;
  });

  //Caps maximum number of recipes in a carousel to prevent accidental excessive queries
  const MAX_RECIPES_IN_CAROUSEL = 12;
  for (let i = 0; i < recipeList.length && i < MAX_RECIPES_IN_CAROUSEL; i++) {
    // Makes a new recipe card
    const recipeCard = document.createElement("recipe-card");

    //Gets a recipe id from recipeList, queries the api for the recipe's data, stores the data in the card
    await getRecipe(recipeList[i]).then((value) => {
      //console.log(value);
      recipeCard.data = value;
    });

    //Stores the card into the array carouselCards
    carouselCards[i] = recipeCard;
  }

  //Inserts all the recipe cards in carouselCards into the carousel
  newCarousel.createCardCarousel(carouselCards);
  //console.log(carouselCards.length);

  let cardTitle = document.createElement("h2");
  cardTitle.innerText = title;
  cardTitle.setAttribute("id", "carousel-title");
  //alert(cardTitle.innerText + " vs " + title);
  cardTitle.innerHTML = title + '<i class="fa fa-long-arrow-right"></i>';
  document
    .querySelectorAll(".recipes-wrapper")
    [carouselNum].appendChild(cardTitle);

  //Appends the newly created and populated carousel to the class recipes-wrapper in the document
  document
    .querySelectorAll(".recipes-wrapper")
    [carouselNum].appendChild(newCarousel);

  //Binds the back and forward buttons to their respective carousel's functions

  document
    .querySelectorAll(".back")
    [carouselNum].addEventListener("click", () => {
      newCarousel.prevCards();
    });

  document
    .querySelectorAll(".forward")
    [carouselNum].addEventListener("click", () => {
      newCarousel.nextCards();
    });

  carouselNum++;

  //Return a reference to the carousel
  return newCarousel;
}

/*load all recipes
async function fetchRecipes() {
  return new Promise((resolve, reject) => {
    recipes.forEach(recipe => {
      fetch(recipe)
        // CHANGE: implement with API
        .then(response => response.json())
        .then(data => {
          // This grabs the page name from the URL in the array above
          data['page-name'] = recipe.split('/').pop().split('.')[0];
          recipeData[recipe] = data;
          if (Object.keys(recipeData).length == recipes.length) {
            resolve();
          }
        })
        .catch(err => {
          console.log(`Error loading the ${recipe} recipe`);
          reject(err);
        });
    });
  });
}*/


const router = new Router(
  function () {
    document.querySelector('.section-recipes-expand').classList.add('hide');
    document.querySelector('.section-recipes-display').classList.remove('hide');
  }
);

/* @function the function creates a carousel and attach the carousel to the main page
   @param input a filter word to select recipes for the carousel
   @return return an array of recipes that contained in the carousel*/
async function createCarousel(selector, numRecipes) {
  if(!numRecipes) numRecipes = 12;

  //used to store fetched recipe that stored in local base
  const localRecipe = [];
  await fetchParams(`query=${selector}&addRecipeNutrition=true&number=${numRecipes}`).then(function (res) {
    const carousel = document.createElement('div');
    // set the div's carousel
    carousel.setAttribute('class', 'carousel');
    for (let i = 0; i < res.results.length; i++) {
      localRecipe[i] = res.results[i];
      recipeData[res.results[i].title] = res.results[i].id;
      // create recipe card
      const recipeCard = document.createElement('recipe-card');
      recipeCard.data = res.results[i];
      bindRecipeExpand(recipeCard, function () {
        fetchById(recipeCard.data.id).then(function (res) {
          document.querySelector('.section-recipes-expand').classList.remove('hide');
          document.querySelector('.section-recipes-display').classList.add('hide');
          document.querySelector('recipe-expand').data = res;
        }
        )
      });
      //Test
      if (i < 3) {
        // show only three recipe in each carousel
        carousel.appendChild(recipeCard);
      }
    }

    /*<a class="back">&#10094</a>
                <a class="forward">&#10095</a>*/
                

    let backButton = document.createElement('a');
    backButton.setAttribute('class', "back");
    backButton.innerHTML="&#10094";
    bindShowLess(backButton, carousel, localRecipe);
    carousel.prepend(backButton);

    let forwardButton = document.createElement('a');
    forwardButton.setAttribute('class', "forward");
    forwardButton.innerHTML="&#10095";
    bindShowMore(forwardButton, carousel, localRecipe);
    carousel.appendChild(forwardButton);
                
    // append showMore button to the carousel.
    /*const showMore = document.createElement('button');
    showMore.setAttribute('class', 'showMore');
    carousel.appendChild(showMore);
    const showLess = document.createElement('button');
    bindShowMore(showMore, carousel, localRecipe);
    showLess.setAttribute('class', 'showLess');
    carousel.prepend(showLess);
    bindShowLess(showLess, carousel, localRecipe);*/
    document.querySelector('.recipes-wrapper').appendChild(carousel);
  })
  return localRecipe;
}



function newLoadLocalRecipes() {
  //Retrieve the array of local recipes from localstorage
  let localRecipes = JSON.parse(localStorage.getItem("localRecipes"));

  let stringifiedRecipies = [];

  //Parse each stored recipe from json format back into js-useable data
  //(localStorage only takes strings so anything stored locally has to be stored in json and then parsed back upon retrieval)
  for (let i = 0; i < localRecipes.length; i++) {
    //stringifiedRecipies[i] = JSON.parse(localRecipes[i]).json;
    stringifiedRecipies[i] = JSON.parse(localRecipes[i]);
  }

  //Create an empty carousel
  let newCarousel = document.createElement("card-carousel");

  const carousel = document.createElement('div');
    // set the div's carousel
  carousel.setAttribute('class', 'carousel');

  //Create an array of all recipe data
  let newCardsArray = [];
  for (let i = 0; i < stringifiedRecipies.length; i++) {
    let newCard = document.createElement("recipe-card");
    newCard.data = stringifiedRecipies[i].data;
    newCardsArray[i] = newCard;

    //newsection
    document.querySelector('.section-recipes-expand').classList.remove('hide');
    document.querySelector('.section-recipes-display').classList.add('hide');
    document.querySelector('recipe-expand').data = newCard.data; //probably gonna break

    carousel.appendChild(newCard);

    /*
    bindRecipeExpand(newCard, function () {
      fetchById(newCard.data.id).then(function (res) {
        document.querySelector('.section-recipes-expand').classList.remove('hide');
        document.querySelector('.section-recipes-display').classList.add('hide');
        document.querySelector('recipe-expand').data = res;
      }
      )
    });*/
    //end newsection

  }

  //Add all recipe cards to the carousel
  newCarousel.createCardCarousel(newCardsArray);

  //Create banner message for new carousel
  let cardTitle = document.createElement("h2");
  cardTitle.innerText = "Locally Created Recipes";
  cardTitle.setAttribute("id", "carousel-title");
  cardTitle.innerHTML =
    cardTitle.innerText + '<i class="fa fa-long-arrow-right"></i>';
  document
    .querySelectorAll(".recipes-wrapper")
    [carouselNum].appendChild(cardTitle);

  /*
  //Appends the newly created and populated carousel to the class recipes-wrapper in the document
  document
    .querySelectorAll(".recipes-wrapper")
    [carouselNum].appendChild(newCarousel);

  //Bind the back and forwards buttons to the carousel
  document
    .querySelectorAll(".back")
    [carouselNum].addEventListener("click", () => {
      newCarousel.prevCards();
    });

  document
    .querySelectorAll(".forward")
    [carouselNum].addEventListener("click", () => {
      newCarousel.nextCards();
    });

  carouselNum++;*/


  // append showMore button to the carousel.
  const showMore = document.createElement('button');
  showMore.setAttribute('class', 'showMore');
  carousel.appendChild(showMore);
  const showLess = document.createElement('button');
  bindShowMore(showMore, carousel, newCardsArray);
  showLess.setAttribute('class', 'showLess');
  carousel.prepend(showLess);
  bindShowLess(showLess, carousel, newCardsArray);
  document.querySelector('.recipes-wrapper').appendChild(carousel);
}






/* the function add an eventlistener to the showMore button in the carousel. By clicking the button, 3 more recipe will be shown. */
function bindShowMore(btn, carousel, localRecipe) {
  let curPtr = 0;
  btn.addEventListener('click', () => {
    //check the index of current recipes 
    for (let i = 0; i < localRecipe.length / 5; i++) {
      if (carousel.querySelector('recipe-card').data.title == localRecipe[i * 5].title) {
        curPtr = (i + 1) * 5;
        break;
      }
    }
    // if current pointer is at the end of the array, there is no more recipe to be shown
    if (curPtr >= localRecipe.length) {
      window.alert('no more recipe to show');
      return;
    }
    for (let i = 0; i < 5; i++) {
      carousel.removeChild(carousel.querySelector('recipe-card'));
    }
    for (let i = 0; i < 5; i++) {
      const recipe = document.createElement('recipe-card');
      recipe.data = localRecipe[i + curPtr];
      carousel.insertBefore(recipe, btn);
    }
  })
}

/* the function bind an eventlistener to the prev button in the carousel. By clicking the button, previous 3 recipes will be shown */
function bindShowLess(btn, carousel, localRecipe) {
  let curPtr = 0;
  btn.addEventListener('click', () => {
    //check the index of current recipes 
    for (let i = 0; i < localRecipe.length / 5; i++) {
      if (carousel.querySelector('recipe-card').data.title == localRecipe[i * 5].title) {
        curPtr = (i - 1) * 5;
        break;
      }
    }
    // if current pointer is at the end of the array, there is no more recipe to be shown
    if (curPtr < 0) {
      window.alert('no more recipe to show');
      return;
    }

    for (let i = 0; i < 5; i++) {
      carousel.removeChild(carousel.querySelector('recipe-card'));
    }
    for (let i = 0; i < 5; i++) {
      const recipe = document.createElement('recipe-card');
      recipe.data = localRecipe[i + curPtr];
      carousel.insertBefore(recipe, carousel.querySelector('.showMore'));
    }
  })
}

function bindRecipeExpand(recipeCard, recipeExpand) {
  router.setExpand(recipeCard.data.id, recipeExpand);
  recipeCard.addEventListener('click', (e) => {
    router.navigate(recipeCard.data.id, false);
  })
}

function bindEsc() {
  document.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {    
      router.navigate('home', false);
    }
  })
}