var util = require('util'),
    puzzle = require('./puzzle');


exports.Parser = function(text) {
  this.text = text;
  this.command = undefined;
  this.option = undefined;
  this.errormsg = undefined;
}

exports.Parser.prototype = {
  parse: function() {
    var t = this.text.replace(/^\s+|\s+$/g, "").split(' ');
    if (t.length === 0) {
      this.errormsg = 'You sent an empty text!';
    } else if (t.length === 1) {
      this.command = t[0].toUpperCase();
      util.puts('> command: ' + this.command);
    } else {
      this.command = t[0].toUpperCase();
      this.option = t[1].toUpperCase();
      util.puts('> command: ' + this.command + ' option: ' + this.option);
    }
  },
  isNotSolution: function() {
    var puzzleNumber = '';
    for (var i = 0; i < this.command.length; i++) {
      if (!isNaN(parseFloat(this.command.substr(i, i+1))) && isFinite(this.command.substr(i, i+1))) {
        puzzleNumber += this.command.substr(i, i+1);
      } else {
        break;
      }
    }
    if (puzzleNumber.length > 0) {
      this.option = this.command.substr(puzzleNumber.length);
      this.command = puzzleNumber;
    }
    if (this.option == undefined || this.errormsg != undefined) {
      return true;
    }
  },
  parseSingleCommand: function() {
    if (this.errormsg != undefined) {
      return this.errormsg
    } else if (this.command === 'HELP') {
      return "Text [PUZZLE NUMBER] [SOLUTION] and we'll let you know if you are correct";
    } else {
      return "I'm sorry, I cannot parse your text. Text 'help' for help."
    }
  },
  parseSolution: function(puzzleObject) {
    // Messages can be modified to your liking
    if (!puzzleObject.problemExists(this.command)) {
      return "I'm sorry, that is not a problem in this mystery hunt";
    }
    if (puzzleObject.isCorrect(this.command, this.option)) {
      return "Congratulations, your answer is correct!";
    } else {
      return "I'm sorry, your answer, '" + this.option + "', is incorrect.";
    }
  }
};