angular.module('admin').controller('ForgotpasswordCtrl',function($scope,  $http, toaster, $state){

    $scope.getToken = function(email) {
        console.log("Email", email);
        $http.get("/api/user/forgotPassword/" + email)
            .success(function (result) {
                $state.go("signIn");
                toaster.pop('success', "Reset success", "Check your email for further instructions");
            })
            .error(function(err){
                toaster.pop('error', "Error", err.message || "An unknown error occurred");
            })
    };
});
