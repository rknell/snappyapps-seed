angular.module('admin').controller('UsersmasterCtrl', function ($scope, $http, $state, app) {

    $scope.app = app;

    $http.get("/api/user")
        .success(function (result) {
            $scope.users = result;
        });

    $scope.edit = function (user) {
        $state.go("app.userDetail", {id: user._id});
    }

    $scope.$on('search', function (data, args) {
        $http.post('/api/user/search', args)
            .success(function (result) {
                console.log("Search result", result);
                $scope.users = result;
            })
    })
});
