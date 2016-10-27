'use strict';

/**
 * @ngdoc overview
 * @name featureTable
 * @description
 * # featureTable
 *
 * Main module of the application.
 */
angular
  .module('productTableApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
