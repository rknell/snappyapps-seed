angular.module('admin').directive('aside', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            app: "="
        },
        templateUrl: 'directive/aside/aside.html',
        link: function (scope, element, attrs, fn) {


        }
    };
});
