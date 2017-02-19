angular.module('pmboard').controller('dashboardController', ['$scope', 'userService', 'productService', function($scope, userService, productService) {
  
  var debugUserId = '55271181777f411b3a90a2a5';
  
  $scope.products = [];
  $scope.user = null;
  $scope.currentProduct = null;
  
  $scope.userWidget = {
    column: {name: 'User', value: 'name'},
    personas: []
  };
  
  $scope.addPersona = function() {
    var row = $scope.userWidget.personas[$scope.userWidget.personas.length - 1];
    productService.addPersona($scope.currentProduct._id, row.name);
  };
  
  $scope.productWidget = {
    column: {name: 'Benefit', value: 'name'},
    stories: []
  };
  
  $scope.addStory = function() {
    var row = $scope.productWidget.stories[$scope.productWidget.stories.length - 1];
    productService.addStory($scope.currentProduct._id, row.name);
  };
  
  $scope.changeProduct = function(index) {
    userService.changeCurrentProduct($scope.user._id, index).then(function() {
      $scope.currentProduct = $scope.products[index];
      $scope.user.currentProduct = index;
      refreshUserWidget();
      refreshProductWidget();
    });
  };
  
  $scope.createProduct = function() {
    return productService.createProduct().then(function(product) {
      $scope.products.push(product);
      return userService.addProductAccess($scope.user._id, product._id).then(function() {
        $scope.changeProduct($scope.products.length-1);
      });
    });
  };
  
  $scope.updateProduct = function(product) {
    return productService.updateProduct(product);
  };
  
  $scope.deleteProduct = function(id) {
    var index = $scope.products.map(function(p) { return p._id; }).indexOf(id);
    return productService.deleteProduct(id).then(function() {
      $scope.products = $scope.products.filter(function(p) { return p._id !== id; });
      var newIndex = index;
      if (newIndex === $scope.products.length) {
        newIndex = newIndex - 1 >= 0 ? newIndex - 1 : 0;
      }
      return $scope.changeProduct(newIndex);
    });
  };
  
  var refreshUserWidget = function() {
    $scope.loading = true;
    $scope.userWidget.url = '/products/' + $scope.currentProduct._id + "/personas"
    productService.getPersonas($scope.currentProduct._id).then(function(personas) {
      $scope.userWidget.personas = personas;
      $scope.loading = false;
    });
  };
  
  var refreshProductWidget = function() {
    $scope.loading = true;
    $scope.userWidget.url = '/products/' + $scope.currentProduct._id + "/stories"
    productService.getStories($scope.currentProduct._id).then(function(stories) {
      $scope.productWidget.stories = stories;
      $scope.loading = false;
    });
  };
  
  $scope.loading = true;
  userService.getUser(debugUserId).then(function(user) {
    $scope.user = user;
    $scope.products = user.products;
    $scope.currentProduct = user.products[$scope.user.currentProduct];
    refreshUserWidget();
    refreshProductWidget();
  });
}]);