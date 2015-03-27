angular.module('admin', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'ngStorage', 'toaster']);

angular.module('admin').config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
        .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: 'partial/App/App.html'
        });

    $stateProvider.state('app.home', {
        url: '/home',
        templateUrl: 'partial/home/home.html'
    });
    $stateProvider.state('signIn', {
        url: '/signIn',
        templateUrl: 'partial/signIn/signIn.html'
    });
    $stateProvider.state('signUp', {
        url: '/signUp',
        templateUrl: 'partial/signUp/signUp.html'
    });
    $stateProvider.state('app.usersMaster', {
        url: '/users',
        templateUrl: 'partial/usersMaster/usersMaster.html'
    });
    $stateProvider.state('app.userDetail', {
        url: '/users/:id',
        templateUrl: 'partial/userDetail/userDetail.html'
    });
    $stateProvider.state('forgotPassword', {
        url: '/forgotPassword',
        templateUrl: 'partial/forgotPassword/forgotPassword.html'
    });
    $stateProvider.state('resetPassword', {
        url: '/resetPassword/:token',
        templateUrl: 'partial/resetPassword/resetPassword.html'
    });
    $stateProvider.state('app.structureMaster', {
        url: '/structure',
        templateUrl: 'partial/structureMaster/structureMaster.html'
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/signIn');

    $httpProvider.interceptors.push(function($q, toaster) {
        return {
            'responseError': function(rejection) {
                if(rejection.status === 401){
                    window.location.replace('#/signIn');
                } else {
                    console.error("Error", rejection);
                    toaster.pop("error", rejection.message || rejection.data.message || "An error occurred processing your request");
                    return $q.reject(rejection);
                }
            }
        };
    });



});

angular.module('admin').run(function($rootScope, $templateCache, app) {
    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope
        .$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            app.settings.asideFolded = false;
            app.settings.asideFixed = true;
            app.settings.asideDock = false;
            app.settings.container = false;
            app.settings.fullHeight = false;
            app.hideAside = false;
            console.log("State Change: State change success!", event, toState, toParams, fromState, fromParams);
        });
});
