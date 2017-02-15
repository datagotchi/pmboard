angular.module('pmboard').factory('userService', ['$resource', function($resource) {
  var service = {};
  
  var User = $resource('/users/:user_id', {user_id: '@id'});
  
  service.getUser = function(userId) {
    return User.get({user_id: userId}).$promise;
  };
  
  return service;
}]);