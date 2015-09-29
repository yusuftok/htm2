'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.hatim').factory('Hatim', ['$resource',
    function($resource) {
        return $resource('api/hatimler/:hatimId', {
            hatimId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }

]);

angular.module('mean.hatim').factory('Cuz', ['$resource',
    function($resource) {
        return $resource('api/hatimler/:hatimId/:cuzId', {
            hatimId: '@hatimId',
            cuzId:'@cuzId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }

]);
