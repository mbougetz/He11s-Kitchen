import { fetchParams, fetchById } from "./service/api.js";

//We're using the free Spoonacular api plan; each key in this array can do 150 requests per day. 
//Pls make a free Spoonacular api account and add your key to this array!
const apiKeys = ["4d388ae5990f41f195ca41c0f0a1a5bb", "199c50e0bf5a46d0b9b937e10db957c5", "c0444bbab49f48e1a3b5afa0054f3f67"];

//router
//used to store recipe's id for specific search. recipeData[recipeName] = recipeId
const recipeData = [];

window.addEventListener('DOMContentLoaded', init);

async function init() {
  const breakfast = createCarousel('breakfast');
  const lunch = createCarousel('lunch');
  let searchInput = '';
  //record the search input
  document.querySelector('input').addEventListener('input', (e) => { searchInput += e.data });
  document.getElementById('search-btn').addEventListener('click', () => {
    addCarouselsToPage(searchInput, 10);
  })

}
/* @function the function creates a carousel and attach the carousel to the main page
   @param input a filter word to select recipes for the carousel
   @return return an array of recipes that contained in the carousel*/
async function createCarousel(selector) {
  //used to store fetched recipe that stored in local base
  const localRecipe = [];
  await fetchParams(`query=${selector}`).then(function(res) {
    const carousel = document.createElement('div');
    // set the div's carousel
    carousel.setAttribute('class', 'carousel');
    for (let i = 0; i < res.results.length; i++) {
      localRecipe[i] = res.results[i];
      recipeData[res.results[i].title] = res.results[i].id
      // create recipe card
      const recipeCard = document.createElement('recipe-card');
      recipeCard.data = res.results[i];
      if (i < 3) {
        // show only three recipe in each carousel
        carousel.appendChild(recipeCard);
      }
    }
    // append showMore button to the carousel.
    const showMore = document.createElement('button');
    showMore.setAttribute('class', 'showMore');
    carousel.appendChild(showMore);
    const showLess = document.createElement('button');
    bindShowMore(showMore, carousel, localRecipe);
    showLess.setAttribute('class', 'showLess');
    carousel.prepend(showLess);
    bindShowLess(showLess, carousel, localRecipe);
    document.querySelector('.recipes-wrapper').appendChild(carousel);
  })
  return localRecipe;
}
/* the function add an eventlistener to the showMore button in the carousel. By clicking the button, 3 more recipe will be shown. */
function bindShowMore(btn, carousel, localRecipe) {
  let curPtr = 0;
  btn.addEventListener('click', () => {
    //check the index of current recipes 
    for (let i = 0; i < localRecipe.length/3; i++) {
      if (carousel.querySelector('recipe-card').data.title == localRecipe[i*3].title) {
        curPtr = (i+1)*3;
        break;
      }
    }
    // if current pointer is at the end of the array, there is no more recipe to be shown
    if (curPtr >= localRecipe.length) {
      window.alert('no more recipe to show');
      return;
    }
    for (let i = 0; i < 3; i++) {
      carousel.removeChild(carousel.querySelector('recipe-card'));
    }
    for (let i = curPtr; i < curPtr + 3; i++) {
      const recipe = document.createElement('recipe-card');
      recipe.data = localRecipe[i];
      carousel.insertBefore(recipe, btn);
    }
  })
}
/* the function bind an eventlistener to the prev button in the carousel. By clicking the button, previous 3 recipes will be shown */
function bindShowLess(btn, carousel, localRecipe) {
  let curPtr = 0;
  btn.addEventListener('click', () => {
    //check the index of current recipes 
    for (let i = 0; i < localRecipe.length/3; i++) {
      if (carousel.querySelector('recipe-card').data.title == localRecipe[i*3].title) {
        curPtr = (i-1)*3;
        break;
      }
    }
    // if current pointer is at the end of the array, there is no more recipe to be shown
    if (curPtr < 0) {
      window.alert('no more recipe to show');
      return;
    }
    for (let i = 0; i < 3; i++) {
      carousel.removeChild(carousel.querySelector('recipe-card'));
    }
    for (let i = curPtr; i < curPtr + 3; i++) {
      const recipe = document.createElement('recipe-card');
      recipe.data = localRecipe[i];
      carousel.insertBefore(recipe, carousel.querySelector('.showMore'));
    }
  })
}

