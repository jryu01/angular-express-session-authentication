'use strict';

angular.module('expAuth-session')
  .controller('HomeController', ['$scope', function ($scope) {
    //controller code goes here
    $scope.greeting = 'Hello ' + $scope.user.facebook.name + '!';  
  }]);
