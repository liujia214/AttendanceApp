var app = angular.module("contactApp", ["ui.router",'ngMaterial']);
app.controller("mainCtrl", function($scope){
    $scope.message = "Hello World";
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('landing', {
        url: '/landing',
        controller: 'LandingController',
        templateUrl: 'app/_landing.html'
    }).state('homepage',{
        url:'/success',
        templateUrl:'app/homepage.html',
        controller:'HomeController'
    }).state('landing.checkin',{
        url:'^/checkin',
        controller:'CheckinController',
        templateUrl:'app/_checkin.html'
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
app.controller('MainController',function($scope,$mdDialog,$mdMedia,$rootScope,ContactService,$state){
    ContactService.validate().then(function(config){
        $rootScope.user = config.data;
        $scope.user.date = new Date().toDateString();
        console.log($scope.user);
        ContactService.getTodayPersonalAtt($scope.user).then(function(result){
            console.log(result.data);
            if(result.data){
                if(result.data.attendance){
                    $scope.status = 'Present';
                    $scope.present = true;
                }else{
                    $scope.status = 'Check In';
                    $scope.present = false;
                }
            }else{
                $scope.status = 'Check In';
                $scope.present = false;
            }

        },function(){

        });
        $state.go('homepage');
    },function(){
        $state.go('landing');
    });
    $scope.login = function(ev){
        $mdDialog.show({
            parent:angular.element(document.body),
            clickOutsideToClose:true,
            templateUrl:'app/_login.html',
            controller:'LoginController',
            targetEvent:ev,
            fullscreen:$mdMedia('sm') && $scope.customFullscreen
        })
    };
    $scope.editProfile = function(ev){
        $mdDialog.show({
            parent:angular.element(document.body),
            clickOutsideToClose:true,
            title:'Edit Profile',
            templateUrl:'app/_profile.html',
            controller:'ProfileController',
            targetEvent:ev,
            fullscreen:$mdMedia('sm') && $scope.customFullscreen
        })
    };
    $scope.check = function(c){
        $scope.user.date = new Date().toDateString();
        $scope.user.attendance = c;
        console.log($scope.user);
        ContactService.updateAllAttendence($scope.user).then(function(result)
        {
            $scope.message = result.data.message;
            $scope.user.changer_id = $scope.user.google_id;
            ContactService.saveLog($scope.user).then(function(result){
                console.log(result.data);
            });
        });
    };
    $scope.logout = function(){
        ContactService.logout().then(function(config){
            console.log($scope.user);
            $rootScope.user = null;
            $state.go('landing');
        });
    };
    $scope.$watch(function(){
        return $mdMedia('sm');
    },function(sm){
        $scope.customFullscreen = (sm === true);
    });
    $rootScope.$on('userinfo',function(event,result){
        console.log(result);
        $scope.user = result;
    })
});

app.controller("LoginController", function($scope, $rootScope,ContactService,$state){
    $scope.googleUrl = '/auth/google';
});
app.controller("LandingController", function($scope, $rootScope,ContactService,$state){
    $scope.googleUrl = '/auth/google';
    ContactService.validate().then(function(config){
        console.log(config.data);
        $rootScope.user = config.data;
        $state.go('homepage');
    });
});

app.controller('HomeController',function($scope,$rootScope,ContactService,$state){
    ContactService.validate().then(function(config){
        $rootScope.user = config.data;
    },function(){
        $state.go('landing');
    });
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
app.controller('ProfileController',function ($scope, $state, ContactService,$mdDialog,$rootScope) {
    ContactService.validate().then(function(config){
        console.log(config.data);
        $scope.user = config.data;
    },function(){
        $state.go('landing');
    });
    $scope.save = function () {
        // saves the user to the database
        ContactService.updateProfile($scope.user).then(function (data) {
            console.log(data.data);
            $rootScope.$emit('userinfo',$scope.user);
            $mdDialog.hide();
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
       getTodayPersonalAtt:function(body){
           var query = 'id=' + encodeURIComponent(body.google_id);
           query += '&date=' + encodeURIComponent(body.date);
           return $http.get('/attendance?'+query);
       },
       getPersonalAtt:function(id){
           return $http.get('/attendance/'+id)
       },
       updatePersonalAtt:function(body){
           return $http.put('/attendance/'+body._id,body)
       },
       saveLog:function(body){
           return $http.post('/log',body);
       },
       logout:function(){
           return $http.get('/logout');
       }
   }
});

