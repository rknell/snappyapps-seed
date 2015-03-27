angular.module('admin').directive('dashboardPanel', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            value: "=",
            title: "=",
            valueClass: "=",
            titleClass: "=",
            backgroundClass: "="
        },
        templateUrl: 'directive/dataPanel/dataPanel.html',
        link: function (scope, element, attrs, fn) {
            console.log("Data panel directive loaded")

        }
    };
});
