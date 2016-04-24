var app = angular.module('groups',[]);
app.controller('LearningGroupController', ['$scope', '$http',  function($scope, $http) {
    $http.get('/getPosts').success(function(data){
      $('div.postData').attr("disabled", true);
      console.log("Post data is " + data);
      $scope.posts = data;
    });

$scope.postComment = function(){
  console.log("Post data " + $scope.postText);
  // var userPost = {
  //   'post' : $scope.postText;
  // };

  console.log("Post Req Data " + "text");
  $http.post('/postComment', "text").success(function(data){
      console.log("Successfully posted");
  });
}
}]);
