var app = angular.module("contactApp", ["ui.router",'ngMaterial']);
app.controller("mainCtrl", function($scope){
    $scope.message = "Hello World";
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('landing', {
        url: '/landing',
        controller: 'LandingController',
        templateUrl: 'app/_landing.html'
    }).state('landing.checkin',{
        url:'^/checkin',
        controller:'CheckinController',
        templateUrl:'app/_checkin.html'
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

app.controller("LandingController", function($scope, $rootScope,ContactService){
    $scope.googleUrl = '/auth/google';
    if(!$scope.user){
        ContactService.validate().then(function(config){
            console.log(config.data);
            $rootScope.user = config.data;
        });
    }
});

app.controller('CheckinController',function($scope,ContactService,$state){
    ContactService.validate().then(function(config){
        $scope.user = config.data;
        $scope.today = new Date();
        $scope.user.date = new Date().toDateString();
    },function(){
       $state.go('landing');
    });
    $scope.check = function(c){
        $scope.user.attendance = c;
        ContactService.updateAllAttendence($scope.user).then(function(result)
        {
           $scope.message = result.data.message;
            $scope.user.changer_id = $scope.user.google_id;
           ContactService.saveLog($scope.user).then(function(result){
               console.log(result.data);
           });
        });
    };
});
app.controller('ProfileController',function ($scope, $state, ContactService) {
    ContactService.validate().then(function(config){
        console.log(config.data);
        $scope.user = config.data;
    },function(){
        $state.go('landing');
    });
    $scope.save = function ($event) {
        // saves the user to the database
        console.log($scope.user._id);
        ContactService.updateProfile($scope.user).then(function (data) {
            console.log(data.data);
            $scope.message = data.data.message;
        }, function (config) {
            console.log('error');
            $scope.message = 'connection error';
            //ErrorDialog.showDialog($event);
        });
    };

});

app.controller('AdminController', function($scope,$state, ContactService){
    ContactService.validate().then(function(config){
        console.log(config.data);
        $scope.user = config.data;
    },function(){
        $state.go('landing');
    });
    $scope.date = new Date();
    $scope.maxDate = new Date();
    $scope.pickdate = function(){
            $scope.message = '';
            var date = encodeURIComponent($scope.date.toDateString());
            ContactService.getAllAttendance(date).then(function(data_attendance) {
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
                });
            });
    };
    ContactService.getProfiles().then(function(result){
        $scope.userlist = result.data;
        $scope.pickdate();
    },function(){
        //ErrorDialog.showDialog();
    });

    $scope.save = function(userlist){
        $scope.attendance=[];
        userlist.forEach(function(ele){
            ele.change_id = $scope.user.google_id;
            ele.date = $scope.date.toDateString();
            $scope.attendance.push(ele);
        });
        ContactService.updateAllAttendence($scope.attendance).then(function(result){
            $scope.message = result.data.message;
            ContactService.saveLog($scope.attendance).then(function(result){
                console.log(result.data);
            })
        },function(){
            $scope.message = 'connection error!';
            //ErrorDialog.showDialog();
        })
    };
});

app.controller('AttendanceController',function($scope,$state,ContactService){
    ContactService.validate().then(function(config){
        $scope.user = config.data;
        ContactService.getPersonalAtt($scope.user.google_id).then(function(result){
            $scope.result = result.data;
            console.log(result.data);
            $scope.result.forEach(function(ele){
                ele.date = new Date(ele.date).toISOString().substr(0,10);
            });
        },function(err){
        })
    },function(){
        $state.go('landing');
    });
    $scope.saveComment = function(attendance){
        console.log('aa');
        ContactService.updatePersonalAtt(attendance).then(function(result){
            console.log(result.data);
        },function(err){
            console.log(err);
            //ErrorDialog.showDialog();
        });
    }

});

app.factory('ErrorDialog',function($mdDialog){
    return{
        showDialog:function($event){
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(document)
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent('Please check your connection!')
                    .ok('Got it')
                    .targetEvent($event)
            );
        }
    }
});
app.factory('ContactService',function($http){
   return{
       validate:function(){
           return $http.get('validate');
       },
       getProfiles:function(){
           return $http.get('/contacts');
       },
       updateProfile:function(body){
           return $http.put('/contacts/'+body._id,body);
       },
       getAllAttendance:function(date){
           return $http.get('/admin/'+date)
       },
       updateAllAttendence:function(body){
           return $http.put('/admin',body)
       },
       getPersonalAtt:function(id){
           return $http.get('/attendance/'+id)
       },
       updatePersonalAtt:function(body){
           return $http.put('/attendance/'+body._id,body)
       },
       saveLog:function(body){
           return $http.post('/log',body);
       }

   }
});

