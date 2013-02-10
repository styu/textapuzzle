/**
 * Required modules
 */
var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    puzzle = require('./puzzle'),
    parse = require('./parse'),
    tropowebapi = require('tropo-webapi');

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

var server = http.createServer(function (request, response) {
    // Create a new instance of the TropoWebAPI object.
    var tropo = new tropowebapi.TropoWebAPI();
    request.addListener('data', function(data){
        json = data.toString();
    });

    request.addListener('end', function() {
        var session = JSON.parse(json);
        var tropo = new TropoWebAPI();

        var text = session.session.initialText;  // Text message sent in
        var answer = new parse.Parser(text);     // Initialize new parser with text
        answer.parse();
        if (answer.isNotSolution()) {
          tropo.say(answer.parseSingleCommand());
        } else {
          tropo.say(answer.parseSolution(puzzleObject));
        }
     
        // Render out the JSON for Tropo to consume.
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(tropowebapi.TropoJSON(tropo));
    });

}).listen(80); // Listen on port 8000 for requests.

/* server started */  
util.puts('> textapuzzle running on port 8000');

