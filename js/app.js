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
    
    setClose(){
        this.isOpen = false;
        this.element.classList.remove("open");
        this.element.classList.remove("show");
    }

    setMatch(){
        this.setClose();
        this.element.classList.add("match");
    
    }


    onClick(cb){
        let card = this;
        this.element.addEventListener("click", function(){
            cb(card);
        });
    }
}

class Game {
    constructor(){
        this.gameContainer = document.getElementById("gameContainer");
        this.scoreContainer = document.getElementById("scoreContainer");
        this.restartButton = document.getElementById("restartButton");
        this.movesContainer = document.getElementById("movesContainer");
        this.star1 = document.getElementById("star1");
        this.star2 = document.getElementById("star2");
        this.star3 = document.getElementById("star3");
        this.timer = document.getElementById("timer");
        this.gameStartTime = Date.now();  // in millisecond
        this.timerStar();
    
        this.restartButton.addEventListener("click", this.restart.bind(this));
    }

    createCards() {
        let cards = [];
        for(let cardName of initialCards){
            let card1 = this.createCard(cardName);
            let card2 = this.createCard(cardName);
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

    updateMove(){
        this.movesContainer.textContent = this.counter;
    }

    setRating(){

        if(this.counter >= 5 && this.counter < 10){
            this.star3.classList.remove("fa-star");
            this.star3.classList.add("fa-star-o");
        }else if (this.counter >= 10 && this.counter < 15){
            this.star2.classList.remove("fa-star");
            this.star2.classList.add("fa-star-o");
            
        }else if (this.counter >= 15){
            this.star1.classList.remove("fa-star");    
            this.star1.classList.add("fa-star-o");           
        }

    }


    setTimer(){
        let seconds = Math.floor((Date.now() - this.gameStartTime) / 1000.0);
        let min = Math.floor(seconds / 60 % 60);
        let hr = Math.floor(seconds / 60 / 60);
        seconds = seconds % 60;

        this.timer.textContent = (hr? (hr > 9 ? hr : "0" + hr) : "00") + ":" + (min ? (min > 9 ? min : "0" + min) : "00")+
         ":" + (seconds > 9 ? seconds : "0" + seconds);

    }

    timerStar(){
        this.t = setInterval(this.setTimer.bind(this), 1000);
    }

    /**
     * 
     * @param {Card} card 
     */
    handleOnClick(card){
        if(card == this.previousCard) { 
            return; // double click same card
        }
        this.previousCard = card;

        let otherOpenCards = this.getOpenCards();


        card.open();

        if(otherOpenCards.length > 1) {
            for(let otherCard of otherOpenCards){
                otherCard.setClose();
            }
        } else if(otherOpenCards.length == 1){
            let otherCard = otherOpenCards[0];

            if(otherCard.cardName == card.cardName){
                otherCard.setMatch();
                card.setMatch();
                
                this.counter++;
                
                this.updateMove();

                this.setRating();
                
            } else {
                
                this.counter++;
                this.updateMove();
                this.setRating();

                setTimeout(function(){
                    otherCard.setClose();
                    card.setClose();
                  
                }, 1000);
            }
        }
    }

    getOpenCards(){
        return this.cards.filter(card => card.isOpen);
    }

    start(){
        this.counter = 0;
        this.cards = this.createCards();
        this.deckElement = this.createDeckElement();
        this.gameContainer.appendChild(this.deckElement);
        this.updateMove();
        this.setRating();
        // this.timerStar;
        
    }

    restart(){
        this.gameContainer.removeChild(this.deckElement);
        this.star1.classList.remove("fa-star-o");
        this.star1.classList.add("fa-star");
        this.star2.classList.remove("fa-star-o");
        this.star2.classList.add("fa-star");
        this.star3.classList.remove("fa-star-o");
        this.star3.classList.add("fa-star");
        this.start();
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
