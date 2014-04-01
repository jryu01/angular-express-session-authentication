'use strict';

angular.module('angularSessionAuthApp')
.factory('Auth', ['$http', function ($http) {
  return {
    signout: function (success, error) {
      $http.post('/signout').success(success).error(error);
    }
  };
}])
.factory('Users', ['$http', function ($http) {
  return {
    list: function (success, error) {
      $http.get('/api/users').success(success).error(error);
    }
  };
}]);