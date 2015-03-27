angular.module('admin').controller('SignupCtrl',function($scope, $state,$http, app, authentication){

    $scope.app = app;

    $scope.signup = function(data){
        console.log("Registering user", data);
        $http.post("/api/user", data)
            .success(function(result){

                $http.post("/api/user/login", {email: result.email, password: result.password})
                    .success(function(result){
                        authentication.currentUser = result;
                        $state.go('app.home');
                    });
            })
            .error(function(err){
                $scope.authError = (err.message || "Sorry, an error occurred. Please try again.");
            })
    }

});
