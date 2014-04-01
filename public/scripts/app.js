'use strict';

angular.module('expAuth-session', ['ngCookies', 'ui.router'])
.constant('ACCESS_LEVELS', {
  pub: 1,
  user: 2 
})
.config(['$stateProvider','$urlRouterProvider', '$locationProvider', '$httpProvider', 'ACCESS_LEVELS', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, ACCESS_LEVELS) {

  // Anonymous routes
  $stateProvider
    .state('start', {
      abstract: true,
      template: "<ui-view/>",
      data: {
        access_level: ACCESS_LEVELS.pub
      }
    })
    .state('start.home', {
      templateUrl: '/views/partials/home.html',
    })
    .state('start.login', {
      url: '/login',
      templateUrl: '/views/partials/home.html'
    });

  // Regular user routes
  $stateProvider
    .state('user', {
      abstract: true,
      template: "<ui-view/>",
      data: {
          access_level: ACCESS_LEVELS.user 
      }
    })
    .state('user.home', {
      url: '/',
      templateUrl: '/views/partials/main.html'
    });

  $stateProvider
    .state('otherwise', {
      url: '/otherwise',
      template: '<h3>Page Not Found</h3>'
    });
  
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/otherwise');

  $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    });

}])
.run(['$rootScope', '$state', '$location', 'Auth', 'Users', 
function run($rootScope, $state, $location, Auth, Users) {
  $rootScope.$on("$stateChangeStart", 
  function (event, toState, toParams, fromState, fromParams) {
    console.log('from');
    console.log(fromState);
    console.log('to');
    console.log(toState);

    if (toState.data.access_level === 1 && Auth.isSignedIn()) {
      event.preventDefault();
      $state.go('user.home');
      return;
    }
    if (toState.data.access_level > 1 && !Auth.isSignedIn()) {
      event.preventDefault();
      $state.go('start.home');
      return;
    }
  });
}]);