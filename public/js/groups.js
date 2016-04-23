var app = angular.module('groups',[]);
app.controller('LearningGroupController', ['$scope', '$http',  function($scope, $http) {
    console.log("Im working");
    $http.get('/learningGroup').success(function(data){
      
    });
  });

$scope.postComment = function(){
  var userPost = {
    'post' : document.getElementById("postTextArea").value
  };
  console.log(" Post Req Data " + requestData['userName']);
  console.log("Post Req Data " + requestData['post'].question);
  $http.post('/postComment', requestData).success(function(data){
      console.log("Successfully posted");
  });
}
