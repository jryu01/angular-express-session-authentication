'use strict';

angular.module('angularSessionAuthApp', ['ui.router'])
.config(['$stateProvider','$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  //================================================
  // Check if the user is connected
  //================================================
  var checkSignin = function ($q, $timeout, $http, $location, $rootScope) {
    // Initialize a new promise
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('/signedin').success(function (user) {
      // Authenticated
      if (user !== '0') {
        $rootScope.user = user;
        $timeout(deferred.resolve, 0);

      // Not Authenticated
      } else {
        $rootScope.message = 'You need to log in.';
        $timeout(function () { deferred.reject(); }, 0);
        $location.url('/login');
      }
    });
    return deferred.promise;
  };

  //================================================
  // Route configurations 
  //================================================

  // Public routes
  $stateProvider
    .state('public', {
      abstract: true,
      template: "<div ui-view></div>"
    })
    .state('public.login', {
      url: '/login',
      templateUrl: '/views/partials/login.html'
    });

  // Regular user routes
  $stateProvider
    .state('user', {
      abstract: true,
      template: "<div ui-view></div>",
      resolve: {
        requiresSignin: checkSignin
      }
    })
    .state('user.home', {
      url: '/',
      templateUrl: '/views/partials/home.html',
      controller: 'HomeController'
    });
  
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  //================================================
  // An interceptor for AJAX errors
  //================================================

  $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
    return function (promise) {
      return promise.then(
        // Successs
        function (response) {
          return response;
        },
        // Error 
        function (response) {
          if (response.status === 401) {
            $location.url('login');
            return $q.reject(response);
          }
        }
      );
    };
  }]);
}]);