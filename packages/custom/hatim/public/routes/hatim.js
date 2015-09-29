'use strict';

angular.module('mean.hatim').config(['$stateProvider',
    function ($stateProvider) {
        // states for my app
        $stateProvider
            .state('all hatims', {
                url: '/hatimler',
                templateUrl: '/hatim/views/list.html',
                resolve: {
                    loggedin: function (MeanUser) {
                        return MeanUser.checkLoggedin();
                    }
                }
            })
            .state('create hatim', {
                url: '/hatimler/create',
                templateUrl: '/hatim/views/create.html',
                resolve: {
                    loggedin: function (MeanUser) {
                        return MeanUser.checkLoggedin();
                    }
                }
            })
            .state('edit hatim', {
                url: '/hatimler/:hatimId/edit',
                templateUrl: '/hatim/views/edit.html',
                resolve: {
                    loggedin: function (MeanUser) {
                        return MeanUser.checkLoggedin();
                    }
                }
            })
            .state('hatim by id', {
                url: '/hatimler/:hatimId',
                templateUrl: '/hatim/views/view.html',
                resolve: {
                    loggedin: function (MeanUser) {
                        return MeanUser.checkLoggedin();
                    }
                }
            });


    }
]);
