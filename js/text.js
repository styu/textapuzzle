/**
 * Required modules
 */
var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    puzzle = require('./puzzle'),
    parse = require('./parse'),
    tropowebapi = require('tropo-webapi'),
    express = require("express");

var app = express();

/**
 * Name of the files the problems and solutions are in.
 * Both files are in the puzzle/ directory, and can be
 * named whatever, so long as these variables are 
 * updated accordingly
 */
var PROBLEM_FILE = 'problems',
    SOLUTION_FILE = 'solutions';

var puzzleObject = new puzzle.Puzzle(PROBLEM_FILE, SOLUTION_FILE);
puzzleObject.init();

app.configure(function(){
    app.use(express.bodyParser());
});

app.post('/', function(req, res){
    var tropo = new TropoWebAPI();
    var session = req.body['session'];

    if (session) {
        var text = session.initialText;  // Text message sent in
        var answer = new parse.Parser(text);     // Initialize new parser with text
        console.log(answer);
        answer.parse();
        if (answer.isNotSolution()) {
          tropo.say(answer.parseSingleCommand());
        } else {
          tropo.say(answer.parseSolution(puzzleObject));
        }
        res.send(tropowebapi.TropoJSON(tropo));
    }
});

/* server started */  
app.listen(80);
console.log('> textapuzzle running on port 8000');

