'use strict';
angular.module('mean.hatim').controller('HatimController', ['$scope', '$stateParams', '$location', 'Global', 'Hatim', 'Cuz', 'MeanUser', 'Circles',
    function($scope, $stateParams, $location, Global, Hatim, Cuz, MeanUser, Circles) {
        $scope.global = Global;

        $scope.hasAuthorization = function(hatim) {
            if (!hatim || !hatim.organizingUser) return false;
            return MeanUser.isAdmin || hatim.organizingUser._id === MeanUser.user._id;
        };

        $scope.availableCircles = [];

        Circles.mine(function(acl) {
            $scope.availableCircles = acl.allowed;
            $scope.allDescendants = acl.descendants;
        });

        $scope.showDescendants = function(permission) {
            var temp = $('.ui-select-container .btn-primary').text().split(' ');
            temp.shift(); //remove close icon
            var selected = temp.join(' ');
            $scope.descendants = $scope.allDescendants[selected];
        };

        $scope.selectPermission = function() {
            $scope.descendants = [];
        };

        $scope.create = function(isValid) {
            if (isValid) {
                // $scope.hatim.permissions.push('test test');
                var hatim = new Hatim($scope.hatim);

                hatim.$save(function(response) {
                    $location.path('hatimler/' + response._id);
                });

                $scope.hatim = {};

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(hatim) {
            if (hatim) {
                hatim.$remove(function(response) {
                    for (var i in $scope.hatimler) {
                        if ($scope.hatimler[i] === hatim) {
                            $scope.hatimler.splice(i, 1);
                        }
                    }
                    $location.path('hatimler');
                });
            } else {
                $scope.hatim.$remove(function(response) {
                    $location.path('hatimler');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var hatim = $scope.hatim;
                if (!hatim.updated) {
                    hatim.updated = [];
                }
                hatim.updated.push(new Date().getTime());

                hatim.$update(function() {
                    $location.path('hatimler/' + hatim._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Hatim.query(function(hatimler) {
                $scope.hatimler = hatimler;
            });
        };

        $scope.findOne = function() {
            $scope.userId=MeanUser.user._id;
            Hatim.get({
                hatimId: $stateParams.hatimId
            }, function(hatim) {
                $scope.hatim = hatim;
            });
        };

        $scope.toggleRead = function(cuz, reading) {
            if (reading){
                cuz.readingUser = MeanUser.user._id;
            }else{
                delete cuz.readingUser;
                cuz.completed = false;
            }
            var cuz = new Cuz(cuz);
            cuz.$update({
                hatimId: $stateParams.hatimId,
                cuzId:cuz.cuzId
            }, function(hatim) {
                $scope.hatim = hatim;
            });
        };

//        $scope.letElseRead = function(cuz) {
//            delete cuz.readingUser;
//            var cuz = new Cuz(cuz);
//            cuz.$update({
//                hatimId: $stateParams.hatimId,
//                cuzId:cuz.cuzId
//            }, function(hatim) {
//                $scope.hatim = hatim;
//            });
//        };

        $scope.toggleComplete = function(cuz, isComplete) {
            cuz.completed = isComplete;
            var cuz = new Cuz(cuz);
            cuz.$update({
                hatimId: $stateParams.hatimId,
                cuzId:cuz.cuzId
            }, function(hatim) {
                $scope.hatim = hatim;
            });
        };
   }
]);