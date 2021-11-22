// CardCarousel.js

class CardCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }


    // paramter is in an array of recipe cards
    createCardCarousel(recipeCards) {
        for (let i = 0; i < recipeCards.length; i++) {
            if (i > 2) {
                recipeCards[i].setAttribute('style', 'display: none');
            }
            this.shadowRoot.append(recipeCards[i]);
        }
    }

    /*
    * This function will be called in an event listener when the right button is clicked.
    * The next 3 recipe cards will be shown.
    */
    nextCards() {
        const cards = this.shadowRoot.querySelectorAll('recipe-card');
        for (let i = cards.length - 4; i >= 0; i--) {
            if (cards[i].getAttribute('style') != 'display: none') {
                cards[i].setAttribute('style', 'display: none');
                cards[i + 3].style.display = '';
            }
        }
    }

    /*
    * This function will be called in an event listener when the left button is clicked.
    * The previous 3 recipe cards will be shown.
    */
    prevCards() {
        const cards = this.shadowRoot.querySelectorAll('recipe-card');
        for (let i = 3; i < cards.length; i++) {
            if (cards[i].getAttribute('style') != 'display: none') {
                cards[i].setAttribute('style', 'display: none');
                cards[i - 3].style.display = '';
            }
        }
    }
}

// add prev and next buttons and their event listeners
const prevButton = document.querySelector('.back');
const nextButton = document.querySelector('.forward');

prevButton.addEventListener('click', CardCarousel().prevCards());
nextButton.addEventListener('click', CardCarousel().nextCards());

customElements.define('card-carousel', CardCarousel);