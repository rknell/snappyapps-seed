angular.module('admin').directive('pageTitle', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: "=",
            subTitle: "="
        },
        templateUrl: 'directive/pageTitle/pageTitle.html',
        link: function (scope, element, attrs, fn) {


        }
    };
});
