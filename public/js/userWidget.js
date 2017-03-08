angular.module('pmboard').directive('userWidget', ['productService', function(productService) {
  return {
    templateUrl: '../templates/userWidget.html',
    scope: {
      productId: '='
    },
    controller: ['$scope', '$uibModal', function($scope, $uibModal) {
      var self = this;
      
      $scope.column = {name: 'User', value: 'name'};
      $scope.personas = [];
      $scope.selectedPersona = null;
      
      $scope.$watchCollection('productId', function() {
        $scope.loading = true;
        
        if (!$scope.productId) {
          return;
        }
        
        $scope.url = `/products/${$scope.productId}/personas`;
        
        productService.getPersonas($scope.productId).then(function(personas) {
          $scope.personas = personas;
          $scope.loading = false;
        });
      });
      
      $scope.addPersona = function() {
        var row = $scope.personas[$scope.personas.length - 1];
        productService.addPersona($scope.productId, row.name);
      };
      
      $scope.selectPersona = function(persona) {
        $scope.selectedPersona = persona;
      };

    }],
    link: function(scope) {}
  }
}]);
