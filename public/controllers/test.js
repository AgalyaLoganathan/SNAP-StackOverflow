angular.module('snap1', [])
    .controller('WhatToAnswerController', ['$scope', '$http', function($scope, $http) {
    $http.get('/what-to-learn').success(function(data){
        $scope.questions_to_answer = data;
    });
}]);


