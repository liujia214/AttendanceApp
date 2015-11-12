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
    }).state('landing.admin',{
        url: '^/admin',
        controller: 'AdminController',
        templateUrl: 'app/_admin.html'
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

app.controller('AdminController', function($http,$scope){
    $scope.userlist;
    $scope.pickdate = function(date){
        $scope.date = date;
        $http.get("/contacts").then(function(data){
            $scope.userlist = data.data;
            var date = encodeURIComponent($scope.date);
            $http.get('/attendance/'+date).then(function(data_attendance) {
                if (data_attendance.data.length != 0 ) {
                    console.log("right now change the front end",data_attendance.data );
                    $scope.userlist.forEach(function(ele_contact){
                        ele_contact.attendance = false;
                        data_attendance.data.forEach(function(ele_attendance){
                            if (ele_attendance.google_id === ele_contact.google_id) {
                                ele_contact.attendance = ele_attendance.attendance;
                            }
                        })
                    })

                } else {
                    $scope.userlist.forEach(function (ele_contact) {
                        ele_contact.attendance = false;
                        console.log(ele_contact);
                    })
                }
                console.log("change over", $scope.userlist);
            });
        });


    },function(){
        $state.go('landing');
    };


    $scope.save = function(userlist){
        $scope.attendance=[];
        userlist.forEach(function(ele){
            $scope.attendance.push(ele);
        })
        $scope.attendance.forEach(function(ele){
            ele.date = $scope.date;
            ele.timestamp = new Date();
        })
        console.log($scope.attendance);
        var date = encodeURIComponent($scope.date);
        $http.put('/attendance/', $scope.attendance).then(function(){

        })
    }
})

