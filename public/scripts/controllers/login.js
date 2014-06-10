'use strict';

angular.module('angularSessionAuthApp')
.controller('LoginController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
  init();
  $scope.signin = function () {
    $http
    .post('/signin', $scope.signinData)
    .success(function (data, status, headers, config) {
      $state.go('user.home');
    })
    .error(function (data, status, headers, config) {
      $scope.loginForm.serverError = {
        message : 'Error: Attempt failed'
      };
      if (data.message) {
        $scope.loginForm.serverError.message = data.message;
      }
    });
  };

  function init() {
    $scope.signinData = {}; 
  }
}]);
