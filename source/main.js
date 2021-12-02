import { fetchParams, fetchById } from "./service/api.js";
import { Router } from "./Router.js";

//We're using the free Spoonacular api plan; each key in this array can do 150 requests per day. 
//Pls make a free Spoonacular api account and add your key to this array!
const apiKeys = ["4d388ae5990f41f195ca41c0f0a1a5bb", "199c50e0bf5a46d0b9b937e10db957c5", "c0444bbab49f48e1a3b5afa0054f3f67"];

//router
//used to store recipe's id for specific search. recipeData[recipeName] = recipeId
const recipeData = [];


//carousel buttons
//var buttons = [document.querySelector('.forward'), document.querySelector('.back')];

window.addEventListener('DOMContentLoaded', init);

const router = new Router();
async function init() {
  document.querySelector('.section-recipes-expand').classList.remove('shown');
  document.querySelector('.section-recipes-display').classList.add('shown');
  
  const breakfast = createCarousel('breakfast');
  const lunch = createCarousel('lunch');
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
      bindRecipeExpand(recipeCard, function() {
        fetchById(recipeCard.data.id).then(function(res) {
            document.querySelector('.carousel').classList.remove('shown');
            document.querySelector('.recipe-expand').classList.add('shown');
            document.querySelector('.recipe-expand').data = res.json();
          }
        )
        .catch(console.log(error))
      });
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
    for (let i = 0; i < 3; i++) {
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
    for (let i = 0; i < 3; i++) {
      const recipe = document.createElement('recipe-card');
      recipe.data = localRecipe[i + curPtr];
      carousel.insertBefore(recipe, carousel.querySelector('.showMore'));
    }
  })
}

function bindRecipeExpand(recipeCard, recipeExpand) {
  router.setExpand(recipeCard.data.id, recipeExpand)
  recipeCard.addEventListener('click', (e) => {
    router.navigate(recipeCard.data.id);
  })
}
