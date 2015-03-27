angular.module('admin').controller('ResetpasswordCtrl',function($scope, $http, $stateParams, toaster, $state){

    $scope.resetPassword = function(password){
        console.log(password, $stateParams.token);
        $http.post("/api/user/resetPassword", {
                password: password,
                token : $stateParams.token
            })
            .success(function(result){
                $state.go("app.home");
                toaster.pop('success', "Reset success", "Your password has been reset and you have now been logged in");
            })
            .error(function(err){
                toaster.pop('error', "Error", err.message || "An unknown error occurred");
            })
    }

});
