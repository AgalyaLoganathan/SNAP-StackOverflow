angular.module('snap1', []);
SNAP1.controller('WhatToAnswerController', function('$scope'){
    var questions_to_answer = [
    {
      id:1,
      question:'Input widths on Bootstrap 3',
      tags:['css','twitter-bootstrap','twitter-bootstrap-3'],
      link:'http://stackoverflow.com/questions/18539711/input-widths-on-bootstrap-3'
    }];
    $scope.questions_to_answer = questions_to_answer;
  });

