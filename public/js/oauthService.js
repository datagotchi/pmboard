angular.module('pmboard').factory('oauthService', ['$http', '$q', 'userService', function($http, $q, userService) {
  var service = {};
  
  service.doAuthentication = function() {
    return retrieve_token().then(function(res) {
      var token = res.data.token;
      return authenticate(token);
    });
  }
  
  function retrieve_token() {
    return $http.get('/oauth/token');
  }
  
  function authenticate(token) {
  	return $q(function(resolve, reject) {
    	OAuth.popup('google', {
    		state: token,
    		// Google requires the following field
    		// to get a refresh token
    		//authorize: {
    		//  approval_prompt: 'force'
    		//}
    	}).done(function(res) {
    		$http.post('/oauth/signin', {code: res.code}).then(function(res) {
      		resolve(res.data);
    		}).catch(function(err) {
      		reject(err);
    		});
  		}).fail(function(err) { // FIXME: I get an origin error, but it doesn't go into my code for some reason upon breakpoint
  			reject(err);
		  });
  	});
  }
  
/*
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
*/
  
  return service;
}]);
