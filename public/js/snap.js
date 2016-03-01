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
.controller('WhatToLearnController', ['$scope', '$http',  function($scope, $http) {
    $http.get('/what-to-learn').success(function(data){
        $scope.questions_to_learn = data;
    });
  $scope.updateCompetency = function(question_id) {
    for (var i = 0; i < $scope.questions_to_learn.length; i++) {
      if($scope.questions_to_learn[i].id == question_id) {
        console.log($scope.questions_to_learn[i].question);
        break;
      }
    }
  };
}])
.controller('CompetencyListController', ['$scope', function($scope) {
  var competency_list = ['html','twitter-bootstrap','css'];
  $scope.competency_list = competency_list;
}])
.controller('LearningListController', ['$scope', function($scope) {
  var learning_list = ['android', 'java', 'mobile app'];
  $scope.learning_list = learning_list;
}]);
