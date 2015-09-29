'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Hatim = new Module('hatim');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Hatim.register(function (app, auth, database, circles) {

    //We enable routing. By default the Package Object is passed to the routes
    Hatim.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Hatim.menus.add({
        'roles': ['authenticated'],
        'title': 'Hatimler',
        'link': 'all hatims'
    });
    Hatim.menus.add({
        'roles': ['authenticated'],
        'title': 'Yeni Hatim Ekle',
        'link': 'create hatim'
    });

//    Hatim.events.defaultData({
//        type: 'post',
//        subtype: 'hatim'
//    });

    Hatim.aggregateAsset('css', 'hatim.css');
    Hatim.aggregateAsset('css', '../lib/ng-table/dist/ng-table.min.css',{ absolute:true, group: 'header', global: true });
    Hatim.aggregateAsset('js', '../lib/ng-table/dist/ng-table.min.js',{ absolute:true, group: 'footer', global: true });
    Hatim.angularDependencies(['ngTable']);
    /**
     //Uncomment to use. Requires meanio@0.3.7 or above
     // Save settings with callback
     // Use this for saving data from administration pages
     Hatim.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

     // Another save settings example this time with no callback
     // This writes over the last settings.
     Hatim.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     Hatim.settings(function(err, settings) {
        //you now have the settings object
    });
     */
//    swagger.add(__dirname);

    return Hatim;
});
