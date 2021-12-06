var key = '199c50e0bf5a46d0b9b937e10db957c5';
const apiKeys = ['69b4ef30e7ce4e04ab91a0610e9d634e','7ce41be0baa945d4a0b061b2c42b904f',"4d388ae5990f41f195ca41c0f0a1a5bb","c629e61a6c09414ab5939fbb80bf2b07", 'd7aec32067624518bb01b5120764b622', "199c50e0bf5a46d0b9b937e10db957c5", "c0444bbab49f48e1a3b5afa0054f3f67"];
export async function fetchById (id) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key}&includeNutrition=true`)
    .then(function(res) {
      resolve(res.json());
    })
    .catch((reason) => reject(reason));
  })
}
export async function fetchParams (parameters) {
  return new Promise((resolve, reject) => {
  fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&${parameters}`)
    .then(function(res) {
      resolve(res.json());
    })
    .catch((reason) => reject(reason));
  })
}