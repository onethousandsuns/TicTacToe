var express = require("express");
var http = require('http');
var bodyParser = require('body-parser');

var config = require('./config');
var utils = require('./utils');
var gameHandler = require('./gameHandler').gameHandler;

var app = express();

http.createServer(app).listen(config.port, function(){
    console.log('Server listening on port ' + config.port);
});

//=============================================================================

app.use(bodyParser.json());

app.use(function (req, res, next) {
    /*if(!req.is('application/json'))
    {
        return res.json({
            "status" : "error",
            "message" : "API takes only  JSON params"});
    }*/
    next();
}, function (req, res, next) {
    console.log('Requested URL:', req.originalUrl, ', Request Type:', req.method, ' ,Request body:', req.body);
    next();
});

app.post('/new_game', function(req, res, next) {
    if ((req.body.user_name == undefined) || (req.body.size == undefined)){
        return res.json({
            "status" : "error",
            "message" : "new_game takes 2 parametres: user_name, size"});
    } else {
        var result = gameHandler.addGame(req.body.user_name, req.body.size);
        return res.json(result);
    }
});

app.post('/join_game', function(req, res, next) {
    if ((req.body.game_token === undefined) || (req.body.user_name === undefined)){
        return res.json({
            "status" : "error",
            "message" : "join_game takes 2 parametres: game_token, user_name"});
    } else {
        var result = gameHandler.joinGame(req.body.game_token, req.body.user_name);
        return res.json(result);
    }

});

app.post('/make_a_move', function (req, res, next) {
    if(req.get('access_token') === undefined)
    {
        return res.json({ "status" : "error",  "message" : "No access token"});
    } else if (req.get('game_token') === undefined) {
        return res.json({ "status" : "error",  "message" : "No game token"});
    }
    else if((req.body.row === undefined) || (req.body.col === undefined)){
        return res.json({
            "status" : "error",
            "message" : "make_a_move takes 2 parametres: row, col"});
    } else {
        var result = gameHandler.makeMove(req.get('game_token'), req.get('access_token'), req.body.row, req.body.col);
        return res.json(result);
    }
});

app.get('/state', function (req, res, next) {
    if(req.get('access_token') === undefined)
    {
        return res.json({ "status" : "error",  "message" : "No access token"});
    } else if (req.get('game_token') === undefined) {
        return res.json({ "status" : "error",  "message" : "No game token"});
    } else {
        var result = gameHandler.getState(req.get('game_token'), req.get('access_token'));
        return res.json(result);
    }
});

app.get('/view_game_list', function(req, res, next){
   gameHandler.printGameList();
    res.json({});
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});
