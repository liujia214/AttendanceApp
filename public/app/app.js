var app = angular.module("contactApp", ["ui.router",'ngMaterial']);
app.controller("mainCtrl", function($scope){
    $scope.message = "Hello World";
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('landing', {
        url: '/landing',
        controller: 'LandingController',
        templateUrl: 'app/_landing.html',
    }).state('landing.profile', {
        url: '^/profile',
        controller: 'ProfileController',
        templateUrl: 'app/_profile.html'
    }).state('landing.admin',{
        url: '^/admin',
        controller: 'AdminController',
        templateUrl: 'app/_admin.html'
    }).state('landing.attendance',{
        url:'^/attendance',
        controller:'AttendanceController',
        templateUrl:'app/_attendance.html'
    });

    $urlRouterProvider.otherwise('/landing');
});

app.controller("LandingController", function($scope, $http, $rootScope){
    $scope.googleUrl = '/auth/google';
    if(!$scope.user){
        $http.get("/validate").then(function(config){
            console.log(config.data);
            $rootScope.user = config.data;
        });
    }

});


app.controller('ProfileController',function ($scope, $http,$state, $rootScope) {
    $http.get("/validate").then(function(config){
        console.log(config.data);
        $scope.user = config.data;
    },function(){
        $state.go('landing');
    });
    //$rootScope.$on('check_this_user', function(event, data){
    //    console.log("hello",data);
    //    $scope.user = data;
    //});
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

});

app.controller('AdminController', function($http,$scope,$state, $rootScope){
    $http.get("/validate").then(function(config){
        console.log(config.data);
        $scope.user = config.data;
    },function(){
        $state.go('landing');
    });
    $scope.date = new Date();
    $scope.maxDate = new Date();
    $scope.pickdate = function(){
            $scope.message = '';
        console.log($scope.date);
            var date = encodeURIComponent($scope.date.toDateString());

            $http.get('/admin/'+date).then(function(data_attendance) {
                console.log(data_attendance.data);
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
            },function(){
                $scope.userlist.forEach(function (ele_contact) {
                    ele_contact.attendance = false;
                    console.log(ele_contact);
                })
            });
    };
    $http.get('/contacts').then(function(result){
        $scope.userlist = result.data;
        $scope.pickdate();
    });

    $scope.save = function(userlist){
        $scope.attendance=[];
        userlist.forEach(function(ele){
            $scope.attendance.push(ele);
        });
        $scope.attendance.forEach(function(ele){
            ele.date = $scope.date.toDateString();
            ele.timestamp = new Date();
        });
        $http.put('/attendance/', $scope.attendance).then(function(result){
            $scope.message = result.data.message;
        },function(){
            $scope.message = 'connection error!';
        })
    };

    //$scope.seecontact= function(contact){
    //    console.log(contact.google_id);
    //    $http.get('contacts/'+contact.google_id).then(function(result){
    //        console.log(result.data);
    //        $state.go('landing.profile');
    //        $rootScope.$emit('check_this_user', result.data);
    //    })
    //}
});

app.controller('AttendanceController',function($scope,$http,$state){
    $http.get("/validate").then(function(config){
        console.log(config.data);
        $scope.user = config.data;
        console.log($scope.user._id);
        $http.get('/attendance/'+$scope.user.google_id).then(function(result){
            $scope.result = result.data;
            $scope.result.forEach(function(ele){
                ele.date = new Date(ele.date).toISOString().substr(0,10);
                ele.attendance = (ele.attendance === true) ? 'Present' : 'Absent';
            });
        })
    },function(){
        $state.go('landing');
    });

});

