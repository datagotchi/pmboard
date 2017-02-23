angular.module('pmboard').directive('benefitModal', [
  '$http', '$uibModal', '$cookies', 'productService', 'oauthService', 
  function($http, $uibModal, $cookies, productService, oauthService) {
  
  return {
    templateUrl: '../templates/benefitModal.html',
    scope: {
      productId: '@',
      benefit: '='
    },
    controller: ['$scope', function($scope) {
      
      $scope.$watch('benefit', function() {
        
      });
    }],
    link: function(scope) {}
  };
  
}]);