angular.module('admin').controller('StructuremasterCtrl', function ($scope, $http) {

    function refresh() {
        $http.get("/api/structure")
            .success(function (result) {
                console.log("Loaded structures", result);
                $scope.structure = result;
            })
    }

    refresh();


    $scope.setStructure = function (item) {
        console.log("Setting structure to", item);
        $http.post("/api/structure/set", {id: item._id})
            .success(function (result) {
                refresh();
            })
    };

    $scope.add = function () {
        console.log("Adding structure", $scope.new);
        $http.post("/api/structure", $scope.new)
            .success(function (result) {
                console.log("Structure added successfully", result);
                $scope.new = {};
                refresh();
            })
    };

    $scope.reset = function () {
        $http.get("/api/structure/reset")
            .success(function (result) {
                refresh();
            })
    }
});
