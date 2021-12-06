var key = 'c0444bbab49f48e1a3b5afa0054f3f67';

export async function fetchById (id) {
  return new Promise((resolve, reject) => {
    /*
    fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key}&includeNutrition=true`)
    .then(function(res) {
      resolve(res.json());
    })
    .catch((reason) => reject(reason));*/


    fetch(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" +
        id +
        "/information?includeNutrition=true",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key": "e26569aaabmsh3816991676f73b4p175a23jsn09f144d9bffb",
        },
      }
    ).then(function(res) {
      resolve(res.json());
    })
    .catch((reason) => reject(reason));
  })
}
export async function fetchParams (parameters) {
  return new Promise((resolve, reject) => {
  /*fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&${parameters}`)
    .then(function(res) {
      resolve(res.json());
    })
    .catch((reason) => reject(reason));*/

    
    fetch(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?&${parameters}" + parameters,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key": "e26569aaabmsh3816991676f73b4p175a23jsn09f144d9bffb",
        },
      }
    ).then(function(res) {
      resolve(res.json());
    })
    .catch((reason) => reject(reason));

  })
}