var app = angular.module('snap',[]);

app.controller('WhatToAnswerController', ['$scope', '$http',  function($scope, $http) {
    console.log("Im working");
    $http.get('/what-to-answer').success(function(data){
        $scope.questions_to_answer = data;
    });

  $scope.updateCompetency = function(question_id) {
    for (var i = 0; i < $scope.questions_to_answer.length; i++) {
      if($scope.questions_to_answer[i].id == question_id) {
        var tags = $scope.questions_to_answer[i].tags;
        $http.post('/updateCompetency', tags).success(function(data){
          console.log("I guess I'm done");
        });
        break;
      }
    }
  };

  $scope.updateQuestionStatus=function(question_id){
    $http.post('/updateQuestionStatus',{question_id}).success(function(data){
    console.log("I guess I'm done");
    });
   };

  var questionForExpert;
  $scope.listExperts = function(question){
    $http.get('/getExperts', question.tags).success(function(data){
          $scope.expertsList = data;
          questionForExpert = question;
          console.log("Question for expert " + questionForExpert.question);
    });
    $('div.experts-list').show();
  };

  $scope.notifyExperts = function(){
    var experts = ['user1', 'user2', 'user4', 'alogana1@asu.edu'];
    var requestData = {
      'experts' : experts,
      'question' : questionForExpert
    };

    console.log("Req Data " + requestData['experts']);
    console.log("Req Data " + requestData['question'].question);
    $http.post('/notifyExperts', requestData).success(function(data){
        console.log("Successfully notified");
    });
    questionForExpert = "";
    $(".expert-notified").show().delay(2000).fadeOut();
    $('div.experts-list').hide();
  }



  $scope.listPosts = function(question){
    $http.get('/getPosts').success(function(data){
          $scope.postList = data;
          console.log("Post ");
    });
    $('div.posts-list').show();
  };

  $scope.hoverIn = function(){
      this.hoverEdit = true;
  };

  $scope.hoverOut = function(){
      this.hoverEdit = false;
  };

}])
.controller('WhatToLearnController', ['$scope', '$http',  function($scope, $http) {
    $http.get('/what-to-learn').success(function(data){
        $scope.questions_to_learn = data;
    });
  $scope.updateLearningObjective = function(question_id) {
    for (var i = 0; i < $scope.questions_to_learn.length; i++) {
      if($scope.questions_to_learn[i].id == question_id) {
        var tags = $scope.questions_to_learn[i].tags;
        $http.post('/updateCompetency', tags).success(function(data){
          console.log("I guess I'm done");
        });
        break;
      }
    }
  };
  $scope.updateQuestionStatus=function(question_id){
    $http.post('/updateQuestionStatus',{question_id}).success(function(data){
    console.log("I guess I'm done");
  });
   };

  $scope.hoverIn = function(){
      this.hoverEdit = true;
  };

  $scope.hoverOut = function(){
      this.hoverEdit = false;
  };

}])
.controller('CompetencyListController', ['$scope', '$http', function($scope, $http) {
  $http.get('/get-competencies').success(function(data){
        $scope.competency_list = data;
    });
  // var competency_list = ['html','twitter-bootstrap','css'];
  // $scope.competency_list = competency_list;
  $scope.removeCompetency = function(competency) {
    console.log(competency);
      var index = competency_list.indexOf(competency);
      console.log(index);
      $scope.competency_list.splice(index, 1);
      console.log(competency_list);
  };
}])
.controller('LearningListController', ['$scope', '$http', function($scope, $http) {
  $http.get('/get-learning-objectives').success(function(data){
        $scope.learning_list = data;
    });
  //var learning_list = ['android', 'java', 'mobile app'];
  //$scope.learning_list = learning_list;
  $scope.removeToLearnElement = function(learning) {
    console.log(learning);
      var index = learning_list.indexOf(learning);
      console.log(index);
      $scope.learning_list.splice(index, 1);
      console.log(learning_list);
  };
}]);
app.controller('DidYouKnowController', ['$scope', '$http',  function($scope, $http) {
    $http.get('/did-you-know').success(function(data){
        $scope.did_you_know_questions = data;
    });

  $scope.hoverIn = function(){
      this.hoverEdit = true;
  };

  $scope.hoverOut = function(){
      this.hoverEdit = false;
  };
}])
