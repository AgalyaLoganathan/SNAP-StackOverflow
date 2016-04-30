var app = angular.module('groups',[]);
app.controller('LearningGroupController', ['$scope', '$http',  function($scope, $http) {
  $scope.userPost="";
  $scope.learningGroup="";
    $http.get('/getPosts').success(function(data){
      // $scope.postText = data;
      // $scope.userPost = data;
      $scope.posts = data;
      console.log("post data=" + $scope.userPost);
    });

$scope.postComment = function(){
  // $scope.userPost = post;
  // console.log("Post data " + $scope.postText);
  console.log("Post data " + $scope.userPost);
  // var userPost = {
  //   'post' : $scope.postText;
  // };

  // console.log("Post Req Data " +   $scope.postText);
  console.log(document.getElementById("learningGroupName").innerHTML.split(" ",1));
  $scope.learningGroup = document.getElementById("learningGroupName").innerHTML.split(" ",1);
  $http.post('/postComment', {'post':$scope.userPost,'learningGroup':$scope.learningGroup}).success(function(data){
    $scope.userPost = data;
    console.log(user)
      console.log("Successfully posted");
  });
}
}]);
