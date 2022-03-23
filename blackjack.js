//Aim for a playable game. The essence of blackjack requires:
//Two players - a player and a dealer (computer).
//A deck of cards.
//A starting hand of 2 cards for each player.
//Comparing both hands and determining a winner. The possible scenarios are:
//A tie. When both the player and dealer have the same total hand values - or if both draw Blackjack
//A Blackjack win. When either player or dealer draw Blackjack.
//A normal win. When neither draw Blackjack, the winner is decided by whomever has the higher hand total.

var GAME_START = "game start";
var GAME_CARDS_DRAWN = "cards drawn";
var GAME_RESULTS_SHOWN = "results shown"
var currentGameMode = GAME_START;

var playerHand = [];
var dealerHand = [];
var currentGameDeck = []

var gameDeck = "empty at the start";

var getRandomIndex = function(cardlength){
    return Math.floor(Math.random()*cardlength)
}

var createDeck = function () {
    var deck = [];
    var suits = ["diamond" , "hearts" , "clover" , "spades"];
    var cardNumbers = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < cardNumbers.length; j++) {
            let card = {
                name: cardNumbers[j],
                suit: suits[i],
                rank: cardNumbers[j] === 'Ace' ? 11 : j+1,
              };
            deck.push(card)
        }
    } 
    return deck;
}

//to shuffle deck, call shuffle deck and pass ordered current game deck
var shuffleDeck = function (cards)  {
    var index = 0;
    while (index < cards.length) {
        var randomIndex = getRandomIndex(cards.length);
        var currentItem = cards[index];
        var randomItem = cards [randomIndex];
        cards[index] = randomItem;
        cards [randomIndex] = currentItem;
        index = index +1;
    }
    return cards;
}

var dealCards = function(){
    document.querySelector("#reveal-button").disabled = true;   
    for (let index = 0; index < 2; index++) {
        playerHand.push(currentGameDeck.pop());
        dealerHand.push(currentGameDeck.pop());
    }

    checkForBlackJack()
}

var disableHitStand = function(disable){
    document.querySelector("#hit-button").disabled = disable;
    document.querySelector("#stand-button").disabled = disable;
}

var checkForBlackJack = function () {
    var playerPoints = getHandSum(playerHand)
    var dealerPoints = getHandSum(dealerHand)
    var instructionsOutput = document.querySelector("#instructions-div");

    if (playerPoints === 21 && dealerPoints === 21) {
        currentGameMode = GAME_RESULTS_SHOWN;
        instructionsOutput.innerHTML = "DEALER AND PLAYER HAS 21, DRAW ---- press reset to play again"
        disableHitStand(true)
    }
    else if (playerPoints === 21 && dealerPoints !== 21) {
        currentGameMode = GAME_RESULTS_SHOWN;
        instructionsOutput.innerHTML = "PLAYER WINS, press reset to play again"
        disableHitStand(true)
    }
    else if (dealerPoints === 21 && playerPoints !== 21) {
        currentGameMode = GAME_RESULTS_SHOWN;
        instructionsOutput.innerHTML = "DEALER WINS, press reset to play again"
        disableHitStand(true)
    }
    else {
        currentGameMode = GAME_CARDS_DRAWN;
        disableHitStand(false)
        instructionsOutput.innerHTML = `Click "hit" to deal another card or "stand" to pass.`
    }

    var outputMessage = playerOutputMsg()
    var output = document.querySelector("#player-hand");
    output.innerHTML = outputMessage

}

var getHandSum = function (hand) {
    let sum = 0;
    
    for (let index = 0; index < hand.length; index++) {
        var rank = 0
        if (hand[index].name === 'Jack' || hand[index].name === 'Queen' || hand[index].name === 'King') {
            rank = 10
        }
        else if(hand[index].name === 'Ace' && hand.length >=3 ){
            rank = 1
        }
        else {
            rank = hand[index].rank
        }
        sum = sum + rank;
    }

    return sum;
}

