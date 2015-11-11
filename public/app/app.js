var app = angular.module("contactApp", ["ui.router"]);
app.controller("mainCtrl", function($scope){
    $scope.message = "Hello World";
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('landing', {
        url: '/landing',
        controller: 'LandingController',
        templateUrl: 'app/_landing.html'
    }).state('profile', {
        url: '/profile',
        controller: 'ProfileController',
        templateUrl: 'app/_profile.html'
    });

    $urlRouterProvider.otherwise('/landing');
});

app.controller("LandingController", function($scope, $http, $rootScope){
    //validation process for front end
    $http.get("/validate").then(function(config){
        console.log(config.data);
        $rootScope.user = config.data;
    },function (config) {
        if(config.status === 401) {
            // redirect the user to /auth/google
            window.location = location.origin + '/auth/google';
        }
    });
});

app.controller('ProfileController', ['$scope', '$http', function ($scope, $http) {

    $scope.createUser = function () {
        $scope.new_user = {};
        $scope.new_user.google_id = $scope.user.id;
        $scope.new_user.google_user = angular.copy($scope.user);
        // saves the user to the database
        $http.post('/contact', $scope.new_user).then(function () {
            console.log($scope.new_user);
        }, function (config) {
            console.log(config)
        });
    };

}]);
