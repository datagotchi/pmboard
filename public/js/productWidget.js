angular.module('pmboard').directive('productWidget', ['productService', function(productService) {
  return {
    templateUrl: '../templates/productWidget.html',
    scope: {
      productId: '='
    },
    controller: ['$scope', '$uibModal', function($scope, $uibModal) {
      var self = this;
      
      $scope.column = {name: 'Benefit', value: 'name'};
      $scope.stories = [];
      
      $scope.$watchCollection('productId', function() {
        $scope.loading = true;
        
        if (!$scope.productId) {
          return;
        }
        
        $scope.url = `/products/${$scope.productId}/stories`;
        
        productService.getStories($scope.productId).then(function(stories) {
          $scope.stories = stories;
          $scope.loading = false;
        });

      });
      
      $scope.refresh = function() {
        
      };
      
      $scope.addStory = function() {
        var row = $scope.stories[$scope.stories.length - 1];
        productService.addStory($scope.productId, row.name);
      };

    }],
    link: function(scope) {}
  }
}]);