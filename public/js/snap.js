var app = angular.module('snap',[]);
app.controller('WhatToAnswerController', ['$scope', '$http',  function($scope, $http) {
    $http.get('/what-to-answer').success(function(data){
        $scope.questions_to_answer = data;
    });
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
  $scope.removeCompetency = function(competency) {
    console.log(competency);
      var index = competency_list.indexOf(competency);
      console.log(index);
      $scope.competency_list.splice(index, 1);
      console.log(competency_list);
  };
}])
.controller('LearningListController', ['$scope', function($scope) {
  var learning_list = ['android', 'java', 'mobile app'];
  $scope.learning_list = learning_list;
  $scope.removeToLearnElement = function(learning) {
    console.log(learning);
      var index = learning_list.indexOf(learning);
      console.log(index);
      $scope.learning_list.splice(index, 1);
      console.log(learning_list);
  };
}]);
