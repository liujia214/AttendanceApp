var app = angular.module("contactApp", ["ui.router",'ngMaterial']);
app.controller("mainCtrl", function($scope){
    $scope.message = "Hello World";
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('landing', {
        url: '/landing',
        controller: 'LandingController',
        templateUrl: 'app/_landing.html'
    }).state('landing.profile', {
        url: '^/profile',
        controller: 'ProfileController',
        templateUrl: 'app/_profile.html'
    });

    $urlRouterProvider.otherwise('/landing');
});

app.controller("LandingController", function($scope, $http, $rootScope){
    $scope.googleUrl = '/auth/google';
    //validation process for front end
    $http.get("/validate").then(function(config){
        console.log(config.data);
        $rootScope.user = config.data;
    });
});

app.controller('ProfileController', ['$scope', '$http','$state', function ($scope, $http,$state) {
    //$scope.user= {};
    //$http.get('/profile').then(function(data){
    //    $scope.user = data.data;
    //    console.log($scope.user);
    //});
    $http.get("/validate").then(function(config){
        console.log(config.data);
        $scope.user = config.data;
    },function(){
        $state.go('landing');
    });
    $scope.save = function () {
        // saves the user to the database
        console.log($scope.user._id);
        $http.put('/contact/'+$scope.user._id, $scope.user).then(function (data) {
            console.log(data.data);
            $scope.message = data.data.message;
        }, function (config) {
            console.log(config)
        });
    };

}]);