var playerOutputMsg = function  () {
    var playerCardValue = getHandSum(playerHand)
    var outputMessage = "<u>YOUR HAND</u><br>";
    for (let index = 0; index < playerHand.length; index++) {
        outputMessage += playerHand[index].name + " " + playerHand[index].suit + "<br><br>"
    }
    
    outputMessage += "Your hand total is " + playerCardValue;
    return outputMessage;
}

var dealerOutputMsg = function  () {
    var playerCardValue = getHandSum(dealerHand)
    var outputMessage = "<u>DEALER HAND</u><br>";
    for (let index = 0; index < dealerHand.length; index++) {
        outputMessage += dealerHand[index].name + " " + dealerHand[index].suit + "<br><br>"
    }
    
    outputMessage += "Dealer hand total is " + playerCardValue;
    return outputMessage;
}

var checkPlayerScore = function () {
    var total = getHandSum(playerHand)
    var instructionsOutput = document.querySelector("#instructions-div");
    if (total === 21) {
        instructionsOutput.innerHTML = "YOU GOT 21 --- you win, press reset to play again"
        disableHitStand(true)
        document.querySelector("#reveal-button").disabled = false;   
        document.querySelector("#reset-button").disabled = false;
    }
    else if (total > 21) {
        instructionsOutput.innerHTML = "YOU BUST ---- DEALER WINS, press reset to play again"
        disableHitStand(true)
        document.querySelector("#reset-button").disabled = false;
    }
}

var playerHit = function(){
    playerHand.push(currentGameDeck.pop());
    var outputMessage = playerOutputMsg()
    var output = document.querySelector("#player-hand");
    output.innerHTML = outputMessage
    checkPlayerScore()

}

var playerStand = function(){
    var dealerSum = getHandSum(dealerHand)
    while (dealerSum < 17) {
        dealerHand.push(currentGameDeck.pop());
        dealerSum = getHandSum(dealerHand)
    }
    document.querySelector("#hit-button").disabled = true;
    document.querySelector("#stand-button").disabled = true;
    document.querySelector("#deal-button").disabled = true;
    document.querySelector("#reveal-button").disabled = false;    
}

var revealDealerHand = function(){
    var output = document.querySelector("#dealer-hand");
    output.innerHTML = dealerOutputMsg()
    checkWhoWins()
    document.querySelector("#reveal-button").disabled = true;
    document.querySelector("#reset-button").disabled = false;
}

var checkWhoWins = function (){
    var playerSum = getHandSum(playerHand)
    var dealerSum = getHandSum(dealerHand)
    var instructionsOutput = document.querySelector("#instructions-div");

    if (playerSum === dealerSum) {
        instructionsOutput.innerHTML = "DRAW, press reset to play again"
    }
    else if ((playerSum > dealerSum || dealerSum > 21) && playerSum <= 21) {
        instructionsOutput.innerHTML = "Player wins, press reset to play again"
    }
    else if ((dealerSum > playerSum || playerSum > 21) && dealerSum <= 21) {
        instructionsOutput.innerHTML = "Dealer wins, press reset to play again"
    }
}

var reset = function (){
    var instructionsOutput = document.querySelector("#instructions-div");
    var playerOutput = document.querySelector("#player-hand");
    var dealerOutput = document.querySelector("#dealer-hand");

    instructionsOutput.innerHTML = "Click deal to start game"
    playerOutput.innerHTML = ""
    dealerOutput.innerHTML = ""

    playerHand = []
    dealerHand = []
    currentGameDeck = []
    currentGameMode = GAME_START;
    document.querySelector("#deal-button").disabled = false;
    document.querySelector("#reset-button").disabled = true;
}

var main = function(){
    if (currentGameMode === GAME_START) {
        // set current game deck to ordered blackjack cards
        document.querySelector("#deal-button").disabled = true;
        currentGameDeck = createDeck()
        // set current game deck to shuffled deck, 
        currentGameDeck = shuffleDeck(currentGameDeck)

        dealCards()
    }
}

