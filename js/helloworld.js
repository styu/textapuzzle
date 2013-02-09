/**
 * A very simple node web server that will respond to requests
 * with the Tropo WebAPI JSON version of "Hello, World!" 
 */

var http = require('http');
var tropowebapi = require('tropo-webapi');
var Parse = require('node-parse-api').Parse;

var APP_ID = "mGegciv4qbSnqZdBjrLqzSSx7VD004ZUSqsbfIfJ";
var MASTER_KEY = "N9pAh8YJkXz1FpEsBDUwGjEnqURMtx32qyueKP5Q";

var app = new Parse(APP_ID, MASTER_KEY);

var server = http.createServer(function (request, response) {

    // Create a new instance of the TropoWebAPI object.
    var tropo = new tropowebapi.TropoWebAPI(); 
    // tropo.say("Hello, World!");
    request.addListener('data', function(data){
        json = data.toString();
    });
     
    request.addListener('end', function() {
     
        var session = JSON.parse(json);
        var tropo = new TropoWebAPI();
     
        var from = session.session.from.id;
        var text = session.session.initialText;
        var n = session.session.from.network;
         
        tropo.say("Hello " + from + ", on the " + n + " network. You said: " + text);
     
        // Render out the JSON for Tropo to consume.
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(tropowebapi.TropoJSON(tropo));
    });

}).listen(8000); // Listen on port 8000 for requests.