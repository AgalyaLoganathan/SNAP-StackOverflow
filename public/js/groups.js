var app = angular.module('groups',[]);
app.controller('LearningGroupController', ['$scope', '$http',  function($scope, $http) {
  $scope.userPost="";
    $http.get('/learningGroups').success(function(data){
      // $scope.postText = data;
      // $scope.userPost = data;
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
  $http.post('/postComment', {'post':$scope.userPost}).success(function(data){
    $scope.userPost = data;
    console.log(user)
      console.log("Successfully posted");
  });
}
}]);
