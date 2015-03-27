angular.module('admin').factory('app',function($localStorage) {


    // config
    var app = {
        name: 'Snappy Apps',
        version: '1.0.0',
        // for chart colors
        color: {
            primary: '#7266ba',
            info: '#23b7e5',
            success: '#27c24c',
            warning: '#fad733',
            danger: '#f05050',
            light: '#e8eff0',
            dark: '#3a3f51',
            black: '#1c2b36'
        },
        settings: {
            themeID: 1,
            navbarHeaderColor: 'bg-black',
            navbarCollapseColor: 'bg-white-only',
            asideColor: 'bg-black',
            headerFixed: true,
            asideFixed: false,
            asideFolded: false,
            asideDock: false,
            container: false
        }
    };

    // save settings to local storage
    if (angular.isDefined($localStorage.settings)) {
        app.settings = $localStorage.settings;
    } else {
        $localStorage.settings = app.settings;
    }


	return app;
});