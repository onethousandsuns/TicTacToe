var express = require("express");
var http = require('http');
var bodyParser = require('body-parser');
var utils = require('./utils');

var app = express();
var portNumber = 3000;

http.createServer(app).listen(portNumber, function(){
    console.log('Server listening on port ' + portNumber);
});

//=============================================================================

app.use(bodyParser.json());

app.use(function (req, res, next) {
    if(!req.is('application/json'))
    {
        return res.json({
            "status" : "error",
            "message" : "API takes only  JSON params"});
    }
    next();
}, function (req, res, next) {
    console.log('Request URL:', req.originalUrl, '\nRequest Type:', req.method, '\nRequest body: ', req.body);
    next();
});

app.get('/state', function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    res.sendStatus(501);
});

app.post('/new_game', function(req, res, next) {
    if (req.bodylen == 2){
        //console.log(req.body);
        return res.json({
            "status" : "error",
            "message" : "new_game takes 2 parametres"});
    } else {
        return res.json({
            "status" : "ok",
            "access_token" : "accessToken",
            "game_token" : "gameToken"
        });
    }
});

app.post('/make_a_move', function (req, res, next) {
    if(req.get('access_token') === undefined)
    {
        return res.json({
            "status" : "error",
            "message" : "No access token"
        });
    } else {
        return res.json({
            "status" : "ok"
        });
    }
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broken');
});
