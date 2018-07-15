/*
 * Create a list that holds all of your cards
 */


const initialCards = [
    "fa-diamond", 
    "fa-anchor",
    "fa-bomb", "fa-leaf",
    "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"];

class Card {
    constructor(cardName){
        this.cardName = cardName;
        this.element = this.createElement(cardName);
        this.isOpen = false;
    }

    createElement(cardName){
        let card = document.createElement("li");
        let icon = document.createElement("i");
        card.classList.add("card");
        icon.classList.add("fa");
        icon.classList.add(cardName);
        card.appendChild(icon);
        return card;
    }
    
    open(){
        this.isOpen = true;
        this.element.classList.add("open");
        this.element.classList.add("show");
    }
    
    close(){
        this.isOpen = false;
        this.element.classList.remove("open");
        this.element.classList.remove("show");
    }

    onClick(cb){
        let card = this;
        this.element.addEventListener("click", function(){
            cb(card);
        });
    }

    /**
     * 
     * @param {Card} other 
     */
    pairWith(other){
        this.pairedCard = other;
    }
}

class Game {
    constructor(){
        /** @type Card[] */
        this.cards = this.createCards();

        this.deckElement = this.createDeckElement();
    }

    createCards() {
        let cards = [];
        for(let cardName of initialCards){
            let card1 = this.createCard(cardName);
            let card2 = this.createCard(cardName);
            card1.pairWith(card2);
            card2.pairWith(card1);
            cards.push(card1);
            cards.push(card2);
        }
        return shuffle(cards);
    }

    createCard(cardName) {
        let card = new Card(cardName);
        card.onClick(this.handleOnClick.bind(this));
        return card;
    }

    createDeckElement(){
        let deck = document.createElement("ul");
        deck.classList.add("deck");
    
        for(let card of this.cards){
            deck.appendChild(card.element);
        }
    
        return deck;
    }

    start(){
        var gameContainer = document.getElementById("gameContainer");
        gameContainer.appendChild(game.deckElement);
    }

    /**
     * 
     * @param {Card} card 
     */
    handleOnClick(card){
        card.open();
        setTimeout(function(){
            if(card.pairedCard.isOpen){

            } else {
                card.close();
            }
        }, 1000);
    }
}

var game = new Game();
game.start();


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
