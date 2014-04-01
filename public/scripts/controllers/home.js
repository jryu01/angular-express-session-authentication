'use strict';

angular.module('angularSessionAuthApp')
  .controller('HomeController', ['$scope', function ($scope) {
    //controller code goes here
    $scope.greeting = 'Hello ' + $scope.user.facebook.name + '!';  
  }]);
