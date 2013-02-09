var util = require('util'),
    fs = require('fs');

/**
 * Class that stores all the puzzle problems and answers
 */
exports.Puzzle = function(problemFile, solutionFile) {
  this.problemFile = problemFile;
  this.solutionFile = solutionFile;
  this.problems = {};
  this.solutions = {};
}

exports.Puzzle.prototype = {
  /**
   * Initializes the Puzzle object with data
   * from user defined files.
   */
  init: function() {
    this.loadProblems();
    this.loadSolutions();
  },

  /**
   * Loads the problems from the problems file into the
   * problems array
   */
  loadProblems: function() {
    var data = fs.readFileSync('../puzzle/' + this.problemFile);
    var lines = data.toString('utf8').split('\n');
    util.puts('Loading problems…');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].charAt(0) !== '#') {
        var problem = lines[i].split(' ');
        if (problem.length !== 2) throw 'Problem does not follow format';
        this.problems[problem[0]] = problem[1];
      }
    }
    util.puts('Problems loaded');
  },

  /**
   * Loads the solutions from the solutions file into
   * the solutions dictionary
   */
  loadSolutions: function() {
    var data = fs.readFileSync('../puzzle/' + this.solutionFile);
    var lines = data.toString('utf8').split('\n');
    util.puts('Loading solutions…');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].charAt(0) !== '#') {
        var line = lines[i].split(' '),
            solution = [];
        if (line.length < 2) throw 'Solution does not follow format';
        for (var j = 1; j < line.length; j++) {
          solution.push(line[j].toUpperCase());
        }
        this.solutions[line[0]] = solution;
      }
    }
    util.puts('Solutions loaded');
  },

  /**
   * Checks if the given problem exists in the problems array
   */
  problemExists: function(problem) {
    return problem in this.problems;
  },

  /**
   * Checks whether the given answer form the given problem is
   * correct.
   */
  isCorrect: function(problem, answer) {
    util.puts('> ' + (this.solutions[problem].indexOf(answer) >= 0));
    return this.solutions[problem].indexOf(answer) >= 0;
  }
};