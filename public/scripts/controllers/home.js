'use strict';

angular.module('angularSessionAuthApp')
  .controller('HomeController', ['$scope', function ($scope) {
    //controller code goes here
    var username;
    if ($scope.user.facebook) {
      username = $scope.user.facebook.name;
    } else if ($scope.user.local) {
      username = $scope.user.local.email;
    }
    $scope.greeting = 'Hello ' + username + '!';  
  }]);
