var utils = require('./utils');

const gameTokenLength = 6;
const accessTokenLength = 12;

var Game = function(userName, size) {
    var username1 = userName,
        username2 = undefined,
        gameToken = utils.createToken(gameTokenLength),
        accessTokenUser1 = utils.createToken(accessTokenLength),
        accessTokenUser2 = utils.createToken(accessTokenLength),
        gameFieldSize = size,
        gameStartTime,
        lastMoveTime,
        gameField = [],
        currentMoveMark = "X",
        winner = "";

    if(typeof(username1) !== "string" || username1 === "" || username1 === undefined){
        throw new Error ("Invalid username1");
    }

    var initializeGameField = function(size){
        if (size < 3) {
            throw new Error("Uncorrect game board size: " + size.toString());
        } else {
            for (i = 0; i < size; i++) {
                gameField[i]= [];
                for (j = 0; j < size; j++) {
                    gameField[i][j] = "?";
                }
            }
        }
    };

    var isGameFieldHasNoEmptyCells = function(){
        for (i = 0; i < gameFieldSize; i++) {
            for (j = 0; j < gameFieldSize; j++) {
                if (gameField[i][j] === "?"){
                    return false;
                }
            }
        }
        return true;
    };
    // TODO: is player win the game check
    var isPlayerWinGame = function(markType){
        return false;
    };


    initializeGameField(gameFieldSize);

    return {
        setUserName1: function(newName) { username1 = newName; },

        getUserName1: function(){ return username1; },
        
        setUserName2: function(newName) { username2 = newName; },

        getUserName2: function(){ return username2; },        

        getGameToken: function(){ return gameToken; },

        getAccessTokenUser1: function() { return accessTokenUser1;},

        getAccessTokenUser2: function() { return accessTokenUser2;},

        getCurrentMoveMark: function(){ return currentMoveMark; },

        getGameDuration: function(){
            var duration = new Date();
            return (duration - gameStartTime);
        },

        getGameField: function() { return gameField; },

        getWinnerName: function() { return winner; },

        joinGame: function(name)
        {
            if (username2 !== undefined){
                console.log("Game has no empty player slots");
                throw new Error ("Game has no empty player slots")
            } else if (typeof(name) !== "string" || name === "" || name === undefined){
                console.log("Invalid player 2 name");
                throw new Error ("Invalid player 2 name");
            } else {
                username2 = name;
                gameStartTime = new Date();
            }
        },

        updateGameField: function(xcoord, ycoord, markType){
            if((xcoord || ycoord) >= gameFieldSize){
                throw new Error("Coordinates out of game field");
            } else if (winner !== ""){
                throw new Error("Game is over");
            } else if (markType.toUpperCase() !== "X" || markType.toUpperCase() !== "X") {
                throw new Error("Incorrect mark type");
            } else if (markType != currentMoveMark){
                throw new Error("Another player move");
            } else if (gameField[xcoord][ycoord] !== '?'){
                 throw new Error("Current cell are used");
            } else {
                gameField[xcoord][ycoord] = markType;
                lastMoveTime = new Date();
                if (isPlayerWinGame(markType)){
                    (markType === "X") ? winner = username1
                                        : winner = username2;
                }
                else {
                    currentMoveMark = (markType.toUpperCase() === "X") ? "O" : "X";
                }
            }
        },
        
        printGameField: function(){
            for (i = 0; i < gameFieldSize; i++) {
                console.log(gameField[i]);
            }
        }
    }
};

exports.Game = Game;
