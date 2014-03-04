var app = angular.module("myApp", ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: "templates/home.html",
    controller: "HomeController"
  })
  .when('/settings', {
    templateUrl: 'templates/settings.html',
    controller: 'SettingsController'
  })
  .otherwise({ redirectTo: '/' });
});

app.controller('HomeController', function() {

});

app.controller('SettingsController', function() {

});
