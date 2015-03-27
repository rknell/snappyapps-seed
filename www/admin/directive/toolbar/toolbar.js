angular.module('admin').directive('toolbar', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            app: "="
        },
        templateUrl: 'directive/toolbar/toolbar.html',
        controller: function ($scope, authentication, $state, $rootScope, $timeout, $http) {
            $scope.logOut = function () {
                authentication.currentUser = null;
                $http.get("/api/user/logout")
                    .success(function (result) {
                        console.log("Logged out successfully", result);
                    });
                $state.go('signIn');
            };

            function loadUser(){
                $http.get("/api/user/current")
                    .success(function(result){
                        $scope.user = result;
                    });
            }
            loadUser();
            $scope.$on('notification', function(){
                loadUser();
            });


            function loadStructure() {
                console.log("Structure changed");
                $http.get("/api/structure")
                    .success(function (result) {
                        console.log("Loaded structure", result);
                        $scope.structure = result;
                    });
            }
            loadStructure();
            $scope.$on('structureChanged', function(){
                console.log("Got changed structure");
                loadStructure();
            });




            var debounceTimer;
            $scope.search = function (query) {
                if (debounceTimer) {
                    $timeout.cancel(debounceTimer);
                }
                debounceTimer = $timeout(function () {
                    console.log("Broadcasting search", $scope.searchQry);
                    $rootScope.$broadcast('search', {query: $scope.searchQry});
                }, 300);
            }
        }
    };
});
