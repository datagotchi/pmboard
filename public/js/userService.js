angular.module('pmboard').factory('userService', ['$http', function($http) {
  var service = {};
  
  service.getUser = function(userId) {
    return $http.get('/users/' + userId).then(function(res) {
      return res.data;
    });
  };
  
  service.changeCurrentProduct = function(userId, index) {
    return $http.put('/users/' + userId, {currentProduct: index});
  };
  
  service.addProductAccess = function(userId, prodId) {
    return $http.put('/users/' + userId, { product_id: prodId });
  };
  
  return service;
}]);
