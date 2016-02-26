var app = angular.module('snap',[]);
app.controller('WhatToAnswerController', ['$scope', function($scope) {
  var questions_to_answer = [
    {
      id:1,
      question:'Input widths on Bootstrap 3',
      tags:['css','twitter-bootstrap','twitter-bootstrap-3'],
      link:'http://stackoverflow.com/questions/18539711/input-widths-on-bootstrap-3'
    },
    {
      id:2,
      question:'Form inline inside a form horizontal in twitter bootstrap?',
      tags:['html','forms','twitter-bootstrap'],
      link:'http://stackoverflow.com/questions/12201835/form-inline-inside-a-form-horizontal-in-twitter-bootstrap'
    },
    {
      id:3,
      question:'How to center a inline form bootstrap 3',
      tags:['html', 'css', 'twitter-bootstrap-3'],
      link:'http://stackoverflow.com/questions/26102910/how-to-center-a-inline-form-bootstrap-3'
    }
  ];
  $scope.questions_to_answer = questions_to_answer;
  $scope.updateCompetency = function(question_id) {
    for (var i = 0; i < $scope.questions_to_answer.length; i++) {
      if($scope.questions_to_answer[i].id == question_id) {
        console.log($scope.questions_to_answer[i].question);
        break;
      }
    }
  };
}])
.controller('WhatToLearnController', ['$scope', function($scope) {
  var questions_to_learn = [
    {
      id:4,
      question:'How do I compare strings in Java?',
      tags:['java', 'string', 'equality'],
      link:'http://stackoverflow.com/questions/513832/how-do-i-compare-strings-in-java'
    },
    {
      id:5,
      question:'What is a Null Pointer Exception, and how do I fix it?',
      tags:['java', 'nullpointerexception'],
      link:'http://stackoverflow.com/questions/218384/what-is-a-null-pointer-exception-and-how-do-i-fix-it'
    },
    {
      id:6,
      question:'Is Java pass-by-reference or pass-by-value?',
      tags:['java', 'parameter-passing', 'terminology', 'pass-by-reference', 'pass-by-value'],
      link:'http://stackoverflow.com/questions/40480/is-java-pass-by-reference-or-pass-by-value'
    }
  ];
  $scope.questions_to_learn = questions_to_learn;
  $scope.updateCompetency = function(question_id) {
    for (var i = 0; i < $scope.questions_to_learn.length; i++) {
      if($scope.questions_to_learn[i].id == question_id) {
        console.log($scope.questions_to_learn[i].question);
        break;
      }
    }
  };
}]);
