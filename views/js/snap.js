var app = angular.module('snap',[]);
app.controller('WhatToAnswerController', ['$scope', function($scope) {
  var questions_to_answer = [
    {
      question:'Input widths on Bootstrap 3',
      tags:['css','twitter-bootstrap','twitter-bootstrap-3'],
      link:'http://stackoverflow.com/questions/18539711/input-widths-on-bootstrap-3'
    },
    {
      question:'Form inline inside a form horizontal in twitter bootstrap?',
      tags:['html','forms','twitter-bootstrap'],
      link:'http://stackoverflow.com/questions/12201835/form-inline-inside-a-form-horizontal-in-twitter-bootstrap'
    },
    {
      question:'How to center a inline form bootstrap 3',
      tags:['html', 'css', 'twitter-bootstrap-3'],
      link:'http://stackoverflow.com/questions/26102910/how-to-center-a-inline-form-bootstrap-3'
    }
  ];
  $scope.questions_to_answer = questions_to_answer;
}])
.controller('WhatToLearnController', ['$scope', function($scope) {
  var questions_to_learn = [
    {
      question:'How do I compare strings in Java?',
      tags:['java', 'string', 'equality'],
      link:'http://stackoverflow.com/questions/513832/how-do-i-compare-strings-in-java'
    },
    {
      question:'What is a Null Pointer Exception, and how do I fix it?',
      tags:['java', 'nullpointerexception'],
      link:'http://stackoverflow.com/questions/218384/what-is-a-null-pointer-exception-and-how-do-i-fix-it'
    },
    {
      question:'Is Java pass-by-reference or pass-by-value?',
      tags:['java', 'parameter-passing', 'terminology', 'pass-by-reference', 'pass-by-value'],
      link:'http://stackoverflow.com/questions/40480/is-java-pass-by-reference-or-pass-by-value'
    }
  ];
  $scope.questions_to_learn = questions_to_learn;
}]);
