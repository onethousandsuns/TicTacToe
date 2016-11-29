
var game = require('./game').Game;

var GameHandler = (function () {

    var games = {};
    const inactiveGameTimeout = 300000;
    const inactiveGameCheckInterval = 10000;

    setInterval(function() {
        for (var token in games){
            if(games[token].getGameDuration() >= inactiveGameTimeout) {
                console.log("Game " + games[token].getGameToken() + " was terminated for inactivity");
                delete games[token];
            }
        }
    }, inactiveGameCheckInterval);

    var isGameTokenUsed = function (token) {
        if (token in games) { 
            return true;
        }
        return false;
    };

    var isCurrentMoveYours = function (gameToken, accessToken) {
        if(((games[gameToken].getAccessTokenUser1() === accessToken) && (games[gameToken].getCurrentMoveMark() === "X")) ||
            ((games[gameToken].getAccessTokenUser2() === accessToken) && (games[gameToken].getCurrentMoveMark() === "O"))){
            return true;
        }
        else {
            return false;
        }
    };

    return {

        getState: function(gameToken, accessToken) {
            if (!isGameTokenUsed(gameToken)){
                return {"status" : "error", "message" : "There is no game with current game token"};
            } else if ((games[gameToken].getAccessTokenUser1() !== accessToken) &&
                (games[gameToken].getAccessTokenUser2() !== accessToken)){
                return {"status" : "error", "message" : "There is no user with current access token"};
            }
            // TODO: fix getGameField
            return {
                "status": "ok",
                "you_turn": isCurrentMoveYours(gameToken, accessToken),
                "game_duration": games[gameToken].getGameDuration(),
                "field": games[gameToken].getGameField().toString(),
                "winner": games[gameToken].getWinnerName()
            };
        },

        addGame: function (userName, gameSize) {
            try {
                var gameInstance = game(userName, gameSize);
            }
            catch (err){
                console.log('При создании игры возникла ошибка: ', err.message);
                return {"status" : "error", "message" : err.message};
            }
        },

        joinGame: function (gameToken, userName) {
            if (!isGameTokenUsed(gameToken)){
                return {"status" : "error", "message" : "There is no game with this game token"};
            }
            try {
                games[gameToken].joinGame(userName);
                return {"status" : "ok", "access_token" : games[gameToken].getAccessTokenUser2().toString()};
                
            } catch (err) {
                console.log('При присоединении к игре ', gameToken, ' возникла ошибка: ', err.message);
                return {"status" : "error", "message" : err.message};
            }
            
        },

        makeMove: function(gameToken, accessToken, row, col) {
            if (!isGameTokenUsed(gameToken)){
                return {"status" : "error", "message" : "There is no game with current game token"};
            } else if ((games[gameToken].getAccessTokenUser1() !== accessToken) &&
                (games[gameToken].getAccessTokenUser2() !== accessToken)){
                return {"status" : "error", "message" : "There is no user with current access token"};
            }

            var markType = "";
            try {
                (accessToken === games[gameToken].getAccessTokenUser1()) ? markType = "X" : markType = "O";
                games[gameToken].updateGameField(row, col, markType);
                console.log('Game: ' + gameToken + '- player ' + markType + " -> {" + row + ", " + col + "}");
                return {"status" : "ok"};
            } catch (err){
                console.log('При осуществлении хода в игре ', gameToken, ' возникла ошибка: ', err.message);
                return {"status" : "error", "message" : err.message};
            }
        }
    };

})();

exports.gameHandler = GameHandler;