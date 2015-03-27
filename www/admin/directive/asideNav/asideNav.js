angular.module('admin').directive('asideNav', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            app: "="
        },
        templateUrl: 'directive/asideNav/asideNav.html',
        link: function (scope, element, attrs, fn) {


        }
    };
});
