var key = "c629e61a6c09414ab5939fbb80bf2b07";
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