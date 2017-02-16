angular.module('pmboard').factory('productService', ['$http', function($http) {
  var service = {};
  
  service.getProduct = function(id) {
    return $http.get('/products/' + id).then(function(res) {
      return res.data;
    });
  };
  
  service.createProduct = function() {
    return $http.post('/products').then(function(res) {
      return res.data;
    });
  };
  
  service.deleteProduct = function(id) {
    return $http.delete('/products/' + id);
  };
  
  service.updateProduct = function(product) {
    return $http.put('/products/' + product._id, product);
  };
  
  service.getPersonas = function(prodId) {
    return $http.get('/products/' + prodId + '/personas').then(function(res) {
      return res.data;
    });
  };

  
  return service;
}]);
