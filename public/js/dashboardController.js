angular.module('pmboard').controller('dashboardController', ['$scope', 'userService', 'productService', function($scope, userService, productService) {
  
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
        $scope.userWidget.modalOptions.trendsByPersona = {};
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
              trend.class = $scope.userWidget.modalOptions.trendTypes[trend.type];
            });
          });
        
          $scope.userWidget.modalOptions.trendsByPersona[persona.name] = Object.keys(trends)
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
      var row = $scope.userWidget.personas[$scope.userWidget.personas.length - 1];
      productService.addPersona($scope.currentProduct._id, row.name);
    },
    modalOptions: {
      trends: [],
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
  
  $scope.loading = true;
  userService.getUser(debugUserId).then(function(user) {
    $scope.user = user;
    $scope.products = user.products;
    $scope.currentProduct = user.products[$scope.user.currentProduct];
    $scope.userWidget.refresh();
    $scope.productWidget.refresh();
  });
}]);