var app = angular.module('expert-notifications',[]);
app.controller('ExpertNotificationsController', ['$scope', '$http',  function($scope, $http) {
    console.log("Im working in expert notifications");
    // $http.get('/expertNotifications').success(function(data){

    //     $scope.notifications = data;
    // });
    $http.get('/listExpertNotifications').success(function(data){
        $scope.notifications = data;
    });
}]);