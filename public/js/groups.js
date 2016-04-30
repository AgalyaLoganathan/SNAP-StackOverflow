var app = angular.module('groups',[]);
app.controller('LearningGroupController', ['$scope', '$http',  function($scope, $http) {
  $scope.posts = [];
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
  $scope.learningGroup = document.getElementById("learningGroupName").innerHTML.split(" ",1);
  $http.post('/postComment', {'post':$scope.userPost,'learningGroup':$scope.learningGroup}).success(function(data){
    $scope.userPost = data;
    $scope.posts.push(data);
    window.location.reload();
  });
}

$scope.updateVerificationStatus = function(post){
  console.log("Verified");
  console.log(post);
  $http.post('/updatePostVerification', {post}).success(function(){
    console.log("Sucessfully saved");
    window.location.reload();
  })
}

$scope.isVerified = function(post){
  console.log("In isVerified");
  console.log(post);
  return post['isVerified'] == true;
}
}]);
