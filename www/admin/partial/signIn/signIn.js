angular.module('admin').controller('SigninCtrl',function($scope, app, $http, $state, authentication){

    $scope.app = app;

    $scope.login = function(username, password){
        console.log("Logging in user", username, password);
        $http.post("/api/user/login",{
            email:  username,
            password: password
        })
            .success(function(result){
                console.log("login result", result);
                authentication.currentUser= result;
                $state.go('app.home');
            })
            .error(function(result){
                $scope.authError = result.message || "An unknown error occurred, please try again.";
            });
    };
});
