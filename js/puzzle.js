var util = require('util'),
    fs = require('fs');

exports.Puzzle = function(problemFile, solutionFile) {
  this.problemFile = problemFile;
  this.solutionFile = solutionFile;
  this.problems = {};
  this.solutions = {};
}

exports.Puzzle.prototype = {
  init: function() {
    this.loadProblems();
    this.loadSolutions();
  },
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
  problemExists: function(problem) {
    return problem in this.problems;
  },
  isCorrect: function(problem, answer) {
    return this.solutions[problem] == answer;
  }
};