// /*NOTE: if you're getting a 402 error in the console because the number of queries for the day have been used up, change the number x in 'apiKeys[x]'
// in the following two functions to a different value*/


// //Returns json data of resultant API search
// //query = search term i.e. "pasta", numResults = number of recipes to return from search results
// async function queryApi(query, numResults){

//   const response = await fetch('https://api.spoonacular.com/recipes/complexSearch?apiKey=' + apiKeys[1] + '&query=' + query + '&number=' + numResults);

//   return response.json();

// }


// //Returns json data of recipe with id specified in parameter 'id'
// async function getRecipe(id){
//   //Query API by specific recipe id
//   const response = await fetch('https://api.spoonacular.com/recipes/'+ id +'/information?apiKey=' + apiKeys[1]);

//   //Return data in json format
//   return response.json();

// }

// //Search API for numResults number of recipes matching the query parameter;
// //Returns an array of recipe ids matching the search parameters
// async function getRecipeList(query, numResults){
//   var recipeResults = [];

//   //Query api
//   await queryApi(query, numResults).then((value) => {

//     //Parse json, put ids of returned recipes into recipeResults
//     for(let i = 0; i < numResults; i++){ //TODO: error checking in case less than numResults results are actually returned
//       recipeResults[i] = value.results[i].id;
//     }

//     //console.log(recipeResults)

//   });

//   return recipeResults;

// }




// //load all recipes
// async function fetchRecipes() {
//     return new Promise((resolve, reject) => {
//       recipes.forEach(recipe => {
//         fetch(recipe)
//           // CHANGE: implement with API
//           .then(response => response.json())
//           .then(data => {
//             // This grabs the page name from the URL in the array above
//             data['page-name'] = recipe.split('/').pop().split('.')[0];
//             recipeData[recipe] = data;
//             if (Object.keys(recipeData).length == recipes.length) {
//               resolve();
//             }
//           })
//           .catch(err => {
//             console.log(`Error loading the ${recipe} recipe`);
//             reject(err);
//           });
//       });
//     });
// }


// //Create carousel, add to page
// async function addCarouselsToPage(searchQuery, numRecipes){

//   // Makes a new empty carousel
//   const newCarousel = document.createElement('card-carousel');

//   //To be filled with all relevant recipe cards
//   var carouselCards = [];

//   //Queries api, stores all recipe ids matching search parameters in recipeList, an array of ids
//   var recipeList; 
//   await getRecipeList(searchQuery, numRecipes).then((value) => {

//     recipeList = value;


//   });

//   //Caps maximum number of recipes in a carousel to prevent accidental excessive queries
//   const MAX_RECIPES_IN_CAROUSEL = 12;
//   for (let i = 0; i < recipeList.length && i < MAX_RECIPES_IN_CAROUSEL; i++){ 

//     // Makes a new recipe card
//     const recipeCard = document.createElement('recipe-card');

//     //Gets a recipe id from recipeList, queries the api for the recipe's data, stores the data in the card
//     await getRecipe(recipeList[i]).then((value) => {
//       // console.log(value);
//       recipeCard.data = value;

//     });


//     //Stores the card into the array carouselCards
//     carouselCards[i] = recipeCard;

//   }

//   //Inserts all the recipe cards in carouselCards into the carousel
//   newCarousel.createCardCarousel(carouselCards);

//   //Appends the newly created and populated carousel to the class recipes-wrapper in the document
//   document.querySelector('.recipes-wrapper').appendChild(newCarousel);

// }