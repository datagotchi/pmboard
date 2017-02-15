angular.module('pmboard').controller('dashboardController', ['$scope', 'userService', function($scope, userService) {
  
  $scope.products = [];
  
  userService.getUser('55271181777f411b3a90a2a5').then(function(user) {
    $scope.products = user.products;
/*
		currentProduct = typeof user.currentProduct === "number" ? user.currentProduct : 0;
		if (currentProduct >= products.length) currentProduct = products.length - 1;
		if (currentProduct >= 0) {
			prod_id = products[currentProduct]._id;
		} else {
			prod_id = null;
		}
*/
  });
}]);