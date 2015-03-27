angular.module('admin').controller('AppCtrl', function ($scope, $localStorage, $window, app, authentication, $state, $http, toaster, $rootScope) {

    function isSmartDevice() {
        // Adapted from http://www.detectmobilebrowsers.com
        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }

    // add 'ie' classes to html
    var isIE = !!navigator.userAgent.match(/MSIE/i);
    if (isIE) {
        angular.element($window.document.body).addClass('ie');
    }
    if (isSmartDevice()) {
        angular.element($window.document.body).addClass('smart');
    }

    $scope.app = app;

    $scope.$watch('app.settings', function () {
        if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
            // aside dock and fixed must set the header fixed.
            $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
    }, true);


    if (typeof(io) !== "undefined") {
        var socket = io.connect();
        socket.on('welcome', function (data) {
            $http.post("/api/user/registerSocket", {socket: socket.id})
            console.log(data, socket);
        });

        socket.on('notification', function (data) {
            toaster.pop('success', data.title, data.message);
        })

        socket.on('changed', function (data) {
            $rootScope.$broadcast('changed', data);
        });

        socket.on('structureChanged', function(data){
            $rootScope.$broadcast('structureChanged');
        })

    } else {
        console.error("Socket.IO failed to load");
    }


});
