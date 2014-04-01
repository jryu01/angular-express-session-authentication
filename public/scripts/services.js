'use strict';

angular.module('expAuth-session')
.factory('Auth', ['$http', '$cookieStore', function ($http, $cookieStore) {

  var currentUser = $cookieStore.get('user') || null;
  console.log(currentUser);
  $cookieStore.remove('user');

  return {

    isSignedIn: function () {
      return !!currentUser;
    },
    signout: function (success, error) {
      $http.post('/signout').success(function () {

        success();
      }).error(error);
    },
    user: currentUser
  };
}])
.factory('Users', ['$http', function ($http) {
  return {
    list: function (success, error) {
      $http.get('/api/users').success(success).error(error);
    }
  };
}]);