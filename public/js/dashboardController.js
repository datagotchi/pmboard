angular.module('pmboard').controller('dashboardController', [
    '$scope', '$http', '$cookies', '$uibModal', 'userService', 'productService', 'oauthService',
    function($scope, $http, $cookies, $uibModal, userService, productService, oauthService) {
  
  var debugUserId = '55271181777f411b3a90a2a5';
  
  $scope.products = [];
  $scope.user = null;
  $scope.currentProduct = null;
  
  $scope.userWidget = {
    column: {name: 'User', value: 'name'},
    personas: [],
    refresh: function() {
      $scope.loading = true;
      $scope.userWidget.url = '/products/' + $scope.currentProduct._id + '/personas';
      productService.getPersonas($scope.currentProduct._id).then(function(personas) {
        
        // refresh personas
        $scope.userWidget.personas = personas;
        
        // refresh trends for each persona
        var trendsByPersona = $scope.userWidget.modalOptions.trendsByPersona = {}; // TODO: store data like this in a service for easier access
        
        personas.forEach(function(persona) {
          
          var trends = {};
          persona.evidence.forEach(function(evidence) {
            evidence.trends.forEach(function(trend) {
              if (!(trend.name in trends)) {
                trends[trend.name] = angular.extend({
                  count: 0
                }, trend);
              }
              trends[trend.name].count++;
              trend.class = $scope.userWidget.modalOptions.trendTypes[trend.type] || 'label-info';
            });
          });
        
          trendsByPersona[persona.name] = Object.keys(trends)
            .map(function(name) {return trends[name]; })
            .sort(function(a, b) {
              if (a.type === b.type) {
                return a.count - b.count; 
              } else {
                var types = Object.keys($scope.userWidget.modalOptions.trendTypes);
                return types.indexOf(a.type) - types.indexOf(b.type);
              }
            });
          
        });
        
        $scope.loading = false;
      });
    },
    addPersona: function() {
      var row = this.personas[$scope.userWidget.personas.length - 1];
      productService.addPersona($scope.currentProduct._id, row.name);
    },
    modalOptions: {
      onUpdateName: function(personaIndex, name) {
        return productService.updatePersona($scope.currentProduct._id, personaIndex, name);
      },
      trendTypes: {
        "Objective" : "label-danger",
        "Goal" : "label-warning",
        "Activity" : "label-primary",
        "Task" : "label-default",
        "Resource" : "label-success"
      },
      trendsShown: {},
      showTrendType: function(trend, trendMap) {
        if (!(trend.type in trendMap)) {
          trendMap[trend.type] = trend.name;
          return trend.type;
        } else if (trendMap[trend.type] === trend.name) {
          return trend.type;
        } else {
          return '';
        }
      },
      onClose: function() {
        $scope.userWidget.modalOptions.trendsShown = {};
      },
      findTrend: function(persona, query) {
        var found = this.trendsByPersona[persona.name]
          .map(function(trend) { return trend.name.toLowerCase(); })
          .filter(function(trendName) { return trendName.indexOf(query) > -1; })
          .map(function(name) { return {name: name, class: 'label-info'}; });
        return found;
      },
      openFilesModal: function(persona) {
        var evidence = persona.evidence;
        var modal = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'templates/addFilesModal.html',
          scope: $scope,
          controller: ['$uibModalInstance', function($uibModalInstance) {
            $scope.files = [];
            $scope.cancel = function() {
              $uibModalInstance.dismiss();
            };
            $scope.addFile = function(file) {
              if (file.selected) {
                var newFile = {
                  name: file.title,
                  url: file.alternateLink,
                  icon: file.iconLink
                };
                productService.addEvidenceToPersona($scope.currentProduct._id, persona.index, newFile).then(function() {
                  persona.evidence.push(newFile);
                  $scope.files = $scope.files.filter(function(f) { return f.alternateLink !== file.alternateLink; });
                });
              }
            }
          }]
        });
        modal.rendered.then(function() {
          $scope.loading = true;
          var oauth = JSON.parse($cookies.get('oauth'));
          var accessToken = oauth.access_token;
          $http.get('https://www.googleapis.com/drive/v2/files', {headers: {Authorization: 'Bearer ' + accessToken}})
            .then(function(res) {
              $scope.files = res.data.items.filter(function(file) {
                return evidence.map(function(f) { return f.url; }).indexOf(file.alternateLink) === -1;
              });
              $scope.loading = false;
            })
            .catch(function(res) {
              $scope.loading = false;
              if (res.status === 401) {
                return oauthService.doAuthentication().then(function(data) {
                  $cookies.put('oauth', data.oauth);
                  location.reload(); // TODO: just go back to the modal that's open?
                });
              }
            });
        });
      },
      removeFile: function(persona, fileIx) {
        return productService.removeEvidenceFromPersona($scope.currentProduct._id, persona.index, fileIx).then(function() {
          persona.evidence.splice(fileIx, 1);
        });
      },
      addTrend: function(persona, fileIx, trend) {
        return productService.addPersonaTrend($scope.currentProduct._id, persona.index, fileIx, {
          name: trend.name,
          type: ''
        });
      },
      removeTrend: function(persona, fileIx, trend) {
        var trendIx = persona.evidence[fileIx].trends.map(function(trend) { return trend.name; }).indexOf(trend.name);
        return productService.removePersonaTrend($scope.currentProduct._id, persona.index, fileIx, trendIx);
      },
      hasType: function(trend) {
        return !!trend.type;
      }
    }
  };
  
  $scope.productWidget = {
    column: {name: 'Benefit', value: 'name'},
    stories: [],
    refresh: function() {
      $scope.loading = true;
      $scope.userWidget.url = '/products/' + $scope.currentProduct._id + '/stories';
      productService.getStories($scope.currentProduct._id).then(function(stories) {
        $scope.productWidget.stories = stories;
        $scope.loading = false;
      });
    },
    addStory: function() {
      var row = $scope.productWidget.stories[$scope.productWidget.stories.length - 1];
      productService.addStory($scope.currentProduct._id, row.name);
    }
  };
  
  $scope.changeProduct = function(index) {
    userService.changeCurrentProduct($scope.user._id, index).then(function() {
      $scope.currentProduct = $scope.products[index];
      $scope.user.currentProduct = index;
      $scope.userWidget.refresh();
      $scope.productWidget.refresh();
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
  
  // initialize the page
  
  OAuth.initialize('K2P2q3_J6a76xcMJCcRRYTrbJ2c'); // TODO: hide this key somewhere via an ajax call?
  
  $scope.loading = true;
  var init = function(user) {
    $scope.user = user;
    $scope.products = user.products;
    $scope.currentProduct = user.products[$scope.user.currentProduct];
    $scope.userWidget.refresh();
    $scope.productWidget.refresh();
  };
  // TODO: get this working without forcing another auth - saved identity token on server???
  if ($cookies.get('userid') && $cookies.get('oauth')/* && getCookie('XSRF-TOKEN')*/) {
    var userId = $cookies.get('userid');
    userService.getUser(userId).then(function(user) {
      init(user);
    });
  } else {
    oauthService.doAuthentication().then(function(data) {
      $cookies.put('oauth', data.oauth);
      $cookies.put('userid', data.user._id);
      init(data.user);
    });
  }
}]);