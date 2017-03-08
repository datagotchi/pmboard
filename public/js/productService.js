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
  
  service.addPersona = function(prodId, personaName) {
    return $http.post('/products/' + prodId + '/personas', {value: personaName}).then(function(res) {
      return res.data;
    });
  };
  
  service.updatePersona = function(prodId, personaIx, personaName) {
    return $http.put('/products/' + prodId + '/personas/' + personaIx, {value: personaName}).then(function(res) {
      return res.data;
    });
  };
  
  service.addEvidenceToPersona = function(prodId, personaIx, evidence) {
    return $http.post(`/products/${prodId}/personas/${personaIx}/evidence`, evidence).then(function(res) {
      return res.data;
    });
  };
  
  service.removeEvidenceFromPersona = function(prodId, personaIx, evidenceIx) {
    return $http.delete(`/products/${prodId}/personas/${personaIx}/evidence/${evidenceIx}`);
  };
  
  service.addPersonaTrend = function(prodId, personaIx, evidenceIx, trend) {
    return $http.post(`/products/${prodId}/personas/${personaIx}/evidence/${evidenceIx}/trends`, trend).then(function(res) {
      return res.data;
    });
  };
  
  service.changeTrendType = function(prodId, personaIx, evidenceIx,  trendIx, trend) {
    return $http.put(`/products/${prodId}/personas/${personaIx}/evidence/${evidenceIx}/trends/${trendIx}`, { type: trend.type });
  };
  
  service.removePersonaTrend = function(prodId, personaIx, evidenceIx, trendIx) {
    return $http.delete(`/products/${prodId}/personas/${personaIx}/evidence/${evidenceIx}/trends/${trendIx}`);
  }
  
  service.getStories = function(prodId) {
    return $http.get('/products/' + prodId + '/stories').then(function(res) {
      return res.data;
    });
  };
  
  service.addStory = function(prodId, story) {
    return $http.post('/products/' + prodId + '/stories', {value: story}).then(function(res) {
      return res.data;
    });
  };

  
  return service;
}]);
