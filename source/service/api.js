var key = "c0444bbab49f48e1a3b5afa0054f3f67";
export async function fetchById (id) {
  return new Proimise((resolve, reject) => {
    fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key}`)
    .then(function(response) {
      resolve(true);
      return response.json();
    })
    .catch(reason => reject(reason));
  })
}
export async function fetchParams (parameters) {
  return new Promise((resolve, reject) => {
  fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&${parameters}`)
    .then(function(res) {
      resolve(res.json());
    })
    .catch((reason) => console.error(reason));
  })
}