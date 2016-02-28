angular.module('snap1', [])
    .controller('WhatToAnswerController', ['$scope', '$http', function($scope, $http) {
    $http.get('/dashboard').success(function(data){
        $scope.questions_to_answer = data;
    });
}]);


