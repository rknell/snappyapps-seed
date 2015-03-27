angular.module('admin').controller('UserdetailCtrl',function($scope, $stateParams, $http){

    $http.get("/api/user/" + $stateParams.id)
        .success(function(result){
            console.log("Loaded user", result);
            $scope.user = result;
        })

});
