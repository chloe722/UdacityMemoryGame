"use strict";
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

    isMatched(){
        if(this.element.classList.contains("match")){
            return true;
        }
    }

    onClick(cb){ // pass callBack as parameter 
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
        this.congratsContainer = document.getElementById("congratsContainer");
        this.testingBtn = document.getElementById("testingbtn");
        this.playAgainBtn = document.getElementById("playAgainBtn");
        this.gameTitle = document.getElementById("title");        
        this.star1 = document.getElementById("star1");
        this.star2 = document.getElementById("star2");
        this.star3 = document.getElementById("star3");
        this.timer = document.getElementById("timer");
        this.timerResult = document.getElementById("timerResult");
        this.moveResult = document.getElementById("moveResult");
        this.ratingResult = document.getElementById("ratingResult");
        this.gameStartTime = Date.now();  // in millisecond
        this.timerStar();
    
        this.restartButton.addEventListener("click", this.restart.bind(this));
        this.playAgainBtn.addEventListener("click", this.playAgain.bind(this));
    
    }

    createCards() {  //create Cards function
        let cards = [];
        for(let cardName of initialCards){ // loop through the intialCards array
            let card1 = this.createCard(cardName); // create card1
            let card2 = this.createCard(cardName); // create card2 
            cards.push(card1);  //push created card1 into cards array
            cards.push(card2); //push created card2 into cards array
        }
        return shuffle(cards); // call shuffle function to shuffle the cards order
    }

    createCard(cardName) { 
        let card = new Card(cardName); 
        card.onClick(this.handleOnClick.bind(this)); //attach
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

    updateMove(){ //Update moves
        this.movesContainer.textContent = this.counter;
    }

    setRating(){ // create Rating system

        if(this.counter >= 5 && this.counter < 10){
            this.star3.classList.remove("fa-star");
            this.star3.classList.add("fa-star-o");
        }else if (this.counter >= 10){
            this.star2.classList.remove("fa-star");
            this.star2.classList.add("fa-star-o");
        }
        // else if (this.counter >= 15){
        //     this.star1.classList.remove("fa-star");    
        //     this.star1.classList.add("fa-star-o");           
        // }

    }

    getRating(){ // get the rating result 
        let ratingResult;

        if(this.counter < 5){
            ratingResult= 3;
        }else if(this.counter >= 5 && this.counter < 10){
            ratingResult= 2;        
        }else if (this.counter >= 10){
            ratingResult= 1;        
        }

        return ratingResult;
    }

    getTimePassed(){ // get the player total playing time
        let seconds = Math.floor((Date.now() - this.gameStartTime) / 1000.0);
        let min = Math.floor(seconds / 60 % 60);
        let hr = Math.floor(seconds / 60 / 60);
        seconds = seconds % 60;

        return (hr? (hr > 9 ? hr : "0" + hr) : "00") + ":" + (min ? (min > 9 ? min : "0" + min) : "00")+
         ":" + (seconds > 9 ? seconds : "0" + seconds);
    }

    setTimer(){

        this.timer.textContent = this.getTimePassed();
    }

    timerStar(){
        this.t = setInterval(this.setTimer.bind(this), 1000);
    }

    restartTime(){
        this.gameStartTime = Date.now();
    }


    checkIfEnd(){ //Check if the game end
        let matchedCards = this.cards.filter(function(card) {
            return card.isMatched();  
        });

        if(matchedCards.length == this.cards.length){ //check if all the matched cards found
            this.showCongrats(); 
        }
    }

    /**
     * 
     * @param {Card} card 
     */
    handleOnClick(card){
        if(card == this.previousCard && card.isOpen) { 
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

                this.checkIfEnd();
                
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

    showCongrats(){
        this.timerResult.textContent = this.getTimePassed();
        this.moveResult.textContent = this.counter;
        this.ratingResult.textContent = this.getRating();
        this.gameTitle.setAttribute("style", "display: none");        
        this.gameContainer.setAttribute("style", "display : none");
        this.scoreContainer.setAttribute("style", "display: none");
        this.congratsContainer.setAttribute("style", "display : block");
    }

    start(){
        this.counter = 0;
        this.cards = this.createCards();
        this.deckElement = this.createDeckElement();
        this.gameContainer.appendChild(this.deckElement);
        this.updateMove();
        this.setRating();
        
    }

    restart(){
        this.gameContainer.removeChild(this.deckElement);
        this.star1.classList.remove("fa-star-o");
        this.star1.classList.add("fa-star");
        this.star2.classList.remove("fa-star-o");
        this.star2.classList.add("fa-star");
        this.star3.classList.remove("fa-star-o");
        this.star3.classList.add("fa-star");
        this.restartTime();
        this.start();
        
    }

    playAgain(){
        this.gameTitle.setAttribute("style", "display: block");        
        this.scoreContainer.setAttribute("style", "display: block");
        this.gameContainer.setAttribute("style", "display : block");
        this.congratsContainer.setAttribute("style", "display: none");
        this.restart();
    }

}

var game = new Game();
game.start();

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
