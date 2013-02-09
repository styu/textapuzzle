var util = require('util'),
    puzzle = require('./puzzle');

/**
 * Helper function that trims white space from text
 * @param text, string to be trimed
 */
function trim(text) {
  return text.replace(/^\s+|\s+$/g, "");
}

/**
 * Helper function that returns true if the string is a digit
 * @param str, a string of length 1
 * @return true if string is digit, false otherwise
 */
function isDigit(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

/**
 * Class for the answer that is texted in
 * Stores the text message in the variable text,
 * and the parsed strings in command, option, errormsg:
 * command: The string that the parser uses to determine
 *          what action to take.
 *          HELP: returns a help message
 *          [NUMBER]: checks the puzzle answer for puzzle [NUMBER]
 * option: The string that the command uses. Currently only
 *         used as the puzzle answer
 * erromsg: Stores any error messages that the Parser will throw
 */
exports.Parser = function(text) {
  this.text = text;
  this.command = undefined;
  this.option = undefined;
  this.errormsg = undefined;

  /******** CUSTOMIZE MESSAGES HERE ********/
  this.EMPTY_TEXT = "You sent an empty text!";
  this.HELP_TEXT = "Text [PUZZLE NUMBER] [SOLUTION] and we'll let you know if you are correct";
  this.PARSE_ERROR_TEXT = "I'm sorry, I cannot parse your text. Text 'help' for help.";
  this.PROBLEM_NOT_EXISTS_TEXT = "I'm sorry, that is not a problem in this mystery hunt";
  this.CORRECT_ANSWER_TEXT = "Congratulations, your answer is correct!";
  this.INCORRECT_ANSWER_TEXT = function() {
    return "I'm sorry, your answer, '" + this.option + "' to problem " + this.command + ", is incorrect.";
  }
}

exports.Parser.prototype = {
  /**
   * Parses the text message
   * The parser also accepts messages of the form
   * [PUZZLE NUMBER][SOLUTION] (no space), so it also
   * checks for solutions of that format.
   */
  parse: function() {
    var t = trim(this.text).split(' ');
    if (t.length === 0) {
      this.errormsg = this.EMPTY_TEXT;
    } else if (t.length === 1) {
      this.command = t[0].toUpperCase();
      var puzzleNumber = '';
      for (var i = 0; i < this.command.length; i++) {
        if (isDigit(this.command.substr(i, i+1))) {
          puzzleNumber += this.command.substr(i, i+1);
        } else {
          break;
        }
      }
      if (puzzleNumber.length > 0) {
        this.option = this.command.substr(puzzleNumber.length);
        this.command = puzzleNumber;
      }
      util.puts('> command: ' + this.command);
    } else {
      this.command = t[0].toUpperCase();
      this.option = t[1].toUpperCase();
      util.puts('> command: ' + this.command + ' option: ' + this.option);
    }
  },

  /**
   * Checks if the parsed text is a solution or not.
   */
  isNotSolution: function() {
    if (this.option == undefined || this.errormsg != undefined) {
      return true;
    }
  },

  /**
   * Parses command by itself, disregarding option
   * If errormsg is defined, it will return that instead.
   */
  parseSingleCommand: function() {
    if (this.errormsg != undefined) {
      return this.errormsg
    } else if (this.command === 'HELP') {
      return this.HELP_TEXT;
    } else {
      return this.PARSE_ERROR_TEXT;
    }
  },

  /**
   * Checks the solution for the problem stored in command
   * against the puzzles stored in puzzleObject
   */
  parseSolution: function(puzzleObject) {
    // Messages can be modified to your liking
    if (!puzzleObject.problemExists(this.command)) {
      return this.PROBLEM_NOT_EXISTS_TEXT;
    }
    if (puzzleObject.isCorrect(this.command, this.option)) {
      return this.CORRECT_ANSWER_TEXT;
    } else {
      return this.INCORRECT_ANSWER_TEXT();
    }
  }
};