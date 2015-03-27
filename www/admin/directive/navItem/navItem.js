angular.module('admin').directive('navItem', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
            name: "=",
            icon: "=",
            items: "=",
            state: "=",
            badgeClass: "=",
            badgeValue: "="
		},
		templateUrl: 'directive/navItem/navItem.html',
        controller: function($scope, $state){
            $scope.clicked = function(){
                console.log("Click registered");
                if($scope.state){
                    $state.go($scope.state);
                } else {
                    console.log("Clicked but state not registered");
                }
            };
        }
	};
});
